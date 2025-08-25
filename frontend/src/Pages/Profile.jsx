import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack, IoIosLogOut } from "react-icons/io";
import { MdEdit, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaUser, FaBirthdayCake, FaGamepad } from "react-icons/fa";
import { getUserById, editUserProfile } from '../Redux/Slice/user.slice';
import stanUser from "../images/stan-user.jpg";
import { decryptData } from "../Utils/encryption";
import { Dialog, Transition } from '@headlessui/react'

import { Fragment } from "react";
import lazyCatImage from '../images/lazy-cat-1.png'
import { FaUserLarge } from 'react-icons/fa6';
import { GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'
import { IoLocation, IoClose, IoTrash, IoPencil } from "react-icons/io5";
import manageAddress from "../images/manage_addres-1.png"
import StylishDiv from '../components/StylishDiv';
// FANCoin Component
const FANCoin = () => {
    const [openId, setOpenId] = useState(null);

    const transactions = [
        {
            id: 1,
            title: "OnboardingReward",
            time: "5:22 PM - 8 Aug",
            amount: "+ 100",
            type: "credit"
        },
        {
            id: 2,
            title: "Daily Login Bonus",
            time: "9:15 AM - 8 Aug",
            amount: "+ 25",
            type: "credit"
        },
        {
            id: 3,
            title: "Task Completion",
            time: "2:30 PM - 7 Aug",
            amount: "+ 50",
            type: "credit"
        },
        {
            id: 4,
            title: "Reward Redemption",
            time: "11:45 AM - 6 Aug",
            amount: "- 75",
            type: "debit"
        },
        {
            id: 5,
            title: "Referral Bonus",
            time: "4:20 PM - 5 Aug",
            amount: "+ 200",
            type: "credit"
        },
        {
            id: 6,
            title: "Game Reward",
            time: "8:10 PM - 4 Aug",
            amount: "+ 30",
            type: "credit"
        }
    ];

    const toggleDetails = (id) => {
        setOpenId(prev => (prev === id ? null : id));
    };

    return (
        <div className="px-3 sm:px-4 py-4 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 3xl:items-start items-strech">
                {transactions.map((transaction) => (
                    <StylishDiv key={transaction.id} className="group rounded-3xl overflow-hidden h-full ">
                        {/* <div className=" opacity-80  h-full min-h-[180px]" /> */}
                        <div className=" rounded-3xl min-h-[120px]  h-full">
                            <div className="flex  items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-base sm:text-lg">{transaction.title}</h3>
                                    <p className="text-gray-300 text-xs sm:text-sm mt-1">{transaction.time}</p>
                                </div>
                                <span className={`font-bold text-base sm:text-lg ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                    {transaction.amount}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDetails(transaction.id)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-white text-sm">Details</span>
                                        <svg
                                            className={`w-4 h-4 text-white ml-1 transition-transform duration-300 ${openId === transaction.id ? 'rotate-180' : ''}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                {openId === transaction.id && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Before Fan Coins:</span>
                                            <span className="text-white">0</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">After Fan Coins:</span>
                                            <span className="text-white">50</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">Before Bonus Fan Coins:</span>
                                            <span className="text-white">0</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-300">After Bonus Fan Coins:</span>
                                            <span className="text-white">50</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </StylishDiv>
                ))}
            </div>
        </div>
    )
}

// UPICard Component
const UPICard = () => {
    return (
        <div className="flex flex-col items-center justify-center  px-4 relative">

            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
              from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
              animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
              from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
              animate-pulse"></div>


            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
              relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>


            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                No transactions yet !
            </h2>
            <p className="text-gray-400 text-sm text-center mt-2">
                Complete tasks or purchases to see them here ✨
            </p>
        </div>
    )
}

// PlayStore Component
const PlayStore = () => {
    return (
        <div className="flex flex-col items-center justify-center  px-4 relative">

            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
                  from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
                  from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div>


            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
                  relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>


            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                No transactions yet !
            </h2>
            <p className="text-gray-400 text-sm text-center mt-2">
                Complete tasks or purchases to see them here ✨
            </p>
        </div>
    )
}
export default function Profile() {
    const dispatch = useDispatch();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [activeMenu, setActiveMenu] = useState('profile');
    const [isActive, setIsActive] = useState("fanCoin");
    console.log("aaaaaa", currentUser)

    // user profile handling ------------------------------------------------------------------------------------------
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


    // Handle edit mode toggle
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // handle  input change 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle  dile change 
    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setProfilePicFile(file);
    };

    // handle update profile
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
            await dispatch(editUserProfile({ userId, userData: payload })).unwrap().then((response) => {
                console.log(response.success);
                if (response.success) {
                    const userId = authUser?._id || localStorage.getItem("userId");
                    if (userId) {
                        dispatch(getUserById(userId));
                    }
                }
            });
            setIsEditing(false);
        } catch (err) {
            // noop - error snackbar handled in thunk
        }
    };



    // manage address ----------------------------------------------------------------------------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Vaibhav Gohil',
            mobile: '+917567058384',
            addressLine1: 'Hirabag, Surat',
            addressLine2: 'Surat, 395006',
            landmark: '',
            pincode: '395006',
            isDefault: true
        }
    ])

    // open add  address modal 
    const openModal = () => {
        setIsModalOpen(true)
        setEditingAddress(null)
        // Reset form data when opening
        setFormData({
            name: '',
            mobile: '',
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            pincode: '',
            isDefault: false
        })
    }

    //  close add address modal 
    const closeModal = () => {
        setIsModalOpen(false)
        setIsEditModalOpen(false)
        setEditingAddress(null)
    }

    //  open edit address modal
    const openEditModal = (address) => {
        setEditingAddress(address)
        setFormData({
            name: address.name,
            mobile: address.mobile.replace('+91', ''),
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            landmark: address.landmark,
            pincode: address.pincode,
            isDefault: address.isDefault
        })
        setIsEditModalOpen(true)
    }

    // address change code here
    const handleaddressChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    // add amd edit address submit handler
    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingAddress) {
            // Update existing address
            const updatedAddresses = addresses.map(addr =>
                addr.id === editingAddress.id
                    ? { ...formData, id: addr.id, mobile: `+91${formData.mobile}` }
                    : addr
            )
            setAddresses(updatedAddresses)
        } else {
            // Add new address
            const newAddress = {
                ...formData,
                id: Date.now(),
                mobile: `+91${formData.mobile}`,
                isDefault: formData.isDefault || addresses.length === 0
            }

            // If this is set as default, remove default from others
            let updatedAddresses = [...addresses]
            if (newAddress.isDefault) {
                updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }))
            }

            setAddresses([...updatedAddresses, newAddress])
        }

        closeModal()
    }

    // delete addres function 
    const deleteAddress = (addressId) => {
        const addressToDelete = addresses.find(addr => addr.id === addressId)
        if (addressToDelete.isDefault && addresses.length > 1) {
            // If deleting default address and there are others, make first one default
            const updatedAddresses = addresses
                .filter(addr => addr.id !== addressId)
                .map((addr, index) => ({ ...addr, isDefault: index === 0 }))
            setAddresses(updatedAddresses)
        } else {
            setAddresses(addresses.filter(addr => addr.id !== addressId))
        }
    }


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


    return (
        <div className="  text-white md:max-w-[85%] max-w-[95%] mx-auto">
            {/* Header */}
            <div className=" sticky top-0 z-40 border-b border-gray-800 ">
                <div className="flex items-center justify-between px-4 py-3">
                    <NavLink to="/" className="flex items-center gap-2 text-white hover:text-[#ab99e1] transition-colors">
                        <IoIosArrowBack className="w-6 h-6" />
                        <span className="text-lg font-medium">Back</span>
                    </NavLink>
                    <h1 className="text-xl font-bold text-[#ab99e1] mx-auto">Profile</h1>
                </div>
            </div>

            {/* Profile Content */}
            <div className='flex flex-col md:flex-row items-stretch min-h-[500px]'>
                {/* side menu section */}
                <div className='h-full px-4 py-6'>
                    <div className='xl:w-[300px] md:w-[200px] w-full'>
                        <ul className='p-3 capitalize'>
                            <li className={` mt-2 transition-all  duration-300 ease-in-out cursor-pointer hover:scale-[105%]   backdrop-blur-xl  ${activeMenu === "profile" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('profile') }}>
                                {(() => {
                                    const Tag = activeMenu === "profile" ? StylishDiv : "div";
                                    const style = activeMenu === "profile" ? "w-full h-[48px]" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <FaUserLarge className="h-5 w-5 me-3" />
                                                <p>profile</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "address" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('address') }}>
                                {(() => {
                                    const Tag = activeMenu === "address" ? StylishDiv : "div";
                                    const style = activeMenu === "address" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <IoLocation className="h-5 w-5 me-3" />
                                                <p>address</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "Transaction" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('Transaction') }}>
                                {(() => {
                                    const Tag = activeMenu === "Transaction" ? StylishDiv : "div";
                                    const style = activeMenu === "Transaction" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <GiTakeMyMoney className="h-5 w-5 me-3" />
                                                <p>Transaction</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "logout" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('logout') }}>
                                {(() => {
                                    const Tag = activeMenu === "logout" ? StylishDiv : "div";
                                    const style = activeMenu === "logout" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <IoIosLogOut className="h-5 w-5 me-3" />
                                                <p>logout</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* content data */}

                {/* profile */}
                {activeMenu === "profile" && (
                    <div className={`px-4 py-6 w-full `}>
                        {/* Profile Header */}
                        <div className=" rounded-2xl p-6 mb-6 border border-white/25">
                            <div className='flex justify-end'>

                                {isEditing ? (
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="bg-[#ab99e1] text-black px-3 py-1 rounded-lg hover:bg-white transition-colors ms-auto"
                                    >
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEditToggle}
                                        className="text-[#ab99e1] hover:text-white transition-colors ms-auto"
                                    >
                                        <MdEdit className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
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
                        <div className=" rounded-2xl p-6 mb-6 border border-white/25">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FaUser className="text-[#ab99e1]" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg">
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

                                <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg">
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
                )}

                {/* address */}
                {activeMenu === "address" && (
                    <div className={`px-4 py-6 w-full`}>
                        <div className=" border border-white/10 rounded-2xl sm:p-6 p-1 mb-6 flex flex-col w-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-2 sm:px-4 py-4   sticky top-0 z-20 border-b border-white/10 ">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {/* <button
                                    className="text-white rounded-full hover:bg-white/10 transition-colors touch-manipulation"
                                    onClick={handleBack}
                                    aria-label="Go back"
                                >
                                    <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button> */}
                                    <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide">Manage Addresses</h1>
                                </div>
                                {/* Add Address Button */}
                                <button
                                    className="bg-gradient-to-r from-[#621df2] to-[#b191ff] 
                             hover:from-[#8354f8] hover:to-[#9f78ff] 
                             text-white px-2 sm:px-5 py-2.5 rounded-xl 
                             flex items-center gap-2 text-sm font-medium 
                             transition-all duration-200 shadow-md hover:shadow-xl"
                                    onClick={openModal}
                                >
                                    <IoLocation className=" w-4 h-4" />
                                    <span>Add Address</span>
                                </button>
                            </div>

                            {/* Main Content - Address Cards */}
                            <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
                                {addresses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center  px-4 relative">

                                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
         from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
         animate-pulse"></div>
                                        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
         from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
         animate-pulse"></div>


                                        <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
         relative overflow-hidden shadow-lg shadow-purple-500/30">
                                            <img
                                                src={manageAddress}
                                                alt="Lazy Cat"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>


                                        <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                                            No addresses added!
                                        </h2>
                                        <p className="text-gray-400 text-sm text-center mt-2">
                                            Add your first address to get started
                                        </p>
                                    </div>
                                ) : (
                                    // Address cards
                                    <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                        {addresses.map((address) => (
                                            <StylishDiv key={address.id} className=" group rounded-3xl overflow-hidden">
                                                {/* <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 blur-[2px]" /> */}
                                                <div className="">
                                                    {/* Default Ribbon */}
                                                    {address.isDefault && (
                                                        <div className="pointer-events-none absolute top-0 right-0 w-32 h-24 overflow-hidden">
                                                            <div className="absolute right-[-19px] top-[7px]  rotate-45">
                                                                <span className="bg-[#621df2] text-white text-[10px] font-semibold tracking-wide px-6 py-1 shadow-lg">Default</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Address Content */}
                                                    <div className="space-y-2 sm:space-y-3">
                                                        <h3 className="text-[#cfab9d] font-medium text-sm sm:text-base">{address.name}</h3>
                                                        <p className="text-white text-sm">{address.addressLine1}</p>
                                                        <p className="text-[#7b7b7b] text-sm">{address.addressLine2}</p>
                                                        <div className='flex items-center gap-2 justify-between'>
                                                            <p className="text-gray-300 text-sm">{address.mobile}</p>
                                                            {/* Action Buttons */}
                                                            <div className="flex flex-wrap items-center  gap-2 sm:gap-3 ">
                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => deleteAddress(address.id)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white p-1 sm:p-2.5 rounded transition-colors duration-200 ms-auto"
                                                                    aria-label="Delete address"
                                                                >
                                                                    <IoTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                </button>

                                                                {/* Edit Button */}
                                                                <button
                                                                    onClick={() => openEditModal(address)}
                                                                    className="bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-1 transition-all duration-200 ms-auto"
                                                                >
                                                                    <IoPencil className="w-4 h-4" />
                                                                    <span className="text-sm">Edit</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </StylishDiv>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Address Add/Edit Modal */}
                            {(isModalOpen || isEditModalOpen) && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
                                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] overflow-y-auto">
                                        {/* Modal Header */}
                                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                                                {editingAddress ? 'Edit Address' : 'Add Address'}
                                            </h2>
                                            <button
                                                onClick={closeModal}
                                                className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                                aria-label="Close modal"
                                            >
                                                <IoClose className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </button>
                                        </div>

                                        {/* Modal Body */}
                                        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                                            {/* Name Field */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            {/* Mobile Field */}
                                            <div>
                                                <label htmlFor="mobile" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Mobile No.
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="mobile"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter mobile number"
                                                />
                                            </div>

                                            {/* Address Line 1 Field */}
                                            <div>
                                                <label htmlFor="addressLine1" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Address Line 1
                                                </label>
                                                <input
                                                    type="text"
                                                    id="addressLine1"
                                                    name="addressLine1"
                                                    value={formData.addressLine1}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter address line 1"
                                                />
                                            </div>

                                            {/* Address Line 2 Field */}
                                            <div>
                                                <label htmlFor="addressLine2" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Address Line 2
                                                </label>
                                                <input
                                                    type="text"
                                                    id="addressLine2"
                                                    name="addressLine2"
                                                    value={formData.addressLine2}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter address line 2 (optional)"
                                                />
                                            </div>

                                            {/* Landmark Field */}
                                            <div>
                                                <label htmlFor="landmark" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Landmark
                                                </label>
                                                <input
                                                    type="text"
                                                    id="landmark"
                                                    name="landmark"
                                                    value={formData.landmark}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter landmark (optional)"
                                                />
                                            </div>

                                            {/* Pincode Field */}
                                            <div>
                                                <label htmlFor="pincode" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    id="pincode"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleaddressChange}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-transparent transition-all duration-200"
                                                    placeholder="Enter pincode"
                                                />
                                            </div>

                                            {/* Default Address Checkbox */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isDefault"
                                                    name="isDefault"
                                                    checked={formData.isDefault}
                                                    onChange={handleaddressChange}
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 bg-white/5 border-white/10 rounded focus:ring-pink-500 focus:ring-2"
                                                />
                                                <label htmlFor="isDefault" className="text-sm sm:text-base text-gray-300 cursor-pointer">
                                                    Set as default address
                                                </label>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff]             hover:from-[#8354f8] hover:to-[#9f78ff] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation shadow-lg mt-4 sm:mt-6"
                                            >
                                                {editingAddress ? 'Update Address' : 'Save Address'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* transaction */}
                {activeMenu === "Transaction" && (
                    <div className='px-4 py-6 w-full'>
                        <section className='w-full  border border-white/25 rounded-2xl  sm:p-6 p-1 text-white flex flex-col'>
                            <div className=''>
                                {/* Header */}
                                <div className='flex items-center justify-between px-2 sm:px-4 py-4  backdrop-blur-xl sticky top-0 z-20 border-b border-white/25'>
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        {/* <button
                                             className='text-white rounded-full p-2 hover:bg-white/10 transition-colors'
                                             onClick={handleBackClick}
                                             aria-label='Go back'
                                         >
                                             <IoArrowBack className='w-5 h-5 sm:w-6 sm:h-6' />
                                         </button> */}
                                        <h1 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide'>Transaction History</h1>
                                    </div>
                                    <div className='bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-md'>
                                        <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                                            <span className='text-xs'>😊</span>
                                        </div>
                                        <span className='font-semibold'>100</span>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className='flex items-center justify-between text-center text-sm md:text-lg  backdrop-blur-xl px-4'>
                                    <div onClick={() => setIsActive("fanCoin")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "fanCoin" ? 'text-white' : 'text-gray-300'}`}>
                                        FAN Coins
                                        <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "fanCoin" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                    </div>
                                    <div onClick={() => setIsActive("UPI")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "UPI" ? 'text-white' : 'text-gray-300'}`}>
                                        UPI/ Cards
                                        <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "UPI" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                    </div>
                                    <div onClick={() => setIsActive("playStore")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "playStore" ? 'text-white' : 'text-gray-300'}`}>
                                        Play Store
                                        <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "playStore" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className='flex-1 '>
                                    {
                                        isActive === "fanCoin" ? <FANCoin /> : isActive === "UPI" ? <UPICard /> : <PlayStore />
                                    }
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* logout modal */}
                <Transition appear show={activeMenu === "logout"} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setActiveMenu("profile")}>
                        {/* Backdrop */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>

                        {/* Modal */}
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold">
                                        logout Account
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-300">
                                        are you sure ?
                                    </p>

                                    <div className="mt-5 flex justify-end gap-3">
                                        <button
                                            className="px-4 py-2 rounded bg-gradient-to-r from-[#621df2] to-[#b191ff] 
                             hover:from-[#8354f8] hover:to-[#9f78ff]   text-white"
                                            onClick={() => setActiveMenu("profile")}
                                        >
                                            logout
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
                                            onClick={() => setActiveMenu("profile")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

            </div>

        </div>
    );
}
