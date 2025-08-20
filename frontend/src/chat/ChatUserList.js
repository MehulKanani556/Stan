import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers } from '../Redux/Slice/user.slice';
import { setSelectedUser } from '../Redux/Slice/manageState.slice';

export default function ChatUserList() {
    const { allMessageUsers } = useSelector((state) => state.user);
    const { selectedUser } = useSelector((state) => state.manageState);
        const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, [dispatch]);

    return (
        <>
            <aside className="hidden sm:flex flex-col w-64 border-r bg-white overflow-y-auto">
                <h2 className="p-4 font-semibold text-gray-700 border-b">GG Talks</h2>
                <ul className="flex-1 ">
                    {allMessageUsers && allMessageUsers.map((user) => (
                        <li
                            key={user._id}
                            className={`p-3 border-b cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedUser?._id === user._id ? 'bg-blue-100' : ''}`}
                            onClick={() => dispatch(setSelectedUser(user))}
                        >
                            <div className="flex items-center gap-2">
                                {
                                    user.profilePhoto ? <img src={user.profilePhoto} alt="profile" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 rounded-full font-bold bg-gray-200 flex items-center justify-center text-gray-600 capitalize">{user.name.charAt(0)}</div>
                                }
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.messages && user.messages.length > 0 ? user.messages[0]?.message.slice(0, 20) + "..." : "No messages yet."}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    )
}