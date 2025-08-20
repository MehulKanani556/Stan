import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllMessageUsers } from '../Redux/Slice/user.slice';
import { setMessages, setSelectedUser } from '../Redux/Slice/manageState.slice';

export default function ChatMessage() {
    const { selectedUser, messages } = useSelector((state) => state.manageState);
    // const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, [dispatch]);

    const { allMessageUsers } = useSelector((state) => state.user);
  

    // Set selected user and their messages when usersQ updates or selectedUser changes
    useEffect(() => {
        if (allMessageUsers && allMessageUsers.length > 0 && !selectedUser) {
            // Select the first user by default if none is selected
            dispatch(setSelectedUser(allMessageUsers[0]));
        } else if (selectedUser) {
            // If a user is selected, find their latest data from usersQ and update messages
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
    }, [allMessageUsers, selectedUser]);
    return (
        <div>
            {selectedUser ? (
               
                messages?.length > 0 ?
                messages?.map((msg, index) => (
                    <div
                        key={msg._id || index} // Use msg._id if available, fallback to index
                        className={`flex mb-3 ${msg.senderId == localStorage.getItem('userId') ? "justify-end" : "justify-start"
                            }`}
                    >
                        {/* {console.log("msg", msg.senderId, localStorage.getItem('userId'))} */}
                        <div
                            className={`max-w-[75%] sm:max-w-md md:max-w-lg px-3 sm:px-4 py-2 rounded-2xl shadow-md text-sm sm:text-base ${msg.senderId === localStorage.getItem('userId')
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none"
                                }`}
                        >
                            <p>{msg.message}</p>
                            <span className="text-[10px] sm:text-xs text-gray-400 block text-right mt-1">
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))
                :
                <div className="text-center text-gray-500 mt-10">
                    No messages yet.
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    Select a user to start chatting.
                </div>
            )}
        </div>
    )
}