import React, { useState, useEffect, useRef, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaHeart, FaShoppingCart, FaWallet } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome4Line, RiHome4Fill } from "react-icons/ri";
import { HiOutlineMicrophone, HiMicrophone } from "react-icons/hi";
import { IoGameControllerOutline, IoGameController } from "react-icons/io5";
import { IoGiftOutline, IoGift } from "react-icons/io5";
import { IoBagOutline, IoBag } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import stanUser from "../images/stan-user.png"
import stanLogo from "../images/stan-logo.svg"
import { clearUser, getUserById, logoutUser, setUser, updateLoginTask } from "../Redux/Slice/user.slice"
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
import { fetchCart } from '../Redux/Slice/cart.slice';
import playstoreLogo from "../images/images/playstore.png"
import appstoreLogo from "../images/images/appstore.png"

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith("/admin");

    // user looging task manage code ----------------------------------------------------------------
    useEffect(() => {
        if (isLoggedIn) {
            dispatch(updateLoginTask());
        }
    }, [])
    // user looging task manage code over here ------------------------------------------------------ 

    const name = useSelector((state) => state?.user?.name);
    const myManage = useSelector((state) => state?.game?.myToggle)


    const userId = authUser?._id || currentUser?._id || localStorage.getItem("userId");
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
        if (userId && (!items?.length && !cartItems?.length)) {
            dispatch(fetchWishlist());
            dispatch(fetchCart());
        }
    }, [dispatch]);

    useEffect(() => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (userId && !currentUser) {
            dispatch(getUserById(userId));
        }
        if (currentUser?.name) {
            localStorage.setItem("userName", JSON.stringify(currentUser.name ? currentUser.name : ""));
            dispatch(setUser(currentUser?.name))
        }
    }, [dispatch, authUser?._id, currentUser, currentUser?.name]);



    const cartGamesCount = useMemo(() => {
        if (!Array.isArray(cartItems)) return 0;
        const uniqueIds = new Set(
            cartItems
                .map((item) => item?.game?._id || item?.game)
                .filter(Boolean)
                .map((id) => String(id))
        );
        return uniqueIds.size;
    }, [cartItems]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        setIsDrawerOpen(false);
        navigate('/profile');
    };

    const handleSigninClick = () => {
        setIsDropdownOpen(false);
        setIsDrawerOpen(false);
        navigate('/login');
    };



    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setIsDrawerOpen(false);
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
                <div className={`drawer w-full ${isAdminRoute ? "" : "max-w-[95%] md:max-w-[85%] m-auto"}`}>
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={(e) => setIsDrawerOpen(e.target.checked)} />
                    <div className="drawer-content flex flex-col">


                        <div className="navbar w-[97%] m-auto px-0 justify-between">

                            <NavLink to={isAdminRoute ? "/admin" : "/"} className="flex items-center gap-2 flex-none">
                                <YOYO_LOGO className="svg-current-color h-12 w-auto text-[var(--color-change)]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                                {/* <span className='text-[var(--color-change)] font-semibold text-4xl'>YOYO</span> */}
                            </NavLink>


                            {!isAdminRoute && (
                                <div className=" hidden md:flex justify-center">
                                    <ul className="menu menu-horizontal text-gray-300 lg:text-xl text-lg px-0">
                                        <li>
                                            <NavLink to="/" className={({ isActive }) =>
                                                isActive ? "text-[var(--color-change)] md:px-2 lg:px-3" : "hover:text-[var(--color-change)] md:px-2 lg:px-3"
                                            }>Home</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={isLoggedIn ? "/ggtalks" : "/login"} className={({ isActive }) =>
                                                isActive ? "text-[var(--color-change)] md:px-2 lg:px-3" : "hover:text-[var(--color-change)] md:px-2 lg:px-3"
                                            }>GGTalks</NavLink>
                                        </li>

                                        <li>
                                            <NavLink to="/games" className={({ isActive }) =>
                                                isActive ? "text-[var(--color-change)] md:px-2 lg:px-3" : "hover:text-[var(--color-change)] md:px-2 lg:px-3"
                                            }>Games</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to={isLoggedIn ? "/rewards" : "/login"} className={({ isActive }) =>
                                                isActive ? "text-[var(--color-change)] md:px-2 lg:px-3" : "hover:text-[var(--color-change)] md:px-2 lg:px-3"
                                            }>Rewards</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/store" end={false} className={({ isActive }) => {
                                                const path = location.pathname;
                                                const isCustomActive =
                                                    path.startsWith("/single/") || path.startsWith("/store");

                                                return isActive || isCustomActive
                                                    ? "text-[var(--color-change)] md:px-2 lg:px-3"
                                                    : "hover:text-[var(--color-change)] md:px-2 lg:px-3";
                                            }}
                                            >Store</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )}


                            <div className="flex items-center gap-5">
                                <div className="hidden md:block relative" ref={dropdownRef}>

                                    <div className='flex gap-2 items-center'>
                                        {
                                            !isAdminRoute && isLoggedIn ?
                                                <>

                                                    <NavLink to="https://play.google.com/store/games?device=windows" target="_blank" className="me-2 relative">

                                                        <img src={playstoreLogo} className='w-7' />

                                                    </NavLink>

                                                    <NavLink to="https://apps.apple.com/in/developer/apple/id284417353?mt=12" target="_blank" className="me-2 relative">

                                                        <img src={appstoreLogo} className='w-7' />

                                                    </NavLink>

                                                    <NavLink to="/wishlist" className="me-2 relative">
                                                        {({ isActive }) => (
                                                            <>
                                                                <div
                                                                    className={`p-2 border-2 rounded-full transition-colors ${isActive ? "border-[var(--color-change)]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                                        }`}
                                                                >
                                                                    <FaHeart
                                                                        className={`text-[18px] cursor-pointer transition-colors ${isActive ? "text-[var(--color-change)]" : "text-[#d1d5db] hover:text-[var(--color-change)]"
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
                                                                    className={`p-2 border-2 rounded-full transition-colors ${isActive ? "border-[var(--color-change)]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                                        }`}
                                                                >
                                                                    <FaShoppingCart
                                                                        className={`text-[18px] cursor-pointer transition-colors ${isActive ? "text-[var(--color-change)]" : "text-[#d1d5db] hover:text-[var(--color-change)]"
                                                                            }`}
                                                                    />
                                                                </div>

                                                                {(cartGamesCount > 0 && myManage) && (
                                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                                                        {cartGamesCount}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </NavLink>
                                                </> : null
                                        }


                                        <div
                                            className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:border-[var(--color-change)] transition-colors"
                                            onClick={toggleDropdown}
                                        >
                                            <img
                                                src={currentUser?.profilePic || authUser?.photo || stanUser}
                                                className="w-full h-full object-cover object-top"
                                                alt="User"
                                            />
                                        </div>
                                        <p
                                            className='text-base cursor-pointer hover:text-[var(--color-change)] transition-colors'
                                            onClick={toggleDropdown}
                                        >
                                            {decryptData(name)?.split(" ")[0]}
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
                                {!isAdminRoute && isLoggedIn ? <div className='flex gap-2 items-center md:hidden'>

                                    <NavLink to="https://play.google.com/store/games?device=windows" target="_blank" className="me-1.5 relative">

                                        <img src={playstoreLogo} className='w-7' />

                                    </NavLink>

                                    <NavLink to="https://apps.apple.com/in/developer/apple/id284417353?mt=12" target="_blank" className="me-2 relative">

                                        <img src={appstoreLogo} className='w-7' />


                                    </NavLink>

                                    <NavLink to="/wishlist" className="me-2 relative">
                                        {({ isActive }) => (
                                            <>
                                                <div
                                                    className={`p-2 border-2 rounded-full transition-colors ${isActive ? "border-[var(--color-change)]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                        }`}
                                                >
                                                    <FaHeart
                                                        className={`text-[18px] cursor-pointer transition-colors ${isActive ? "text-[var(--color-change)]" : "text-[#d1d5db] hover:text-[var(--color-change)]"
                                                            }`}
                                                    />
                                                </div>

                                                {(items?.length > 0 && myManage) && (
                                                    <span className="absolute -top-[0.4rem] -right-[0.4rem] bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
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
                                                    className={`p-2 border-2 rounded-full transition-colors ${isActive ? "border-[var(--color-change)]" : "border-[#d1d5db] hover:border-[#9ca3af]"
                                                        }`}
                                                >
                                                    <FaShoppingCart
                                                        className={`text-[18px] cursor-pointer transition-colors ${isActive ? "text-[var(--color-change)]" : "text-[#d1d5db] hover:text-[var(--color-change)]"
                                                            }`}
                                                    />
                                                </div>

                                                {(cartGamesCount > 0 && myManage) && (
                                                    <span className="absolute -top-[0.4rem] -right-[0.4rem] bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ">
                                                        {cartGamesCount}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </div> : null}

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

                    <div className="drawer-side md:hidden">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay" />
                        <div className="min-h-full w-80 p-4 relative text-white bg-gradient-to-b from-[#100f14]/95 via-[#16141c]/95 to-[#0e0d12]/95 backdrop-blur-xl border-l border-white/5 shadow-[0_10px_40px_-10px_rgba(171,153,225,0.35)]">

                            {/* ambient glows */}
                            <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 bg-[var(--color-change)]/20 rounded-full blur-3xl"></div>
                            <div aria-hidden className="pointer-events-none absolute bottom-24 -right-10 h-48 w-48 bg-[#6b5bcc]/20 rounded-full blur-3xl"></div>

                            {/* brand */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <YOYO_LOGO className="svg-current-color h-7 w-auto text-[var(--color-change)]" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
                                </div>
                                <label
                                    htmlFor="my-drawer-3"
                                    className="w-full flex mt-3 justify-end cursor-pointer text-white hover:text-[var(--color-change)]"
                                >
                                    <HiX className="w-6 h-6 bg-black rounded-full p-[2px] " />
                                </label>
                            </div>

                            {isLoggedIn ? (
                                <div onClick={handleProfileClick} className="mt-3 bg-white/5 px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(171,153,225,0.35)]">
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
                                <div onClick={handleSigninClick} className="mt-3 bg-white/5 px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(171,153,225,0.35)]">
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

                                        <NavLink to="/rewards" onClick={() => setIsDrawerOpen(false)} className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <SlBadge className='text-[var(--color-change)] group-hover:scale-110 transition-transform' /> Rewards Offers
                                        </NavLink>

                                        {/* <NavLink to="/transaction" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <CgNotes className='text-[var(--color-change)] group-hover:scale-110 transition-transform' />  Transaction
                                        </NavLink> */}

                                        <NavLink to={isLoggedIn ? "/ggtalks" : "/login"} onClick={() => setIsDrawerOpen(false)} className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <BsChatHeartFill className='text-[var(--color-change)] group-hover:scale-110 transition-transform' />  GG Talks
                                        </NavLink>

                                        {/* <NavLink to="/support" className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <BiSupport className='text-[var(--color-change)] group-hover:scale-110 transition-transform' />  Support
                                        </NavLink> */}

                                        <NavLink to="/guides" onClick={() => setIsDrawerOpen(false)} className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <PiQuestionMarkFill className='text-[var(--color-change)] group-hover:scale-110 transition-transform' />  Guides
                                        </NavLink>

                                        <NavLink to="/games" onClick={() => setIsDrawerOpen(false)} className='group w-[48%] bg-white/5 px-3 py-2 text-sm rounded-xl flex items-center gap-2 ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <IoGameController className='text-[var(--color-change)] group-hover:scale-110 transition-transform' /> Free Games
                                        </NavLink>
                                        {/* 
                                        <NavLink to="/wishlist" className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>
                                            <FaHeart className='text-[var(--color-change)] group-hover:scale-110 transition-transform' />  Wishlist
                                        </NavLink>

                                        <NavLink to="/cart" className='group w-[48%] bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 text-[13px] ring-1 ring-white/10 hover:ring-[var(--color-change)]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5'>

                                            <FaShoppingCart className='text-[var(--color-change)] group-hover:scale-110 transition-transform' /> Cart
                                        </NavLink> */}


                                    </div>
                                </div>



                            </div>

                            <div className='absolute bottom-4 left-0 w-full flex items-center justify-center'>
                                {isLoggedIn ? (
                                    <button onClick={handleLogoutClick} className="flex items-center justify-center text-sm gap-2 cursor-pointer text-black bg-gradient-to-r from-[#6b5bcc] to-[var(--color-change)] px-5 py-2 rounded-full font-medium shadow-[0_10px_30px_-12px_rgba(171,153,225,0.55)] hover:from-[#7a69d9] hover:to-[#b9a9ee] transition-all">
                                        <MdLogout className='text-black/80' /> Logout
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="flex items-center justify-center text-sm gap-2 cursor-pointer text-black bg-gradient-to-r from-[#6b5bcc] to-[var(--color-change)] px-5 py-2 rounded-full font-medium shadow-[0_10px_30px_-12px_rgba(171,153,225,0.55)] hover:from-[#7a69d9] hover:to-[#b9a9ee] transition-all">
                                        <MdLogout className='text-black/80' /> Sign In
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {!isAdminRoute && (
                <footer className="bg-black/30 backdrop-blur-xl text-white  py-2 rounded-t-2xl fixed bottom-0 w-full md:hidden block z-50">
                    <ul className="flex  items-center justify-evenly">
                        <li>
                            <NavLink to="/" className="flex items-center justify-center flex-col gap-1 text-xs">
                                {({ isActive }) => (
                                    <>
                                        {isActive ? (
                                            <RiHome4Fill className="size-5 text-[var(--color-change)]" />
                                        ) : (
                                            <RiHome4Line className="size-5 text-gray-400" />
                                        )}
                                        <p className={isActive ? "text-[var(--color-change)]" : "text-gray-400"}>Home</p>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={isLoggedIn ? "/ggtalks" : "/login"} className="flex items-center justify-center flex-col gap-1 text-xs">
                                {({ isActive }) => (
                                    <>
                                        {isActive ? (
                                            <BsChatHeartFill className="size-5 text-[var(--color-change)] fill-current" />
                                        ) : (
                                            <BsChatHeart className="size-5 text-gray-400" />
                                        )}
                                        <p className={isActive ? "text-[var(--color-change)]" : "text-gray-400"}>GG Talks</p>
                                    </>
                                )}
                            </NavLink>
                        </li>



                        <li>
                            <NavLink to="/games" end={false} className="flex items-center justify-center flex-col gap-1 text-xs">
                                {({ isActive }) => {
                                    const active = location.pathname.startsWith("/game") || location.pathname.startsWith("/games/");
                                    return (
                                        <>
                                            {active ? (
                                                <IoGameController className="size-5 text-[var(--color-change)]" />
                                            ) : (
                                                <IoGameControllerOutline className="size-5 text-gray-400" />
                                            )}
                                            <p className={active ? "text-[var(--color-change)]" : "text-gray-400"}>Games</p>
                                        </>
                                    )
                                }}
                            </NavLink>

                        </li>

                        <li>
                            <NavLink to="/rewards" className="flex items-center justify-center flex-col gap-1 text-xs">
                                {({ isActive }) => (
                                    <>
                                        {isActive ? (
                                            <IoGift className="size-5 text-[var(--color-change)]" />
                                        ) : (
                                            <IoGiftOutline className="size-5 text-gray-400" />
                                        )}
                                        <p className={isActive ? "text-[var(--color-change)]" : "text-gray-400"}>Rewards</p>
                                    </>
                                )}
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/store" className="flex items-center justify-center flex-col gap-1 text-xs">
                                {({ isActive }) => {
                                    const active = location.pathname.startsWith("/store") || location.pathname.startsWith("/single/");
                                    return (
                                        <>
                                            {active ? (
                                                <IoBag className="size-5 text-[var(--color-change)]" />
                                            ) : (
                                                <IoBagOutline className="size-5 text-gray-400" />
                                            )}
                                            <p className={active ? "text-[var(--color-change)]" : "text-gray-400"}>Store</p>
                                        </>
                                    )
                                }}
                            </NavLink>
                        </li>
                    </ul>
                </footer>
            )}


        </>
    )
}
