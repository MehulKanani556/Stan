
import express from "express";
import { upload, convertJfifToWebp } from "../middlewares/imageupload.js";
import { isAdmin, isUser, UserAuth } from "../middlewares/auth.js";
import { deleteUser, editProfile, editUser, followOrUnfollow, getAllUsers, getUserById, register, searchUsers, suggestedUsers } from "../controllers/userController.js";
import { changePassword, forgotPassword, resetPassword, userLogin, VerifyOtp, VerifyPhone } from "../controllers/loginController.js";


const indexRoutes = express.Router()

//register Routes
indexRoutes.post("/register", register)
indexRoutes.get("/getAllUsers", UserAuth, isAdmin, getAllUsers)
indexRoutes.get("/getUserById/:id", UserAuth, isAdmin, getUserById)
indexRoutes.put("/editUser/:id", UserAuth, isAdmin, upload.single("profilePic"), convertJfifToWebp, editUser)
indexRoutes.put("/editProfile/:id", UserAuth, upload.single("profilePic"), convertJfifToWebp, editProfile)
indexRoutes.delete("/deleteUser/:id", UserAuth, deleteUser)

//login Routes
indexRoutes.post("/userLogin", userLogin)
indexRoutes.post("/VerifyPhone", VerifyPhone)
indexRoutes.post("/forgotPassword", forgotPassword)
indexRoutes.post("/VerifyEmail", VerifyOtp)
indexRoutes.post("/resetPassword", UserAuth, resetPassword)
indexRoutes.post("/changePassword", UserAuth, changePassword)

indexRoutes.get("/searchUsers", UserAuth, searchUsers)
indexRoutes.get("/suggestedUsers", UserAuth, isUser, suggestedUsers)
indexRoutes.post("/followOrUnfollow/:id", UserAuth, isUser, followOrUnfollow)


export default indexRoutes
