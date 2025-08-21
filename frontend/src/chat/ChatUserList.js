import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers, getAllUsers } from '../Redux/Slice/user.slice';
import { setSelectedUser } from '../Redux/Slice/manageState.slice';
import { decryptData } from '../Utils/encryption';
import { BiSolidMessageRoundedAdd } from "react-icons/bi";

export default function ChatUserList({ showUserList, setShowUserList }) {
    const { allMessageUsers, allUsers } = useSelector((state) => state.user);
    const { selectedUser, onlineUsers } = useSelector((state) => state.manageState);
    const [showUsers,setShowUsers] = useState(false);
    const dispatch = useDispatch();
    // console.log(allUsers);

    const formatMessageTimestamp = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffMinutes = Math.round((now - messageDate) / (1000 * 60));
        const diffDays = Math.round((now - messageDate) / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (messageDate.toDateString() === now.toDateString()) {
            // Same day (today)
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            // Less than 7 days ago
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[messageDate.getDay()];
        } else {
            // Older than 7 days
            return messageDate.toLocaleDateString('en-GB'); // dd/mm/yyyy
        }
    };

    useEffect(() => {
        dispatch(getAllMessageUsers());
        dispatch(getAllUsers());
    }, [dispatch]);

    const handleUserSelect = (user) => {
        dispatch(setSelectedUser(user));
        // Hide user list on mobile after selection
        if (window.innerWidth < 768) {
            setShowUserList(false);
        }
    };

    return (
        <>
            {/* Sidebar: on mobile shows when toggled, on desktop always visible */}
            <aside className={`
                ${showUserList ? 'block' : 'hidden'} md:block
                relative md:relative top-0 left-0 h-full h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] w-full md:w-64 
                bg-gray-900 border-r border-gray-800 z-50 flex flex-col overflow-hidden
            `}>
                {/* Header */}
                <div className="flex items-center border-b border-gray-700 justify-between p-4 py-[18px] border-b-gray-600 bg-gray-900">
                    <h2 className="font-semibold text-white text-lg">GG Talks</h2>
                    <button className={`text-white rounded-md `} onClick={() => setShowUsers(!showUsers)}>
                        <BiSolidMessageRoundedAdd className='text-2xl' />
                    </button>
                </div>

                {/* User list */}
                <div className="flex-1 overflow-y-auto ">
                    {!showUsers ?
                        (allMessageUsers && allMessageUsers.length > 0 ? (
                            <ul className="divide-y divide-gray-800">
                                {allMessageUsers.map((user) => (
                                    <li
                                        key={user._id}
                                        className={`
                                        p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200
                                        ${selectedUser?._id === user._id ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
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
                                                    <div className="w-12 h-12 rounded-full font-bold bg-gray-800 flex items-center justify-center text-gray-300 capitalize text-lg">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                                 {/* Online indicator */}
                                                 {onlineUsers.includes(user._id) && (
                                                    <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0 absolute right-0 bottom-1"></div>
                                                )}
                                            </div>

                                            {/* User info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-gray-100 truncate capitalize text-base">
                                                        {user.name}
                                                    </p>
                                                   
                                                </div>
                                                <p className="text-sm text-gray-400 truncate mt-1">
                                                    {user.messages && user.messages.length > 0
                                                        ? user.messages[0]?.message.length > 20 ? user.messages[0]?.message.slice(0, 20) + "..." : user.messages[0]?.message
                                                        : "No messages yet."
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                {user.messages && user.messages.length > 0 && (
                                                    <p className="text-sm text-gray-400 truncate mt-1">
                                                        {formatMessageTimestamp(user.messages[0].createdAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-6 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm">No users found</p>
                            </div>
                        ))
                        : (
                            <ul className="divide-y divide-gray-800">
                                {allUsers.map((user) => (
                                    <>

                                        <li
                                            key={user._id}
                                            className={`
                                        p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200
                                        ${selectedUser?._id === user._id ? 'bg-gray-800 border-r-4 border-blue-500' : ''}
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
                                                        <div className="w-12 h-12 rounded-full font-bold bg-gray-800 flex items-center justify-center text-gray-300 capitalize text-lg">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    {onlineUsers.includes(user._id) && (
                                                        <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0 absolute right-0 bottom-1"></div>
                                                    )}
                                                </div>

                                                {/* User info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-gray-100 truncate capitalize text-base">
                                                            {user.name}
                                                        </p>
                                                        {/* Online indicator */}
                                                        {/* <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div> */}
                                                    </div>

                                                </div>
                                            </div>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        )
                    }
                </div>
            </aside>
        </>
    )
}