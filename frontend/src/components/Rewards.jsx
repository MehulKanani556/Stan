import React from 'react'
import { NavLink } from 'react-router-dom'
import greenGem from "../images/green-gem.png"
import gemesLogo from "../images/gens-logo1.png"
import { FaGem } from "react-icons/fa";
import phonePe from "../images/phonepe.jpg"
import Amazon from "../images/Amazon.png"
import dominos from "../images/dominos.png"
import flipkart from "../images/flipkart.png"
import referlcash from "../images/referl-cash.png"

export default function Rewards() {
    const [isActive, setIsActive] = React.useState("redeem")
    return (
        <section className='w-full'>
            <div className='container'>
                <div className='flex items-center justify-between text-center text-sm md:text-lg'>
                    <div onClick={() => setIsActive("redeem")} className={`w-1/2 pt-2    cursor-pointer   `}>
                        Redeem & Win
                        <div className={`w-full h-1 mt-1 transition-all ease-in duration-500 ${isActive === "redeem" ? 'bg-[#aa98fe] ' : "bg-transparent"} `}></div>
                    </div>
                    <div onClick={() => setIsActive("refer")} className={`w-1/2 pt-2 cursor-pointer   `}>
                        Refer & Earn
                        <div className={`w-full h-1 mt-1  transition-all ease-in duration-500 ${isActive === "refer" ? 'bg-[#aa98fe] ' : "bg-transparent"} `}></div>
                    </div>
                </div>
                {
                    isActive === "redeem" ? <RedeemAndWin /> : ""
                }

            </div>
        </section>
    )
}

const RedeemAndWin = () => {
    const cards = [
        { id: 1, price: 10, gems: 200 },
        { id: 2, price: 20, gems: 400 },
        { id: 3, price: 35, gems: 550 },
        { id: 1, price: 10, gems: 200 },
        { id: 2, price: 20, gems: 400 },
        { id: 3, price: 35, gems: 550 },
        { id: 1, price: 10, gems: 200 },
        { id: 2, price: 20, gems: 400 },
        { id: 3, price: 35, gems: 550 },
    ];
    return (
        <section className='pb-10 px-4'>
            <div className='container'>
                <div className='flex flex-col w-full  items-center justify-center md:pt-20 pt-10'>
                    <img src={greenGem} className='max-w-[400px] w-[20%]' />
                    <img src={gemesLogo} className='max-w-[900px] w-[50%]' />
                </div>
                <div className='rounded-lg w-full m-auto bg-gradient-to-b from-[#b292fb] to-[#6723f2] md:p-5 p-3 flex items-center justify-between   max-w-[500px]'>
                    <div className='flex items-center gap-3'>
                        <img src={greenGem} className='max-w-[400px] w-[15%]' />
                        <div className='flex flex-col  justify-start '>
                            <h2 className='text-white md:text-2xl text-sm '>Total Gem Balance</h2>
                            <h3 className='text-white md:text-4xl text-xl font-bold '>1000</h3>
                        </div>
                    </div>
                    <button className='bg-white text-black px-3 py-1 rounded-md text-sm font-medium '>History</button>
                </div>

                <div className="py-10 w-full">
                    <h5 className="text-white font-semibold text-base md:text-xl w-full">
                        PhonePe EGift Voucher
                    </h5>

                    <div className="bg-black flex items-center justify-center py-5 w-full">
                        {/* Horizontal scroll only, no wrapping */}
                        <div className="flex gap-4 overflow-x-auto px-4 w-full no-scrollbar flex-nowrap">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className="bg-[#1b1724] rounded-2xl flex flex-col items-center p-5 shadow-lg flex-shrink-0 w-40 sm:w-48 lg:w-[calc(20%-1rem)]"
                                >
                                    {/* Logo */}
                                    <img
                                        src={phonePe}
                                        alt="PhonePe"
                                        className="w-14 h-14 lg:w-36 lg:h-36  object-contain bg-white rounded-md p-1"
                                    />

                                    {/* Price */}
                                    <p className="text-white text-lg font-semibold mt-2">
                                        ₹{card.price}
                                    </p>

                                    {/* Gems */}
                                    <div className="bg-[#2b2635] rounded-lg px-3 py-1 flex items-center gap-2 mt-3">
                                        <FaGem className="text-green-500" />
                                        <span className="text-white font-semibold">{card.gems}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="py-10 w-full">
                    <h5 className="text-white font-semibold text-base md:text-xl w-full">
                        PhonePe EGift Voucher
                    </h5>

                    <div className="bg-black flex items-center justify-center py-5 w-full">
                        {/* Horizontal scroll only, no wrapping */}
                        <div className="flex gap-4 overflow-x-auto px-4 w-full no-scrollbar flex-nowrap">
                            {cards.map((card) => (
                                <div
                                    key={card.id}
                                    className="bg-[#1b1724] rounded-2xl flex flex-col items-center p-5 shadow-lg                      flex-shrink-0 w-40 sm:w-48 lg:w-[calc(20%-1rem)]"
                                >
                                    {/* Logo */}
                                    <img
                                        src={Amazon}
                                        alt="PhonePe"
                                        className="w-14 h-14 lg:w-36 lg:h-36 object-contain bg-white rounded-md p-1"
                                    />

                                    {/* Price */}
                                    <p className="text-white text-lg font-semibold mt-2">
                                        ₹{card.price}
                                    </p>

                                    {/* Gems */}
                                    <div className="bg-[#2b2635] rounded-lg px-3 py-1 flex items-center gap-2 mt-3">
                                        <FaGem className="text-green-500" />
                                        <span className="text-white font-semibold">{card.gems}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='py-10 w-full'>
                    <div className='flex items-center justify-between mb-6'>
                        <h5 className="text-white font-semibold text-base md:text-xl">Exciting Coupons</h5>
                        <button className='text-[#6723f2] text-sm font-medium whitespace-nowrap underline'>View All</button>
                    </div>
                    
                                         {/* Exciting Coupons Cards */}
                     <div className='flex gap-4 overflow-x-auto pb-4 no-scrollbar'>
                         {[
                             { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                             { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' },
                             { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                             { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' },
                             { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                             { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' }
                         ].map((card, index) => (
                             <div key={index} className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-4 flex items-center gap-4 min-w-[280px] sm:min-w-[320px] lg:min-w-[380px] flex-shrink-0 shadow-lg`}>
                                 {/* Small Logo */}
                                 <div className='flex flex-col items-center gap-2'>
                                     <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1'>
                                         <img src={card.logo} alt={card.name} className='w-8 h-8 object-contain' />
                                     </div>
                                     <span className='text-white text-sm font-medium'>{card.name}</span>
                                 </div>
                                 
                                 {/* Large Logo */}
                                 <div className='flex-1 flex justify-center'>
                                     <div className='w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl flex items-center justify-center p-2'>
                                         <img src={card.logo} alt={card.name} className='w-full h-full object-contain' />
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>

                <div className='flex flex-col w-full  items-center justify-center md:pt-20 pt-10'>
                    <img src={referlcash} className='max-w-[1000px] w-[100%]' />
                </div>

            </div>
        </section>
    )
}

