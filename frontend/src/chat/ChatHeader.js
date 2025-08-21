import React from 'react'
import { useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ChatHeader({ onMenuClick, showUserList }) {
    const { selectedUser, onlineUsers, typingUsers } = useSelector((state) => state.manageState);
    
    const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);
    const isUserTyping = selectedUser && typingUsers && typingUsers.includes(selectedUser._id);
    
    return (
        <div className="flex items-center gap-3 px-4 py-[6px] bg-gray-800 text-white shadow-md border-b border-gray-700 h-16">
            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={onMenuClick}
            >
                <IoMdArrowRoundBack className='text-2xl' />
            </button>

            {selectedUser ? (
                <div className="flex items-center gap-3 flex-1">
                    {/* User avatar */}
                    <div className="flex-shrink-0 relative">
                        {selectedUser.profilePhoto ? (
                            <img
                                src={selectedUser.profilePhoto}
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full font-bold bg-blue-500 flex items-center justify-center text-white capitalize border-2 border-blue-300">
                                {selectedUser.name.charAt(0)}
                            </div>
                        )}
                        {/* Online indicator */}
                        {isUserOnline && (
                            <div className="w-3 h-3 bg-green-400 rounded-full absolute -right-0.5 -bottom-0.5 border-2 border-gray-800"></div>
                        )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate capitalize">{selectedUser.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                            {isUserTyping && (
                                <div className="flex items-center gap-2 text-green-400">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="font-medium">typing</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                        <h3 className="font-bold text-lg">Welcome to GG Talks</h3>
                        <p className="text-gray-300 text-sm">Select a chat to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    )
}