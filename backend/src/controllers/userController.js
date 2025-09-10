import User from "../models/userModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendForbiddenResponse, sendCreatedResponse, sendUnauthorizedResponse, sendNotFoundResponse } from '../utils/ResponseUtils.js';
import { getReceiverSocketId } from "../socketManager/SocketManager.js";
import { decryptData, encryptData } from "../middlewares/incrypt.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

// Configure S3 client
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY.trim(),
        secretAccessKey: process.env.S3_SECRET_KEY.trim()
    },
    region: process.env.S3_REGION || "us-east-1"
});
const generateTokens = async (id) => {
    try {
        const userData = await User.findOne({ _id: id });
        if (!userData) {
            throw new Error("User not found");
        }

        const accessToken = await jwt.sign(
            {
                _id: userData._id,
                role: userData.role || "user",
                isAdmin: userData.role === "admin"
            },
            process.env.JWT_SECRET,
            // { expiresIn: "60m" }
        );

        const refreshToken = await jwt.sign(
            {
                _id: userData._id,
                role: userData.role || "user",
                isAdmin: userData.role === "admin"
            },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: "15d" }
        );

        userData.refreshToken = refreshToken;
        await userData.save({ validateBeforeSave: false });

        return {
            accessToken: accessToken, // Encrypt accessToken
            refreshToken: userData.refreshToken, // Already encrypted
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// Helper function to delete file from S3
const deleteFileFromS3 = async (fileUrl) => {
    try {
        if (!fileUrl) return;

        // Extract the key from the URL
        const key = fileUrl.split('.com/')[1];
        if (!key) return;

        const deleteParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        };

        await s3.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};

export const register = async (req, res) => {
    try {
        const { contactNo, email, password, name, role } = req.body;

        // Only encrypt values that exist and are not undefined
        const contactNoHash = contactNo ? encryptData(contactNo) : undefined;
        const emailHash = email ? encryptData(email) : undefined;
        const nameHash = name ? encryptData(name) : undefined;
        const passwordHash = password ? encryptData(password) : undefined;


        // Check for contactNo uniqueness if provided (check against encrypted value) 
        if (contactNo) {
            const userByContact = await User.findOne({ contactNo: contactNoHash });
            if (userByContact) {
                return sendBadRequestResponse(res, "ContactNo already taken");
            }
        }

        // Check for email uniqueness if provided (check against encrypted value)
        if (email) {
            const userByEmail = await User.findOne({ email: emailHash });
            if (userByEmail) {
                return sendBadRequestResponse(res, "Email already in use");
            }
        }

        const data = await User.insertOne({
            name: nameHash,
            email: emailHash,
            contactNo: contactNoHash,
            password: passwordHash,
            role: role || 'user',
        });

        const { accessToken, refreshToken } = await generateTokens(data._id);
        if (!accessToken) {
            return sendErrorResponse(res, 500, "Failed to generate token");
        }

        return res
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 2 * 60 * 60 * 1000, sameSite: "Strict" })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                sameSite: "Strict",
            })
            .status(201)
            .json({
                success: true,
                message: "Account created successfully",
                result: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role || 'user',
                    isAdmin: data.role === 'admin',
                    lastLogin: data.lastLogin,
                    token: accessToken
                }
            });

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            name,
            username,
            email,
            bio,
            gender,
        } = req.body;

        const emailHash = email ? encryptData(email) : undefined;
        const nameHash = name ? encryptData(name) : undefined;
        const bioHash = bio ? encryptData(bio) : undefined;
        const usernameHash = username ? encryptData(username) : undefined;
        const genderHash = gender ? encryptData(gender) : undefined;


        if (!req.user || (req.user._id.toString() !== userId && req.user.role !== 'admin')) {
            return sendForbiddenResponse(res, "Access denied. You can only update your own profile.");
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Check for unique username/email (compare against encrypted values and exclude current user)
        if (username && usernameHash && usernameHash !== existingUser.username) {
            const existingUsername = await User.findOne({ username: usernameHash, _id: { $ne: userId } });
            if (existingUsername) {
                return sendErrorResponse(res, 400, "Username already exists");
            }
        }

        if (email && emailHash && emailHash !== existingUser.email) {
            const existingEmail = await User.findOne({ email: emailHash, _id: { $ne: userId } });
            if (existingEmail) {
                return sendErrorResponse(res, 400, "Email already exists");
            }
        }

        // Handle image upload
        if (req.file) {
            // Delete old profile image from S3 if it exists
            if (existingUser.profilePic) {
                try {
                    await deleteFileFromS3(existingUser.profilePic);
                } catch (error) {
                    console.error('Error deleting old profile image:', error);
                    // Continue with the update even if deletion fails
                }
            }

            // With S3, the file.location contains the full S3 URL
            const newImagePath = req.file.location;

            // Store the S3 URL in the database
            existingUser.profilePic = newImagePath;
        }

        // Update allowed fields
        if (name) existingUser.name = nameHash;
        if (username) existingUser.username = usernameHash;
        if (email) existingUser.email = emailHash;
        if (bio) existingUser.bio = bioHash;
        if (gender) existingUser.gender = genderHash;

        await existingUser.save();
        const userResponse = existingUser.toObject();
        delete userResponse.password;
        return sendSuccessResponse(res, "User updated successfully", userResponse);

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Check if user is authenticated and is admin
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // if (!req.user.isAdmin) {
        //     return sendForbiddenResponse(res, "Access denied. Only admins can view all users.");
        // }

        // Find all users with role 'user'
        const users = await User.find().select('-password');

        // Check if any users were found
        if (!users || users.length === 0) {
            return sendSuccessResponse(res, "No users found", []);
        }

        const decryptedUsers = users.map(user => ({
            ...user.toObject(),
            name: decryptData(user.name),
            email: decryptData(user.email),
            // Add other fields you need to decrypt
        }));
        // Send a success response with the fetched users
        return sendSuccessResponse(res, "Users fetched successfully", decryptedUsers);

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists and has proper role
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // Check if user is admin or accessing their own profile
        const isAdmin = req.user.role === 'admin';
        if (!isAdmin && req.user._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own profile.");
        }

        // Use findById for more robust lookup
        const user = await User.findById(id);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found", []);
        }

        // Prepare user response (exclude password)
        const userResponse = user.toObject();
        delete userResponse.password;

        return sendSuccessResponse(res, "User retrieved successfully", userResponse);
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

