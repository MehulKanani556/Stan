import mongoose from "mongoose";

const userRewardsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserStan",
            required: true
        },
        reward: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reward",
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'redeemed', 'expired', 'cancelled'],
            default: 'pending'
        },
        redeemedAt: {
            type: Date
        },
        expiresAt: {
            type: Date
        },
        pointsSpent: {
            type: Number,
            required: true,
            min: 0
        },
        // For tracking redemption details
        redemptionCode: {
            type: String,
            unique: true,
            sparse: true
        },
        // For gift cards or digital items
        redemptionDetails: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    { timestamps: true }
);

// Compound index to ensure one user can only redeem one reward once
userRewardsSchema.index({ user: 1, reward: 1 }, { unique: true });

// Index for efficient queries
userRewardsSchema.index({ user: 1, status: 1 });
userRewardsSchema.index({ status: 1, redeemedAt: 1 });

export default mongoose.model("UserReward", userRewardsSchema);
