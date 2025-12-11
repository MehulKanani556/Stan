
import moment from "moment"
import User from '../models/userModel.js'
import Game from '../models/Games.model.js'
import Games from '../models/Games.model.js'
import { ThrowError } from "../utils/ErrorUtils.js"
import Order from "../models/Order.model.js"
import { decryptData } from "../middlewares/incrypt.js"

// Helper function to get date range based on period
const getDateRange = (period) => {
    const now = moment();

    switch (period) {
        case 'today':
            return {
                start: now.startOf('day').toDate(),
                end: now.endOf('day').toDate()
            };
        case 'month':
            return {
                start: now.startOf('month').toDate(),
                end: now.endOf('month').toDate()
            };
        case 'year':
            return {
                start: now.startOf('year').toDate(),
                end: now.endOf('year').toDate()
            };
        default: // 'all' or any other value
            return {
                start: null,
                end: null
            };
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const { period = "all" } = req.query;
        const dateRange = getDateRange(period);

        // User Count
        let userQuery = {};
        if (period !== "all") {
            userQuery.createdAt = { $gte: dateRange.start, $lte: dateRange.end };
        }
        const totalUsers = await User.countDocuments(userQuery);

        // Game Count
        const totalGames = await Game.countDocuments(userQuery);

        const totalOrders = await Order.countDocuments(userQuery);


        // Revenue Aggregation from Orders
        let matchQuery = { status: "paid" }; // ✅ only paid orders
        if (period !== "all") {
            matchQuery.createdAt = {
                $gte: dateRange.start,
                $lte: dateRange.end,
            };
        }

        const result = await Order.aggregate([
            { $match: matchQuery },
            {
                $project: {
                    amount: 1,
                    createdAt: 1,
                },
            },
            {
                $facet: {
                    overall: [
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$amount" },
                                totalPayments: { $sum: 1 },
                            },
                        },
                    ],
                    paymentMethods: [
                        {
                            $group: {
                                _id: "",
                                revenue: { $sum: "$amount" },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { revenue: -1 } },
                    ],
                },
            },
        ]);

        const overall = result[0]?.overall[0] || {
            totalRevenue: 0,
            totalPayments: 0,
        };

        // Final response
        res.status(200).json({
            success: true,
            message: `Dashboard data fetched successfully for ${period === "all" ? "all time" : period}`,
            period,
            data: {
                totalUsers,
                totalGames,
                totalRevenue: overall.totalRevenue,
                totalOrders,
            },
        });
    } catch (error) {
        console.error("getDashboardStats error:", error);
        return ThrowError(res, 500, error.message);
    }
};