export const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            name,
            username,
            email,
            bio,
            gender,
        } = req.body;

        if (!req.user || (req.user._id.toString() !== userId && req.user.role !== 'admin')) {
            return sendForbiddenResponse(res, "Access denied. You can only update your own profile.");
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Encrypt values that will be updated
        const nameHash = name ? encryptData(name) : undefined;
        const usernameHash = username ? encryptData(username) : undefined;
        const emailHash = email ? encryptData(email) : undefined;
        const bioHash = bio ? encryptData(bio) : undefined;
        const genderHash = gender ? encryptData(gender) : undefined;

        // Handle image upload
        if (req.file) {
            // Delete old profile image from S3 if it exists
            if (existingUser.profilePic) {
                try {
                    await deleteFileFromS3(existingUser.profilePic);
                } catch (error) {
                    console.error('Error deleting old profile image:', error);
                    // Continue with the update even if deletion fails
                }
            }

            // With S3, the file.location contains the full S3 URL
            const newImagePath = req.file.location;

            // Store the S3 URL in the database
            existingUser.profilePic = newImagePath;
        }

        // Check for unique username/email (check against encrypted values)
        if (username && usernameHash && usernameHash !== existingUser.username) {
            const existingUsername = await User.findOne({ username: usernameHash, _id: { $ne: userId } });
            if (existingUsername) {
                return sendErrorResponse(res, 400, "Username already exists");
            }
        }
        if (email && emailHash && emailHash !== existingUser.email) {
            const existingEmail = await User.findOne({ email: emailHash, _id: { $ne: userId } });
            if (existingEmail) {
                return sendErrorResponse(res, 400, "Email already exists");
            }
        }

        // Update allowed fields with encrypted values
        if (name) existingUser.name = nameHash;
        if (username) existingUser.username = usernameHash;
        if (email) existingUser.email = emailHash;
        if (bio) existingUser.bio = bioHash;
        if (gender) existingUser.gender = genderHash;

        await existingUser.save();
        const userResponse = existingUser.toObject();
        delete userResponse.password;
        return sendSuccessResponse(res, "User updated successfully", userResponse);

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return sendBadRequestResponse(res, "User ID is required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }
        if (!user.otp || !user.otpExpiry) {
            return sendBadRequestResponse(res, "No OTP found. Please request a new OTP.");
        }
        if (user.otp !== otp) {
            return sendBadRequestResponse(res, "Invalid OTP.");
        }
        if (user.otpExpiry < Date.now()) {
            return sendBadRequestResponse(res, "OTP has expired. Please request a new OTP.");
        }
        user.lastLogin = new Date();
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        // 1. Delete profile image from AWS S3 if it exists
        if (user.profilePic) {
            try {
                await deleteFileFromS3(user.profilePic);
            } catch (error) {
                console.error('Error deleting profile image from S3:', error);
                // Continue with user deletion even if image deletion fails
            }
        }

        // 2. Remove user from other users' followers and followings
        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } }
        );
        await User.updateMany(
            { followings: userId },
            { $pull: { followings: userId } }
        );

        // 3. Remove from blockedUsers if used
        await User.updateMany(
            { blockedUsers: userId },
            { $pull: { blockedUsers: userId } }
        );

        // 4. Finally, delete the user
        await User.findByIdAndDelete(userId);

        return sendSuccessResponse(res, "User and all associated data deleted successfully");
    } catch (error) {
        return sendErrorResponse(res, 500, "Something went wrong while deleting the user");
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return sendBadRequestResponse(res, "Query is required")
        }

        // Search for users whose username or fullname starts with the query (case-insensitive)
        const users = await User.find({
            $or: [
                { username: { $regex: `^${query}`, $options: "i" } },
                { name: { $regex: `^${query}`, $options: "i" } },
            ],
        }).select("username fullname profilePic _id");

        if (users.length === 0) {
            return sendNotFoundResponse(res, "No user found.")
        }

        return sendSuccessResponse(res, "user fetched successfully...", users)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

