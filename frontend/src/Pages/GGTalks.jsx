import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessageUsers, markMessagesAsRead } from "../Redux/Slice/user.slice";
import ChatUserList from "../chat/ChatUserList";
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import { addMessage, setMessages, setSelectedUser, removeTypingUser } from "../Redux/Slice/manageState.slice";
import { resetUnreadCount } from "../Redux/Slice/user.slice";
import { GrSend } from "react-icons/gr";

export default function GGTalks() {
    const [newMessage, setNewMessage] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const [pendingMessages, setPendingMessages] = useState([]);
    
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const typingTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const currentUserId = localStorage.getItem('userId');

    const { allMessageUsers } = useSelector((state) => state.user);
    const { selectedUser, messages, typingUsers } = useSelector((state) => state.manageState);

    // Connection status monitoring
    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                // console.log('Connected to server');
                setConnectionStatus('connected');
                
                // Rejoin user room after reconnection
                socket.emit('user-join', { userId: currentUserId });
                
                // Resend any pending messages
                resendPendingMessages();
            });

            socket.on('disconnect', (reason) => {
                console.log('Disconnected from server:', reason);
                setConnectionStatus('disconnected');
            });

            socket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setConnectionStatus('error');
            });

            socket.on('reconnect', (attemptNumber) => {
                console.log(`Reconnected after ${attemptNumber} attempts`);
                setConnectionStatus('connected');
            });

            socket.on('reconnect_attempt', (attemptNumber) => {
                console.log(`Reconnection attempt ${attemptNumber}`);
                setConnectionStatus('reconnecting');
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('connect_error');
                socket.off('reconnect');
                socket.off('reconnect_attempt');
            };
        }
    }, [socket, currentUserId]);

    // Heartbeat mechanism
    useEffect(() => {
        if (socket && connectionStatus === 'connected') {
            heartbeatIntervalRef.current = setInterval(() => {
                socket.emit('ping');
            }, 25000); // Send ping every 25 seconds

            socket.on('pong', () => {
                // Connection is healthy
            });

            return () => {
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                }
                socket.off('pong');
            };
        }
    }, [socket, connectionStatus]);

    // Resend pending messages when connection is restored
    const resendPendingMessages = useCallback(() => {
        if (pendingMessages.length > 0 && socket && connectionStatus === 'connected') {
            pendingMessages.forEach(msg => {
                socket.emit("sendMessage", msg);
            });
            setPendingMessages([]);
        }
    }, [pendingMessages, socket, connectionStatus]);

    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, [dispatch]);

    // On mobile, show the user list first until a chat is selected
    useEffect(() => {
        const checkMobileView = () => {
            if (window.innerWidth < 768 && !selectedUser) {
                setShowUserList(true);
            }
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => {
            window.removeEventListener('resize', checkMobileView);
        };
    }, [selectedUser]);

    // Auto-select first user on desktop, but not on mobile to show welcome screen
    useEffect(() => {
        if (allMessageUsers && allMessageUsers.length > 0 && !selectedUser) {
            if (window.innerWidth >= 768) {
                // dispatch(setSelectedUser(allMessageUsers[0]));
            }
        } else if (selectedUser) {
            const currentSelectedUser = allMessageUsers.find(
                (user) => user._id === selectedUser._id
            );
            if (currentSelectedUser) {
                const sortedMessages = [...(currentSelectedUser.messages || [])].sort(
                    (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)
                );
                dispatch(setMessages(sortedMessages.map(msg => ({
                    ...msg,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }))));
            }
        }
    }, [allMessageUsers, selectedUser, dispatch]);

    // Mark messages as read when user opens a chat
    useEffect(() => {
        if (selectedUser && currentUserId && socket && connectionStatus === 'connected') {
            // Find the selected user's unread count
            const userWithUnread = allMessageUsers.find(user => user._id === selectedUser._id);
            
            // Only mark as read if there are unread messages
            if (userWithUnread && userWithUnread.unreadCount > 0) {
                // Mark messages as read in backend
                dispatch(markMessagesAsRead({ senderId: selectedUser._id }));
                
                // Reset unread count locally immediately for better UX
                dispatch(resetUnreadCount(selectedUser._id));
                
                // Emit socket event to notify the sender that messages have been read
                socket.emit("markMessagesRead", { senderId: selectedUser._id });
            }
        }
    }, [selectedUser, allMessageUsers, dispatch, socket, currentUserId, connectionStatus]);

    // Check if selected user is typing
    useEffect(() => {
        if (selectedUser && typingUsers) {
            setIsTyping(typingUsers.includes(selectedUser._id));
        } else {
            setIsTyping(false);
        }
    }, [selectedUser, typingUsers]);

    // Socket.IO for real-time messages and typing with better error handling
    useEffect(() => {
        if (socket) {
            // Handle new messages
            socket.on("newMessage", (message) => {
                // Update the conversation if message is for current chat
                if (selectedUser &&
                    ((message.senderId === selectedUser._id && message.receiverId === currentUserId) ||
                        (message.senderId === currentUserId && message.receiverId === selectedUser._id))
                ) {
                    dispatch(addMessage({
                        ...message,
                        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));

                    // If message is from selected user, mark as read immediately
                    if (message.senderId === selectedUser._id && socket && connectionStatus === 'connected') {
                        setTimeout(() => {
                            socket.emit("markMessagesRead", { senderId: selectedUser._id });
                        }, 100);
                    }
                }

                // Always refresh message users list to update unread counts
                dispatch(getAllMessageUsers());

                // Remove typing indicator when message is received
                dispatch(removeTypingUser(message.senderId));
            });

            // Handle message sent confirmation
            socket.on("messageSent", (message) => {
                console.log("Message sent successfully:", message.message);
                // Remove from pending messages if it was there
                setPendingMessages(prev => prev.filter(msg => msg.message !== message.message));
            });

            // Handle message errors
            socket.on("messageError", (error) => {
                console.error("Message error:", error);
                // You could show a toast notification here
            });

            // Handle messages read confirmation
            socket.on("messagesRead", (data) => {
                console.log(`Messages read by user ${data.readBy}`);
                // You can add UI feedback here if needed
            });

            // Handle mark read error
            socket.on("markReadError", (error) => {
                console.error("Error marking messages as read:", error);
            });

            return () => {
                socket.off("newMessage");
                socket.off("messageSent");
                socket.off("messageError");
                socket.off("messagesRead");
                socket.off("markReadError");
            };
        }
    }, [socket, selectedUser, dispatch, currentUserId, connectionStatus]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUser) {
            const messageData = {
                receiverId: selectedUser._id,
                message: newMessage.trim(),
                senderId: currentUserId,
                timestamp: Date.now() // Add timestamp for deduplication
            };

            if (socket && connectionStatus === 'connected') {
                socket.emit("sendMessage", messageData);
                
                // Stop typing indicator
                socket.emit("stop-typing", { receiverId: selectedUser._id });
                
                // Clear typing timeout
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
            } else {
                // Store message for later sending when connection is restored
                setPendingMessages(prev => [...prev, messageData]);
                console.log("Connection unavailable, message queued for later sending");
            }

            setNewMessage("");
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (socket && selectedUser && connectionStatus === 'connected') {
            if (e.target.value.length > 0) {
                // Emit typing event
                socket.emit("typing", { receiverId: selectedUser._id });

                // Clear existing timeout
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                // Set new timeout to stop typing after 2 seconds of inactivity
                typingTimeoutRef.current = setTimeout(() => {
                    socket.emit("stop-typing", { receiverId: selectedUser._id });
                }, 2000);
            } else {
                // Immediately stop typing if input is empty
                socket.emit("stop-typing", { receiverId: selectedUser._id });

                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = null;
                }
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle blur event to stop typing
    const handleInputBlur = () => {
        if (socket && selectedUser && connectionStatus === 'connected') {
            socket.emit("stop-typing", { receiverId: selectedUser._id });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    // Close user list when clicking outside on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowUserList(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);

            // Cleanup timeouts on unmount
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    // Connection status indicator
    const ConnectionStatusIndicator = () => {
        if (connectionStatus === 'connected') return null;
        
        const statusConfig = {
            disconnected: { color: 'bg-red-500', text: 'Disconnected' },
            reconnecting: { color: 'bg-yellow-500', text: 'Reconnecting...' },
            error: { color: 'bg-red-500', text: 'Connection Error' }
        };
        
        const config = statusConfig[connectionStatus];
        
        return (
            <div className={`fixed top-0 left-0 right-0 ${config.color} text-white text-center py-2 text-sm z-50`}>
                {config.text}
                {pendingMessages.length > 0 && ` • ${pendingMessages.length} message(s) pending`}
            </div>
        );
    };

    return (
        <div className="flex bg-gray-950 relative overflow-hidden h-[calc(100vh-64px-56px)] md:h-[calc(100vh-72px)]">
            <ConnectionStatusIndicator />
            
            {/* User List Sidebar */}
            <ChatUserList
                showUserList={showUserList}
                setShowUserList={setShowUserList}
            />

            {/* Main Chat Area */}
            <div className={`min-w-0 flex-1 h-full ${(window.innerWidth < 768 && !selectedUser) || showUserList ? 'hidden' : 'flex'} md:flex flex-col`}>
                {/* Chat Header */}
                {selectedUser &&
                    <ChatHeader
                        onMenuClick={() => setShowUserList(!showUserList)}
                        showUserList={showUserList}
                    />
                }

                {/* Messages Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    <ChatMessage isTyping={isTyping} />
                </div>

                {/* Message Input */}
                {selectedUser && (
                    <div className="p-3 sm:p-4 bg-gray-800 shadow-lg md:relative md:bottom-0 fixed bottom-[56px] w-full">
                        <div className="flex items-end gap-2 sm:gap-3 max-w-[95%] mx-auto">
                            {/* Text input */}
                            <div className="flex-1 relative">
                                <input
                                    placeholder={`Message ${selectedUser.name}...`}
                                    className="w-full rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 min-h-[44px] text-sm sm:text-base transition-all duration-200 bg-dark text-gray-900 dark:text-white 
              "
                                    value={newMessage}
                                    onChange={handleTyping}
                                    onKeyPress={handleKeyPress}
                                    onBlur={handleInputBlur}
                                    rows={1}
                                    style={{
                                        height: 'auto',
                                        minHeight: '44px'
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                                    }}
                                />
                            </div>

                            {/* Send button */}
                            <button
                                className={`flex-shrink-0 p-3 rounded-full shadow-md text-xl transition-all duration-200 ${
                                    newMessage.trim()
                                        ? connectionStatus === 'connected'
                                            ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:scale-105'
                                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                title={connectionStatus !== 'connected' ? 'Will send when connection is restored' : ''}
                            >
                                <GrSend />
                            </button>
                        </div>
                        
                        {/* Show pending messages count */}
                        {pendingMessages.length > 0 && (
                            <div className="text-xs text-yellow-400 mt-2 text-center">
                                {pendingMessages.length} message(s) will be sent when connection is restored
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}