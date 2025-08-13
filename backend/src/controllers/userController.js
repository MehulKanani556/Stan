import User from "../models/userModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendForbiddenResponse, sendCreatedResponse, sendUnauthorizedResponse, sendNotFoundResponse } from '../utils/ResponseUtils.js';
import { getReceiverSocketId, io } from "../socket/socket.js";
import { encryptData } from "../middlewares/incrypt.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

        const token = await data.getJWT();
        if (!token) {
            return sendErrorResponse(res, 500, "Failed to generate token");
        }

        return sendCreatedResponse(res, "Account created successfully", { data, token: token });
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

        // Check for unique username (check against encrypted value)
        if (username && username !== existingUser.username) {
            const existingUsername = await User.findOne({ username: usernameHash });
            if (existingUsername) {
                return sendErrorResponse(res, 400, "Username already exists");
            }
        }

        // Check for unique email (check against encrypted value)
        if (email && email !== existingUser.email) {
            const existingEmail = await User.findOne({ email: emailHash });
            if (existingEmail) {
                return sendErrorResponse(res, 400, "Email already exists");
            }
        }

        // Handle image upload
        if (req.file) {
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

        if (!req.user.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only admins can view all users.");
        }

        // Find all users with role 'user'
        const users = await User.find({ role: 'user' }).select('-password');

        // Check if any users were found
        if (!users || users.length === 0) {
            return sendSuccessResponse(res, "No users found", []);
        }

        // Send a success response with the fetched users
        return sendSuccessResponse(res, "Users fetched successfully", users);

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
            // With S3, the file.location contains the full S3 URL
            const newImagePath = req.file.location;
            
            // Store the S3 URL in the database
            existingUser.profilePic = newImagePath;
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

        // 1. Delete user's posts (commented out until Post model exists)
        // await Post.deleteMany({ user: userId });

        // 2. Delete comments by user (commented out until Comment model exists)
        // await Comment.deleteMany({ user: userId });

        // 3. Remove likes and saved references from all posts (commented out until Post model exists)
        // await Post.updateMany(
        //     { likes: userId },
        //     { $pull: { likes: userId } }
        // );
        // await Post.updateMany(
        //     { saved: userId },
        //     { $pull: { saved: userId } }
        // );
        // await Post.updateMany(
        //     { taggedFriends: userId },
        //     { $pull: { taggedFriends: userId } }
        // );
        // await Comment.updateMany(
        //     { likeComment: userId },
        //     { $pull: { likeComment: userId } }
        // )

        // 7. Remove user from other users' followers and followings
        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId } }
        );
        await User.updateMany(
            { followings: userId },
            { $pull: { followings: userId } }
        );

        // 8. (Optional) Remove from blockedUsers if used
        await User.updateMany(
            { blockedUsers: userId },
            { $pull: { blockedUsers: userId } }
        );

        // 9. Finally, delete the user
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
                io.to(receiverSocketId).emit("notification", notification);
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