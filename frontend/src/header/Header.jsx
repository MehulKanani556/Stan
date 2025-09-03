import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaHeart, FaShoppingCart, FaWallet } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome4Line, RiHome4Fill } from "react-icons/ri";
import { HiOutlineMicrophone, HiMicrophone } from "react-icons/hi";
import { IoGameControllerOutline, IoGameController } from "react-icons/io5";
import { IoGiftOutline, IoGift } from "react-icons/io5";
import { IoBagOutline, IoBag } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import stanUser from "../images/stan-user.jpg"
import stanLogo from "../images/stan-logo.svg"
import { clearUser, getUserById, logoutUser, setUser } from "../Redux/Slice/user.slice"
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

import { ReactComponent as YOYO_LOGO } from "../images/YOYO-LOGO.svg"
import { fetchWishlist } from '../Redux/Slice/wishlist.slice';
import axiosInstance from '../Utils/axiosInstance';
import { BASE_URL } from '../Utils/baseUrl';
import axios from 'axios';
import { handleMyToggle } from '../Redux/Slice/game.slice';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));
    // const [name, setName] = useState(() => {
    //     const stored = localStorage.getItem("userName");
    //     return stored ? JSON.parse(stored) : "";
    // });
    const name = useSelector((state) => state?.user?.name);
    const myManage = useSelector((state)=> state?.game?.myToggle)

    
         
    const { items } = useSelector((state) => state.wishlist);
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
        const userId = authUser?._id || currentUser?._id || localStorage.getItem("userId");
        if (userId) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, authUser, currentUser]);

    useEffect(() => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (userId && !currentUser) {
            dispatch(getUserById(userId));
        }
        if (currentUser?.name) {
            localStorage.setItem("userName", JSON.stringify(currentUser.name ? currentUser.name : ""));
            // setName(currentUser.name);
            dispatch(setUser(currentUser?.name))
        }

    }, [dispatch, authUser, currentUser]);



    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        navigate('/profile');
    };

    const handleSigninClick = () => {
        setIsDropdownOpen(false);
        navigate('/login');
    };



    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        const id = authUser?._id || currentUser?._id || localStorage.getItem("userId");
        if (id) {
            dispatch(logoutUser());
            dispatch(clearUser())
        }
        localStorage.removeItem("userName");
        navigate("/")
        dispatch(handleMyToggle(false)) 
    };


    return (
        <>
            <header className='bg-black/30 backdrop-blur-xl sticky w-full top-0 z-50 '>
                <div className="drawer max-w-[95%] md:max-w-[85%] m-auto w-full  ">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">


                        <div className="navbar  w-full px-0 justify-between">

                            <div className="flex items-center gap-2 flex-none">
                                <YOYO_LOGO className="svg-current-color h-12 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                                {/* <span className='text-[#ab99e1] font-semibold text-4xl'>YOYO</span> */}
                            </div>


                            <div className=" hidden md:flex justify-center">
                                <ul className="menu menu-horizontal text-gray-300 lg:text-xl text-lg px-0">
                                    <li>
                                        <NavLink to="/" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1] md:px-2 lg:px-3" : "hover:text-[#ab99e1] md:px-2 lg:px-3"
                                        }>Home</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/ggtalks" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1] md:px-2 lg:px-3" : "hover:text-[#ab99e1] md:px-2 lg:px-3"
                                        }>GGTalks</NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/games" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1] md:px-2 lg:px-3" : "hover:text-[#ab99e1] md:px-2 lg:px-3"
                                        }>Games</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/rewards" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1] md:px-2 lg:px-3" : "hover:text-[#ab99e1] md:px-2 lg:px-3"
                                        }>Rewards</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/store" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1] md:px-2 lg:px-3" : "hover:text-[#ab99e1] md:px-2 lg:px-3"
                                        }>Store</NavLink>
                                    </li>
                                </ul>
                            </div>


                            <div className="flex items-center gap-5">
                                <div className="hidden md:block relative" ref={dropdownRef}>
                                    <div className='flex gap-2 items-center'>
                                       <NavLink to="/wishlist" className="me-2 relative">
                                          {({ isActive }) => (
                                            <>
                                              <div
                                                className={`p-2 border-2 rounded-full transition-colors ${
                                                  isActive ? "border-[#ab99e1]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                }`}
                                              >
                                                <FaHeart
                                                  className={`text-[18px] cursor-pointer transition-colors ${
                                                    isActive ? "text-[#ab99e1]" : "text-[#d1d5db] hover:text-[#ab99e1]"
                                                  }`}
                                                />
                                              </div>
                                        
                                              {(items?.length > 0 && myManage) && (
                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                                  {items?.length}
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </NavLink>

                                        <NavLink to="/cart" className="me-2 relative">
                                            {({ isActive }) => (
                                              <>
                                                <div
                                                  className={`p-2 border-2 rounded-full transition-colors ${
                                                    isActive ? "border-[#ab99e1]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                  }`}
                                                >
                                                  <FaShoppingCart
                                                    className={`text-[18px] cursor-pointer transition-colors ${
                                                      isActive ? "text-[#ab99e1]" : "text-[#d1d5db] hover:text-[#ab99e1]"
                                                    }`}
                                                  />
                                                </div>
                                          
                                                {(cartItems?.length > 0 && myManage) && (
                                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                                    {cartItems?.length}
                                                  </span>
                                                )}
                                              </>
                                            )}
                                        </NavLink>

                                        <div
                                            className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#ab99e1] transition-colors"
                                            onClick={toggleDropdown}
                                        >
                                            <img
                                                src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />
                                        </div>
                                        <p
                                            className='text-base cursor-pointer hover:text-[#ab99e1] transition-colors'
                                            onClick={toggleDropdown}
                                        >
                                            {decryptData(name)}
                                        </p>
                                    </div>


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

                                                        {/* <button
                                                            onClick={() => {
                                                                setIsDropdownOpen(false);
                                                                navigate('/settings');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-white hover:bg-[#2d2a35] transition-colors flex items-center gap-3"
                                                        >
                                                            <MdSettings className="w-5 h-5 text-white" />
                                                            Settings
                                                        </button> */}

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

                                <div className='flex gap-2 items-center md:hidden'>
                                    <NavLink to="/wishlist" className="me-2 relative">
                                          {({ isActive }) => (
                                            <>
                                              <div
                                                className={`p-2 border-2 rounded-full transition-colors ${
                                                  isActive ? "border-[#ab99e1]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                }`}
                                              >
                                                <FaHeart
                                                  className={`text-[18px] cursor-pointer transition-colors ${
                                                    isActive ? "text-[#ab99e1]" : "text-[#d1d5db] hover:text-[#ab99e1]"
                                                  }`}
                                                />
                                              </div>
                                        
                                              {(items?.length > 0 && myManage) && (
                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                                  {items?.length}
                                                </span>
                                              )}
                                            </>
                                          )}
                                    </NavLink>
                                     <NavLink to="/cart" className="me-2 relative">
                                          {({ isActive }) => (
                                            <>
                                              <div
                                                className={`p-2 border-2 rounded-full transition-colors ${
                                                  isActive ? "border-[#ab99e1]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                }`}
                                              >
                                                <FaShoppingCart
                                                  className={`text-[18px] cursor-pointer transition-colors ${
                                                    isActive ? "text-[#ab99e1]" : "text-[#d1d5db] hover:text-[#ab99e1]"
                                                  }`}
                                                />
                                              </div>
                                        
                                              {(cartItems?.length > 0 && myManage) && (
                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ">
                                                  {cartItems?.length}
                                                </span>
                                              )}
                                            </>
                                          )}
                                      </NavLink>
                                </div>
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
                    
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="min-h-full w-80 p-4 relative text-white bg-gradient-to-b from-[#100f14]/95 via-[#16141c]/95 to-[#0e0d12]/95 backdrop-blur-xl border-l border-white/5 shadow-[0_10px_40px_-10px_rgba(171,153,225,0.35)]">

                            {/* ambient glows */}
                            <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 bg-[#ab99e1]/20 rounded-full blur-3xl"></div>
                            <div aria-hidden className="pointer-events-none absolute bottom-24 -right-10 h-48 w-48 bg-[#6b5bcc]/20 rounded-full blur-3xl"></div>

                            {/* brand */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <YOYO_LOGO className="svg-current-color h-7 w-auto text-[#ab99e1]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                                </div>
                                <label
                                    htmlFor="my-drawer-3"
                                    className="w-full flex mt-3 justify-end cursor-pointer text-white hover:text-[#ab99e1]"
                                >
                                    <HiX className="w-6 h-6 bg-black rounded-full p-[2px] " />
                                </label>
                            </div>

                            {isLoggedIn ? (
                                <div onClick={handleProfileClick} className="mt-3 bg-white/5 px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer ring-1 ring-white/10 hover:ring-[#ab99e1]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(171,153,225,0.35)]">
                                    <div className='flex gap-4 items-center'>
                                        <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-[0_0_0_3px_rgba(171,153,225,0.15)_inset]">
                                            <img
                                                src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />
                                        </div>
                                        <div className='flex flex-col gap-0.5 '>
                                            <h2 className="text-white text-sm font-medium capitalize">{currentUser?.userName || currentUser?.fullName || authUser?.userName || authUser?.fullName || 'Profile'}</h2>
                                            <p className="text-white/60 text-[11px]">View Profile</p>
                                        </div>
                                    </div>
                                    <button className='text-[#ebe8f1] text-lg'>
                                        <IoIosArrowForward />
                                    </button>
                                </div>
                            )
                                :
                                <div onClick={handleSigninClick} className="mt-3 bg-white/5 px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer ring-1 ring-white/10 hover:ring-[#ab99e1]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(171,153,225,0.35)]">
                                    <div className='flex gap-4 items-center'>
                                        <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-[0_0_0_3px_rgba(171,153,225,0.15)_inset]">
                                            <img
                                                src={stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />
                                        </div>
                                        <div className='flex flex-col gap-0.5 '>
                                            <h2 className="text-white text-base font-medium capitalize">Signin</h2>

                                        </div>
                                    </div>
                                    <button className='text-[#ebe8f1] text-lg'>
                                        <IoIosArrowForward />
                                    </button>
                                </div>

                            }
                            <div className='w-full flex flex-col gap-5'>
                                <div className='w-full mt-4'>

                                    <div className='flex flex-wrap justify-between gap-y-3'>

                                        <NavLink to="/rewards" className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <SlBadge className='text-[#ab99e1] group-hover:scale-110 transition-transform' /> Rewards Offers
                                        </NavLink>

                                        {/* <NavLink to="/transaction" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <CgNotes className='text-[#ab99e1] group-hover:scale-110 transition-transform' />  Transaction
                                        </NavLink> */}

                                        <NavLink to="/GGTalks" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <BsChatHeartFill className='text-[#ab99e1] group-hover:scale-110 transition-transform' />  GG Talks
                                        </NavLink>

                                        {/* <NavLink to="/support" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <BiSupport className='text-[#ab99e1] group-hover:scale-110 transition-transform' />  Support
                                        </NavLink> */}

                                        <NavLink to="/guides" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <PiQuestionMarkFill className='text-[#ab99e1] group-hover:scale-110 transition-transform' />  Guides
                                        </NavLink>

                                        <NavLink to="/games" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <IoGameController className='text-[#ab99e1] group-hover:scale-110 transition-transform' /> Free Games
                                        </NavLink>
{/* 
                                        <NavLink to="/wishlist" className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <FaHeart className='text-[#ab99e1] group-hover:scale-110 transition-transform' />  Wishlist
                                        </NavLink>

                                        <NavLink to="/cart" className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[#ab99e1]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>

                                            <FaShoppingCart className='text-[#ab99e1] group-hover:scale-110 transition-transform' /> Cart
                                        </NavLink> */}


                                    </div>
                                </div>



                            </div>

                            <div className='absolute bottom-4 left-0 w-full flex items-center justify-center'>
                                {isLoggedIn ? (
                                    <button onClick={handleLogoutClick} className="flex items-center justify-center text-sm gap-2 cursor-pointer text-black bg-gradient-to-r from-[#6b5bcc] to-[#ab99e1] px-5 py-2 rounded-full font-medium shadow-[0_10px_30px_-12px_rgba(171,153,225,0.55)] hover:from-[#7a69d9] hover:to-[#b9a9ee] transition-all">
                                        <MdLogout className='text-black/80' /> Logout
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="flex items-center justify-center text-sm gap-2 cursor-pointer text-black bg-gradient-to-r from-[#6b5bcc] to-[#ab99e1] px-5 py-2 rounded-full font-medium shadow-[0_10px_30px_-12px_rgba(171,153,225,0.55)] hover:from-[#7a69d9] hover:to-[#b9a9ee] transition-all">
                                        <MdLogout className='text-black/80' /> Sign In
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            <footer className="bg-black/30 backdrop-blur-xl text-white  py-2 rounded-t-2xl fixed bottom-0 w-full md:hidden block z-50">
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
                        <NavLink to="/GGTalks" className="flex items-center justify-center flex-col gap-1 text-xs">
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
