import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessageUsers } from "../Redux/Slice/user.slice";
import ChatUserList from "../chat/ChatUserList";
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import { addMessage, setMessages, setSelectedUser } from "../Redux/Slice/manageState.slice";

export default function GGTalks() {
    const [newMessage, setNewMessage] = useState("");
    const [showUserList, setShowUserList] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const { socket } = useSocket();
    const dispatch = useDispatch();

    const { allMessageUsers } = useSelector((state) => state.user);
    const { selectedUser, messages } = useSelector((state) => state.manageState);

    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, [dispatch]);

    // Auto-select first user on desktop, but not on mobile to show welcome screen
    useEffect(() => {
        if (allMessageUsers && allMessageUsers.length > 0 && !selectedUser) {
            // Only auto-select on desktop (width >= 768px)
            if (window.innerWidth >= 768) {
                dispatch(setSelectedUser(allMessageUsers[0]));
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

    // Socket.IO for real-time messages
    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (message) => {
                if (selectedUser &&
                    ((message.senderId === selectedUser._id && message.receiverId === localStorage.getItem('userId')) ||
                    (message.senderId === localStorage.getItem('userId') && message.receiverId === selectedUser._id))
                ) {
                    dispatch(addMessage({
                        ...message,
                        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }));
                }
            });

            // Handle typing indicators
            socket.on("userTyping", ({ userId, isTyping: typing }) => {
                if (selectedUser && userId === selectedUser._id) {
                    setIsTyping(typing);
                }
            });

            return () => {
                socket.off("newMessage");
                socket.off("userTyping");
            };
        }
    }, [socket, selectedUser, dispatch]);

    // Handle typing indicator
    useEffect(() => {
        if (socket && selectedUser && newMessage.trim()) {
            socket.emit("typing", { receiverId: selectedUser._id, isTyping: true });
            
            const typingTimer = setTimeout(() => {
                socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
            }, 2000);

            return () => clearTimeout(typingTimer);
        }
    }, [newMessage, socket, selectedUser]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUser && socket) {
            const messageData = {
                receiverId: selectedUser._id,
                message: newMessage.trim(),
                senderId: localStorage.getItem('userId'),
            };
            
            socket.emit("sendMessage", messageData);
            setNewMessage("");
            
            // Stop typing indicator
            socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 relative overflow-hidden">
            {/* User List Sidebar */}
            <ChatUserList 
                showUserList={showUserList} 
                setShowUserList={setShowUserList} 
            />

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Chat Header */}
                <ChatHeader 
                    onMenuClick={() => setShowUserList(!showUserList)}
                    showUserList={showUserList}
                />

                {/* Messages Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    <ChatMessage />
                    
                    {/* Typing Indicator */}
                    {isTyping && selectedUser && (
                        <div className="px-4 py-2 bg-gray-50">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span>{selectedUser.name} is typing...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Message Input */}
                {selectedUser && (
                    <div className="p-3 sm:p-4 bg-white border-t shadow-lg">
                        <div className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
                          

                            {/* Text input */}
                            <div className="flex-1 relative">
                                <textarea
                                    placeholder={`Message ${selectedUser.name}...`}
                                    className="w-full border rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 min-h-[44px] text-sm sm:text-base transition-all duration-200"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
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
                                className={`flex-shrink-0 p-3 rounded-full shadow-md transition-all duration-200 ${
                                    newMessage.trim() 
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        
                        
                    </div>
                )}
            </div>
        </div>
    );
}