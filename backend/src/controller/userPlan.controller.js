import UserPlan from "../models/userPlan.model.js";
import asyncHandler from "express-async-handler";

export const getUserPlans = asyncHandler(async (req, res) => {
    const plans = await UserPlan.find({ userId: req.user._id })
        .populate({
            path: "membershipId",
            populate: {
                path: "createdBy",
                select: "name",
            },
        })
        .sort({ purchasedAt: -1 });

    return res.json({ plans });
});

// Remove duplicate UserPlan records and mark old plans as expired
export const cleanupDuplicatePlans = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const plans = await UserPlan.find({ userId }).sort({ purchasedAt: -1 });

    const seen = new Set();
    let deletedCount = 0;
    let isFirst = true;

    for (const plan of plans) {
        const key = plan.subscriptionId || plan.membershipId?.toString();
        if (seen.has(key)) {
            // Remove true duplicates (same subscriptionId)
            await UserPlan.findByIdAndDelete(plan._id);
            deletedCount++;
        } else {
            seen.add(key);
            // Only the first (most recent) plan stays active, rest become expired
            if (isFirst) {
                isFirst = false;
            } else if (plan.status === "active") {
                await UserPlan.findByIdAndUpdate(plan._id, { status: "expired" });
            }
        }
    }

    return res.json({
        message: `Cleaned up ${deletedCount} duplicate(s), older plans marked as expired`,
        deletedCount,
    });
});