export const suggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.user?._id;

        const suggestedUsers = await User.find({
            _id: { $ne: currentUserId },
            role: { $ne: 'admin' } // Exclude admins
        }).select("-password");

        if (!suggestedUsers) {
            return sendBadRequestResponse(res, "Currently do not have any users")
        }
        return sendSuccessResponse(res, "Suggested users fetched successfully...", suggestedUsers)
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.user._id;
        const followingUserId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(followingUserId)) {
            return sendBadRequestResponse(res, "Invalid FollowingUserId")
        }

        if (userId.toString() === followingUserId.toString()) {
            return sendBadRequestResponse(res, "You can't follow and unfollow yourself")
        }

        const user = await User.findById(userId);
        const followingUser = await User.findById(followingUserId);

        if (!user || !followingUser) {
            return sendBadRequestResponse(res, "User not found")
        }

        const isFollowing = user.followings.includes(followingUserId);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $pull: { followings: followingUserId } },
                    { new: true }
                ),
                User.findByIdAndUpdate(
                    followingUserId,
                    { $pull: { followers: userId } },
                    { new: true }
                ),
            ]);

            const newUserData = await User.findById(userId);
            const newFollowingUser = await User.findById(followingUserId);
            return res.status(200).json({
                message: "Unfollowing",
                user: newUserData,
                followingUser: newFollowingUser,
                success: true,
            });
        } else {
            // Follow logic
            await Promise.all([
                User.findByIdAndUpdate(
                    userId,
                    { $push: { followings: followingUserId } },
                    { new: true }
                ),
                User.findByIdAndUpdate(
                    followingUserId,
                    { $push: { followers: userId } },
                    { new: true }
                ),
            ]);

            const newUserData = await User.findById(userId);
            const newFollowingUser = await User.findById(followingUserId);

            // ✅ Send real-time notification to followed user
            //const notification = {
            //type: "follow",
            //message: `${user.username} started following you.`,
            //senderId: userId,
            //receiverId: followingUserId,
            //timestamp: new Date(),
            //};

            const notification = {
                type: "follow",
                userId: userId,
                userDetails: user,
                message: `started following you.`,
            };

            const receiverSocketId = getReceiverSocketId(followingUserId);

            if (receiverSocketId) {
                global.io.to(receiverSocketId).emit("notification", notification);
            }

            return res.status(200).json({
                message: "Following",
                user: newUserData,
                followingUser: newFollowingUser,
                success: true,
            });
        }
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};


export const sendDeleteOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (email) {
            const otp = generateOTP()
            // Find user by email
            const user = await User.findOne({ email: emailHash });
            if (!user) {
                return sendErrorResponse(res, 404, "User not found");
            }

            // Send OTP to the original email (not encrypted)
            await sendOtpEmail(email, otp);
            // Set OTP and expiry (e.g., 5 minutes from now)
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();
            // Send OTP to email
            return sendSuccessResponse(res, "OTP sent to email", { email });
        }

        // If neither provided
        return sendBadRequestResponse(res, "Please provide either email");
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
}