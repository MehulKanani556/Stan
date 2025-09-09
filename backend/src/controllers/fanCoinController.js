import User from '../models/userModel.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHandler.js';

// Calculate fan coins based on purchase amount
const calculateFanCoins = (amount) => {
    // Example: 1 fan coin for every $10 spent
    return Math.floor(amount / 10);
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
