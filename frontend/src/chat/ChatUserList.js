import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers, getAllUsers } from '../Redux/Slice/user.slice';
import { setSelectedUser } from '../Redux/Slice/manageState.slice';
import { decryptData } from '../Utils/encryption';

export default function ChatUserList({ showUserList, setShowUserList }) {
    const { allMessageUsers, allUsers } = useSelector((state) => state.user);
    const { selectedUser } = useSelector((state) => state.manageState);
    const [showUsers,setShowUsers] = useState(false);
    const dispatch = useDispatch();
    console.log(allUsers);

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
            {/* Mobile overlay backdrop */}
            {showUserList && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setShowUserList(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative top-0 left-0 h-full w-80 md:w-64 
                bg-white border-r z-50 transform transition-transform duration-300 ease-in-out
                ${showUserList ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col overflow-hidden
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <h2 className="font-semibold text-gray-700 text-lg">GG Talks</h2>                    
                    <button className={`text-gray-600 rounded-md ${showUsers ? 'rotate-45' : ''}`} onClick={() => setShowUsers(!showUsers)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    {/* Close button for mobile */}
                    <button
                        className="md:hidden p-1 rounded-lg hover:bg-gray-100"
                        onClick={() => setShowUserList(false)}
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User list */}
                <div className="flex-1 overflow-y-auto">
                    {!showUsers ? 
                    (allMessageUsers && allMessageUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {allMessageUsers.map((user) => (
                                <li
                                    key={user._id}
                                    className={`
                                        p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200
                                        ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}
                                    `}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Profile photo or initial */}
                                        <div className="flex-shrink-0">
                                            {user.profilePhoto ? (
                                                <img 
                                                    src={user.profilePhoto} 
                                                    alt="profile" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full font-bold bg-gray-200 flex items-center justify-center text-gray-600 capitalize text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* User info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-gray-900 truncate capitalize text-base">
                                                    {user.name}
                                                </p>
                                                {/* Online indicator */}
                                                <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {user.messages && user.messages.length > 0 
                                                    ? user.messages[user.messages.length - 1]?.message.slice(0, 30) + "..."
                                                    : "No messages yet."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-sm">No users found</p>
                        </div>
                    ))
                    : (
                    <ul className="divide-y divide-gray-100">
                        {allUsers.map((user) => (
                            <>

                            <li
                                    key={user._id}
                                    className={`
                                        p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200
                                        ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}
                                    `}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Profile photo or initial */}
                                        <div className="flex-shrink-0">
                                            {user.profilePhoto ? (
                                                <img 
                                                    src={user.profilePhoto} 
                                                    alt="profile" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full font-bold bg-gray-200 flex items-center justify-center text-gray-600 capitalize text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* User info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-gray-900 truncate capitalize text-base">
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