export const getRecentTransactions = async (req, res) => {
    try {
        const { period = 'all' } = req.query;
        const dateRange = getDateRange(period);
        const now = new Date();

        let matchQuery = {};
        if (period !== 'all') {
            matchQuery.createdAt = {
                $gte: dateRange.start,
                $lte: dateRange.end
            };
        }

        const transactions = await Order.find(matchQuery)
            .populate('user', "name userName email profilePic") // ✅ matches schema (user not userId)
            .populate('items.game', 'title cover_image.url') // ✅ populate game title and cover image
            .sort({ createdAt: -1 });

        const result = transactions.map(detail => {
            // ⏱️ Duration calculation
            const durationInMinutes = Math.round(
                (now - new Date(detail.createdAt)) / (1000 * 60)
            );

            const days = Math.floor(durationInMinutes / (60 * 24));
            const hours = Math.floor((durationInMinutes % (60 * 24)) / 60);
            const minutes = durationInMinutes % 60;

            let durationText;
            if (days > 0) {
                durationText = `${days} day${days !== 1 ? 's' : ''} ago`;
            } else {
                durationText =
                    `${hours} hr${hours !== 1 ? 's' : ''} ` +
                    `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
            }
           

            let decryptedFullName = detail.user?.name ? decryptData(detail.user.name) : "";
            let decryptedUserName = detail.user?.name ? decryptData(detail.user.name) : "";
            return {
                orderId: detail._id,
                userName: decryptedUserName?.trim() ? decryptedUserName : decryptedUserName?.trim() ? decryptedUserName : "Unknown User",
                fullName: decryptedFullName?.trim() ? decryptedFullName : decryptedFullName?.trim() ? decryptedFullName : "Unknown User",
                userEmail: detail.user?.email ? decryptData(detail.user.email) : 'No Email',
                items: detail.items.map(itm => ({
                    gameTitle: itm.game?.title || 'Unknown Game',
                    gameImage: itm.game?.cover_image?.url,
                    platform: itm.platform,
                    price: itm.price
                })),
                totalAmount: detail.amount || 0,
                currency: detail.currency,
                status: detail.status,
                duration: durationText,
                createdAt: detail.createdAt
            };
        });

        res.status(200).json({
            message: 'Get Transactions successfully',
            period: period,
            totalTransactions: transactions.length,
            data: result,
        });
    } catch (error) {
        console.error("getRecentTransactions error:", error);
        return ThrowError(res, 500, error.message);
    }
};

// games
export const getCategoryByGame = async (req, res) => {
    try {
        const { period = 'all' } = req.query;
        const dateRange = getDateRange(period);

        let matchQuery = { isActive: true };
        if (period !== 'all') {
            matchQuery.createdAt = {
                $gte: dateRange.start,
                $lte: dateRange.end
            };
        }

        // Aggregate to get categories with game counts
        const topCategories = await Games.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: "$category",
                    gameCount: { $sum: 1 }
                }
            },
            {
                $sort: { gameCount: -1 }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 1,
                    categoryName: "$categoryDetails.categoryName",
                    categoryDescription: "$categoryDetails.category_description",
                    categoryImage: "$categoryDetails.category_image",
                    gameCount: 1
                }
            }
        ]);

        if (!topCategories || topCategories.length === 0) {
            return res.status(200).json({
                success: true,
                message: `No categories found for ${period === 'all' ? 'all time' : period}`,
                period: period,
                data: []
            });
        }

        const totalGames = await Games.countDocuments(matchQuery); // Calculate total games

        return res.status(200).json({
            success: true,
            message: `Top categories fetched successfully for ${period === 'all' ? 'all time' : period}`,
            period: period,
            data: topCategories.map(category => ({
                ...category,
                percentage: ((category.gameCount / totalGames) * 100).toFixed(2) // Calculate percentage
            }))
        });

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
}

export const getTopGamesDashboard = async (req, res) => {
    try {
        const { period = "all" } = req.query;
        const dateRange = getDateRange(period);

        let matchQuery = { status: "paid" };
        if (period !== "all") {
            matchQuery.createdAt = {
                $gte: dateRange.start,
                $lte: dateRange.end,
            };
        }

        const result = await Order.aggregate([
            { $match: matchQuery },
            { $unwind: "$items" },

            {
                $group: {
                    _id: "$items.game",
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$items.price" },

                    // Per-platform counts/revenue for allowed platforms only
                    windowsCount: { $sum: { $cond: [{ $eq: ["$items.platform", "windows"] }, 1, 0] } },
                    windowsRevenue: { $sum: { $cond: [{ $eq: ["$items.platform", "windows"] }, "$items.price", 0] } },

                    visionProCount: { $sum: { $cond: [{ $eq: ["$items.platform", "vision_pro"] }, 1, 0] } },
                    visionProRevenue: { $sum: { $cond: [{ $eq: ["$items.platform", "vision_pro"] }, "$items.price", 0] } },

                    ps5Count: { $sum: { $cond: [{ $eq: ["$items.platform", "ps5"] }, 1, 0] } },
                    ps5Revenue: { $sum: { $cond: [{ $eq: ["$items.platform", "ps5"] }, "$items.price", 0] } },

                    xboxCount: { $sum: { $cond: [{ $eq: ["$items.platform", "xbox"] }, 1, 0] } },
                    xboxRevenue: { $sum: { $cond: [{ $eq: ["$items.platform", "xbox"] }, "$items.price", 0] } },

                    questCount: { $sum: { $cond: [{ $eq: ["$items.platform", "quest"] }, 1, 0] } },
                    questRevenue: { $sum: { $cond: [{ $eq: ["$items.platform", "quest"] }, "$items.price", 0] } },

                    ns1Count: { $sum: { $cond: [{ $eq: ["$items.platform", "nintendo_switch_1"] }, 1, 0] } },
                    ns1Revenue: { $sum: { $cond: [{ $eq: ["$items.platform", "nintendo_switch_1"] }, "$items.price", 0] } },

                    ns2Count: { $sum: { $cond: [{ $eq: ["$items.platform", "nintendo_switch_2"] }, 1, 0] } },
                    ns2Revenue: { $sum: { $cond: [{ $eq: ["$items.platform", "nintendo_switch_2"] }, "$items.price", 0] } },
                }
            },

            { $sort: { totalOrders: -1, totalRevenue: -1 } },

            {
                $lookup: {
                    from: "games",
                    localField: "_id",
                    foreignField: "_id",
                    as: "game"
                }
            },
            { $unwind: "$game" },

            {
                $project: {
                    _id: 0,
                    totalOrders: 1,
                    totalRevenue: 1,
                    game: {
                        _id: "$game._id",
                        title: "$game.title",
                        cover_image: "$game.cover_image",
                        category: "$game.category"
                    },
                    platforms: {
                        windows: { count: "$windowsCount", revenue: "$windowsRevenue" },
                        vision_pro: { count: "$visionProCount", revenue: "$visionProRevenue" },
                        ps5: { count: "$ps5Count", revenue: "$ps5Revenue" },
                        xbox: { count: "$xboxCount", revenue: "$xboxRevenue" },
                        quest: { count: "$questCount", revenue: "$questRevenue" },
                        nintendo_switch_1: { count: "$ns1Count", revenue: "$ns1Revenue" },
                        nintendo_switch_2: { count: "$ns2Count", revenue: "$ns2Revenue" }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: `Top games fetched successfully for ${period === "all" ? "all time" : period}`,
            period,
            data: result
        });
    } catch (error) {
        console.error("getTopGames error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//order
export const getTopCategories = async (req, res) => {
    try {
        const { period = "all" } = req.query;
        const dateRange = getDateRange(period);

        // ✅ Only paid orders
        let matchQuery = { status: "paid" };
        if (period !== "all") {
            matchQuery.createdAt = {
                $gte: dateRange.start,
                $lte: dateRange.end,
            };
        }

        const topCategories = await Order.aggregate([
            { $match: matchQuery },

            // Break items array
            { $unwind: "$items" },

            // Lookup game
            {
                $lookup: {
                    from: "games",
                    localField: "items.game",
                    foreignField: "_id",
                    as: "gameInfo"
                }
            },
            { $unwind: "$gameInfo" },

            // Group by categoryId
            {
                $group: {
                    _id: "$gameInfo.category",   // category ObjectId
                    totalRevenue: { $sum: "$items.price" },
                    totalOrders: { $sum: 1 },
                    games: { $addToSet: "$gameInfo.title" }
                }
            },

            // Lookup category details
            {
                $lookup: {
                    from: "categories",     // ✅ your categories collection
                    localField: "_id",      // category id
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            { $unwind: "$categoryInfo" },

            // Final projection
            {
                $project: {
                    _id: 0,
                    category: "$categoryInfo", // ✅ full category object
                    totalRevenue: 1,
                    totalOrders: 1,
                    games: 1
                }
            },

            { $sort: { totalOrders: -1, totalRevenue: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            period,
            total: topCategories.length,
            data: topCategories
        });
    } catch (error) {
        console.error("getTopCategories error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getPlatformWiseOrders = async (req, res) => {
    try {
        const { period = "all" } = req.query;

        // ✅ Match only PAID orders
        let match = { status: "paid" };

        if (period !== "all") {
            const now = new Date();
            let start, end;

            if (period === "today") {
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
            } else if (period === "month") {
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            } else if (period === "year") {
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            }

            match.createdAt = { $gte: start, $lte: end };
        }

        const aggregatedResult = await Order.aggregate([
            { $match: match },   // ✅ Only paid orders
            { $unwind: "$items" },

            {
                $group: {
                    _id: { $toLower: "$items.platform" }, // Group by lowercase platform name for consistent matching
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$items.price" },
                    games: { $addToSet: "$items.game" } // list of game IDs
                }
            },

            {
                $project: {
                    platform: "$_id", // Use the lowercase _id as the platform name
                    _id: 0,
                    totalOrders: 1,
                    totalRevenue: 1,
                    games: 1
                }
            }
        ]);

        // Allowed platforms (no ios/android)
        const staticPlatforms = ['windows','vision_pro','ps5','xbox','quest','nintendo_switch_1','nintendo_switch_2'];
        const platformMap = new Map();
        aggregatedResult.forEach(item => {
            platformMap.set(item.platform, item); // item.platform is already lowercase from aggregation
        });

        // Ensure all static platforms are present, adding default zero data if missing
        const result = staticPlatforms.map(platformName => {
            const existingData = platformMap.get(platformName);
            if (existingData) {
                return existingData;
            } else {
                return {
                    platform: platformName,
                    totalOrders: 0,
                    totalRevenue: 0,
                    games: []
                };
            }
        });

        res.json({
            success: true,
            period,
            total: result.length,
            data: result
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


