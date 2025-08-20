import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack } from "react-icons/io";
import { MdEdit, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaUser, FaBirthdayCake, FaGamepad } from "react-icons/fa";
import { getUserById, editUserProfile } from '../Redux/Slice/user.slice';
import stanUser from "../images/stan-user.jpg";
import { decryptData } from "../Utils/encryption";

export default function Profile() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        gender: "",
    });
    const [profilePicFile, setProfilePicFile] = useState(null);

    useEffect(() => {
        // Get current user ID from auth state or localStorage
        const userId = authUser?._id || localStorage.getItem("userId");
        if (userId) {
            dispatch(getUserById(userId));
        }
    }, [dispatch, authUser]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: decryptData(currentUser.name),
                username: decryptData(currentUser.username),
                email: decryptData(currentUser.email),
                bio: decryptData(currentUser.bio),
                gender: decryptData(currentUser.gender),
            });
            setUser(currentUser);
        } else {
            setUser(null);
        }
    }, [currentUser]);
    console.log(currentUser, "currentUser");


    // Handle edit mode toggle
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setProfilePicFile(file);
    };

    const handleUpdateProfile = async () => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (!userId) return;

        const payload = { ...formData };
        // Do not allow updating email from the client
        delete payload.email;
        if (profilePicFile) {
            payload.profilePic = profilePicFile;
        }

        try {
            await dispatch(editUserProfile({ userId, userData: payload })).unwrap();
            setIsEditing(false);
        } catch (err) {
            // noop - error snackbar handled in thunk
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ab99e1] mx-auto mb-4"></div>
                    <p className="text-[#ab99e1]">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#ab99e1] text-black px-4 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Local user state is managed via setUser when currentUser changes

    // Calculate stats
    const gamesPlayed = 156; // This could come from a separate API
    const wins = 89;
    const points = 2400;
    const winRate = Math.round((wins / gamesPlayed) * 100);
    const achievements = 12;
    const friends = user?.followers?.length || 45;
    const rating = 8.5;

    return (
        <div className=" bg-black text-white max-w-[100%] md:max-w-[60%] mx-auto">
            {/* Header */}
            <div className="bg-black sticky top-0 z-40 border-b border-gray-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <NavLink to="/" className="flex items-center gap-2 text-white hover:text-[#ab99e1] transition-colors">
                        <IoIosArrowBack className="w-6 h-6" />
                        <span className="text-lg font-medium">Back</span>
                    </NavLink>
                    <h1 className="text-xl font-bold text-[#ab99e1]">Profile</h1>
                    {isEditing ? (
                        <button
                            onClick={handleUpdateProfile}
                            className="bg-[#ab99e1] text-black px-3 py-1 rounded-lg hover:bg-white transition-colors"
                        >
                            Update
                        </button>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className="text-[#ab99e1] hover:text-white transition-colors"
                        >
                            <MdEdit className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Content */}
            <div className="px-4 py-6 ">
                {/* Profile Header */}
                <div className="bg-[#221f2a] rounded-2xl p-6 mb-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-[#ab99e1] overflow-hidden">
                                <img
                                    src={profilePicFile ? URL.createObjectURL(profilePicFile) : (user?.profilePic || stanUser)}
                                    className="w-full h-full object-cover object-top"
                                    alt="User Profile"
                                />
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-[#ab99e1] text-black p-2 rounded-full hover:bg-white transition-colors cursor-pointer">
                                    <MdEdit className="w-4 h-4" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {decryptData(user?.name) || "user name"}
                        </h2>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-[#221f2a] rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaUser className="text-[#ab99e1]" />
                        Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-[#2d2a35] rounded-lg">
                            <FaUser className="text-[#ab99e1] w-5 h-5" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-400">Name</div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                    />
                                ) : (
                                    <div className="text-white">{decryptData(user?.name) || "User"}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[#2d2a35] rounded-lg">
                            <MdEmail className="text-[#ab99e1] w-5 h-5" />
                            <div className="flex-1">
                                <div className="text-sm text-gray-400">Email</div>
                                {/* {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                    />
                                ) : (
                                    <div className="text-white">{decryptData(user?.email) || "example@gmail.com"}</div>
                                )} */}
                                <div className="text-white">{decryptData(user?.email) || "example@gmail.com"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
