import React from 'react'
import { NavLink } from 'react-router-dom'
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
import { MdRocketLaunch } from "react-icons/md";
import { FaGift } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import { RiHandCoinFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { BsChatHeartFill, BsChatHeart } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { PiQuestionMarkFill } from "react-icons/pi";
import { MdLogout } from "react-icons/md";



export default function Header() {
    return (
        <>
            <header className='bg-black sticky w-full top-0 z-50 '>
                <div className="drawer">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        {/* Navbar */}
                        <div className="navbar bg-black w-full px-4 justify-between">
                            {/* Left Section - Logo */}
                            <div className="flex items-center gap-2 flex-none">
                                <img src={stanLogo} alt="logo" />
                                <h3 className='text-white text-3xl font-bold'>STAN</h3>
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
                                        <NavLink to="/clubs" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Clubs</NavLink>
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
                          
                                <div className="hidden md:block relative w-9 h-9">
                                    <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                                        <img
                                            src={stanUser}
                                            className="w-full h-full object-cover object-top"
                                            alt="User"
                                        />
                                    </div>
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

                            <div className="bg-[#221f2a] px-3 py-2 rounded-lg flex items-center justify-between">
                                <div className='flex gap-4 items-center'>
                                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                                        <img
                                            src={stanUser}
                                            className="w-full h-full object-cover object-top"
                                            alt="User"
                                        />
                                    </div>
                                    <div className='flex flex-col gap-1 '>
                                        <h2 className="text-white text-sm font-medium capitalize">Vaibhav Gohil</h2>

                                        <p className="text-white text-xs font-light">View Profile</p>

                                    </div>
                                </div>
                                <button className='text-[#ebe8f1] text-lg'>
                                    <IoIosArrowForward />
                                </button>
                            </div>


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
                                       
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 rounded flex items-center gap-2 text-[13px]'>
                                            <SlBadge /> Rewards Offers
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <CgNotes />  Transaction
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <BsChatHeartFill />  chat
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <BiSupport />  Support
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <PiQuestionMarkFill />  Guides
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-2 text-sm rounded flex items-center gap-2'>
                                            <IoGameController /> Free Games
                                        </div>
                                       
                                    </div>
                                </div>
                                
                                
                            </div>

                            <div className='absolute bottom-4 left-0 w-full flex items-center justify-center'>
                                <NavLink className="flex items-center justify-center text-md gap-3 cursor-pointer">
                                    <MdLogout /> Logout
                                </NavLink>
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
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Chatter</p>
                                </>
                            )}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/clubs" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <HiMicrophone className="size-5 text-[#ab99e1]" /> // Solid filled icon
                                    ) : (
                                        <HiOutlineMicrophone className="size-5 text-gray-400" /> // Outline icon
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Clubs</p>
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
