import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers } from '../Redux/Slice/user.slice';
import { setMessages, setSelectedUser } from '../Redux/Slice/manageState.slice';

export default function ChatMessage() {
    const { selectedUser, messages } = useSelector((state) => state.manageState);
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, [dispatch]);

    const { allMessageUsers } = useSelector((state) => state.user);

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Set selected user and their messages when users update or selectedUser changes
    useEffect(() => {
        if (allMessageUsers && allMessageUsers.length > 0 && !selectedUser) {
            // Select the first user by default if none is selected
            dispatch(setSelectedUser(allMessageUsers[0]));
        } else if (selectedUser) {
            // If a user is selected, find their latest data from allMessageUsers and update messages
            const currentSelectedUser = allMessageUsers.find(
                (user) => user._id === selectedUser._id
            );
            if (currentSelectedUser) {
                // Sort messages by createdAt in ascending order to display chronologically
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

    const formatMessageTime = (timestamp) => {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInHours = (now - messageTime) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageTime.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {selectedUser ? (
                <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-gray-50"
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                >
                    {messages?.length > 0 ? (
                        <>
                            {messages.map((msg, index) => {
                                const isMyMessage = msg.senderId === localStorage.getItem('userId');
                                const showAvatar = index === 0 || 
                                    messages[index - 1].senderId !== msg.senderId;

                                return (
                                    <div
                                        key={msg._id || index}
                                        className={`flex items-end gap-2 ${
                                            isMyMessage ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        {/* Avatar for received messages */}
                                        {!isMyMessage && (
                                            <div className={`w-8 h-8 flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                                                {selectedUser.profilePhoto ? (
                                                    <img 
                                                        src={selectedUser.profilePhoto} 
                                                        alt="profile" 
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 capitalize text-sm font-medium">
                                                        {selectedUser.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Message bubble */}
                                        <div
                                            className={`
                                                max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl
                                                px-4 py-3 rounded-2xl shadow-sm relative
                                                ${isMyMessage
                                                    ? "bg-blue-500 text-white rounded-br-md ml-auto"
                                                    : "bg-white text-gray-800 rounded-bl-md border"
                                                }
                                            `}
                                        >
                                            {/* Message content */}
                                            <p className="text-sm sm:text-base leading-relaxed break-words">
                                                {msg.message}
                                            </p>
                                            
                                            {/* Timestamp */}
                                            <div className={`
                                                text-xs mt-1 flex items-center gap-1
                                                ${isMyMessage ? "text-blue-100" : "text-gray-400"}
                                            `}>
                                                <span>{formatMessageTime(msg.createdAt || msg.time)}</span>
                                                
                                               
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-sm mx-auto px-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                                <p className="text-gray-500 text-sm">
                                    Start a conversation with {selectedUser.name}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-sm mx-auto px-4">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to GG Talks</h3>
                        <p className="text-gray-500">
                            Select a conversation from the sidebar to start chatting
                        </p>
                        <div className="mt-6 md:hidden">
                            <p className="text-sm text-gray-400">
                                Tap the menu button to view conversations
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}