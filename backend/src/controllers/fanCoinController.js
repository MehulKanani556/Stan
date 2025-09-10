import User from '../models/userModel.js';
import Game from '../models/Games.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';

// Enhanced fan coin calculation
const calculateFanCoins = (amount, type = 'purchase') => {
    switch(type) {
        case 'purchase':
            // 1 fan coin for every $10 spent
            return Math.floor(amount / 10);
        case 'dailyLogin':
            return 5; // Daily login bonus
        case 'review':
            return 10; // Bonus for writing a review
        case 'achievement':
            return 20; // Bonus for game achievements
        case 'referral':
            return 50; // Referral bonus
        default:
            return 0;
    }
};

// Daily login bonus
export const claimDailyLoginBonus = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Check if bonus already claimed today
        const lastLoginBonus = user.fanCoinTransactions
            .filter(t => t.type === 'DAILY_LOGIN')
            .sort((a, b) => b.date - a.date)[0];

        if (lastLoginBonus && 
            new Date(lastLoginBonus.date).toDateString() === new Date().toDateString()) {
            return sendErrorResponse(res, 400, "Daily bonus already claimed");
        }

        // Add daily login bonus
        const bonusCoins = calculateFanCoins(0, 'dailyLogin');
        user.fanCoins += bonusCoins;
        user.fanCoinTransactions.push({
            type: 'DAILY_LOGIN',
            amount: bonusCoins,
            description: 'Daily login bonus'
        });

        await user.save();

        return sendSuccessResponse(res, "Daily login bonus claimed", {
            fanCoins: user.fanCoins,
            bonusCoins
        });
    } catch (error) {
        console.error("Error claiming daily login bonus:", error);
        return sendErrorResponse(res, 500, "Failed to claim daily login bonus");
    }
};

// Reward for writing a game review
export const rewardGameReview = async (req, res) => {
    try {
        const { userId, gameId } = req.body;
        const user = await User.findById(userId);
        const game = await Game.findById(gameId);

        if (!user || !game) {
            return sendErrorResponse(res, 404, "User or Game not found");
        }

        // Check if user has already reviewed this game
        const hasReviewed = user.fanCoinTransactions.some(
            t => t.type === 'REVIEW' && t.description.includes(gameId)
        );

        if (hasReviewed) {
            return sendErrorResponse(res, 400, "Review bonus already claimed for this game");
        }

        // Add review bonus
        const bonusCoins = calculateFanCoins(0, 'review');
        user.fanCoins += bonusCoins;
        user.fanCoinTransactions.push({
            type: 'REVIEW',
            amount: bonusCoins,
            description: `Review bonus for game: ${gameId}`
        });

        await user.save();

        return sendSuccessResponse(res, "Review bonus claimed", {
            fanCoins: user.fanCoins,
            bonusCoins
        });
    } catch (error) {
        console.error("Error rewarding game review:", error);
        return sendErrorResponse(res, 500, "Failed to reward game review");
    }
};

// Add fan coins after successful game purchase
export const addFanCoinsAfterPurchase = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Calculate fan coins
        const earnedCoins = calculateFanCoins(amount);

        // Add fan coins
        user.fanCoins += earnedCoins;

        // Record the transaction
        user.fanCoinTransactions.push({
            type: 'EARN',
            amount: earnedCoins,
            description: `Earned from game purchase of $${amount}`
        });

        // Save the updated user
        await user.save();

        return sendSuccessResponse(res, "Fan coins added successfully", {
            fanCoins: user.fanCoins,
            earnedCoins
        });
    } catch (error) {
        console.error("Error adding fan coins:", error);
        return sendErrorResponse(res, 500, "Failed to add fan coins");
    }
};

// Use fan coins for game purchase
export const useFanCoinsForPurchase = async (req, res) => {
    try {
        const { userId, gamePrice, fanCoinsToUse } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Check if user has enough fan coins
        if (user.fanCoins < fanCoinsToUse) {
            return sendErrorResponse(res, 400, "Insufficient fan coins");
        }

        // Deduct fan coins
        user.fanCoins -= fanCoinsToUse;

        // Record the transaction
        user.fanCoinTransactions.push({
            type: 'SPEND',
            amount: fanCoinsToUse,
            description: `Used for game purchase discount`
        });

        // Save the updated user
        await user.save();

        // Calculate discounted price
        // Example: 1 fan coin = $1 discount
        const discountedPrice = Math.max(0, gamePrice - fanCoinsToUse);

        return sendSuccessResponse(res, "Fan coins applied successfully", {
            fanCoins: user.fanCoins,
            discountedPrice
        });
    } catch (error) {
        console.error("Error using fan coins:", error);
        return sendErrorResponse(res, 500, "Failed to apply fan coins");
    }
};

// Get user's fan coin balance and transaction history
export const getFanCoinDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId).select('fanCoins fanCoinTransactions');
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        return sendSuccessResponse(res, "Fan coin details retrieved", {
            fanCoins: user.fanCoins,
            transactions: user.fanCoinTransactions
        });
    } catch (error) {
        console.error("Error retrieving fan coin details:", error);
        return sendErrorResponse(res, 500, "Failed to retrieve fan coin details");
    }
};

// New method to redeem fan coins for rewards
export const redeemFanCoinsForReward = async (req, res) => {
    try {
        const { userId, rewardType } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Define reward costs
        const rewardCosts = {
            'PROFILE_THEME': 100,
            'EXCLUSIVE_CONTENT': 200,
            'GIFT_CARD_10': 500,
            'GIFT_CARD_25': 1000,
            'MERCHANDISE_DISCOUNT': 250
        };

        const rewardCost = rewardCosts[rewardType];

        if (!rewardCost) {
            return sendErrorResponse(res, 400, "Invalid reward type");
        }

        if (user.fanCoins < rewardCost) {
            return sendErrorResponse(res, 400, "Insufficient fan coins");
        }

        // Deduct fan coins
        user.fanCoins -= rewardCost;
        user.fanCoinTransactions.push({
            type: 'PURCHASE',
            amount: rewardCost,
            description: `Redeemed ${rewardType}`
        });

        await user.save();

        return sendSuccessResponse(res, "Reward redeemed successfully", {
            fanCoins: user.fanCoins,
            rewardType
        });
    } catch (error) {
        console.error("Error redeeming fan coins:", error);
        return sendErrorResponse(res, 500, "Failed to redeem fan coins");
    }
};

export const getReferralBonus = async (req, res) => {
    try {
        const { referrerId, referredUserId } = req.body;
        const referrer = await User.findById(referrerId);
        const referredUser = await User.findById(referredUserId);

        if (!referrer || !referredUser) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Check if referral bonus already claimed
        const hasClaimedReferralBonus = referrer.fanCoinTransactions.some(
            t => t.type === 'REFERRAL' && t.description.includes(referredUserId)
        );

        if (hasClaimedReferralBonus) {
            return sendErrorResponse(res, 400, "Referral bonus already claimed");
        }

        // Add referral bonus
        const bonusCoins = calculateFanCoins(0, 'referral');
        referrer.fanCoins += bonusCoins;
        referrer.fanCoinTransactions.push({
            type: 'REFERRAL',
            amount: bonusCoins,
            description: `Referral bonus from user: ${referredUserId}`
        });

        await referrer.save();

        return sendSuccessResponse(res, "Referral bonus claimed", {
            fanCoins: referrer.fanCoins,
            bonusCoins
        });
    } catch (error) {
        console.error("Error claiming referral bonus:", error);
        return sendErrorResponse(res, 500, "Failed to claim referral bonus");
    }
};
