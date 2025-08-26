import mongoose from "mongoose";
import User from "../models/userModel.js";
import Game from "../models/Games.model.js";
import { sendBadRequestResponse as sendError } from "../utils/ResponseUtils.js";



export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id || req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendError(res, 400, 'Invalid user id');
        }
        const user = await User.findById(userId).populate({
            path: 'cart.game',
            populate: {
                path: 'category'
            }
        });
        if (!user) return sendError(res, 404, 'User not found');

        // Ensure each item carries a price; if missing, derive from game's platform price
        const responseCart = (user.cart || []).map((c) => {
            const platformPrice = Number(c?.game?.platforms?.[c.platform]?.price || 0);
            const price = (typeof c.price === 'number' && c.price > 0) ? c.price : platformPrice;
            return { ...c.toObject?.() ? c.toObject() : c, price };
        });

        return res.status(200).json({ success: true, cart: responseCart });
    } catch (err) {
        return sendError(res, 500, err.message);
    }
};

// Add to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { gameId, platform, qty } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return sendError(res, 400, 'Invalid game id');
        }
        if (!['windows', 'ios', 'android'].includes(platform)) {
            return sendError(res, 400, 'Invalid platform');
        }
        const game = await Game.findById(gameId);
        if (!game) return sendError(res, 404, 'Game not found');
        const platformData = game.platforms?.[platform];
        if (!platformData || !platformData.available) {
            return sendError(res, 400, 'Selected platform not available');
        }
        const price = Number(platformData.price || 0);
        const quantity = Math.max(1, Number(qty || 1));
        
        const user = await User.findById(userId);
        if (!user) return sendError(res, 404, 'User not found');
        
        // Check if this exact game+platform combination already exists
        const existingIndex = (user.cart || []).findIndex(
            (c) => String(c.game) === String(gameId) && c.platform === platform
        );

        if (existingIndex >= 0) {
            return res.status(400).json({
                success: false,
                message: `This game is already in your cart for ${platform} platform. You can only add one instance per platform.`
            });
        }

        // Add new item to cart
        user.cart.push({ game: gameId, platform, qty: quantity, price, name: game.title });

        await user.save();
        const populated = await User.findById(userId).populate({
            path: 'cart.game',
            populate: {
                path: 'category'
            }
        });
        return res.status(200).json({ success: true, message: 'Added to cart', cart: populated.cart });
    } catch (err) {
        return sendError(res, 500, err.message);
    }
};


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { gameId, platform, qty } = req.body;
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return sendError(res, 400, 'Invalid game id');
        }
        const quantity = Math.max(1, Number(qty || 1));
        const user = await User.findById(userId);
        if (!user) return sendError(res, 404, 'User not found');
        const idx = (user.cart || []).findIndex(
            (c) => String(c.game) === String(gameId) && c.platform === platform
        );
        if (idx < 0) return sendError(res, 404, 'Item not in cart');
        // Refresh price from game definition and update qty
        const game = await Game.findById(gameId);
        const platformData = game?.platforms?.[platform];
        const price = Number(platformData?.price || user.cart[idx].price || 0);
        user.cart[idx].qty = quantity;
        user.cart[idx].price = price;
        user.cart[idx].name = game.title
        await user.save();
        const populated = await User.findById(userId).populate({
            path: 'cart.game',
            populate: {
                path: 'category'
            }
        });
        // Ensure price present in response
        const responseCart = (populated.cart || []).map((c) => {
            const platformPrice = Number(c?.game?.platforms?.[c.platform]?.price || 0);
            const priceOut = (typeof c.price === 'number' && c.price > 0) ? c.price : platformPrice;
            return { ...c.toObject?.() ? c.toObject() : c, price: priceOut };
        });
        return res.status(200).json({ success: true, message: 'Cart updated', cart: responseCart });
    } catch (err) {
        return sendError(res, 500, err.message);
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { gameId, platform } = req.body;
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return sendError(res, 400, 'Invalid game id');
        }
        const user = await User.findById(userId);
        if (!user) return sendError(res, 404, 'User not found');
        user.cart = (user.cart || []).filter(
            (c) => !(String(c._id) == String(gameId) && c.platform == platform)
        );
        await user.save();
        console.log(user.cart,gameId,platform);
        
        const populated = await User.findById(userId).populate({
            path: 'cart.game',
            populate: {
                path: 'category'
            }
        });
        return res.status(200).json({ success: true, message: 'Removed from cart', cart: populated.cart });
    } catch (err) {
        return sendError(res, 500, err.message);
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) return sendError(res, 404, 'User not found');
        user.cart = [];
        await user.save();
        return res.status(200).json({ success: true, message: 'Cart cleared', cart: [] });
    } catch (err) {
        return sendError(res, 500, err.message);
    }
};