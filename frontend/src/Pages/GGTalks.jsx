import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessageUsers, getMessageByUserId } from "../Redux/Slice/user.slice";
import ChatUserList from "../chat/ChatUserList";
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import { addMessage, setMessages, setSelectedUser } from "../Redux/Slice/manageState.slice";
import { GrSend } from "react-icons/gr";
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

    // On mobile, show the user list first until a chat is selected
    useEffect(() => {
        if (window.innerWidth < 768 && !selectedUser) {
            setShowUserList(true);
        }
    }, [selectedUser]);

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
            socket.on("typing", ({ senderId }) => {
                if (selectedUser && senderId === selectedUser._id) {
                    setIsTyping(true);
                }
            });

            socket.on("stop-typing", ({ senderId }) => {
                if (selectedUser && senderId === selectedUser._id) {
                    setIsTyping(false);
                }
            });

            return () => {
                socket.off("newMessage");
                socket.off("typing");
                socket.off("stop-typing");
            };
        }
    }, [socket, selectedUser, dispatch]);

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
            socket.emit("stop-typing", { receiverId: selectedUser._id });
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (socket && selectedUser) {
            if (e.target.value.length > 0) {
                socket.emit("typing", { receiverId: selectedUser._id });
            } else {
                socket.emit("stop-typing", { receiverId: selectedUser._id });
            }
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
        <div className="flex bg-gray-950 relative overflow-hidden h-[calc(100vh-64px-56px)] md:h-[calc(100vh-72px)]">
            {/* User List Sidebar */}
            <ChatUserList 
                showUserList={showUserList} 
                setShowUserList={setShowUserList} 
            />

            {/* Main Chat Area */}
            <div className={`min-w-0 flex-1 ${(!selectedUser || showUserList) ? 'hidden' : 'flex'} md:flex flex-col`}>
                {/* Chat Header */}
                <ChatHeader 
                    onMenuClick={() => setShowUserList(!showUserList)}
                    showUserList={showUserList}
                />

                {/* Messages Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    <ChatMessage isTyping={isTyping} />
                    
                   
                </div>

                {/* Message Input */}
                {selectedUser && (
                    <div className="p-3 sm:p-4 bg-gray-800 shadow-lg">
                        <div className="flex items-end gap-2 sm:gap-3 max-w-[95%] mx-auto">
                          

                            {/* Text input */}
                            <div className="flex-1 relative">
                                <input  
                                    placeholder={`Message ${selectedUser.name}...`}
                                    className="w-full rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 min-h-[44px] text-sm sm:text-base transition-all duration-200"
                                    value={newMessage}
                                    onChange={handleTyping}
                                    onKeyPress={handleKeyPress}
                                    onBlur={() => socket.emit("stop-typing", { receiverId: selectedUser._id })}
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
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                            >
                               <GrSend />
                            </button>
                        </div>
                        
                        
                    </div>
                )}
            </div>
        </div>
    );
}