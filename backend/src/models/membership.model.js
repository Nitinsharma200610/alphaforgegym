import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPurchased: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;