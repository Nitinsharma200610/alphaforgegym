import Membership from "../models/membership.model.js";
import User from "../models/user.model.js";
import UserPlan from "../models/userPlan.model.js";
import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import {
  createProduct,
  createCustomer,
  updateProduct,
  deleteProduct,
  createCheckoutSession,
} from "../service/stripe.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Verify checkout session and update user subscription (workaround for local dev without webhooks)
export const verifyCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user?._id;

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get full subscription details separately
    const subscriptionId = session.subscription;
    if (!subscriptionId) {
      return res
        .status(400)
        .json({ message: "No subscription found in session" });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription && subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;

      // Find membership by price ID
      const membership = await Membership.findOne({ priceId });

      if (membership) {
        // Update user subscription with proper date handling
        const startDate = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000)
          : new Date();
        const endDate = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

        user.subscription = {
          membershipId: membership._id,
          subscriptionId: subscription.id,
          status: "active",
          startDate: startDate,
          endDate: endDate,
        };
        await user.save();

        // Mark all previous plans as expired
        await UserPlan.updateMany(
          { userId: user._id, status: "active" },
          { status: "expired" },
        );

        // Create or update UserPlan record (upsert prevents duplicates on page refresh)
        await UserPlan.findOneAndUpdate(
          { userId: user._id, subscriptionId: subscription.id },
          {
            userId: user._id,
            membershipId: membership._id,
            subscriptionId: subscription.id,
            status: "active",
            startDate: startDate,
            endDate: endDate,
            purchasedAt: new Date(),
          },
          { upsert: true, new: true },
        );

        return res.json({
          message: "Subscription activated successfully",
          subscription: user.subscription,
        });
      }
    }

    return res.status(400).json({ message: "Could not process subscription" });
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return res.status(500).json({
      message: "Error verifying checkout session",
      error: error.message,
    });
  }
});

// Convert duration to Stripe interval format
const getDurationInterval = (duration) => {
  const map = {
    monthly: { interval: "month", validity: 1 },
    quarterly: { interval: "month", validity: 3 },
    yearly: { interval: "year", validity: 1 },
  };
  return map[duration] || { interval: "month", validity: 1 };
};

export const createMembership = asyncHandler(async (req, res) => {
  const { name, price, duration, features } = req.body;

  if (!name || !price || !duration || !features) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Parse features if it's a string
  const featuresList =
    typeof features === "string"
      ? features.split(",").map((f) => f.trim())
      : features;

  const { interval, validity } = getDurationInterval(duration);

  // Create product in Stripe
  const stripeProduct = await createProduct({
    name,
    price,
    interval,
    validity,
    currency: "inr",
  });

  // Save membership to database
  const membership = await Membership.create({
    name,
    price,
    duration,
    features: featuresList,
    planId: stripeProduct.planId,
    priceId: stripeProduct.priceId,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    message: "Membership plan created successfully",
    membership,
  });
});

export const getAllMemberships = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }
  const memberships = await Membership.find(filter)
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
  return res.json({ memberships });
});

export const checkoutMembership = asyncHandler(async (req, res) => {
  const { membershipId } = req.body;
  const userId = req.user._id;

  if (!membershipId) {
    return res
      .status(400)
      .json({ message: "Membership ID is required" });
  }

  const membership = await Membership.findById(membershipId);
  if (!membership) {
    return res.status(404).json({ message: "Membership not found" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const checkoutSession = await createCheckoutSession({
      customerId: user.customerId,
      priceId: membership.priceId,
      successUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/membership`,
    });

    return res.json({
      message: "Checkout session created",
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    // If currency conflict, create a fresh Stripe customer and retry
    if (error.message && error.message.includes("cannot combine currencies")) {
      try {
        const newCustomer = await createCustomer({
          name: user.name,
          email: user.email,
        });
        user.customerId = newCustomer.id;
        await user.save();

        const checkoutSession = await createCheckoutSession({
          customerId: newCustomer.id,
          priceId: membership.priceId,
          successUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout/success`,
          cancelUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/membership`,
        });

        return res.json({
          message: "Checkout session created",
          sessionId: checkoutSession.id,
          url: checkoutSession.url,
        });
      } catch (retryError) {
        return res.status(500).json({
          message: "Error creating checkout session",
          error: retryError.message,
        });
      }
    }

    return res.status(500).json({
      message: "Error creating checkout session",
      error: error.message,
    });
  }
});

export const getMembershipById = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) {
    return res.status(404).json({ message: "Membership not found" });
  }
  return res.json({ membership });
});

export const updateMembership = asyncHandler(async (req, res) => {
  const { name, features } = req.body;
  const membership = await Membership.findById(req.params.id);

  if (!membership) {
    return res.status(404).json({ message: "Membership not found" });
  }

  // Update in Stripe
  if (name) {
    await updateProduct(membership.planId, { name });
  }

  // Update in database
  if (name) membership.name = name;
  if (features) {
    membership.features =
      typeof features === "string"
        ? features.split(",").map((f) => f.trim())
        : features;
  }

  await membership.save();

  return res.json({
    message: "Membership updated successfully",
    membership,
  });
});

export const deleteMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id);

  if (!membership) {
    return res.status(404).json({ message: "Membership not found" });
  }

  // Deactivate in Stripe
  await deleteProduct({
    planId: membership.planId,
    priceId: membership.priceId,
  });

  // Mark as inactive in database
  membership.isActive = false;
  await membership.save();

  return res.json({ message: "Membership deleted successfully" });
});
