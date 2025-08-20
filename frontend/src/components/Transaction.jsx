import React, { useState } from 'react'
import Footer from './Footer'
import lazyCatImage from '../images/lazy-cat-1.png'
import { IoArrowBack } from "react-icons/io5"

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-start">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="relative group rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 opacity-80 blur-[2px]" />
                        <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl">
                            <div className="flex items-center justify-between">
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
                    </div>
                ))}
            </div>
        </div>
    )
}

// UPICard Component
const UPICard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {/* Circular Illustration */}
            <div className="w-64 h-64  overflow-visible rounded-full flex items-center justify-center mb-8 relative">
                {/* Lazy Cat Image */}
                <img 
                    src={lazyCatImage} 
                    alt="Lazy Cat" 
                    className="w-full h-full object-cover "
                />
            </div>
            
            {/* No transactions text */}
            <h2 className="text-white text-xl font-semibold">No transactions yet !</h2>
        </div>
    )
}

// PlayStore Component
const PlayStore = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            {/* Circular Illustration */}
            <div className="w-64 h-64  overflow-visible rounded-full flex items-center justify-center mb-8 relative">
                {/* Lazy Cat Image */}
                <img 
                    src={lazyCatImage} 
                    alt="Lazy Cat" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            {/* No transactions text */}
            <h2 className="text-white text-xl font-semibold">No transactions yet !</h2>
        </div>
    )
}

export default function Transaction() {
    const [isActive, setIsActive] = useState("fanCoin");
    
    const handleBackClick = () => {
        // Navigate back to previous page
        window.history.back();
    };
    
    return (
        <>
            <section className='w-full min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col'>
                <div className=''>
                    {/* Header */}
                    <div className='flex items-center justify-between px-2 sm:px-4 py-4 bg-black/30 backdrop-blur-xl sticky top-0 z-20 shadow-lg'>
                        <div className='flex items-center gap-2 sm:gap-3'>
                            <button
                                className='text-white rounded-full p-2 hover:bg-white/10 transition-colors'
                                onClick={handleBackClick}
                                aria-label='Go back'
                            >
                                <IoArrowBack className='w-5 h-5 sm:w-6 sm:h-6' />
                            </button>
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
                    <div className='flex items-center justify-between text-center text-sm md:text-lg bg-black/30 backdrop-blur-xl px-4'>
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
                    <div className='flex-1 min-h-screen'>
                        {
                            isActive === "fanCoin" ? <FANCoin /> : isActive === "UPI" ? <UPICard /> : <PlayStore />
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
