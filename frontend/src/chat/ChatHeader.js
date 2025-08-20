import React from 'react'
import { useSelector } from 'react-redux';
import { decryptData } from '../Utils/encryption';

export default function ChatHeader({ onMenuClick, showUserList }) {
    const { selectedUser } = useSelector((state) => state.manageState);
    
    return (
        <div className="flex items-center gap-3 px-4 py-[6px] bg-blue-600 text-white shadow-md">
            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={onMenuClick}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showUserList ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {selectedUser ? (
                <div className="flex items-center gap-3 flex-1">
                    {/* User avatar */}
                    <div className="flex-shrink-0">
                        {selectedUser.profilePhoto ? (
                            <img 
                                src={selectedUser.profilePhoto} 
                                alt="profile" 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full font-bold bg-blue-500 flex items-center justify-center text-white capitalize border-2 border-blue-300">
                                {decryptData(selectedUser.name).charAt(0)}
                            </div>
                        )}
                    </div>
                    
                    {/* User info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate capitalize">{decryptData(selectedUser.name)}</h3>
                        <div className="flex items-center gap-2 text-blue-200 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    {/* <div className="flex items-center gap-2">
                        Video call button
                        <button className="p-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        
                        Voice call button
                        <button className="p-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                        
                        More options button
                        <button className="p-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div> */}
                </div>
            ) : (
                <div className="flex items-center justify-center flex-1">
                    <div className="text-center">
                        <h3 className="font-bold text-lg">Welcome to GG Talks</h3>
                        <p className="text-blue-200 text-sm">Select a chat to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    )
}