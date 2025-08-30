import express from "express";
import {
  upload,
  convertJfifToWebp,
  handleMulterError,
} from "../middlewares/imageupload.js";
import { isAdmin, isUser, UserAuth } from "../middlewares/auth.js";
import { deleteUser, editProfile, editUser, followOrUnfollow, getAllUsers, getUserById, register, searchUsers, suggestedUsers } from "../controllers/userController.js";
import { changePassword, forgotPassword, generateNewToken, logoutUser, resetPassword, userLogin, VerifyOtp, VerifyPhone } from "../controllers/loginController.js";
import { getMessage, sendMessage, getAllMessageUsers, deleteChat } from "../controllers/messageController.js";
import { createFreeGame, getFreeGames, getFreeGameBySlug, updateFreeGame, deleteFreeGame } from "../controllers/freeGamesController.js";
import { createGame, deleteGame, getAllActiveGames, getAllGames, getGameById, updateGame, getPopularGames, getTopGames } from "../controllers/game.controller.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/Category.Controller.js";
import { chatWidGetController } from "../controllers/chatWidGet.controller.js";
import { createTrailer, deleteTrailer, getAllTrailer, getPublicTrailers, updateTrailer } from "../controllers/HomeTrailerController.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cart.controller.js";
import { addToWishlist, checkWishlistStatus, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import websiteInfoRoutes from "./websiteInfo.routes.js";
import { createOrder, downloadGame, getAllOrders, getUserOrders, retryOrderPayment, verifyPayment } from "../controllers/order.controller.js";


const indexRoutes = express.Router();

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
indexRoutes.delete("/deleteUser/:id", UserAuth, deleteUser);

//login Routes
indexRoutes.post("/userLogin", userLogin);
indexRoutes.post("/VerifyPhone", VerifyPhone);
indexRoutes.post("/forgotPassword", forgotPassword);
indexRoutes.post("/VerifyEmail", VerifyOtp);
indexRoutes.post("/resetPassword", resetPassword);
indexRoutes.post("/changePassword", UserAuth, changePassword);

indexRoutes.post("/generateNewTokens", generateNewToken);
indexRoutes.post("/logout",UserAuth,logoutUser)

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

indexRoutes.get("/getAllGames", getAllGames);
indexRoutes.get("/getAllActiveGames", getAllActiveGames);
indexRoutes.get("/getPopularGames", getPopularGames);
indexRoutes.get("/getTopGames", getTopGames);
indexRoutes.get("/games-by-category", getTopGames);
indexRoutes.post(
  "/createGame",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "windows_file", maxCount: 1 },
    { name: "ios_file", maxCount: 1 },
    { name: "android_file", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createGame
);

indexRoutes.put(
  "/updateGame/:id",
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "windows_file", maxCount: 1 },
    { name: "ios_file", maxCount: 1 },
    { name: "android_file", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateGame
);
indexRoutes.delete("/deleteGame/:id", deleteGame);
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
indexRoutes.post("/order/retry", UserAuth, retryOrderPayment);
indexRoutes.get("/allorders", UserAuth, getUserOrders);
indexRoutes.get("/getorders", getAllOrders);
indexRoutes.get('/download/:token', downloadGame);

export default indexRoutes
