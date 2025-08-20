import React from 'react'
import { useSelector } from 'react-redux';

export default function ChatHeader() {
    const { selectedUser } = useSelector((state) => state.manageState);
    return (
        <div className="p-4 bg-blue-600 text-white font-bold shadow-md">
            {selectedUser ? selectedUser.name : "Select a chat"}
        </div>
    )
}