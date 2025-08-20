import mongoose from "mongoose";
import FreeGame from "../models/freeGamesModel.js";
import { sanitize } from "../utils/sanitize.js";
import {
    sendSuccessResponse,
    sendErrorResponse,
    sendBadRequestResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
} from "../utils/ResponseUtils.js";

export const createFreeGame = async (req, res) => {
    try {
        const { slug, name, image, iframeSrc } = req.body;

        if (!slug || !name || !image || !iframeSrc) {
            return sendBadRequestResponse(res, "slug, name, image and iframeSrc are required");
        }

        const normalizedSlug = sanitize(slug).toLowerCase();
        const safeName = sanitize(name);
        const safeImage = sanitize(image);
        const normalizedIframeSrc = sanitize(iframeSrc).toLowerCase();

        const existing = await FreeGame.findOne({
            $or: [{ slug: normalizedSlug }, { iframeSrc: normalizedIframeSrc }],
        });
        if (existing) {
            return sendBadRequestResponse(res, "A game with this slug or iframeSrc already exists");
        }

        const created = await FreeGame.create({
            slug: normalizedSlug,
            name: safeName,
            image: safeImage,
            iframeSrc: normalizedIframeSrc,
        });

        return sendCreatedResponse(res, "Free game created successfully", created);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const getFreeGames = async (req, res) => {
    try {
        const games = await FreeGame.find().sort({ createdAt: -1 });
        return sendSuccessResponse(res, "Free games fetched successfully", games);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const getFreeGameBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return sendBadRequestResponse(res, "slug is required");
        }
        const normalizedSlug = sanitize(slug).toLowerCase();
        const game = await FreeGame.findOne({ slug: normalizedSlug });
        if (!game) {
            return sendNotFoundResponse(res, "Free game not found");
        }
        return sendSuccessResponse(res, "Free game fetched successfully", game);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const updateFreeGame = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Valid id is required");
        }

        const update = {};
        if (typeof req.body.slug !== "undefined") update.slug = sanitize(req.body.slug).toLowerCase();
        if (typeof req.body.name !== "undefined") update.name = sanitize(req.body.name);
        if (typeof req.body.image !== "undefined") update.image = sanitize(req.body.image);
        if (typeof req.body.iframeSrc !== "undefined") update.iframeSrc = sanitize(req.body.iframeSrc).toLowerCase();

        // uniqueness checks if slug or iframeSrc are being updated
        if (update.slug) {
            const existsSlug = await FreeGame.findOne({ slug: update.slug, _id: { $ne: id } });
            if (existsSlug) {
                return sendBadRequestResponse(res, "slug already in use");
            }
        }
        if (update.iframeSrc) {
            const existsIframe = await FreeGame.findOne({ iframeSrc: update.iframeSrc, _id: { $ne: id } });
            if (existsIframe) {
                return sendBadRequestResponse(res, "iframeSrc already in use");
            }
        }

        const updated = await FreeGame.findByIdAndUpdate(id, update, { new: true });
        if (!updated) {
            return sendNotFoundResponse(res, "Free game not found");
        }
        return sendSuccessResponse(res, "Free game updated successfully", updated);
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const deleteFreeGame = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Valid id is required");
        }

        const deleted = await FreeGame.findByIdAndDelete(id);
        if (!deleted) {
            return sendNotFoundResponse(res, "Free game not found");
        }
        return sendSuccessResponse(res, "Free game deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};


