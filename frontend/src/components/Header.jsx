import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaWallet } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi"; // Added close icon
import { RiHome4Line, RiHome4Fill } from "react-icons/ri";
import { TbUsersGroup } from "react-icons/tb";
import { HiOutlineMicrophone, HiMicrophone } from "react-icons/hi";
import { IoGameControllerOutline, IoGameController } from "react-icons/io5";
import { IoGiftOutline, IoGift } from "react-icons/io5";
import { IoBagOutline, IoBag } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";



export default function Header() {
    return (
        <>
            <header className='bg-black'>
                <div className="drawer">
                    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col">
                        {/* Navbar */}
                        <div className="navbar bg-black w-full px-4">
                            {/* Left Section - Logo */}
                            <div className="flex items-center gap-2 flex-none">
                                <label
                                    htmlFor="my-drawer-3"
                                    aria-label="open sidebar"
                                    className="cursor-pointer btn-ghost md:hidden"
                                >
                                    <HiMenu className="text-gray-500 h-6 w-6 hover:text-white" />
                                </label>
                                <img src='./image/stan-logo.svg' alt="logo" />
                                <h3 className='text-white text-3xl font-bold'>STAN</h3>
                            </div>

                            {/* Center Section - Menu */}
                            <div className="flex-1 hidden md:flex justify-center">
                                <ul className="menu menu-horizontal text-gray-300 text-xl">
                                    <li>
                                        <NavLink to="/" className={({ isActive }) =>
                                            isActive ? "text-[#ab99e1]" : "hover:text-[#ab99e1]"
                                        }>Home</NavLink>
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

                            {/* Right Section - Wallet & Profile */}
                            <div className=" items-center gap-5 flex-none md:flex hidden">
                                <NavLink to="/wallet">
                                    <FaWallet className='text-white text-xl hover:text-[#ab99e1]' />
                                </NavLink>
                                <div to="/profile" className="relative w-9 h-9">
                                    {/* Profile Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-semibold text-black">
                                        VG
                                    </div>

                                    {/* Menu Icon Overlay
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1c1b1e] flex items-center justify-center border-2 border-black">
                                        <HiMenu className="text-white " />
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Sidebar Drawer */}
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="bg-[#151517] min-h-full w-80 p-4 relative">

                            <div className="bg-[#221f2a] px-3 py-2 rounded-lg flex items-center justify-between">
                                <div className='flex gap-4 items-center'>
                                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                                        <img
                                            src="./image/stan-user.jpg"
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
                                <div className='w-full'>
                                    <p className='text-sm text-white mb-1'>Benefits</p>
                                    <div className='flex flex-wrap justify-between gap-y-3'>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Refer $ Earn
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Offer Wall
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Rewards
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Earn More
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Okto Wallet
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <p className='text-sm text-white mb-1'>Account</p>
                                    <div className='flex flex-wrap justify-between gap-y-3'>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Transaction
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Social
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <p className='text-sm text-white mb-1'>More</p>
                                    <div className='flex flex-wrap justify-between gap-y-3'>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Support
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                           Guides
                                        </div>
                                        <div className='w-[48%] bg-[#221f2a] px-3 py-3 rounded flex items-center gap-2'>
                                            Free Games
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <footer className="bg-[#1c1b1e] text-white px-3 py-2 rounded-t-2xl fixed bottom-0 w-full md:hidden block">
                <ul className="flex gap-5 items-center justify-evenly">
                    <li>
                        <NavLink to="/" className="flex items-center justify-center flex-col gap-1 text-sm">
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
                        <NavLink to="/social" className="flex items-center justify-center flex-col gap-1 text-xs">
                            {({ isActive }) => (
                                <>
                                    {isActive ? (
                                        <TbUsersGroup className="size-5 text-[#ab99e1] fill-current" />
                                    ) : (
                                        <TbUsersGroup className="size-5 text-gray-400" />
                                    )}
                                    <p className={isActive ? "text-[#ab99e1]" : "text-gray-400"}>Social</p>
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
