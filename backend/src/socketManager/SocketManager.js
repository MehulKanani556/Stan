import Message from "../models/messageModel.js";

// Store user-to-socket mappings
const userSocketMap = new Map();
const socketUserMap = new Map();

// Store typing timeouts to auto-clear typing status
const typingTimeouts = new Map();

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Handle user joining (when they login or connect)
    socket.on("user-join", (data) => {
      const { userId } = data;
      if (userId) {
        // Remove user from previous socket if exists
        const existingSocketId = userSocketMap.get(userId);
        if (existingSocketId && existingSocketId !== socket.id) {
          const existingSocket = io.sockets.sockets.get(existingSocketId);
          if (existingSocket) {
            socketUserMap.delete(existingSocketId);
          }
        }

        // Store the new mapping
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);
        
        // Join user to their own room
        socket.join(userId);
        
        console.log(`User ${userId} joined with socket ${socket.id}`);
        
        // Broadcast updated online users list
        io.emit("online-users", Array.from(userSocketMap.keys()));
      }
    });

    // Connection test event
    socket.on("connection-test", (data) => {
      console.log("Custom 'connection-test' event received:", data);
      socket.emit("connection-test-response", { status: "success", message: "Connection test successful" });
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, message, senderId } = data;
        
        // Validate message content
        if (!message || message.trim() === "") {
          console.log("Attempted to send an empty message, ignoring.");
          socket.emit("messageError", { error: "Message cannot be empty" });
          return;
        }

        // Validate sender
        const senderSocketUserId = socketUserMap.get(socket.id);
        if (senderSocketUserId !== senderId) {
          console.log("Sender validation failed");
          socket.emit("messageError", { error: "Invalid sender" });
          return;
        }

        // Create message in database
        const newMessage = await Message.create({
          receiverId,
          message: message.trim(),
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

        // Clear typing status for sender
        clearTypingStatus(senderId, io);

      } catch (error) {
        console.error("Error handling sendMessage:", error);
        socket.emit("messageError", { 
          error: "Failed to send message",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Handle typing indicator with auto-clear
    socket.on("typing", (data) => {
      const { receiverId } = data;
      const senderId = socketUserMap.get(socket.id);
      
      if (!senderId) {
        console.log("Typing event from unregistered socket");
        return;
      }

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
        console.log(`Typing indicator sent from ${senderId} to ${receiverId}`);
        
        // Clear existing timeout for this user
        const existingTimeout = typingTimeouts.get(senderId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        // Set new timeout to auto-clear typing after 3 seconds
        const timeoutId = setTimeout(() => {
          clearTypingStatus(senderId, io);
          console.log(`Auto-cleared typing status for ${senderId}`);
        }, 3000);
        
        typingTimeouts.set(senderId, timeoutId);
      }
    });

    socket.on("stop-typing", (data) => {
      const { receiverId } = data;
      const senderId = socketUserMap.get(socket.id);
      
      if (!senderId) {
        console.log("Stop-typing event from unregistered socket");
        return;
      }

      clearTypingStatus(senderId, io);
      
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop-typing", { senderId });
        console.log(`Stop-typing indicator sent from ${senderId} to ${receiverId}`);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        // Clear typing status
        clearTypingStatus(userId, io);
        
        // Remove mappings
        userSocketMap.delete(userId);
        socketUserMap.delete(socket.id);
        
        console.log(`User ${userId} disconnected`);
        
        // Broadcast updated online users list
        io.emit("online-users", Array.from(userSocketMap.keys()));
      }
    });
  });
}

// Helper function to clear typing status
function clearTypingStatus(userId, io) {
  const timeoutId = typingTimeouts.get(userId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    typingTimeouts.delete(userId);
  }
  
  // Notify all connected clients that this user stopped typing
  io.emit("stop-typing", { senderId: userId });
}

// Helper function to get receiver socket ID (export if needed elsewhere)
export const getReceiverSocketId = (userId) => {
  return userSocketMap.get(userId);
};

export const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};

export const isUserOnline = (userId) => {
  return userSocketMap.has(userId);
};

export default { initializeSocket };