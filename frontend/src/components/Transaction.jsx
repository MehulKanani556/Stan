import React, { useState } from 'react'
import lazyCatImage from '../images/lazy-cat-1.png'
import { IoArrowBack } from "react-icons/io5"
import StylishDiv from './StylishDiv';

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
        <div className="px-3 sm:px-4 py-10 w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-min">
                {transactions.map((transaction) => (
                    <StylishDiv key={transaction.id} >
                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col">
                            {/* Title & Amount */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-white text-base sm:text-lg">
                                        {transaction.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                        {transaction.time}
                                    </p>
                                </div>
                                <span
                                    className={`font-bold text-base sm:text-lg ${transaction.type === "credit"
                                        ? "text-green-400"
                                        : "text-red-400"
                                        }`}
                                >
                                    {transaction.amount}
                                </span>
                            </div>

                            {/* Details Toggle */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleDetails(transaction.id)}
                                >
                                    <div className="flex items-center">
                                        <span className="text-white text-sm">Details</span>
                                        <svg
                                            className={`w-4 h-4 text-white ml-1 transition-transform duration-300 ${openId === transaction.id ? "rotate-180" : ""
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative">
            {/* Floating Glow Effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
                  from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
                  from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div>

            {/* Circular Illustration */}
            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
                  relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* No transactions text */}
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative">
            {/* Floating Glow Effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
                        from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
                        animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
                        from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
                        animate-pulse"></div>

            {/* Circular Illustration */}
            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
                        relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* No transactions text */}
            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                No transactions yet !
            </h2>
            <p className="text-gray-400 text-sm text-center mt-2">
                Complete tasks or purchases to see them here ✨
            </p>
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
                <div className='max-w-[1480px] m-auto w-full'>
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 sm:px-5 py-4 
                bg-black/40 backdrop-blur-xl sticky top-0 z-20 shadow-md border-b border-white/10">
                        {/* Left Side */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                className="text-white rounded-full p-2 hover:bg-white/10 transition-all duration-300"
                                onClick={handleBackClick}
                                aria-label="Go back"
                            >
                                <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Transaction History
                            </h1>
                        </div>

                        {/* Right Side Balance */}
                        <div className="bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white px-3 sm:px-4 py-1.5 
                  rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-lg">
                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-sm">😊</span>
                            </div>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center justify-between text-center text-sm sm:text-base md:text-lg 
                bg-black/30 backdrop-blur-lg px-3 sm:px-6 border-b border-white/10">
                        {[
                            { id: "fanCoin", label: "FAN Coins" },
                            { id: "UPI", label: "UPI / Cards" },
                            { id: "playStore", label: "Play Store" }
                        ].map(tab => (
                            <div
                                key={tab.id}
                                onClick={() => setIsActive(tab.id)}
                                className={`w-1/3 py-4 cursor-pointer font-medium transition-all duration-300 ${isActive === tab.id ? "text-white" : "text-gray-400 hover:text-white/80"
                                    }`}
                            >
                                {tab.label}
                                <div
                                    className={`w-full h-1 mt-2 rounded-full transition-all duration-500 ${isActive === tab.id
                                            ? "bg-gradient-to-r from-purple-400 to-pink-400"
                                            : "bg-transparent"
                                        }`}
                                ></div>
                            </div>
                        ))}
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
