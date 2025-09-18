import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Utils/axiosInstance";
import { enqueueSnackbar } from "notistack";

// ==================== REWARD MANAGEMENT (ADMIN) ====================

// Create a new reward
export const createReward = createAsyncThunk(
    "reward/createReward",
    async (rewardData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('title', rewardData.title);
            formData.append('description', rewardData.description);
            formData.append('price', rewardData.price);
            formData.append('category', rewardData.category || 'merchandise');
            formData.append('isLimited', rewardData.isLimited);
            formData.append('stock', rewardData.stock);
            formData.append('minLevel', rewardData.minLevel || 1);
            formData.append('tags', rewardData.tags);

            if (rewardData.image) {
                formData.append('image', rewardData.image);
            }

            const response = await axiosInstance.post('/rewards', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create reward";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Get all rewards
export const getAllRewards = createAsyncThunk(
    "reward/getAllRewards",
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await axiosInstance.get(`/rewards?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch rewards";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Get reward by ID
export const getRewardById = createAsyncThunk(
    "reward/getRewardById",
    async (rewardId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/rewards/${rewardId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch reward";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);
// Get User Game Play Time
export const getUserGamePlayTime = createAsyncThunk(
    "reward/getUserGamePlayTime",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/getUserGamePlayTime`);
            console.log(response.data);            
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch reward";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Update reward
export const updateReward = createAsyncThunk(
    "reward/updateReward",
    async ({ rewardId, rewardData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            Object.keys(rewardData).forEach(key => {
                if (rewardData[key] !== undefined && rewardData[key] !== null) {
                    formData.append(key, rewardData[key]);
                }
            });

            const response = await axiosInstance.put(`/rewards/${rewardId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update reward";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Delete reward
export const deleteReward = createAsyncThunk(
    "reward/deleteReward",
    async (rewardId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/rewards/${rewardId}`);
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete reward";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// ==================== USER REWARDS ====================

// Get user's reward balance and history
export const getUserRewardBalance = createAsyncThunk(
    "reward/getUserRewardBalance",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/rewards/balance');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch balance";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Redeem a reward
export const redeemReward = createAsyncThunk(
    "reward/redeemReward",
    async (rewardId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/user/rewards/${rewardId}/redeem`);
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to redeem reward";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Get user's redemption history
export const getUserRedemptionHistory = createAsyncThunk(
    "reward/getUserRedemptionHistory",
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await axiosInstance.get(`/user/rewards/history?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch redemption history";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Get threshold claims status (100/200/500)
export const getThresholdClaims = createAsyncThunk(
    'reward/getThresholdClaims',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/rewards/thresholds');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch thresholds';
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Claim a threshold tier and receive fan coins
export const claimThresholdTier = createAsyncThunk(
    'reward/claimThresholdTier',
    async (tier, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/user/rewards/thresholds/${tier}/claim`);
            enqueueSnackbar(response?.data?.message || 'Claimed successfully', { variant: 'success' });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to claim threshold';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// ==================== REWARD TASKS & QUESTS ====================

// Complete a task and earn points
export const completeTask = createAsyncThunk(
    "reward/completeTask",
    async (taskData, { rejectWithValue }) => {
        try {
            const { taskId, points, title } = taskData;

            // Map task titles to task types for backend
            const taskTypeMap = {
                'Take a quiz': 'quiz',
                'Watch a video': 'video',
                'Refer a friend': 'referral',
                'Login to the app': 'login',
                'Play any game for 15 minutes': 'game_play',
                'Daily Streak Bonus': 'streak'
            };

            const taskType = taskTypeMap[title] || 'quiz';

            const response = await axiosInstance.post('/rewards/tasks/complete', {
                title,
                taskId,
                points,
                taskType
            });
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to complete task";
            enqueueSnackbar(errorMessage, { variant: "error" });
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// Get available tasks
export const getAvailableTasks = createAsyncThunk(
    "reward/getAvailableTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/rewards/tasks');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch tasks";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);
// Get all tasks
export const getAllTasks = createAsyncThunk(
    "reward/getAllTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/getAllTask');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch tasks";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// ==================== LEADERBOARD ====================

// Get rewards leaderboard
export const getRewardsLeaderboard = createAsyncThunk(
    "reward/getRewardsLeaderboard",
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const response = await axiosInstance.get(`/rewards/leaderboard?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch leaderboard";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// ==================== ADMIN STATISTICS ====================

// Get rewards statistics (admin only)
export const getRewardsStatistics = createAsyncThunk(
    "reward/getRewardsStatistics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/rewards/statistics');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch statistics";
            return rejectWithValue(error.response?.data || { message: errorMessage });
        }
    }
);

// ==================== INITIAL STATE ====================

const initialState = {
    // Rewards data
    rewards: [],
    currentReward: null,
    rewardsPagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 20
    },

    // User rewards
    userBalance: 0,
    thresholdClaims: { m100: false, m200: false, m500: false },
    fanCoins: 0,
    recentTransactions: [],
    redemptionHistory: [],
    redemptionPagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 20
    },

    // Tasks
    availableTasks: [],

    // Leaderboard
    leaderboard: [],
    //all task
    allTasks :[],

    // Statistics
    statistics: null,

    // play time
    userGamePlayTime:null,

    // Loading states
    loading: {
        rewards: false,
        currentReward: false,
        balance: false,
        redemption: false,
        tasks: false,
        leaderboard: false,
        statistics: false,
        create: false,
        update: false,
        delete: false,
        redeem: false,
        completeTask: false,
        userGamePlayTime:false,
        allTasks:false
    },

    // Error states
    error: null,
    message: null
};

// ==================== SLICE ====================

const rewardSlice = createSlice({
    name: "reward",
    initialState,
    reducers: {
        clearRewards: (state) => {
            state.rewards = [];
            state.currentReward = null;
            state.rewardsPagination = {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 20
            };
        },
        clearUserRewards: (state) => {
            state.userBalance = 0;
            state.recentTransactions = [];
            state.redemptionHistory = [];
            state.redemptionPagination = {
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: 20
            };
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;
        },
        clearAll: (state) => {
            return { ...initialState };
        },
        testAction: (state) => {
            console.log("Test action dispatched - reward slice is working!");
            state.message = "Test action successful";
        }
    },
    extraReducers: (builder) => {
        builder
            // ==================== CREATE REWARD ====================
            .addCase(createReward.pending, (state) => {
                state.loading.create = true;
                state.error = null;
            })
            .addCase(createReward.fulfilled, (state, action) => {
                state.loading.create = false;
                state.message = action.payload.message;
                state.error = null;
                // Add new reward to the beginning of the list
                if (action.payload.result) {
                    state.rewards.unshift(action.payload.result);
                }
            })
            .addCase(createReward.rejected, (state, action) => {
                state.loading.create = false;
                state.error = action.payload?.message || "Failed to create reward";
            })

            // ==================== GET ALL REWARDS ====================
            .addCase(getAllRewards.pending, (state) => {
                state.loading.rewards = true;
                state.error = null;
            })
            .addCase(getAllRewards.fulfilled, (state, action) => {
                state.loading.rewards = false;
                state.rewards = action.payload.result?.rewards || [];
                state.rewardsPagination = action.payload.result?.pagination || state.rewardsPagination;
                state.error = null;
            })
            .addCase(getAllRewards.rejected, (state, action) => {
                state.loading.rewards = false;
                state.error = action.payload?.message || "Failed to fetch rewards";
            })

            // ==================== GET REWARD BY ID ====================
            .addCase(getRewardById.pending, (state) => {
                state.loading.currentReward = true;
                state.error = null;
            })
            .addCase(getRewardById.fulfilled, (state, action) => {
                state.loading.currentReward = false;
                state.currentReward = action.payload.result;
                state.error = null;
            })
            .addCase(getRewardById.rejected, (state, action) => {
                state.loading.currentReward = false;
                state.error = action.payload?.message || "Failed to fetch reward";
            })
            // ==================== GET All Task ====================
            .addCase(getAllTasks.pending, (state) => {
                state.loading.allTasks = true;
                state.error = null;
            })
            .addCase(getAllTasks.fulfilled, (state, action) => {
                state.loading.allTasks = false;
                state.allTasks = action.payload.result;
                state.error = null;
            })
            .addCase(getAllTasks.rejected, (state, action) => {
                state.loading.allTasks = false;
                state.error = action.payload?.message || "Failed to fetch task";
            })
            // ==================== GET User Game Play Time ====================
            .addCase(getUserGamePlayTime.pending, (state) => {
                state.loading.userGamePlayTime = true;
                state.error = null;
            })
            .addCase(getUserGamePlayTime.fulfilled, (state, action) => {
                state.loading.userGamePlayTime = false;
                console.log(action.payload);
                
                state.userGamePlayTime = action.payload;
                state.error = null;
            })
            .addCase(getUserGamePlayTime.rejected, (state, action) => {
                state.loading.userGamePlayTime = false;
                state.error = action.payload?.message || "Failed to fetch reward";
            })

            // ==================== UPDATE REWARD ====================
            .addCase(updateReward.pending, (state) => {
                state.loading.update = true;
                state.error = null;
            })
            .addCase(updateReward.fulfilled, (state, action) => {
                state.loading.update = false;
                state.message = action.payload.message;
                state.error = null;
                // Update reward in the list
                if (action.payload.result) {
                    const index = state.rewards.findIndex(reward => reward._id === action.payload.result._id);
                    if (index !== -1) {
                        state.rewards[index] = action.payload.result;
                    }
                }
            })
            .addCase(updateReward.rejected, (state, action) => {
                state.loading.update = false;
                state.error = action.payload?.message || "Failed to update reward";
            })

            // ==================== DELETE REWARD ====================
            .addCase(deleteReward.pending, (state) => {
                state.loading.delete = true;
                state.error = null;
            })
            .addCase(deleteReward.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.message = action.payload.message;
                state.error = null;
            })
            .addCase(deleteReward.rejected, (state, action) => {
                state.loading.delete = false;
                state.error = action.payload?.message || "Failed to delete reward";
            })

            // ==================== GET USER BALANCE ====================
            .addCase(getUserRewardBalance.pending, (state) => {
                state.loading.balance = true;
                state.error = null;
            })
            .addCase(getUserRewardBalance.fulfilled, (state, action) => {
                state.loading.balance = false;
                state.userBalance = action.payload.result?.balance || 0;
                state.recentTransactions = action.payload.result?.recentTransactions || [];
                state.error = null;
            })
            .addCase(getUserRewardBalance.rejected, (state, action) => {
                state.loading.balance = false;
                state.error = action.payload?.message || "Failed to fetch balance";
            })

            // ==================== REDEEM REWARD ====================
            .addCase(redeemReward.pending, (state) => {
                state.loading.redeem = true;
                state.error = null;
            })
            .addCase(redeemReward.fulfilled, (state, action) => {
                state.loading.redeem = false;
                state.message = action.payload.message;
                state.userBalance = action.payload.result?.newBalance || state.userBalance;
                state.error = null;
                // Refresh user balance after successful redemption
                if (action.payload.result?.newBalance !== undefined) {
                    state.userBalance = action.payload.result.newBalance;
                }
            })
            .addCase(redeemReward.rejected, (state, action) => {
                state.loading.redeem = false;
                state.error = action.payload?.message || "Failed to redeem reward";
            })

            // ==================== GET REDEMPTION HISTORY ====================
            .addCase(getUserRedemptionHistory.pending, (state) => {
                state.loading.redemption = true;
                state.error = null;
            })
            .addCase(getUserRedemptionHistory.fulfilled, (state, action) => {
                state.loading.redemption = false;
                state.redemptionHistory = action.payload.result?.redemptions || [];
                state.redemptionPagination = action.payload.result?.pagination || state.redemptionPagination;
                state.error = null;
            })
            .addCase(getUserRedemptionHistory.rejected, (state, action) => {
                state.loading.redemption = false;
                state.error = action.payload?.message || "Failed to fetch redemption history";
            })

            // ==================== THRESHOLD CLAIMS ====================
            .addCase(getThresholdClaims.pending, (state) => {
                state.loading.balance = true;
                state.error = null;
            })
            .addCase(getThresholdClaims.fulfilled, (state, action) => {
                state.loading.balance = false;
                state.userBalance = action.payload.result?.balance ?? state.userBalance;
                state.thresholdClaims = action.payload.result?.claims || state.thresholdClaims;
                state.fanCoins = action.payload.result?.fanCoins ?? state.fanCoins;
            })
            .addCase(getThresholdClaims.rejected, (state, action) => {
                state.loading.balance = false;
                state.error = action.payload?.message || 'Failed to fetch thresholds';
            })

            .addCase(claimThresholdTier.pending, (state) => {
                state.loading.redeem = true;
                state.error = null;
            })
            .addCase(claimThresholdTier.fulfilled, (state, action) => {
                state.loading.redeem = false;
                const res = action.payload.result || {};
                state.userBalance = res.newBalance ?? state.userBalance;
                state.fanCoins = res.fanCoins ?? state.fanCoins;
                if (res.claims) state.thresholdClaims = res.claims;
            })
            .addCase(claimThresholdTier.rejected, (state, action) => {
                state.loading.redeem = false;
                state.error = action.payload?.message || 'Failed to claim threshold';
            })

            // ==================== COMPLETE TASK ====================
            .addCase(completeTask.pending, (state) => {
                state.loading.completeTask = true;
                state.error = null;
            })
            .addCase(completeTask.fulfilled, (state, action) => {
                state.loading.completeTask = false;
                state.message = action.payload.message;
                state.userBalance = action.payload.result?.newBalance || state.userBalance;
                console.log("action.payload.result?.newBalance", action.payload.result?.newBalance);
                console.log("state.userBalance", state.userBalance);
                state.error = null;
                // Refresh user balance after successful task completion
                if (action.payload.result?.newBalance !== undefined) {
                    state.userBalance = action.payload.result.newBalance;
                }
            })
            .addCase(completeTask.rejected, (state, action) => {
                state.loading.completeTask = false;
                state.error = action.payload?.message || "Failed to complete task";
            })

            // ==================== GET AVAILABLE TASKS ====================
            .addCase(getAvailableTasks.pending, (state) => {
                state.loading.tasks = true;
                state.error = null;
            })
            .addCase(getAvailableTasks.fulfilled, (state, action) => {
                state.loading.tasks = false;
                state.availableTasks = action.payload.result || [];
                state.error = null;
            })
            .addCase(getAvailableTasks.rejected, (state, action) => {
                state.loading.tasks = false;
                state.error = action.payload?.message || "Failed to fetch tasks";
            })

            // ==================== GET LEADERBOARD ====================
            .addCase(getRewardsLeaderboard.pending, (state) => {
                state.loading.leaderboard = true;
                state.error = null;
            })
            .addCase(getRewardsLeaderboard.fulfilled, (state, action) => {
                state.loading.leaderboard = false;
                state.leaderboard = action.payload.result?.leaderboard || [];
                state.error = null;
            })
            .addCase(getRewardsLeaderboard.rejected, (state, action) => {
                state.loading.leaderboard = false;
                state.error = action.payload?.message || "Failed to fetch leaderboard";
            })

            // ==================== GET STATISTICS ====================
            .addCase(getRewardsStatistics.pending, (state) => {
                state.loading.statistics = true;
                state.error = null;
            })
            .addCase(getRewardsStatistics.fulfilled, (state, action) => {
                state.loading.statistics = false;
                state.statistics = action.payload.result;
                state.error = null;
            })
            .addCase(getRewardsStatistics.rejected, (state, action) => {
                state.loading.statistics = false;
                state.error = action.payload?.message || "Failed to fetch statistics";
            });
    },
});

export const {
    clearRewards,
    clearUserRewards,
    clearError,
    clearAll,
    testAction
} = rewardSlice.actions;

export default rewardSlice.reducer;
