import express from "express";
import {
  upload,
  convertJfifToWebp,
  handleMulterError,
} from "../middlewares/imageupload.js";
import { isAdmin, isUser, UserAuth } from "../middlewares/auth.js";
import { deleteUser, editProfile, editUser, followOrUnfollow, getAllUsers, getUserById, register, searchUsers, sendDeleteOtp, suggestedUsers } from "../controllers/userController.js";
import { changePassword, forgotPassword, generateNewToken, googleLogin, logoutUser, resetPassword, userLogin, VerifyOtp, VerifyPhone } from "../controllers/loginController.js";
import { getMessage, sendMessage, getAllMessageUsers, deleteChat, markMessagesAsRead } from "../controllers/messageController.js";
import { createFreeGame, getFreeGames, getFreeGameBySlug, updateFreeGame, deleteFreeGame } from "../controllers/freeGamesController.js";
import { createGame, deleteGame, getAllActiveGames, getAllGames, getGameById, updateGame, getPopularGames, getTopGames, getTrendingGames, HomeTopGames, getAllActiveGamesWithPagination } from "../controllers/game.controller.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/Category.Controller.js";
import { chatWidGetController } from "../controllers/chatWidGet.controller.js";
import { createTrailer, deleteTrailer, getAllTrailer, getPublicTrailers, updateTrailer } from "../controllers/HomeTrailerController.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart.controller.js";
import { addToWishlist, checkWishlistStatus, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import websiteInfoRoutes from "./websiteInfo.routes.js";
import { createOrder, createPaymentIntent, downloadGame, getAllOrders, getUserOrders, retryOrderPayment, verifyPayment } from "../controllers/order.controller.js";
// import { createOrUpdateRating, deleteRating, getAllRatings, getGameRatings, getGameRatingStats, getUserGameRating, getUserRatings, markReviewHelpful, updateRating } from "../controllers/rating.controller.js";
import { createOrUpdateRating, getAllRatingByGame, getAllRatings } from "../controllers/rating.controller.js";
import {
  addFanCoinsAfterPurchase,
  useFanCoinsForPurchase,
  getFanCoinDetails,
  claimDailyLoginBonus,
  rewardGameReview,
  redeemFanCoinsForReward,
  getReferralBonus
} from '../controllers/fanCoinController.js';
import {
  createReward,
  getAllRewards,
  getRewardById,
  updateReward,
  deleteReward,
  getUserRewardBalance,
  redeemReward,
  getUserRedemptionHistory,
  completeTask,
  getAvailableTasks,
  getRewardsLeaderboard,
  getRewardsStatistics,
  updateLoginTask,
  getRewardThresholdStatus,
  claimRewardThreshold
} from '../controllers/rewards.controller.js';
import { getTaskClaimState, claimTask } from '../controllers/userDailyTaskClaim.controller.js';

import { getUserLogging, loggingHistory } from "../controllers/LoggingHistroyController.js";
// import { loggingHistory } from "../controllers/LoggingHistroyController.js";
import { getUserGamePlayTime } from "../controllers/userGameplay.controller.js";
import { createDailyTask, createEarnTask, createMilestone, createWeeklyTask, getAllTask } from "../controllers/task.controller.js";
import { createScratchCard, getUserScratchCards, revealScratchCard } from "../controllers/scratchCard.controller.js";
import { getRecentTransactions, getTopGamesDashboard, getDashboardStats, getTopCategories, getCategoryByGame, getPlatformWiseOrders } from "../controllers/dashBoard.controller.js";

// import {
//     createQuiz,
//     getAllQuizzes,
//     getQuizById,
//     updateQuiz,
//     deleteQuiz,
//     startQuiz,
//     answerQuestion,
//     getCurrentSession,
//     abandonQuiz,
//     getUserQuizHistory,
//     getQuizLeaderboard,
//     getDefaultGamingQuiz
// } from '../controllers/quiz.controller.js';


const indexRoutes = express.Router();
// Task claim state routes (daily & weekly)
indexRoutes.get('/user/task-claim', UserAuth, getTaskClaimState);
indexRoutes.post('/user/task-claim', UserAuth, claimTask);

//register Routes
indexRoutes.post("/register", register);
indexRoutes.get("/getAllUsers", UserAuth, getAllUsers);
indexRoutes.get("/getUserById/:id", UserAuth, getUserById);
indexRoutes.put(
  "/editUser/:id",
  UserAuth,
  isAdmin,
  upload.single("profilePic"),
  convertJfifToWebp,
  editUser
);
indexRoutes.put(
  "/editProfile/:id",
  UserAuth,
  upload.single("profilePic"),
  convertJfifToWebp,
  editProfile
);
indexRoutes.post("/sendDeleteOtp/:id", UserAuth, sendDeleteOtp);
indexRoutes.post("/deleteUser/:id", UserAuth, deleteUser);

//login Routes
indexRoutes.post("/userLogin", userLogin);
indexRoutes.post("/google-login", googleLogin);
indexRoutes.post("/VerifyPhone", VerifyPhone);
indexRoutes.post("/forgotPassword", forgotPassword);
indexRoutes.post("/VerifyEmail", VerifyOtp);
indexRoutes.post("/resetPassword", resetPassword);
indexRoutes.post("/changePassword", UserAuth, changePassword);

indexRoutes.post("/generateNewTokens", generateNewToken);
indexRoutes.post("/logout", UserAuth, logoutUser)

indexRoutes.get("/searchUsers", UserAuth, searchUsers);
indexRoutes.get("/suggestedUsers", UserAuth, isUser, suggestedUsers);
indexRoutes.post("/followOrUnfollow/:id", UserAuth, isUser, followOrUnfollow);

indexRoutes.post(
  "/sendMessage/:id",
  UserAuth,
  isUser,
  upload.single("messageImage"),
  handleMulterError,
  convertJfifToWebp,
  sendMessage
);
indexRoutes.get("/getMessage/:id", UserAuth, isUser, getMessage);
indexRoutes.get("/getAllMessageUsers", UserAuth, getAllMessageUsers);
indexRoutes.post("/deleteChat", UserAuth, deleteChat);

// Free Games Routes
indexRoutes.post(
  "/free-games",
  UserAuth,
  isAdmin,
  upload.single("image"),
  handleMulterError,
  convertJfifToWebp,
  createFreeGame
);
indexRoutes.get("/free-games", getFreeGames);
indexRoutes.get("/free-games/:slug", getFreeGameBySlug);
indexRoutes.put(
  "/free-games/:id",
  UserAuth,
  isAdmin,
  upload.single("image"),
  handleMulterError,
  convertJfifToWebp,
  updateFreeGame
);
indexRoutes.delete("/free-games/:id", UserAuth, isAdmin, deleteFreeGame);

//Game
indexRoutes.get("/getAllActiveGamesWithPagination", getAllActiveGamesWithPagination)
indexRoutes.get("/getAllGames", getAllGames);
indexRoutes.get("/getAllActiveGames", getAllActiveGames);
indexRoutes.get("/getPopularGames", getPopularGames);
indexRoutes.get("/getTopGames", getTopGames);
indexRoutes.get("/getTrendingGames", getTrendingGames);
indexRoutes.get("/games-by-category", getTopGames);
indexRoutes.get("/homeTopGame", HomeTopGames);
const gameFileFields = [
  { name: "cover_image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "windows_file", maxCount: 1 },
  { name: "nintendo_switch_1_file", maxCount: 1 },
  { name: "nintendo_switch_2_file", maxCount: 1 },
  { name: "ps5_file", maxCount: 1 },
  { name: "xbox_file", maxCount: 1 },
  { name: "vision_pro_file", maxCount: 1 },
  { name: "quest_file", maxCount: 1 },
  { name: "android_file", maxCount: 1 },
  { name: "ios_file", maxCount: 1 },
  { name: "images", maxCount: 10 },
];

indexRoutes.post(
  "/createGame",
  upload.fields(gameFileFields),
  createGame
);

indexRoutes.put(
  "/updateGame/:id",
  upload.fields(gameFileFields),
  updateGame
);
indexRoutes.delete("/deleteGame/:id", UserAuth, isAdmin, deleteGame);
indexRoutes.get("/getGameById/:id", getGameById);

// hometrailers routes
indexRoutes.post("/hometrailer", upload.single("trailer"), createTrailer);
indexRoutes.get("/hometrailer", getAllTrailer);
indexRoutes.get("/public/hometrailer", getPublicTrailers);
indexRoutes.put(
  "/hometrailer/:id",
  UserAuth,
  upload.single("trailer"),
  updateTrailer
);
indexRoutes.delete("/hometrailer/:id", UserAuth, deleteTrailer);

// cart
indexRoutes.get("/cart", UserAuth, getCart);
indexRoutes.post("/cart/add", UserAuth, addToCart);
indexRoutes.put("/cart", UserAuth, updateCartItem);
indexRoutes.post("/cart/remove", UserAuth, removeFromCart);
indexRoutes.post("/cart/clear", UserAuth, clearCart);

// wishlist
indexRoutes.get("/wishlist", UserAuth, getWishlist);
indexRoutes.post("/wishlist/add", UserAuth, addToWishlist);
indexRoutes.post("/wishlist/remove", UserAuth, removeFromWishlist);
indexRoutes.get("/wishlist/check/:gameId", UserAuth, checkWishlistStatus);

// category
indexRoutes.post(
  "/createCategory",
  upload.single("category_image"),
  createCategory
);
indexRoutes.get("/getCategoryById/:id", getCategoryById);
indexRoutes.get("/getAllCategories", getAllCategories);
indexRoutes.put(
  "/updateCategory/:id",
  upload.single("category_image"),
  updateCategory
);
indexRoutes.delete("/deleteCategory/:id", deleteCategory);

indexRoutes.get("/chatWidget", chatWidGetController);
indexRoutes.use('/website', websiteInfoRoutes);


// payment

indexRoutes.post("/order/create", UserAuth, createOrder);
indexRoutes.post("/order/verify", UserAuth, verifyPayment);
indexRoutes.post("/order/retry-payment", UserAuth, retryOrderPayment);
indexRoutes.get("/allorders", UserAuth, getUserOrders);
indexRoutes.get("/getorders", getAllOrders);
indexRoutes.get('/download/:token', downloadGame);
indexRoutes.post("/payment/create-intent", UserAuth, createPaymentIntent);

// Rating and Review Routes
indexRoutes.post("/ratings/:gameId", UserAuth, createOrUpdateRating);
// indexRoutes.get("/ratings/:gameId", getGameRatings);
// indexRoutes.get("/ratings/user/:gameId", UserAuth, getUserGameRating);
// indexRoutes.get("/ratings/user-ratings/:userId", getUserRatings);
// indexRoutes.post("/ratings/:ratingId/helpful", UserAuth, markReviewHelpful);
// indexRoutes.put("/ratings/:ratingId", UserAuth, updateRating);
// indexRoutes.delete("/ratings/:ratingId", UserAuth, deleteRating);
// indexRoutes.get("/ratings/:gameId/stats", getGameRatingStats);
indexRoutes.get("/admin/ratings", getAllRatings);
indexRoutes.get("/gamerating/:gameId", getAllRatingByGame)

// Fan Coin Routes
indexRoutes.post('/fan-coins/add', addFanCoinsAfterPurchase);
indexRoutes.post('/fan-coins/use', useFanCoinsForPurchase);
indexRoutes.get('/fan-coins/:userId', getFanCoinDetails);
indexRoutes.post('/fan-coins/daily-login', claimDailyLoginBonus);
indexRoutes.post('/fan-coins/review-bonus', rewardGameReview);
indexRoutes.post('/fan-coins/redeem', redeemFanCoinsForReward);
indexRoutes.post('/fan-coins/referral-bonus', UserAuth, getReferralBonus);

// Rewards Routes
// Admin routes for reward management
indexRoutes.post('/rewards', UserAuth, isAdmin, upload.single('image'), handleMulterError, convertJfifToWebp, createReward);
indexRoutes.get('/rewards', getAllRewards);
// Place specific routes BEFORE parameterized routes to avoid conflicts
indexRoutes.get('/rewards/leaderboard', getRewardsLeaderboard);
indexRoutes.get('/rewards/:id', getRewardById);
indexRoutes.put('/rewards/:id', UserAuth, isAdmin, upload.single('image'), handleMulterError, convertJfifToWebp, updateReward);
indexRoutes.delete('/rewards/:id', UserAuth, isAdmin, deleteReward);

indexRoutes.get('/getUserGamePlayTime', UserAuth, getUserGamePlayTime);

// User routes for rewards
indexRoutes.get('/user/rewards/balance', UserAuth, getUserRewardBalance);
indexRoutes.post('/user/rewards/:rewardId/redeem', UserAuth, redeemReward);
indexRoutes.get('/user/rewards/history', UserAuth, getUserRedemptionHistory);
// Threshold claim routes
indexRoutes.get('/user/rewards/thresholds/status', UserAuth, getRewardThresholdStatus);
indexRoutes.post('/user/rewards/thresholds/:tier/claim', UserAuth, claimRewardThreshold);
indexRoutes.post('/user/LogginHistory', UserAuth, loggingHistory);
// Task and quest routes
indexRoutes.get('/rewards/tasks', getAvailableTasks);
indexRoutes.post('/rewards/tasks/complete', UserAuth, completeTask);
indexRoutes.post('/updateLoginTask', UserAuth, updateLoginTask)
// Leaderboard and statistics
indexRoutes.get('/admin/rewards/statistics', UserAuth, isAdmin, getRewardsStatistics);

indexRoutes.post('/mark-read', UserAuth, markMessagesAsRead);


// task 
indexRoutes.post("/dailytask", UserAuth, isAdmin, createDailyTask);
indexRoutes.post("/weeklytask", UserAuth, isAdmin, createWeeklyTask);
indexRoutes.post("/earntask", UserAuth, isAdmin, createEarnTask);
indexRoutes.post("/milestone", UserAuth, isAdmin, createMilestone);
indexRoutes.get("/getAllTask", getAllTask);
indexRoutes.get("/getuserLogging", UserAuth, getUserLogging);


// scratch card routes
indexRoutes.post('/scratch-card/create', UserAuth, createScratchCard);
indexRoutes.get('/get-scratch-card', UserAuth, getUserScratchCards);
indexRoutes.post('/scratch-card/reveal', UserAuth, revealScratchCard);

// Quiz Routes
// Admin routes for quiz management
// indexRoutes.post('/quiz', UserAuth, isAdmin, createQuiz);
// indexRoutes.get('/quiz', getAllQuizzes);
// indexRoutes.get('/quiz/default-gaming', getDefaultGamingQuiz);
// indexRoutes.get('/quiz/:id', getQuizById);
// indexRoutes.put('/quiz/:id', UserAuth, isAdmin, updateQuiz);
// indexRoutes.delete('/quiz/:id', UserAuth, isAdmin, deleteQuiz);

// // Quiz game routes
// indexRoutes.post('/quiz/:quizId/start', UserAuth, startQuiz);
// indexRoutes.post('/quiz/session/:sessionId/answer', UserAuth, answerQuestion);
// indexRoutes.get('/quiz/session/:sessionId', UserAuth, getCurrentSession);
// indexRoutes.post('/quiz/session/:sessionId/abandon', UserAuth, abandonQuiz);

// // User quiz history and leaderboard
// indexRoutes.get('/user/quiz/history', UserAuth, getUserQuizHistory);
// indexRoutes.get('/quiz/leaderboard', getQuizLeaderboard);


// Dashboard
indexRoutes.get("/getDashboardStats", getDashboardStats)
indexRoutes.get("/getRecentTransactions", getRecentTransactions)
indexRoutes.get("/getCategoryByGame", getCategoryByGame)
indexRoutes.get("/getTopGamesDashboard", getTopGamesDashboard)
indexRoutes.get("/getTopCategories", getTopCategories)
indexRoutes.get("/getPlatformWiseOrders", getPlatformWiseOrders)


export default indexRoutes;
