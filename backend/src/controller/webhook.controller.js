import Stripe from "stripe";
import User from "../models/user.model.js";
import Membership from "../models/membership.model.js";
import { config } from "dotenv";

config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // req.body should be raw Buffer when using express.raw()
    const body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Received event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

const handleCheckoutSessionCompleted = async (session) => {
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  try {
    // Get user by customer ID
    const user = await User.findOne({ customerId });

    if (!user) {
      console.error(`User not found for customer: ${customerId}`);
      return;
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription && subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;

      // Find membership by price ID
      const membership = await Membership.findOne({ priceId });

      if (membership) {
        // Update user subscription with proper structure
        user.subscription = {
          membershipId: membership._id,
          subscriptionId: subscription.id,
          status:
            subscription.status === "active" ? "active" : subscription.status,
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        };
        await user.save();
        console.log(`User ${user._id} subscribed to ${membership.name}`);
      }
    }
  } catch (error) {
    console.error("Error processing checkout session:", error);
  }
};

const handleSubscriptionCreated = async (subscription) => {
  console.log("Subscription created:", subscription.id);
  // Update user subscription status
  const customerId = subscription.customer;

  try {
    const user = await User.findOne({ customerId });

    if (!user) {
      console.error(`User not found for customer: ${customerId}`);
      return;
    }

    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      const membership = await Membership.findOne({ priceId });

      if (membership) {
        user.subscription = {
          membershipId: membership._id,
          subscriptionId: subscription.id,
          status:
            subscription.status === "active" ? "active" : subscription.status,
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        };
        await user.save();
        console.log(
          `User ${user._id} subscription created: ${membership.name}`,
        );
      }
    }
  } catch (error) {
    console.error("Error processing subscription created:", error);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  const customerId = subscription.customer;

  try {
    const user = await User.findOne({ customerId });

    if (!user) {
      console.error(`User not found for customer: ${customerId}`);
      return;
    }

    if (subscription.items.data.length > 0) {
      const priceId = subscription.items.data[0].price.id;
      const membership = await Membership.findOne({ priceId });

      if (membership) {
        user.subscription = {
          membershipId: membership._id,
          subscriptionId: subscription.id,
          status:
            subscription.status === "active" ? "active" : subscription.status,
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        };
        await user.save();
        console.log(
          `User ${user._id} subscription updated to ${membership.name}`,
        );
      }
    }
  } catch (error) {
    console.error("Error processing subscription update:", error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  const customerId = subscription.customer;

  try {
    const user = await User.findOne({ customerId });

    if (user) {
      user.subscription = {
        membershipId: null,
        subscriptionId: null,
        status: "cancelled",
        startDate: null,
        endDate: null,
      };
      await user.save();
      console.log(`User ${user._id} subscription cancelled`);
    }
  } catch (error) {
    console.error("Error processing subscription deletion:", error);
  }
};
