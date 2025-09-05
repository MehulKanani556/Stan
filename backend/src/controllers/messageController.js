import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
// import Message from "../models/messageModel.js";
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
            // With S3 + multer-s3, the uploaded file URL is available at req.file.location
            messageImageUrl = messageImage.location;
        }

        if (!message && !messageImageUrl) {
            return res.status(400).json({ success: false, message: "Either textMessage or messageImage is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // Establish the conversation if not started yet.
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

        // Implement socket.io for real-time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            global.io.to(receiverSocketId).emit("newMessage", newMessage);

            // Fetch sender details to include in notification
            const sender = await User.findById(senderId).select(
                "name profilePic"
            );

            // Construct notification object
            const notification = {
                type: "message",
                userId: senderId,
                userDetails: sender,
                message: `Sent you a message`,
                conversationId: conversation._id,
            };

            // Emit notification event
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
            participants: { $all: [senderId, receiverId] }, // ✅ Fix: Use an array instead of an object
        }).populate("messages"); // ✅ Populates messages with actual message data

        if (!conversation) {
            return res.status(200).json({
                success: true,
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            messages: conversation.messages, // ✅ Ensure messages are sent correctly
        });
    } catch (error) {
        console.log("Error in getMessage:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
};
export const getAllMessageUsers = async (req, res) => {
    try {

        const pipeline = [
            // Match messages where user is either sender or receiver
            {
                $match: {
                    $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
                },
            },

            // Project to get the other user in the conversation
            {
                $project: {
                    user: {
                        $cond: {
                            if: { $eq: ["$senderId", req.user._id] },
                            then: "$receiverId",
                            else: "$senderId",
                        },
                    },
                },
            },

            // Group by user to remove duplicates
            {
                $group: {
                    _id: "$user",
                },
            },

            // Lookup user details
            {
                $lookup: {
                    from: "userstans",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData",
                },
            },

            // Unwind user data
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Project required user fields
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ["$userData.name", ""] },
                    email: { $ifNull: ["$userData.email", null] },
                    photo: { $ifNull: ["$userData.photo", null] },
                    profilePhoto: { $ifNull: ["$userData.profilePic", null] },
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
            // Union with current user's data
            // {
            //     $unionWith: {
            //         coll: "userstans",
            //         pipeline: [
            //             {
            //                 $match: {
            //                     _id: req.user._id,
            //                 },
            //             },
            //             {
            //                 $project: {
            //                     _id: 1,
            //                     name: 1,
            //                     email: 1,
            //                     photo: 1,
            //                     profilePhoto: 1,
            //                     createdAt: 1,
            //                     phone: 1,
            //                     dob: 1,
            //                     bio: 1,
            //                     archiveUsers: 1,
            //                     blockedUsers: 1,
            //                     isUser: { $literal: true },
            //                     deleteChatFor: 1,
            //                 },
            //             },
            //         ],
            //     },
            // },



            // Modified messages lookup for direct messages
            {
                $lookup: {
                    from: "messagestans",
                    let: {
                        userId: "$_id",
                        currentUserId: req.user._id,
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
                                                        // { $ne: ["$isBlocked", true] },
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

            // Final projection for users
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
                },
            },
        ];

        const results = await MessageStan.aggregate(pipeline);

        // Process the results to include group messages
        const userResults = results.filter((item) => item.isUser);

        const currentUser = results.find(
            (r) => r._id.toString() === req.user._id.toString()
        );

        const formattedUsers = userResults
            .filter((user) => {
            {console.log('$project',user)}
                const isInDeleteChatFor = currentUser?.deleteChatFor?.includes(
                    user._id.toString()
                );

                if (isInDeleteChatFor) {
                    const hasMessages = user?.directMessages && user?.directMessages.filter((u) => {
                        const deletedForStrings = u.deletedFor.map((id) => id.toString());
                        return !deletedForStrings.includes(currentUser._id.toString());
                    });

                    if (hasMessages && hasMessages?.length <= 0) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
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
  
      // Find all messages between these users
      let messages  = await MessageStan.find({
          $or: [
            { senderId: userId, receiverId: selectedId },
            { senderId: selectedId, receiverId: userId },
          ],
        });
        console.log(messages,userId,selectedId);
        
      
      // Add current user to deletedFor array for each message
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