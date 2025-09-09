import mongoose from "mongoose";
import User from "../models/userModel.js";
import Game from "../models/Games.model.js";


export const addToWishlist = async (req, res) => {
    try {
        const { gameId } = req.body;
        const userId = req.user._id;

        if (!gameId) {
            return res.status(400).json({
                status: 400,
                message: "Game ID is required"
            });
        }

        // Check if game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({
                status: 404,
                message: "Game not found"
            });
        }

        // Check if user exists
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        // Check if game is already in wishlist

        const existingWishlistItem = userData.wishlist.find(
            item => item.game.toString() === gameId
        );

        if (existingWishlistItem) {
            return res.status(400).json({
                status: 400,
                message: "Game already in wishlist"
            });
        }

        // Add to wishlist
        userData.wishlist.push({ game: gameId });
        await userData.save();

        // Populate game details for response
        await userData.populate('wishlist.game');

        return res.status(200).json({
            status: 200,
            message: "Game added to wishlist successfully",
            wishlist: userData.wishlist,
            success: true
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

// Remove game from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { gameId } = req.body;
        const userId = req.user._id;

        if (!gameId) {
            return res.status(400).json({
                status: 400,
                message: "Game ID is required"
            });
        }

        // Check if user exists
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        // Remove from wishlist
        const removedItem = userData.wishlist.find(
            item => item.game.toString() === gameId
        );
        userData.wishlist = userData.wishlist.filter(
            item => item.game.toString() !== gameId
        );
        await userData.save();

        return res.status(200).json({
            status: 200,
            message: "Game removed from wishlist successfully",
            removedItem,
            wishlist: userData.wishlist,
            success: true
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        // Check if user exists and populate wishlist with game details
        const userData = await User.findById(userId).populate({
            path: 'wishlist.game',
            populate: {
                path: 'category'
            }
        });
        if (!userData) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Wishlist retrieved successfully",
            wishlist: userData.wishlist || [],
            success: true
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

// Check if game is in wishlist
export const checkWishlistStatus = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user._id;

        if (!gameId) {
            return res.status(400).json({
                status: 400,
                message: "Game ID is required"
            });
        }

        // Check if user exists
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        // Check if game is in wishlist
        const isInWishlist = userData.wishlist.some(
            item => item.game.toString() === gameId
        );

        return res.status(200).json({
            status: 200,
            message: "Wishlist status checked successfully",
            isInWishlist,
            success: true
        });

    } catch (error) {
        console.error('Check wishlist status error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};