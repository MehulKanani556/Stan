import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoTrash } from "react-icons/go";
import { TbDotsVertical } from "react-icons/tb";
import { deleteChat, getAllMessageUsers } from '../Redux/Slice/user.slice';
import { setSelectedUser } from '../Redux/Slice/manageState.slice';
export default function ChatHeader({ onMenuClick, showUserList }) {
    const { selectedUser, onlineUsers, typingUsers } = useSelector((state) => state.manageState);
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


    const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);
    const isUserTyping = selectedUser && typingUsers && typingUsers.includes(selectedUser._id);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
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
                    <div>
                        <div className="flex items-center gap-5">
                            <div className="hidden md:block relative" ref={dropdownRef}>
                                <div className='flex gap-2 item-center'>
                                    <button
                                        // className="w-6 h-6 rounded-full border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#ab99e1] transition-colors"
                                        onClick={toggleDropdown}
                                    >
                                        <TbDotsVertical className='text-grey-400' />
                                    </button>

                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 text-center bg-[#221f2a] rounded-lg shadow-lg border border-gray-700 z-50">
                                        <div className="py-1">

                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    dispatch(deleteChat({ selectedUserId: selectedUser._id })).then(() => {
                                                        dispatch(getAllMessageUsers());
                                                        dispatch(setSelectedUser(null));
                                                    });

                                                }}
                                                className="w-full px-4 py-1 text-left text-base text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                            >
                                                <GoTrash className='text-red-400' />
                                                Delete Chat
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                        {/* <button onClick={() => setShowModal(!showModel)}>
                            <TbDotsVertical className='text-grey-400' />
                        </button> */}
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