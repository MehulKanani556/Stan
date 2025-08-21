import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaWallet } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // Added close icon
import { RiHome4Line, RiHome4Fill } from "react-icons/ri";
import { HiOutlineMicrophone, HiMicrophone } from "react-icons/hi";
import { IoGameControllerOutline, IoGameController } from "react-icons/io5";
import { IoGiftOutline, IoGift } from "react-icons/io5";
import { IoBagOutline, IoBag } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import stanUser from "../images/stan-user.jpg"
import stanLogo from "../images/stan-logo.svg"
import { getUserById } from "../Redux/Slice/user.slice"
import { logoutUser } from "../Redux/Slice/auth.slice"
import { MdRocketLaunch, MdSettings } from "react-icons/md";
import { FaGift } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import { RiHandCoinFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { BsChatHeartFill, BsChatHeart } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { PiQuestionMarkFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";
import { decryptData } from '../Utils/encryption';

import { ReactComponent as YOYO_LOGO } from "../images/YOYO-WITH-TEXT.svg"


export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));

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

    useEffect(() => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (userId && !currentUser) {
            dispatch(getUserById(userId));
        }
    }, [dispatch, authUser, currentUser]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        navigate('/profile');
    };

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        const id = authUser?._id || currentUser?._id || localStorage.getItem("userId");
        if (id) {
            dispatch(logoutUser(id));
        }
        navigate('/login');
    };

    return (
        <>
            <header className='bg-black/30 backdrop-blur-xl sticky w-full top-0 z-50 '>
                <div className="drawer max-w-[95%] md:max-w-[85%] m-auto w-full  ">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        {/* Navbar */}
                        <div className="navbar  w-full px-4 justify-between">
                            {/* Left Section - Logo */}
                            <div className="flex items-center gap-2 flex-none">
                                <YOYO_LOGO className="svg-current-color h-8 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                            </div>

                            {/* Center Section - Menu (Desktop) */}
                            <div className="flex-1 hidden md:flex justify-center">
                                <ul className="menu menu-horizontal text-gray-300 lg:text-xl text-lg">
                                    <li>
                                        <NavLink to="/" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/ggtalks" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>GGTalks</NavLink>
                                    </li>
                                    
                                    <li>
                                        <NavLink to="/games" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Games</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/rewards" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Rewards</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/store" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Store</NavLink>
                                    </li>
                                </ul>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-5">
                                <div className="hidden md:block relative" ref={dropdownRef}>
                                    <div className='flex gap-2 item-center'>

                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#ab99e1] transition-colors"
                                            onClick={toggleDropdown}
                                        >
                                            <img
                                                src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />

                                        </div>
                                        <p className='text-base'>
                                            {decryptData(currentUser?.name)}
                                        </p>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#221f2a] rounded-lg shadow-lg border border-gray-700 z-50">
                                            <div className="py-2">
                                                {isLoggedIn ? (
                                                    <>
                                                        <button
                                                            onClick={handleProfileClick}
                                                            className="w-full px-4 py-2 text-left text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                                        >
                                                            <div className="w-5 h-5 rounded-full flex items-center justify-center">
                                                                <img
                                                                    src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                                    className="w-full h-full object-cover object-top rounded-full"
                                                                    alt="User"
                                                                />
                                                            </div>
                                                            Profile
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                setIsDropdownOpen(false);
                                                                navigate('/settings');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                                        >
                                                            <MdSettings className="w-5 h-5 text-white" />
                                                            Settings
                                                        </button>

                                                        <button
                                                            onClick={handleLogoutClick}
                                                            className="w-full px-4 py-2 text-left text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                                        >
                                                            <MdLogout className="w-5 h-5 text-red-400" />
                                                            Logout
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            navigate('/login');
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                                    >
                                                        <MdLogout className="w-5 h-5 text-red-400" />
                                                        Sign In
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Menu Icon at far right */}
                                <label
                                    htmlFor="my-drawer-3"
                                    aria-label="open sidebar"
                                    className="cursor-pointer btn-ghost md:hidden"
                                >
                                    <HiMenu className=" h-6 w-6 text-white" />
                                </label>
                            </div>
                        </div>

                    </div>



                    {/* Sidebar Drawer */}
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="bg-[#151517] min-h-full w-80 p-4 relative ">

                            {isLoggedIn && (
                                <div onClick={handleProfileClick} className="bg-[#221f2a] px-3 py-2 rounded-lg flex items-center justify-between cursor-pointer">
                                    <div className='flex gap-4 items-center'>
                                        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                                            <img
                                                src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 '>
                                            <h2 className="text-white text-sm font-medium capitalize">{currentUser?.userName || currentUser?.fullName || authUser?.userName || authUser?.fullName || 'Profile'}</h2>
                                            <p className="text-white text-xs font-light">View Profile</p>
                                        </div>
                                    </div>
                                    <button className='text-[#ebe8f1] text-lg'>
                                        <IoIosArrowForward />
                                    </button>
                                </div>
                            )}


                            {/* Close Button */}
                            <label
                                htmlFor="my-drawer-3"
                                className="w-full flex mt-3 justify-end cursor-pointer text-white hover:text-[#ab99e1]"
                            >
                                <HiX className="w-6 h-6 bg-black rounded-full p-[2px] " />
                            </label>

                            <div className='w-full flex flex-col gap-5'>
                                <div className='w-full mt-5'>

                                    <div className='flex flex-wrap justify-between gap-y-3'>

                                        <NavLink to="/rewards" className='w-[48%] bg-[#221f2a] px-3 py-2 rounded flex items-center gap-2 text-[13px]'>
                                            <SlBadge /> Rewards Offers
                                        </NavLink>
                                        <NavLink to="/transaction" className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <CgNotes />  Transaction
                                        </NavLink>
                                        <NavLink to="/chatter" className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <BsChatHeartFill />  GG Talks
                                        </NavLink>
                                        <NavLink to="/support" className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <BiSupport />  Support
                                        </NavLink>
                                        <NavLink className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <PiQuestionMarkFill />  Guides
                                        </NavLink>
                                        <NavLink to="/games" className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <IoGameController /> Free Games
                                        </NavLink>

                                    </div>
                                </div>


                            </div>

                            <div className='absolute bottom-4 left-0 w-full flex items-center justify-center'>
                                {isLoggedIn ? (
                                    <button onClick={handleLogoutClick} className="flex items-center justify-center text-md gap-3 cursor-pointer text-white">
                                        <MdLogout /> Logout
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="flex items-center justify-center text-md gap-3 cursor-pointer text-white">
                                        <MdLogout /> Sign In
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            <footer className="bg-[#1c1b1e] text-white  py-2 rounded-t-2xl fixed bottom-0 w-full md:hidden block z-50">
                <ul className="flex  items-center justify-evenly">
                    <li>
                        <NavLink to="/" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <RiHome4Fill className="size-5 text-[#ab99e1]" />
                                    ) : (
                                        <RiHome4Line className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Home</p>
                                </>
                            )}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/chatter" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <BsChatHeartFill className="size-5 text-[#ab99e1] fill-current" />
                                    ) : (
                                        <BsChatHeart className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>GG Talks</p>
                                </>
                            )}
                        </NavLink>
                    </li>

                   

                    <li>
                        <NavLink to="/games" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <IoGameController className="size-5 text-[#ab99e1]" />
                                    ) : (
                                        <IoGameControllerOutline className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Games</p>
                                </>
                            )}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/rewards" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <IoGift className="size-5 text-[#ab99e1]" />
                                    ) : (
                                        <IoGiftOutline className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Rewards</p>
                                </>
                            )}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/store" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <IoBag className="size-5 text-[#ab99e1]" />
                                    ) : (
                                        <IoBagOutline className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Store</p>
                                </>
                            )}
                        </NavLink>
                    </li>
                </ul>
            </footer>


        </>
    )
}
