import Message from "../models/messageModel.js";

// Store user-to-socket mappings
const userSocketMap = new Map();
const socketUserMap = new Map();

// Store typing timeouts to auto-clear typing status
const typingTimeouts = new Map();

// Store message queues for offline users
const messageQueues = new Map();

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
        
        // Send any queued messages for this user
        const queuedMessages = messageQueues.get(userId);
        if (queuedMessages && queuedMessages.length > 0) {
          queuedMessages.forEach(message => {
            socket.emit("newMessage", message);
          });
          messageQueues.delete(userId);
          console.log(`Delivered ${queuedMessages.length} queued messages to ${userId}`);
        }
        
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
          senderId,
          isRead: false // New messages are unread by default
        });

        // Add timestamp for frontend
        const messageWithTime = {
          ...newMessage.toObject(),
          time: new Date(newMessage.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

        // Send to receiver
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          // Check if receiver socket is still connected
          const receiverSocket = io.sockets.sockets.get(receiverSocketId);
          if (receiverSocket && receiverSocket.connected) {
            io.to(receiverSocketId).emit("newMessage", messageWithTime);
            console.log(`Message sent to receiver ${receiverId}`);
          } else {
            // Socket exists but disconnected, queue the message
            queueMessageForOfflineUser(receiverId, messageWithTime);
            console.log(`Receiver ${receiverId} socket disconnected, message queued`);
          }
        } else {
          // Receiver not online, queue the message
          queueMessageForOfflineUser(receiverId, messageWithTime);
          console.log(`Receiver ${receiverId} is not online, message queued`);
        }

        // Send confirmation back to sender
        socket.emit("messageSent", messageWithTime);
        console.log(`Message confirmation sent to sender ${senderId}`);

        // Also emit to sender for immediate UI update
        socket.emit("newMessage", messageWithTime);

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

    // Handle marking messages as read with better error handling
    socket.on("markMessagesRead", async (data) => {
      try {
        const { senderId } = data;
        const receiverId = socketUserMap.get(socket.id);
        
        if (!receiverId) {
          console.log("Mark read event from unregistered socket");
          socket.emit("markReadError", { error: "User not registered" });
          return;
        }

        // Mark all unread messages from senderId to receiverId as read
        const result = await Message.updateMany(
          {
            senderId: senderId,
            receiverId: receiverId,
            isRead: false
          },
          {
            isRead: true,
            readAt: new Date()
          }
        );

        console.log(`Marked ${result.modifiedCount} messages as read from ${senderId} to ${receiverId}`);

        // Notify the sender that their messages have been read
        const senderSocketId = userSocketMap.get(senderId);
        if (senderSocketId) {
          const senderSocket = io.sockets.sockets.get(senderSocketId);
          if (senderSocket && senderSocket.connected) {
            io.to(senderSocketId).emit("messagesRead", {
              readBy: receiverId,
              timestamp: new Date(),
              messageCount: result.modifiedCount
            });
          }
        }

        // Send confirmation back to the reader
        socket.emit("messagesMarkedRead", {
          senderId,
          count: result.modifiedCount
        });

      } catch (error) {
        console.error("Error marking messages as read:", error);
        socket.emit("markReadError", { 
          error: "Failed to mark messages as read",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Handle typing indicator with better validation
    socket.on("typing", (data) => {
      const { receiverId } = data;
      const senderId = socketUserMap.get(socket.id);
      
      if (!senderId) {
        console.log("Typing event from unregistered socket");
        return;
      }

      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        if (receiverSocket && receiverSocket.connected) {
          io.to(receiverSocketId).emit("typing", { senderId });
          console.log(`Typing indicator sent from ${senderId} to ${receiverId}`);
        }
        
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
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);
        if (receiverSocket && receiverSocket.connected) {
          io.to(receiverSocketId).emit("stop-typing", { senderId });
          console.log(`Stop-typing indicator sent from ${senderId} to ${receiverId}`);
        }
      }
    });

    // Handle disconnect with cleanup
    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);
      
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        // Clear typing status
        clearTypingStatus(userId, io);
        
        // Don't immediately remove mappings - wait a bit for reconnection
        setTimeout(() => {
          // Check if user has reconnected with different socket
          if (userSocketMap.get(userId) === socket.id) {
            userSocketMap.delete(userId);
            socketUserMap.delete(socket.id);
            console.log(`User ${userId} mapping removed after disconnect timeout`);
            
            // Broadcast updated online users list
            io.emit("online-users", Array.from(userSocketMap.keys()));
          }
        }, 5000); // 5 second grace period for reconnection
      }
    });

    // Handle reconnection
    socket.on("reconnect", () => {
      console.log(`Socket ${socket.id} reconnected`);
    });

    // Add heartbeat mechanism
    socket.on("ping", () => {
      socket.emit("pong");
    });
  });

  // Cleanup disconnected sockets periodically
  setInterval(() => {
    const disconnectedSockets = [];
    
    for (const [socketId, userId] of socketUserMap.entries()) {
      const socket = io.sockets.sockets.get(socketId);
      if (!socket || !socket.connected) {
        disconnectedSockets.push({ socketId, userId });
      }
    }
    
    disconnectedSockets.forEach(({ socketId, userId }) => {
      userSocketMap.delete(userId);
      socketUserMap.delete(socketId);
      console.log(`Cleaned up disconnected socket ${socketId} for user ${userId}`);
    });
    
    if (disconnectedSockets.length > 0) {
      io.emit("online-users", Array.from(userSocketMap.keys()));
    }
  }, 30000); // Check every 30 seconds
}

// Helper function to queue messages for offline users
function queueMessageForOfflineUser(userId, message) {
  if (!messageQueues.has(userId)) {
    messageQueues.set(userId, []);
  }
  
  const queue = messageQueues.get(userId);
  queue.push(message);
  
  // Limit queue size to prevent memory issues
  if (queue.length > 50) {
    queue.shift(); // Remove oldest message
  }
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
  const socketId = userSocketMap.get(userId);
  if (!socketId) return false;
  
  const socket = io.sockets.sockets.get(socketId);
  return socket && socket.connected;
};

export default { initializeSocket };