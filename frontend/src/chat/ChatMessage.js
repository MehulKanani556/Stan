import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers } from '../Redux/Slice/user.slice';
import { setMessages, setSelectedUser } from '../Redux/Slice/manageState.slice';

export default function ChatMessage({ isTyping }) {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const { selectedUser, messages } = useSelector((state) => state.manageState);
    const { allMessageUsers } = useSelector((state) => state.user);


    // Auto scroll to bottom when new messages arrive
 

    const scrollToBottom = useCallback(()=>{
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    },[]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping,scrollToBottom]);


    // Set selected user and their messages when users update or selectedUser changes


    const  processSelectedUserMessages = useCallback(()=>{
        if(allMessageUsers && allMessageUsers.length > 0 && selectedUser){
            const currentSelectedUser = allMessageUsers.find(
                (user) => user._id === selectedUser._id
            );
            if(currentSelectedUser){
                const sortedMessages = [...(currentSelectedUser.messages || [])].sort(
                    (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)
                );
                return sortedMessages.map(msg => ({
                    ...msg,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
            } else {
                return [];
            }
        }
        return [];
    },[allMessageUsers, selectedUser]);

    useEffect(()=>{
        const messages = processSelectedUserMessages();
        dispatch(setMessages(messages));
    },[allMessageUsers,selectedUser,dispatch,processSelectedUserMessages]);

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

    // Function to get date label (Today, day name, or dd/mm/yyyy format)
    const getDateLabel = (timestamp) => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        
        // Reset time to compare only dates
        const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Calculate difference in days
        const diffInTime = todayOnly - messageDateOnly;
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            // Today
            return 'Today';
        } else if (diffInDays > 0 && diffInDays <= 7) {
            // Within one week - show day name
            return messageDate.toLocaleDateString([], { weekday: 'long' });
        } else {
            // Older than one week - show dd/mm/yyyy format
            const day = String(messageDate.getDate()).padStart(2, '0');
            const month = String(messageDate.getMonth() + 1).padStart(2, '0');
            const year = messageDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentGroup = null;

        messages?.forEach((msg, index) => {
            const messageDate = new Date(msg.createdAt || msg.time);
            const dateKey = messageDate.toDateString();

            if (!currentGroup || currentGroup.dateKey !== dateKey) {
                currentGroup = {
                    dateKey,
                    dateLabel: getDateLabel(msg.createdAt || msg.time),
                    messages: []
                };
                groups.push(currentGroup);
            }

            currentGroup.messages.push({ ...msg, index });
        });

        return groups;
    };

    const messageGroups = groupMessagesByDate(messages);

    useEffect(() => {
        const setVh = () => {
            const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVh();

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVh);
        } else {
            window.addEventListener('resize', setVh);
        }

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', setVh);
            } else {
                window.removeEventListener('resize', setVh);
            }
        };
    }, []);

    return (
        <div className="flex flex-col md:h-full h-[calc(var(--vh,1vh)*100-248px)] bg-gray-950 text-gray-100">

            {selectedUser ? (
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-gray-950"
                    style={{ minHeight: 0 }}
                >
                    {messages?.length > 0 ? (
                        <>
                            {messageGroups.map((group, groupIndex) => (
                                <div key={group.dateKey}>
                                    {/* Date Separator */}
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                                            <span className="text-xs text-gray-300 font-medium">
                                                {group.dateLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Messages for this date */}
                                    <div className="space-y-4">
                                        {group.messages.map((msg, msgIndex) => {
                                            const isMyMessage = msg.senderId === localStorage.getItem('userId');
                                            const showAvatar = msgIndex === 0 ||
                                                group.messages[msgIndex - 1].senderId !== msg.senderId;

                                            return (
                                                <div
                                                    key={msg._id || msg.index}
                                                    className={`flex items-end gap-2 ${isMyMessage ? "justify-end" : "justify-start"
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
                                                                ? "bg-blue-600 text-white rounded-br-md ml-auto"
                                                                : "bg-gray-800 text-gray-200 rounded-bl-md border border-gray-700"
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
                                                            ${isMyMessage ? "text-blue-200" : "text-gray-400"}
                                                        `}>
                                                            <span>{formatMessageTime(msg.createdAt || msg.time)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-sm mx-auto px-4">
                                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-100 mb-2">No messages yet</h3>
                                <p className="text-gray-400 text-sm">
                                    Start a conversation with {selectedUser.name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Typing Indicator */}
                    {isTyping && selectedUser && (
                        <div className="flex items-end gap-2 justify-start px-3">
                            {/* Avatar */}
                            <div className="w-8 h-8 flex-shrink-0">
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
                            
                            {/* Typing bubble */}
                            <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md max-w-[200px]">
                                <div className="flex items-center gap-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-sm text-gray-400">{selectedUser.name} is typing</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-950">
                    <div className="text-center max-w-sm mx-auto px-4">
                        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-100 mb-2">Welcome to GG Talks</h3>
                        <p className="text-gray-400">
                            Select a conversation from the sidebar to start chatting
                        </p>
                        <div className="mt-6 md:hidden">
                            <p className="text-sm text-gray-500">
                                Tap the menu button to view conversations
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}