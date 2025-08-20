import Message from "../models/messageModel.js";

// Store user-to-socket mappings
const userSocketMap = new Map();
const socketUserMap = new Map();

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Handle user joining (when they login or connect)
    socket.on("user-join", (data) => {
      const { userId } = data;
      if (userId) {
        // Store the mapping
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);
        
        // Join user to their own room
        socket.join(userId);
        
        console.log(`User ${userId} joined with socket ${socket.id}`);
      }
    });

    // Listen for your custom event (fix typo: "conection" -> "connection")
    socket.on("connection-test", (data) => {
      console.log("Custom 'connection-test' event received:", data);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, message, senderId } = data;
        
        // Validate message content
        if (!message || message.trim() === "") {
          console.log("Attempted to send an empty message, ignoring.");
          return;
        }

        // Create message in database
        const newMessage = await Message.create({
          receiverId,
          message,
          senderId
        });

        // Add timestamp for frontend
        const messageWithTime = {
          ...newMessage.toObject(),
          time: new Date(newMessage.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

        // Send to receiver if they're online
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", messageWithTime);
          console.log(`Message sent to receiver ${receiverId}`);
        } else {
          console.log(`Receiver ${receiverId} is not online`);
        }

        // Send confirmation back to sender
        socket.emit("messageSent", messageWithTime);
        console.log(`Message confirmation sent to sender ${senderId}`);

      } catch (error) {
        console.error("Error handling sendMessage:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        userSocketMap.delete(userId);
        socketUserMap.delete(socket.id);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
}

// Helper function to get receiver socket ID (export if needed elsewhere)
export const getReceiverSocketId = (userId) => {
  return userSocketMap.get(userId);
};

export default { initializeSocket };