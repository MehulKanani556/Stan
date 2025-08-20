import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllMessageUsers, getAllMessages } from "../Redux/Slice/user.slice";
import ChatUserList from "../chat/ChatUserList";
import ChatHeader from "../chat/ChatHeader";
import ChatMessage from "../chat/ChatMessage";
import { addMessage, setMessages } from "../Redux/Slice/manageState.slice";

export default function GGTalks() {
    // const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const { socket } = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMessageUsers());
    }, []);

    const { allMessageUsers } = useSelector((state) => state.user);
    const messages = useSelector((state) => state.manageState.messages);


    // // Set selected user and their messages when usersQ updates or selectedUser changes
    useEffect(() => {
        if (allMessageUsers && allMessageUsers.length > 0 && !selectedUser) {
            // Select the first user by default if none is selected
            setSelectedUser(allMessageUsers[0]);
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

    // Fetch messages for selected user when selectedUser changes
    // useEffect(() => {
    //     if (selectedUser) {
    //         dispatch(getAllMessages({ selectedId: selectedUser._id }));
    //     }
    // }, [selectedUser]);

    // Socket.IO for real-time messages
    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (message) => {
                if (selectedUser &&
                    ((message.senderId === selectedUser._id && message.receiverId === localStorage.getItem('userId')) ||
                    (message.senderId === localStorage.getItem('userId') && message.receiverId === selectedUser._id))
                ) {
                    // console.log("message", messages,message);
                    // alert("newMessage");
                    // dispatch(addMessage(message));
                }

            });
            return () => {
                socket.off("newMessage");
            };
        }
    }, [socket, selectedUser]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUser) {
            const messageData = {
                receiverId: selectedUser._id,
                message: newMessage,
                senderId: localStorage.getItem('userId'),
                // senderId will be added on the backend from auth token
            };
            
            socket.emit("sendMessage", messageData);
            setNewMessage("");
          
        }
    };

    return (
        <div className="flex bg-gray-100 ">
            {/* SIDEBAR */}
            <div className="flex h-full">  
            <ChatUserList />
            </div>

            {/* CHAT WINDOW */}
            <div className="flex flex-col flex-1">
                {/* Chat Header */}
               <ChatHeader />

                {/* Messages */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
                    <ChatMessage />
                </div>

                {/* Input Box */}
                {selectedUser && (
                    <div className="p-3 sm:p-4 bg-white border-t flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 border rounded-full px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-full shadow-md text-sm sm:text-base"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
