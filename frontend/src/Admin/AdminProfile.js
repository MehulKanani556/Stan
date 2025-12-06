import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { decryptData, encryptData } from '../Utils/encryption';
import { editUserProfile, getUserById } from '../Redux/Slice/user.slice';
import { FaCamera, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { IMAGE_URL } from '../Utils/baseUrl';
import { Divider, Modal } from '@mui/material';

export default function AdminProfile() {
    // const userId = localStorage.getItem("yoyouserId");
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    console.log(currentUser);

    // const currentUser = useSelector((state) => state.user.currentUser);

    const [isEditing, setIsEditing] = useState(false);
    const [originalValues, setOriginalValues] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            userName: "",
            name: "",
            email: "",
            profilePic: "",
        },
        onSubmit: (values) => {
            // Log the field values
            console.log("Field values:", values);

            const encryptedValues = {
                userName: values.userName,
                name: values.name,
                email: values.email,
                profilePic: values.profilePic,
            };

            dispatch(
                editUserProfile({
                    userId: userId,
                    userData: {
                        ...encryptedValues,
                        profilePic: selectedFile,
                    }
                })
            ).then((response) => {
                if (response.payload?.success) {
                    setIsEditing(false);
                    setOriginalValues(values);
                    // navigate("/admin/profile");
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setImageRemoved(false);
                }
            });
        },
    });

    const {
        handleSubmit,
        setFieldValue,
        handleChange,
        setValues,
        values,
    } = formik;

    // Proper reactive isChanged
    const isChanged = useMemo(() => {
        return (
            JSON.stringify(values) !== JSON.stringify(originalValues) ||
            selectedFile !== null ||
            imageRemoved
        );
    }, [values, originalValues, selectedFile, imageRemoved]);

    useEffect(() => {
        if (userId) {
            dispatch(getUserById(userId));
        }
    }, [userId, dispatch]);

    useEffect(() => {
        if (currentUser) {
            const userData = {
                userName: decryptData(currentUser.userName) || "",
                name: decryptData(currentUser.name) || "",
                email: decryptData(currentUser.email) || "",
                profilePic: currentUser.profilePic || "",
            };
            setValues(userData);
            setOriginalValues(userData);
            console.log(userData);
        }

    }, [currentUser, setValues]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageRemoved(false);
            setIsEditing(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFieldValue("profilePic", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageRemoved(true);
        setFieldValue("profilePic", "null");
    };

    const avatars = [
        require("../images/1.png"),
        require("../images/2.png"),
        require("../images/3.png"),
        require("../images/4.png"),
        require("../images/5.png"),
        require("../images/6.png"),
        require("../images/7.png"),
        require("../images/8.png"),
    ];

    const handleAvatarSelect = async (avatar) => {
        try {
            const response = await fetch(avatar);
            const blob = await response.blob();
            const fileName = `avatar-${Date.now()}.png`;
            const file = new File([blob], fileName, { type: blob.type });

            setIsEditing(true);
            setPreviewUrl(avatar);
            setSelectedFile(file);
            setFieldValue("profilePic", file);
            setImageRemoved(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error selecting avatar:", error);
        }
    };

    const handleEditClick = () => {
        if (!isEditing) {
            setIsEditing(true);
        } else {
            if (isChanged) {
                handleSubmit(); // Save changes
            } else {
                setValues(originalValues); // Revert to original
                setIsEditing(false);
            }
        }
    };

    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown mb-2">Profile</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                {/* Profile Image Section */}
                <div className="relative group mb-5 flex justify-between items-center">
                    <div className="relative w-24 h-24 rounded-full shadow-2xl bg-primary">
                        {previewUrl ? (
                            <>
                                <img
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    className="cursor-pointer object-cover w-full h-full rounded-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 flex items-center justify-center"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </>
                        ) : !imageRemoved &&
                            currentUser?.profilePic &&
                            currentUser?.profilePic !== "null" ? (
                            <>
                                <img
                                    src={
                                        currentUser?.profilePic?.startsWith("/uploads/")
                                            ? `${IMAGE_URL}${currentUser.profilePic}`
                                            : currentUser.profilePic
                                    }
                                    alt="Profile"
                                    className="cursor-pointer object-cover w-full h-full rounded-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 flex items-center justify-center"
                                >
                                    <FaTimes size={14} />
                                </button>
                            </>
                        ) : (
                            <div className="text-black text-lg font-bold flex w-24 h-24 justify-center items-center">
                                <span className="text-black font-bold text-3xl uppercase">
                                    {decryptData(currentUser?.name)?.[0] ||
                                        decryptData(currentUser?.userName)?.[0]}
                                </span>
                            </div>
                        )}

                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer absolute bottom-0 right-0 z-50 text-white flex items-center justify-center bg-black/50 hover:bg-black/60 w-8 h-8 rounded-full"
                        >
                            <FaCamera className="text-white/60" />
                        </div>

                        <Modal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <div className="bg-[#1e1e1e] rounded-[2px] p-[16px] sm:p-[24px] w-[90%] max-w-[400px] text-white shadow-lg">
                                <h2>Select Profile Image</h2>
                                <div>
                                    <label
                                        htmlFor="modalProfileImageInput"
                                        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/60 rounded-lg p-4 mb-4 hover:bg-primary/10 hover:border-primary/90"
                                    >
                                        <span className="text-primary text-lg font-semibold mb-2 flex items-center gap-2">
                                            <FaCamera /> Upload a new image
                                        </span>
                                        <span className="text-xs text-gray-400 mb-1">
                                            PNG, JPG, JPEG, GIF (max 5MB)
                                        </span>
                                        <input
                                            id="modalProfileImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                handleImageUpload(e);
                                                setIsModalOpen(false);
                                            }}
                                        />
                                    </label>
                                </div>
                                <Divider className="!bg-white/10 !mb-4" />
                                <div className="avatar-selection grid grid-cols-1 lg:grid-cols-4 gap-2">
                                    {avatars.map((avatar, index) => (
                                        <img
                                            key={index}
                                            src={avatar}
                                            alt={`Avatar ${index + 1}`}
                                            onClick={() => handleAvatarSelect(avatar)}

                                            className="avatar w-20 h-20 rounded-full cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>
                        </Modal>
                    </div>
                    {/* Edit / Save / Cancel Button */}
                    <button
                        type={isChanged && isEditing ? "submit" : "button"}
                        onClick={!isChanged || !isEditing ? handleEditClick : undefined}
                        className="flex justify-center items-center bg-primary gap-2 py-[3px] md:py-[5px] px-[6px] md:px-[30px] rounded-[4px] font-semibold text-base text-white"

                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundPosition = "right center")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundPosition = "left center")
                        }
                    >
                        {!isEditing ? (
                            <>
                                <FaEdit className="text-white/80" />
                                Edit
                            </>
                        ) : isChanged ? (
                            <>
                                <FaSave className="text-white/80" />
                                Save
                            </>
                        ) : (
                            <>
                                <FaTimes className="text-white/80" />
                                Cancel
                            </>
                        )}
                    </button>
                </div>

                {/* Input Fields */}
                <div className="user-details w-full ">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Full name"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded"
                                onChange={handleChange}
                                value={values.name || ''}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* User Name */}
                        {/* <div>
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                User Name
                            </label>
                            <input
                                name="userName"
                                type="text"
                                placeholder="User name"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded"
                                onChange={handleChange}
                                value={values.userName || ''}
                                disabled={!isEditing}
                            />
                        </div> */}



                        {/* Email */}
                        <div>
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded"
                                // readOnly
                                // disabled
                                value={values.email}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}