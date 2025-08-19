import mongoose from "mongoose";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user?._id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;
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

        const newMessage = await Message.create({
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
            io.to(receiverSocketId).emit("newMessage", newMessage);

            // Fetch sender details to include in notification
            const sender = await User.findById(senderId).select(
                "username profilePic"
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
            io.to(receiverSocketId).emit("notification", notification);
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
