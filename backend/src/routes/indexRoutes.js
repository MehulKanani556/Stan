
import express from "express";
import { upload, convertJfifToWebp, handleMulterError } from "../middlewares/imageupload.js";
import { isAdmin, isUser, UserAuth } from "../middlewares/auth.js";
import { deleteUser, editProfile, editUser, followOrUnfollow, getAllUsers, getUserById, register, searchUsers, suggestedUsers } from "../controllers/userController.js";
import { changePassword, forgotPassword, resetPassword, userLogin, VerifyOtp, VerifyPhone } from "../controllers/loginController.js";
import { getMessage, sendMessage,getAllMessageUsers } from "../controllers/messageController.js";
import { createFreeGame, getFreeGames, getFreeGameBySlug, updateFreeGame, deleteFreeGame } from "../controllers/freeGamesController.js";


const indexRoutes = express.Router()

//register Routes
indexRoutes.post("/register", register)
indexRoutes.get("/getAllUsers", UserAuth,  getAllUsers)
indexRoutes.get("/getUserById/:id", UserAuth, getUserById)
indexRoutes.put("/editUser/:id", UserAuth, isAdmin, upload.single("profilePic"), convertJfifToWebp, editUser)
indexRoutes.put("/editProfile/:id", UserAuth, upload.single("profilePic"), convertJfifToWebp, editProfile)
indexRoutes.delete("/deleteUser/:id", UserAuth, deleteUser)

//login Routes
indexRoutes.post("/userLogin", userLogin)
indexRoutes.post("/VerifyPhone", VerifyPhone)
indexRoutes.post("/forgotPassword", forgotPassword)
indexRoutes.post("/VerifyEmail", VerifyOtp)
indexRoutes.post("/resetPassword", resetPassword)
indexRoutes.post("/changePassword", UserAuth, changePassword)

indexRoutes.get("/searchUsers", UserAuth, searchUsers)
indexRoutes.get("/suggestedUsers", UserAuth, isUser, suggestedUsers)
indexRoutes.post("/followOrUnfollow/:id", UserAuth, isUser, followOrUnfollow)


indexRoutes.post("/sendMessage/:id", UserAuth, isUser, upload.single("messageImage"), handleMulterError, convertJfifToWebp, sendMessage)
indexRoutes.get("/getMessage/:id", UserAuth, isUser, getMessage)
indexRoutes.get("/getAllMessageUsers", UserAuth, getAllMessageUsers)

// Free Games Routes
indexRoutes.post("/free-games", UserAuth, isAdmin, upload.single("image"), handleMulterError, convertJfifToWebp, createFreeGame)
indexRoutes.get("/free-games", getFreeGames)
indexRoutes.get("/free-games/:slug", getFreeGameBySlug)
indexRoutes.put("/free-games/:id", UserAuth, isAdmin, upload.single("image"), handleMulterError, convertJfifToWebp, updateFreeGame)
indexRoutes.delete("/free-games/:id", UserAuth, isAdmin, deleteFreeGame)


export default indexRoutes
