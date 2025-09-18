import mongoose from "mongoose";
import { ThrowError } from '../utils/ErrorUtils.js';
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendNotFoundResponse } from '../utils/ResponseUtils.js';
import Reward from '../models/Rewards.model.js';
import UserReward from '../models/UserRewards.model.js';
import User from '../models/userModel.js';
import cloudinaryHelper from '../helper/cloudinary.js';
import fs from 'fs';
import UserTaskClaim from '../models/UserDailyTaskClaim.model.js';
import { DailyTask, WeeklyTask, Milestone } from '../models/Task.model.js';

const { fileupload, deleteFile } = cloudinaryHelper;

// ==================== REWARD MANAGEMENT (ADMIN) ====================

// Create a new reward
export const createReward = function (req, res) {
    (async function () {
        try {
            const {
                title,
                description,
                price,
                category,
                isLimited,
                stock,
                minLevel,
                tags
            } = req.body;

            // Handle image upload
            let imageData = null;
            if (req.file) {
                const filedata = await fileupload(req.file.path, "Rewards");
                if (filedata.message) {
                    return ThrowError(res, 400, 'Image upload failed');
                }
                imageData = {
                    url: filedata.Location,
                    public_id: filedata.ETag.replace(/"/g, '')
                };

                // Clean up local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }

            const reward = new Reward({
                title,
                description,
                image: imageData,
                price: parseInt(price),
                category: category || 'merchandise',
                isLimited: isLimited === 'true',
                stock: isLimited === 'true' ? parseInt(stock) : -1,
                minLevel: parseInt(minLevel) || 1,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : []
            });

            const savedReward = await reward.save();
            if (!savedReward) return ThrowError(res, 400, 'Reward not created');

            return sendSuccessResponse(res, "Reward created successfully", savedReward);
        } catch (error) {
            return ThrowError(res, 500, error.message);
        }
    })();
};

// ==================== REWARD THRESHOLD CLAIMS (100/200/500) ====================
export const getRewardThresholdStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('rewards fanCoins rewardsThresholdClaims');
        if (!user) {
            return sendNotFoundResponse(res, 'User not found');
        }

        const claims = user.rewardsThresholdClaims || { m100: false, m200: false, m500: false };
        return sendSuccessResponse(res, 'Fetched threshold claim status', {
            balance: user.rewards || 0,
            fanCoins: user.fanCoins || 0,
            claims
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

export const claimRewardThreshold = async (req, res) => {
    try {
        const userId = req.user._id;
        const { tier } = req.params; // '100' | '200' | '500'

        const tierNumber = Number(tier);
        const validTiers = [100, 200, 500];
        if (!validTiers.includes(tierNumber)) {
            return sendBadRequestResponse(res, 'Invalid threshold tier');
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendNotFoundResponse(res, 'User not found');
        }

        // Initialize claims object if missing
        if (!user.rewardsThresholdClaims) {
            user.rewardsThresholdClaims = { m100: false, m200: false, m500: false };
        }

        const claimKey = tierNumber === 100 ? 'm100' : tierNumber === 200 ? 'm200' : 'm500';
        const fanCoinReward = tierNumber === 100 ? 5 : tierNumber === 200 ? 10 : 25;

        if (user.rewardsThresholdClaims[claimKey]) {
            return sendBadRequestResponse(res, 'Threshold already claimed');
        }

        if ((user.rewards || 0) < tierNumber) {
            return sendBadRequestResponse(res, 'Insufficient points to claim this threshold');
        }

        // Deduct reward points
        user.rewards -= tierNumber;
        user.rewardsTransactions = user.rewardsTransactions || [];
        user.rewardsTransactions.push({
            type: 'SPEND',
            amount: tierNumber,
            description: `Threshold claim: ${tierNumber}`,
            date: new Date()
        });

        // Add fan coins
        user.fanCoins = (user.fanCoins || 0) + fanCoinReward;
        user.fanCoinTransactions = user.fanCoinTransactions || [];
        user.fanCoinTransactions.push({
            type: 'EARN',
            amount: fanCoinReward,
            description: `Threshold reward: ${tierNumber}`,
            date: new Date()
        });

        // Mark claimed
        user.rewardsThresholdClaims[claimKey] = true;

        await user.save();

        return sendSuccessResponse(res, 'Threshold claimed successfully', {
            tier: tierNumber,
            fanCoinsAwarded: fanCoinReward,
            newBalance: user.rewards,
            fanCoins: user.fanCoins,
            claims: user.rewardsThresholdClaims
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all rewards (public)
export const getAllRewards = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, status, page = 1, limit = 20 } = req.query;

        const query = { isActive: true };

        if (category) query.category = category;
        if (status) query.status = status;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const rewards = await Reward.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Reward.countDocuments(query);

        return sendSuccessResponse(res, "Rewards retrieved successfully", {
            rewards,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get reward by ID
export const getRewardById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid reward ID");
        }

        const reward = await Reward.findById(id);
        if (!reward) {
            return sendNotFoundResponse(res, "Reward not found");
        }

        return sendSuccessResponse(res, "Reward retrieved successfully", reward);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update reward
export const updateReward = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid reward ID");
        }

        // Handle image update
        if (req.file) {
            const reward = await Reward.findById(id);
            if (reward && reward.image && reward.image.public_id) {
                await deleteFile(reward.image.public_id);
            }

            const filedata = await fileupload(req.file.path, "Rewards");
            if (filedata.message) {
                return ThrowError(res, 400, 'Image upload failed');
            }

            updateData.image = {
                url: filedata.Location,
                public_id: filedata.ETag.replace(/"/g, '')
            };

            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        const updatedReward = await Reward.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedReward) {
            return sendNotFoundResponse(res, "Reward not found");
        }

        return sendSuccessResponse(res, "Reward updated successfully", updatedReward);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Delete reward
export const deleteReward = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid reward ID");
        }

        const reward = await Reward.findById(id);
        if (!reward) {
            return sendNotFoundResponse(res, "Reward not found");
        }

        // Delete image from cloudinary
        if (reward.image && reward.image.public_id) {
            await deleteFile(reward.image.public_id);
        }

        // Soft delete - set isActive to false
        await Reward.findByIdAndUpdate(id, { isActive: false });

        return sendSuccessResponse(res, "Reward deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ==================== USER REWARDS ====================

// Get user's reward balance and history
export const getUserRewardBalance = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('rewards rewardsTransactions');
        if (!user) {
            return sendNotFoundResponse(res, "User not found");
        }

        // Get recent claimed tasks from UserTaskClaim

        // const claim = await UserTaskClaim.findOne({ user: userId });
        let recentTransactions = user.rewardsTransactions || [];
        // console.log(claim);
        // if (claim) {
        //     // Handle daily claims (array of days)
        //     if (Array.isArray(claim.daily) && claim.daily.length > 0) {
        //         for (const dailyEntry of claim.daily) {
        //             if (Array.isArray(dailyEntry.claimedTasks) && dailyEntry.claimedTasks.length > 0) {
        //                 const dailyTasks = await DailyTask.find({ _id: { $in: dailyEntry.claimedTasks } });
        //                 for (const t of dailyTasks) {
        //                     recentTransactions.push({
        //                         type: 'DAILY',
        //                         taskId: t._id,
        //                         title: t.title,
        //                         amount: t.reward,
        //                         claimedAt: dailyEntry.date
        //                     });
        //                 }
        //             }
        //         }
        //     }
        //     // Handle weekly claims (single object)
        //     if (
        //         claim.weekly &&
        //         Array.isArray(claim.weekly.claimedTasks) &&
        //         claim.weekly.claimedTasks.length > 0
        //     ) {
        //         const weeklyTasks = await WeeklyTask.find({ _id: { $in: claim.weekly.claimedTasks } });
        //         for (const t of weeklyTasks) {
        //             recentTransactions.push({
        //                 type: 'WEEKLY',
        //                 taskId: t._id,
        //                 title: t.title,
        //                 amount: t.reward,
        //                 claimedAt: claim.weekly.week
        //             });
        //         }
        //     }
        //     // Handle milestone claims (single object)
        //     if (
        //         claim.milestone &&
        //         Array.isArray(claim.milestone.claimedTasks) &&
        //         claim.milestone.claimedTasks.length > 0
        //     ) {
        //         const milestoneTasks = await Milestone.find({ _id: { $in: claim.milestone.claimedTasks } });
        //         for (const t of milestoneTasks) {
        //             recentTransactions.push({
        //                 type: 'MILESTONE',
        //                 taskId: t._id,
        //                 title: t.title,
        //                 amount: t.reward,
        //                 claimedAt: null // Optionally add a timestamp if you store it
        //             });
        //         }
        //     }
        // }
        console.log('recentTransactions',);

        // const claim = await UserTaskClaim.findOne({ user: userId });
        // let recentTransactions = [];
        // console.log(claim);
        // if (claim) {
        //     // Handle daily claims (array of days)
        //     if (Array.isArray(claim.daily) && claim.daily.length > 0) {
        //         for (const dailyEntry of claim.daily) {
        //             if (Array.isArray(dailyEntry.claimedTasks) && dailyEntry.claimedTasks.length > 0) {
        //                 const dailyTasks = await DailyTask.find({ _id: { $in: dailyEntry.claimedTasks } });
        //                 for (const t of dailyTasks) {
        //                     recentTransactions.push({
        //                         type: 'DAILY',
        //                         taskId: t._id,
        //                         title: t.title,
        //                         amount: t.reward,
        //                         claimedAt: dailyEntry.date
        //                     });
        //                 }
        //             }
        //         }
        //     }
        //     // Handle weekly claims (single object)
        //     if (
        //         claim.weekly &&
        //         Array.isArray(claim.weekly.claimedTasks) &&
        //         claim.weekly.claimedTasks.length > 0
        //     ) {
        //         const weeklyTasks = await WeeklyTask.find({ _id: { $in: claim.weekly.claimedTasks } });
        //         for (const t of weeklyTasks) {
        //             recentTransactions.push({
        //                 type: 'WEEKLY',
        //                 taskId: t._id,
        //                 title: t.title,
        //                 amount: t.reward,
        //                 claimedAt: claim.weekly.week
        //             });
        //         }
        //     }
        //     // Handle milestone claims (single object)
        //     if (
        //         claim.milestone &&
        //         Array.isArray(claim.milestone.claimedTasks) &&
        //         claim.milestone.claimedTasks.length > 0
        //     ) {
        //         const milestoneTasks = await Milestone.find({ _id: { $in: claim.milestone.claimedTasks } });
        //         for (const t of milestoneTasks) {
        //             recentTransactions.push({
        //                 type: 'MILESTONE',
        //                 taskId: t._id,
        //                 title: t.title,
        //                 amount: t.reward,
        //                 claimedAt: null // Optionally add a timestamp if you store it
        //             });
        //         }
        //     }
        // }
        // Sort by claimedAt (or fallback to type order)
        recentTransactions = recentTransactions.sort((a, b) => {
            if (a.date && b.date) return new Date(b.date) - new Date(a.date);
            if (a.date) return -1;
            if (b.date) return 1;
            return 0;
        });
        let recentEarn = recentTransactions.filter(item => item.type === "EARN")
        return sendSuccessResponse(res, "User balance retrieved successfully", {
            balance: user.rewards || 0,
            recentTransactions,
            recentEarn,
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Redeem a reward
export const redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(rewardId)) {
            return sendBadRequestResponse(res, "Invalid reward ID");
        }

        // Get reward details
        const reward = await Reward.findById(rewardId);
        if (!reward || !reward.isActive) {
            return sendNotFoundResponse(res, "Reward not found or inactive");
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            return sendNotFoundResponse(res, "User not found");
        }

        // Check if user has enough points
        if (user.rewards < reward.price) {
            return sendBadRequestResponse(res, "Insufficient points to redeem this reward");
        }

        // Check if reward is in stock
        if (reward.isLimited && reward.stock <= 0) {
            return sendBadRequestResponse(res, "Reward is out of stock");
        }

        // Check if user already redeemed this reward
        const existingRedemption = await UserReward.findOne({ user: userId, reward: rewardId });
        if (existingRedemption) {
            return sendBadRequestResponse(res, "You have already redeemed this reward");
        }

        // Create redemption record
        const userReward = new UserReward({
            user: userId,
            reward: rewardId,
            pointsSpent: reward.price,
            status: 'redeemed',
            redeemedAt: new Date(),
            redemptionCode: `RWD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });

        // Update user's fan coins
        user.rewards -= reward.price;
        user.rewardsTransactions.push({
            type: 'SPEND',
            amount: reward.price,
            description: `Redeemed: ${reward.title}`,
            date: new Date()
        });

        // Update reward stock if limited
        if (reward.isLimited) {
            reward.stock -= 1;
            if (reward.stock <= 0) {
                reward.status = 'out_of_stock';
            }
        }

        // Save all changes
        await Promise.all([
            userReward.save(),
            user.save(),
            reward.save()
        ]);

        return sendSuccessResponse(res, "Reward redeemed successfully", {
            redemptionCode: userReward.redemptionCode,
            reward: {
                title: reward.title,
                price: reward.price
            },
            newBalance: user.rewards
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get user's redemption history
export const getUserRedemptionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const redemptions = await UserReward.find({ user: userId })
            .populate('reward', 'title image price category')
            .sort({ redeemedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await UserReward.countDocuments({ user: userId });

        return sendSuccessResponse(res, "Redemption history retrieved successfully", {
            redemptions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ==================== REWARD TASKS & QUESTS ====================

// Complete a task and earn points
export const completeTask = async (req, res) => {
    try {
        const { taskType, taskId, points, completed } = req.body;
        const userId = req.user._id;
        let claim = await UserTaskClaim.findOne({ user: userId });
        const user = await User.findById(userId);
        if (!user) {
            return sendNotFoundResponse(res, "User not found");
        }

        // Define task rewards
        const taskRewards = {
            'quiz': 50,
            'video': 5,
            'referral': 50,
            'login': 15,
            'game_play': 15,
            'streak': 20,
            'buy': 200
        };

        // Enforce completion rules for quiz task
        // Ensure earn array exists
        if (!Array.isArray(claim.earn)) {
            claim.earn = [];
        }
        if (taskType === 'quiz') {
            // Require explicit completed flag from client indicating all questions answered
            if (!completed) {
                return sendBadRequestResponse(res, 'Quiz must be completed to earn points');
            }
            const alreadyCompletedQuiz = claim.earn.includes(taskId);
            if (alreadyCompletedQuiz) {
                return sendBadRequestResponse(res, 'Quiz already completed');
            }
        }
        if (taskType === 'buy') {
            const alreadyCompletedQuiz = claim.earn.includes(taskId);

            if (alreadyCompletedQuiz) {
                return sendBadRequestResponse(res, 'Task already completed');
            }
        }
        claim.earn.push(taskId)
        claim.save();
        // const points = taskRewards[taskType] || 0;
        if (points === 0) {
            return sendBadRequestResponse(res, "Invalid task type");
        }

        // Add points to user
        user.rewards = (user.rewards || 0) + points;
        user.rewardsTransactions.push({
            type: 'EARN',
            amount: points,
            description: `Task completed: ${taskType}`,
            date: new Date()
        });

        await user.save();

        return sendSuccessResponse(res, "Task completed successfully", {
            pointsEarned: points,
            newBalance: user.rewards
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get available tasks
export const getAvailableTasks = async (req, res) => {
    try {
        const tasks = [
            { id: 'quiz', title: 'Take a quiz', points: 50, icon: 'quiz' },
            { id: 'video', title: 'Watch a video', points: 5, icon: 'video' },
            { id: 'referral', title: 'Refer a friend', points: 50, icon: 'referral' },
            { id: 'login', title: 'Daily login', points: 15, icon: 'login' },
            { id: 'game_play', title: 'Play any game for 15 minutes', points: 15, icon: 'game' },
            { id: 'streak', title: 'Daily streak bonus', points: 20, icon: 'streak' }
        ];

        return sendSuccessResponse(res, "Available tasks retrieved successfully", tasks);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ==================== LEADERBOARD ====================

// Get rewards leaderboard
export const getRewardsLeaderboard = async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        let startDate;
        const endDate = new Date();

        switch (period) {
            case 'day':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 1);
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            default:
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
        }

        // Get users with highest fan coins
        const leaderboard = await User.aggregate([
            {
                $match: {
                    rewards: { $exists: true, $gt: 0 }
                }
            },
            {
                $project: {
                    name: 1,
                    rewards: 1,
                    joinedAt: 1
                }
            },
            {
                $sort: { rewards: -1 }
            },
            {
                $limit: 6
            }
        ]);

        return sendSuccessResponse(res, "Leaderboard retrieved successfully", {
            period,
            leaderboard: leaderboard.map((user, index) => ({
                rank: index + 1,
                name: user.name,
                points: user.rewards,
                joinedAt: user.joinedAt
            }))
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// ==================== ADMIN STATISTICS ====================

// Get rewards statistics (admin only)
export const getRewardsStatistics = async (req, res) => {
    try {
        const totalRewards = await Reward.countDocuments({ isActive: true });
        const totalRedemptions = await UserReward.countDocuments({ status: 'redeemed' });
        const totalPointsSpent = await UserReward.aggregate([
            { $match: { status: 'redeemed' } },
            { $group: { _id: null, total: { $sum: '$pointsSpent' } } }
        ]);

        const popularRewards = await UserReward.aggregate([
            { $match: { status: 'redeemed' } },
            { $group: { _id: '$reward', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'rewards',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'reward'
                }
            },
            { $unwind: '$reward' },
            {
                $project: {
                    title: '$reward.title',
                    price: '$reward.price',
                    redemptions: '$count'
                }
            }
        ]);

        return sendSuccessResponse(res, "Statistics retrieved successfully", {
            totalRewards,
            totalRedemptions,
            totalPointsSpent: totalPointsSpent[0]?.total || 0,
            popularRewards
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};


export const updateLoginTask = async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await User.findById(userId);
        console.log(userData)
        return sendSuccessResponse(res, "Statistics retrieved successfully", {
            userData
        });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}
