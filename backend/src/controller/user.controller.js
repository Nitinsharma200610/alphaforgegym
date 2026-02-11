import User from "../models/user.model.js";
import Membership from "../models/membership.model.js";
import Service from "../models/service.model.js";
import asyncHandler from "express-async-handler";
import { createCustomer } from "../service/stripe.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const stripeCustomer = await createCustomer({ name, email });

  const user = await User.create({
    name,
    email,
    password,
    customerId: stripeCustomer.id,
  });
  const { password: pwd, ...rest } = user.toObject();
  return res
    .status(201)
    .json({ message: "User registered successfully", user: rest });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = user.generateAuthToken();

  const { password: pwd, ...rest } = user.toObject();
  return res.json({
    message: "Login successful",
    user: { ...rest, token: token },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ user });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("subscription.membershipId");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "USER" })
    .select("-password")
    .populate("subscription.membershipId")
    .sort({ createdAt: -1 });
  return res.json({ users });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "USER" });
  const totalServices = await Service.countDocuments({ isActive: true });
  
  // Count active subscriptions by checking status
  const activeSubscriptions = await User.countDocuments({ 
    "subscription.status": "active",
    role: "USER"
  });

  // Calculate generic revenue (mock calculation based on memberships)
  // In a real app, this would come from Stripe or a Transaction model
  // For now, let's sum up the price of active memberships
  const usersWithActiveSubs = await User.find({ 
    "subscription.status": "active" 
  }).populate("subscription.membershipId");

  const totalRevenue = usersWithActiveSubs.reduce((acc, user) => {
    return acc + (user.subscription?.membershipId?.price || 0);
  }, 0);

  return res.json({
    stats: {
      totalUsers,
      totalServices,
      activeSubscriptions,
      totalRevenue
    }
  });
});

export const updateUserSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { subscription } = req.body;

  if (!subscription) {
    return res.status(400).json({ message: "Subscription is required" });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true },
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    message: "User subscription updated successfully",
    user,
  });
});


