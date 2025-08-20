import React, { useState } from 'react'
import Footer from '../footer/Footer'
import lazyCatImage from '../images/lazy-cat.png'

// FANCoin Component
const FANCoin = () => {
    const [showDetails, setShowDetails] = useState({});

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
        setShowDetails(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    return (
        <div className="mt-4 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-[#1b182d] rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white text-lg">{transaction.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{transaction.time}</p>
                            </div>
                            <span className={`font-bold text-lg ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                {transaction.amount}
                            </span>
                        </div>
                        <div className="mt-4 pt-4">
                            <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDetails(transaction.id)}
                            >
                                <div className="flex items-center">
                                    <span className="text-white text-sm">Details</span>
                                    <svg 
                                        className={`w-4 h-4 text-white ml-1 transition-transform duration-300 ${showDetails[transaction.id] ? 'rotate-180' : ''}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            {showDetails[transaction.id] && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Before Fan Coins:</span>
                                        <span className="text-white">0</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">After Fan Coins:</span>
                                        <span className="text-white">50</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Before Bonus Fan Coins:</span>
                                        <span className="text-white">0</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">After Bonus Fan Coins:</span>
                                        <span className="text-white">50</span>
                                    </div>
                                </div>
                            )}
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
            <div className="w-64 h-64 bg-[#2A1B3D] overflow-visible rounded-full flex items-center justify-center mb-8 relative">
                {/* Lazy Cat Image */}
                <img 
                    src={lazyCatImage} 
                    alt="Lazy Cat" 
                    className="w-full h-full object-cover  "
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
            <div className="w-64 h-64 bg-[#2A1B3D] overflow-visible rounded-full flex items-center justify-center mb-8 relative">
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
            <section className='w-full min-h-screen bg-black'>
                <div className='container mx-auto'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-4 bg-gray-900'>
                        <div className='flex items-center'>
                            <svg 
                                className="w-6 h-6 text-white mr-3 cursor-pointer hover:opacity-80 transition-opacity" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                onClick={handleBackClick}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <h1 className='text-white font-bold text-lg'>Transaction History</h1>
                        </div>
                        <div className='flex items-center bg-gray-800 rounded-lg px-3 py-1'>
                            <div className='w-6 h-6 bg-yellow-400 rounded-full mr-2 flex items-center justify-center'>
                                <span className='text-xs'>😊</span>
                            </div>
                            <span className='text-white font-semibold'>100</span>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className='flex items-center justify-between text-center text-sm md:text-lg bg-gray-900 px-4'>
                        <div onClick={() => setIsActive("fanCoin")} className={`w-1/3 pt-4  cursor-pointer ${isActive === "fanCoin" ? 'text-white' : 'text-gray-400'}`}>
                           FAN Coins
                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "fanCoin" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                        </div>
                        <div onClick={() => setIsActive("UPI")} className={`w-1/3 pt-4  cursor-pointer ${isActive === "UPI" ? 'text-white' : 'text-gray-400'}`}>
                            UPI/ Cards
                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "UPI" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                        </div>
                        <div onClick={() => setIsActive("playStore")} className={`w-1/3 pt-4  cursor-pointer ${isActive === "playStore" ? 'text-white' : 'text-gray-400'}`}>
                            Play Store
                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "playStore" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className='bg-black min-h-screen'>
                        {
                            isActive === "fanCoin" ? <FANCoin /> : isActive === "UPI" ? <UPICard /> : <PlayStore />
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
