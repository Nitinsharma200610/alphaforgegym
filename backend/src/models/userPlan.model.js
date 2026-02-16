import mongoose from "mongoose";

const userPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        membershipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Membership",
            required: true,
        },
        subscriptionId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "expired", "past_due"],
            default: "active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
        purchasedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

const UserPlan = mongoose.model("UserPlan", userPlanSchema);

export default UserPlan;
