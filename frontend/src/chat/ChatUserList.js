import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers, getAllUsers } from '../Redux/Slice/user.slice';
import { setSelectedUser } from '../Redux/Slice/manageState.slice';
import { BiSolidMessageRoundedAdd } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

export default function ChatUserList({ showUserList, setShowUserList }) {
    const { allMessageUsers, allUsers } = useSelector((state) => state.user);
    const { selectedUser, onlineUsers, typingUsers } = useSelector((state) => state.manageState);

    const [showUsers, setShowUsers] = useState(false);
    const dispatch = useDispatch();

    const formatMessageTimestamp = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffMinutes = Math.round((now - messageDate) / (1000 * 60));
        const diffDays = Math.round((now - messageDate) / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes} min`;
        } else if (messageDate.toDateString() === now.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[messageDate.getDay()];
        } else {
            return messageDate.toLocaleDateString('en-GB'); // dd/mm/yyyy
        }
    };

    useEffect(() => {
        dispatch(getAllMessageUsers());
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleUserSelect = (user) => {
        dispatch(setSelectedUser(user));
        if (window.innerWidth < 768) {
            setShowUserList(false);
        }
    };

    // 🔑 Sort conversations by latest message timestamp
    const sortedMessageUsers = [...(allMessageUsers || [])].sort((a, b) => {
        const aIsTyping = typingUsers && typingUsers.includes(a._id);
        const bIsTyping = typingUsers && typingUsers.includes(b._id);

        // Prioritize typing users
        if (aIsTyping && !bIsTyping) return -1;
        if (!aIsTyping && bIsTyping) return 1;

        // Then sort by latest message
        const aLast = a.messages?.[0]?.createdAt ? new Date(a.messages[0].createdAt) : new Date(0);
        const bLast = b.messages?.[0]?.createdAt ? new Date(b.messages[0].createdAt) : new Date(0);
        return bLast - aLast;
    });

    // Check if user is typing
    const isUserTyping = (userId) => {
        return typingUsers && typingUsers.includes(userId);
    };
    // Typing indicator component
    const TypingIndicator = ({ className = "" }) => (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-green-400 font-medium text-sm">typing</span>
        </div>
    );

    return (
        <>
            <aside className={`
                ${showUserList ? 'block' : 'hidden'} md:block
                relative md:relative top-0 left-0 h-full h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] w-full md:w-64 
                bg-gray-900 border-r border-gray-800 z-40 flex flex-col overflow-hidden
            `}>
                {/* Header */}
                <div className="flex items-center border-b border-gray-700 justify-between p-4 py-[18px] border-b-gray-600 bg-gray-900">
                    <h2 className="font-semibold text-white text-lg">GG Talks</h2>
                    <button className={`text-white rounded-md `} onClick={() => setShowUsers(!showUsers)}>
                        {showUsers ? <RxCross2 className='text-2xl' /> : <BiSolidMessageRoundedAdd className='text-2xl' />}
                    </button>
                </div>

                {/* User list */}
                <div className="flex-1 overflow-y-auto">
                    {!showUsers ? (
                        // Conversations view
                        sortedMessageUsers.length > 0 ? (
                            <ul className="divide-y divide-gray-800">
                                {sortedMessageUsers.map((user) => {
                                    const userIsTyping = isUserTyping(user._id);
                                    const isOnline = onlineUsers.includes(user._id);
                                    const isSelected = selectedUser?._id === user._id;

                                    return (
                                        <li
                                            key={user._id}
                                            className={`
                                                p-4 cursor-pointer hover:bg-gray-800/70 transition-all duration-200
                                                ${isSelected ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
                                                ${userIsTyping ? 'bg-gray-800/30 ring-1 ring-green-400/20' : ''}
                                            `}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Profile photo or initial */}
                                                <div className="flex-shrink-0 relative">
                                                    {user.profilePhoto ? (
                                                        <img
                                                            src={user.profilePhoto}
                                                            alt="profile"
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full font-bold bg-gray-600 flex items-center justify-center text-gray-300 capitalize text-lg">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    {/* Online indicator */}
                                                    {isOnline && (
                                                        <div className="w-3 h-3 bg-green-400 rounded-full absolute -right-0.5 -bottom-0.5 border-2 border-gray-900"></div>
                                                    )}
                                                </div>

                                                {/* User info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-100 truncate capitalize text-base">
                                                            {user.name}
                                                        </h3>
                                                        {/* Timestamp - hide when typing */}
                                                        {!userIsTyping && user.messages && user.messages.length > 0 && (
                                                            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                                                {formatMessageTimestamp(user.messages[0].createdAt)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Message preview or typing indicator */}
                                                    <div className="flex items-center">
                                                        {userIsTyping ? (
                                                            <TypingIndicator />
                                                        ) : (
                                                            <p className="text-sm text-gray-400 truncate pr-2">
                                                                {user.messages && user.messages.length > 0
                                                                    ? user.messages[0]?.message.length > 35
                                                                        ? user.messages[0]?.message.slice(0, 35) + "..."
                                                                        : user.messages[0]?.message
                                                                    : "No messages yet"}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Online status text */}
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {isOnline && (
                                                            <span className="text-xs text-green-400"></span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            // Empty conversations state
                            <div className="p-6 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium mb-2">No conversations yet</h3>
                                <p className="text-sm text-gray-500">Start a conversation by selecting a user</p>
                            </div>
                        )
                    ) : (
                        <>
                        {/* // All users view */}
                            <div className="p-3 pb-0">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">All Users</h3>
                            </div>
                            <ul className="divide-y divide-gray-800">
                                {allUsers
                                     .filter(user => 
                                        user._id !== localStorage.getItem("userId") &&  // exclude self
                                        !allMessageUsers.some(msgUser => msgUser._id === user._id) // exclude already messaged users
                                      )
                                    .map((user) => {
                                        const userIsTyping = isUserTyping(user._id);
                                        const isOnline = onlineUsers.includes(user._id);
                                        const isSelected = selectedUser?._id === user._id;

                                        return (
                                            <li
                                                key={user._id}
                                                className={`
                                                p-4 cursor-pointer hover:bg-gray-800/70 transition-all duration-200
                                                ${isSelected ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
                                                ${userIsTyping ? 'bg-gray-800/30 ring-1 ring-green-400/20' : ''}
                                            `}
                                                onClick={() => {handleUserSelect(user); }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Profile photo or initial */}
                                                    <div className="flex-shrink-0 relative">
                                                        {user.profilePhoto ? (
                                                            <img
                                                                src={user.profilePhoto}
                                                                alt="profile"
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full font-bold bg-gray-800 flex items-center justify-center text-gray-300 capitalize text-lg border border-gray-700">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        {isOnline && (
                                                            <div className="w-3 h-3 bg-green-400 rounded-full absolute -right-0.5 -bottom-0.5 border-2 border-gray-900"></div>
                                                        )}
                                                    </div>

                                                    {/* User info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium text-gray-100 truncate capitalize text-base">
                                                                {user.name}
                                                            </h3>
                                                        </div>

                                                        {/* Status indicators */}
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {userIsTyping ? (
                                                                <TypingIndicator />
                                                            ) : isOnline ? (
                                                                <span className="text-xs text-green-400">Online</span>
                                                            ) : (
                                                                <span className="text-xs text-gray-500">Offline</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </>

                    )}
                </div>

            </aside>
        </>
    )
}
