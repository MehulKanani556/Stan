import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import MessageStan from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getReceiverSocketId } from "../socketManager/SocketManager.js";
import { decryptData } from "../middlewares/incrypt.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user?._id;
        const receiverId = req.params.id;
        const { text: message } = req.body;
        const messageImage = req.file;

        // Validate auth and params
        if (!senderId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, message: "Invalid receiverId" });
        }

        let messageImageUrl;
        if (messageImage) {
            messageImageUrl = messageImage.location;
        }

        if (!message && !messageImageUrl) {
            return res.status(400).json({ success: false, message: "Either textMessage or messageImage is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await MessageStan.create({
            senderId,
            receiverId,
            message,
            messageImage: messageImageUrl,
        });

        if (newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            global.io.to(receiverSocketId).emit("newMessage", newMessage);

            const sender = await User.findById(senderId).select("name profilePic");

            const notification = {
                type: "message",
                userId: senderId,
                userDetails: sender,
                message: `Sent you a message`,
                conversationId: conversation._id,
            };

            global.io.to(receiverSocketId).emit("notification", notification);
        }

        return res.status(201).json({
            success: true,
            newMessage,
        });
    } catch (error) {
        console.log("Error sending message:", error);
        return res.status(500).json({ success: false, message: error?.message || "Internal Server Error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.user?._id;
        const receiverId = req.params.id;
        
        if (!senderId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, message: "Invalid receiverId" });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages,
        });
    } catch (error) {
        console.log("Error in getMessage:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// New endpoint to mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const currentUserId = req.user?._id;
        const { senderId } = req.body;

        if (!currentUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ success: false, message: "Invalid senderId" });
        }

        // Mark all unread messages from senderId to currentUserId as read
        const result = await MessageStan.updateMany(
            {
                senderId: senderId,
                receiverId: currentUserId,
                isRead: false
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        // Notify the sender via socket that their messages have been read
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            global.io.to(senderSocketId).emit("messagesRead", {
                readBy: currentUserId,
                messageCount: result.modifiedCount,
                timestamp: new Date()
            });
        }

        return res.status(200).json({
            success: true,
            message: "Messages marked as read",
            count: result.modifiedCount
        });
    } catch (error) {
        console.log("Error marking messages as read:", error);
        return res.status(500).json({ success: false, message: error?.message || "Internal Server Error" });
    }
};

export const getAllMessageUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const pipeline = [
            {
                $match: {
                    $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
                },
            },
            {
                $project: {
                    user: {
                        $cond: {
                            if: { $eq: ["$senderId", currentUserId] },
                            then: "$receiverId",
                            else: "$senderId",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$user",
                },
            },
            {
                $lookup: {
                    from: "userstans",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ["$userData.name", ""] },
                    email: { $ifNull: ["$userData.email", null] },
                    photo: { $ifNull: ["$userData.photo", null] },
                    profilePhoto: { $ifNull: ["$userData.profilePhoto", null] },
                    createdAt: { $ifNull: ["$userData.createdAt", null] },
                    phone: { $ifNull: ["$userData.phone", null] },
                    dob: { $ifNull: ["$userData.dob", null] },
                    bio: { $ifNull: ["$userData.bio", null] },
                    archiveUsers: { $ifNull: ["$userData.archiveUsers", null] },
                    blockedUsers: { $ifNull: ["$userData.blockedUsers", null] },
                    isUser: {
                        $cond: [{ $ifNull: ["$userData._id", null] }, true, false],
                    },
                    deleteChatFor: { $ifNull: ["$userData.deleteChatFor", null] },
                },
            },
            {
                $lookup: {
                    from: "messagestans",
                    let: {
                        userId: "$_id",
                        currentUserId: currentUserId,
                        isUser: "$isUser",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$isUser", true] },
                                        {
                                            $or: [
                                                {
                                                    $and: [
                                                        { $eq: ["$senderId", "$$userId"] },
                                                        { $eq: ["$receiverId", "$$currentUserId"] },
                                                        { $ne: ["$isBlocked", true] },
                                                    ],
                                                },
                                                {
                                                    $and: [
                                                        { $eq: ["$senderId", "$$currentUserId"] },
                                                        { $eq: ["$receiverId", "$$userId"] },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $sort: { createdAt: -1 },
                        },
                        {
                            $limit: 20,
                        },
                    ],
                    as: "directMessages",
                },
            },
            // Add unread count lookup
            {
                $lookup: {
                    from: "messagestans",
                    let: {
                        userId: "$_id",
                        currentUserId: currentUserId,
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$senderId", "$$userId"] },
                                        { $eq: ["$receiverId", "$$currentUserId"] },
                                        { $eq: ["$isRead", false] }
                                    ],
                                },
                            },
                        },
                        {
                            $count: "unreadCount"
                        }
                    ],
                    as: "unreadData",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    profilePhoto: 1,
                    photo: 1,
                    createdAt: 1,
                    phone: 1,
                    dob: 1,
                    bio: 1,
                    archiveUsers: 1,
                    blockedUsers: 1,
                    isUser: 1,
                    directMessages: 1,
                    deleteChatFor: 1,
                    unreadCount: {
                        $ifNull: [
                            { $arrayElemAt: ["$unreadData.unreadCount", 0] },
                            0
                        ]
                    }
                },
            },
        ];

        const results = await MessageStan.aggregate(pipeline);
        const userResults = results.filter((item) => item.isUser);

        const currentUser = results.find(
            (r) => r._id.toString() === currentUserId.toString()
        );

        const formattedUsers = userResults
            .filter((user) => {
                const isInDeleteChatFor = currentUser?.deleteChatFor?.includes(
                    user._id.toString()
                );

                if (isInDeleteChatFor) {
                    const hasMessages = user?.directMessages && user?.directMessages.filter((u) => {
                        const deletedForStrings = u.deletedFor?.map((id) => id.toString()) || [];
                        return !deletedForStrings.includes(currentUserId.toString());
                    });

                    if (hasMessages && hasMessages?.length <= 0) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            })
            .map((user) => ({
                _id: user._id,
                name: decryptData(user.name),
                email: user.email,
                photo: user.photo,
                profilePhoto: user.profilePhoto,
                createdAt: user.createdAt,
                phone: user.phone,
                dob: user.dob,
                bio: user.bio,
                archiveUsers: user.archiveUsers,
                blockedUsers: user.blockedUsers,
                isUser: true,
                messages: user.directMessages || [],
                unreadCount: user.unreadCount || 0
            }));

        return res.status(200).json({
            status: 200,
            message: "All Message Users and Groups Found Successfully...",
            users: [...formattedUsers],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { selectedId } = req.body;
        const userId = req.user._id;

        let messages = await MessageStan.find({
            $or: [
                { senderId: userId, receiverId: selectedId },
                { senderId: selectedId, receiverId: userId },
            ],
        });
        console.log(messages, userId, selectedId);

        await Promise.all(
            messages.map(async (message) => {
                await MessageStan.findByIdAndDelete(message._id);
            })
        );

        return res.status(200).json({
            status: 200,
            message: "Chat Delete successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};