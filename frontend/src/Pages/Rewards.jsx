import React from 'react'
import { NavLink } from 'react-router-dom'
import greenGem from "../images/green-gem.png"
import gemesLogo from "../images/gens-logo1.png"
import { FaGem, FaWhatsapp, FaInfoCircle, FaMoneyBillWave, FaArrowUp } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import phonePe from "../images/phonepe.jpg"
import Amazon from "../images/Amazon.png"
import dominos from "../images/dominos.png"
import flipkart from "../images/flipkart.png"
import referlcash from "../images/referl-cash.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { MdOutlineContentCopy } from "react-icons/md";
import 'swiper/css';
import 'swiper/css/pagination';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import StylishDiv from '../components/StylishDiv';
import { BsCart4 } from "react-icons/bs";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoRocketOutline } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import { SiPhonepe } from "react-icons/si";



const swiperStyles = `
  .swiper-pagination {
    position: absolute !important;
    bottom: 30px !important;
    left: 0 !important;
    right: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 6px !important;
    z-index: 1000 !important;
  }
  .swiper-pagination-bullet {
    width: 8px !important;
    height: 8px !important;
    background: #ffffff !important;
    border-radius: 50% !important;
    opacity: 0.6 !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
    display: inline-block !important;
    margin: 0 3px !important;
    border: 1px solid transparent !important;
  }
  .swiper-pagination-bullet-active {
    background: #aa98fe !important;
    opacity: 1 !important;
    transform: scale(1.2) !important;
    border: 1px solid #ffffff !important;
    box-shadow: 0 0 8px rgba(170, 152, 254, 0.6) !important;
  }
  .swiper {
    position: relative !important;
  }
  .mySwiper {
    position: relative !important;
   padding-bottom: 80px !important;
  }
`;

export default function Rewards() {
    const [isActive, setIsActive] = React.useState("redeem")
    const handleBackClick = () => {
        window.history.back();
    };

    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = swiperStyles;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <section className='w-full'>

                <div className=''>
                    <div className="flex items-center justify-between text-center text-sm md:text-lg font-medium relative bg-[#1c1c2b]/10   shadow-lg ">
                        <div
                            onClick={() => setIsActive("redeem")}
                            className={`w-1/2 py-3 cursor-pointer transition-all duration-500  
        ${isActive === "redeem"
                                    ? "bg-gradient-to-r from-[#7b5cff] to-[#aa98fe] text-white shadow-md scale-x-105"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"}`}
                        >
                            Redeem & Win
                        </div>

                        <div
                            onClick={() => setIsActive("refer")}
                            className={`w-1/2 py-3 cursor-pointer transition-all duration-500 
        ${isActive === "refer"
                                    ? "bg-gradient-to-r from-[#7b5cff] to-[#aa98fe] text-white shadow-md scale-x-105"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"}`}
                        >
                            FAQs
                        </div>
                    </div>

                    {
                        isActive === "redeem" ? <RedeemAndWin /> : <NeedHelp />
                    }

                </div>
            </section>
        </>
    )
}

const RedeemAndWin = () => {
    const [showAllTasks, setShowAllTasks] = React.useState(false);
    const [copySuccess, setCopySuccess] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
  

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setShowPopup(true);
            setTimeout(() => {
                setCopySuccess(false);
                setShowPopup(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const coupons = [
        { name: "Dominos", logo: dominos, bgGradient: "from-blue-400 to-blue-600" },
        { name: "Flipkart", logo: flipkart, bgGradient: "from-yellow-400 to-yellow-500" },
        { name: "Dominos", logo: dominos, bgGradient: "from-blue-400 to-blue-600" },
        { name: "Flipkart", logo: flipkart, bgGradient: "from-yellow-400 to-yellow-500" },
        { name: "Dominos", logo: dominos, bgGradient: "from-blue-400 to-blue-600" },
        { name: "Flipkart", logo: flipkart, bgGradient: "from-yellow-400 to-yellow-500" },
    ];

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

    const taskCards = [
        {
            id: 1,
            title: "Cricket Pandit (Install)",
            description: "Install Cricket Pandit app",
            reward: 2,
            icon: "C",
            bgColor: "bg-purple-600"
        },
        {
            id: 2,
            title: "Bebetta (Install)",
            description: "Install Bebetta app",
            reward: 2,
            icon: "C",
            bgColor: "bg-blue-600"
        },
        {
            id: 3,
            title: "NAVI APP (UPI FIRST TRANSACTION)",
            description: "Install, Register and Transact on Navi App",
            reward: 15,
            icon: "N",
            bgColor: "bg-green-600"
        },
        {
            id: 4,
            title: "Paytm (First Transaction)",
            description: "Complete your first UPI transaction",
            reward: 5,
            icon: "P",
            bgColor: "bg-orange-600"
        },
        {
            id: 5,
            title: "Google Pay (Sign Up)",
            description: "Create new Google Pay account",
            reward: 3,
            icon: "G",
            bgColor: "bg-red-600"
        },
        {
            id: 6,
            title: "Amazon (First Order)",
            description: "Place your first order on Amazon",
            reward: 8,
            icon: "A",
            bgColor: "bg-indigo-600"
        }
    ];

    const displayedTasks = showAllTasks ? taskCards : taskCards.slice(0, 3);
    return (
        <section className='pb-10 '>
            {showPopup && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-bounce">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Invite code copied!</span>
                    </div>
                </div>
            )}

           




            <div className='max-w-[95%] md:max-w-[85%] m-auto '>
                <div className="flex flex-col w-full items-center justify-center md:pt-20 pt-10">

                    <img
                        src={greenGem}
                        className="md:w-[150px]  w-[100px] mb-10 opacity-100 hover:opacity-50 duration-500"
                        alt="Gem"
                    />

                    <StylishDiv>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 md:gap-4">
                                <img
                                    src={greenGem}
                                    className="w-10 h-10 md:w-14 md:h-14 drop-shadow-lg"
                                    alt="Gem"
                                />
                                <div className="flex flex-col leading-tight">
                                    <h2 className="text-white text-sm md:text-lg font-medium">
                                        Total Gem Balance
                                    </h2>
                                    <h3 className="text-white text-xl md:text-3xl font-extrabold">
                                        1000
                                    </h3>
                                </div>
                            </div>
                            <button className="bg-white z-10 text-black px-3 py-1 md:px-5 md:py-2 rounded-md md:rounded-lg text-xs md:text-base font-semibold shadow hover:bg-gray-200 transition">
                                History
                            </button>
                        </div>
                    </StylishDiv>
                </div>

                <div className="py-10 w-full">
                    <h5 className="text-white font-bold text-lg md:text-2xl  mb-6 flex items-center gap-4">
                       <SiPhonepe className='text-4xl' /> PhonePe E-Gift Vouchers
                    </h5>

                    <div className=" flex items-center justify-center pt-8 w-full relative  ">
                        <Swiper
                            spaceBetween={12}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                            className="mySwiper w-full px-4"
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                640: { slidesPerView: 2, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1200: { slidesPerView: 5, spaceBetween: 20 },
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index} className="flex justify-center">
                                    <div className="bg-black/20  hover:bg-[#241c32]/30 transition-all duration-300 
                           rounded-2xl flex flex-col items-center justify-between 
                           p-5 sm:p-6 shadow-lg hover:shadow-2xl 
                           w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] 
                           max-h-[300px] sm:h-[320px] group relative overflow-hidden cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent 
                             opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                        <div className="bg-white overflow-hidden rounded-xl shadow-md flex items-center justify-center w-full   ">
                                            <img
                                                src={phonePe}
                                                alt="PhonePe"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-white text-xl sm:text-2xl font-bold mt-2">
                                            ₹{card.price}
                                        </p>
                                        <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 
                             rounded-lg px-4 py-1 flex items-center gap-2 mt-4 
                             border border-green-400/40">
                                            <FaGem className="text-green-400 animate-pulse" />
                                            <span className="text-white font-semibold text-base sm:text-lg">
                                                {card.gems}
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>


                <div className="py-10 w-full">
                    <h5 className="text-white font-bold text-lg md:text-2xl flex items-center gap-4  mb-6">
                        <BsCart4 className='text-4xl'/> Amazon E-Gift Vouchers 
                    </h5>

                    <div className=" flex items-center justify-center pt-8 w-full relative  ">
                        <Swiper
                            spaceBetween={12}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                            className="mySwiper w-full px-4"
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                640: { slidesPerView: 2, spaceBetween: 12 },
                                768: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1200: { slidesPerView: 5, spaceBetween: 20 },
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index} className="flex justify-center">
                                    <div className="bg-black/20  hover:bg-[#241c32]/30 transition-all duration-300 
                           rounded-2xl flex flex-col items-center justify-between 
                           p-5 sm:p-6 shadow-lg hover:shadow-2xl 
                           w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] 
                           max-h-[300px] sm:h-[320px] group relative overflow-hidden cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent 
                             opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                        <div className="bg-white overflow-hidden rounded-xl shadow-md flex items-center justify-center w-full">
                                            <img
                                                src={Amazon}
                                                alt="Amazon"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-white text-xl sm:text-2xl font-bold mt-2">
                                            ₹{card.price}
                                        </p>
                                        <div className="bg-gradient-to-r from-green-500/20 to-green-700/20 
                             rounded-lg px-4 py-1 flex items-center gap-2 mt-4 
                             border border-green-400/40">
                                            <FaGem className="text-green-400 animate-pulse" />
                                            <span className="text-white font-semibold text-base sm:text-lg">
                                                {card.gems}
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <div className="py-10 w-full">
                    <h5 className="text-white font-bold text-lg md:text-2xl text-center mb-6 flex items-center gap-4">
                        <RiCoupon2Fill className='text-4xl'/> Exciting Coupons 
                    </h5>

                    <div className=" flex items-center justify-center pt-8 w-full relative">
                        <Swiper
                            spaceBetween={12}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                            className="mySwiper w-full px-4"
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 10 },
                                480: { slidesPerView: 1, spaceBetween: 12 },
                                640: { slidesPerView: 2, spaceBetween: 14 },
                                768: { slidesPerView: 2, spaceBetween: 16 },
                                1024: { slidesPerView: 3, spaceBetween: 18 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {coupons.map((card, index) => (
                                <SwiperSlide key={index} className="flex justify-center">
                                    <div className={`bg-gradient-to-br ${card.bgGradient} hover:scale-[1.02] transition-all duration-300 
                           rounded-2xl flex items-center gap-3 sm:gap-4 lg:gap-6 
                           p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-2xl 
                           w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] 
                           group relative overflow-hidden cursor-pointer`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent 
                             opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                        <div className="flex flex-col items-center gap-2 min-w-[50px] sm:min-w-[60px] lg:min-w-[70px] relative z-10">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg 
                                            flex items-center justify-center p-1 shadow-md group-hover:shadow-lg transition-all duration-300">
                                                <img
                                                    src={card.logo}
                                                    alt={card.name}
                                                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 object-contain"
                                                />
                                            </div>
                                            <span className="text-white text-xs sm:text-sm lg:text-base font-medium text-center">
                                                {card.name}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex justify-center relative z-10">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 
                                            bg-white rounded-xl flex items-center justify-center p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                                                <img
                                                    src={card.logo}
                                                    alt={card.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>




                <div className="py-10 w-full">
                    <h5 className="text-white font-semibold text-xl md:text-2xl w-full mb-8 flex items-center gap-4">
                        <IoRocketOutline className='text-4xl'/> Earn With
                    </h5>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="relative group bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 rounded-2xl p-8 backdrop-blur-xl border border-purple-500/30 shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500 animate-pulse"></div>
                            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                            <div className="relative z-10 flex flex-col">
                                <h3 className="text-yellow-400 font-extrabold text-2xl mb-3 tracking-wide">
                                    Refer & Get
                                </h3>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-white text-4xl font-extrabold drop-shadow-md">₹45</span>
                                    <span className="text-gray-300 text-sm lg:text-base flex items-center gap-1">
                                        Per Install <FaInfoCircle className="w-5 h-5 text-gray-400" />
                                    </span>
                                </div>
                                <div className="border border-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-3 py-2 flex-1 bg-black/30">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300 text-sm lg:text-base">
                                            Invite Code: <span className="text-white font-mono">CyjcfXGT</span>
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard("CyjcfXGT")}
                                            className="p-2 hover:bg-purple-700/40 rounded-lg transition-colors"
                                            title="Copy invite code"
                                        >
                                            <MdOutlineContentCopy className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                                <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-600/40 hover:from-purple-700 hover:to-purple-900 transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/50">
                                    REFER NOW
                                </button>
                            </div>
                        </div>
                        <div className="relative group bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 rounded-2xl p-8 backdrop-blur-xl border border-blue-500/30 shadow-lg hover:shadow-blue-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                            <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                            <div className="relative z-10 flex flex-col">
                                <p className="text-gray-400 text-sm lg:text-base mb-2 italic">
                                    Complete quests and redeem amazing coupons 🎁
                                </p>
                                <h3 className="text-yellow-400 font-extrabold text-2xl mb-6 tracking-wide">
                                    Earn & Redeem
                                </h3>
                                <div className="bg-[#2a2a3e]/70 rounded-lg p-5 mb-6 border border-gray-600/40">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-500/40">
                                            <span className="text-white text-lg font-extrabold">₹</span>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm lg:text-base">Referral Cash Balance</p>
                                            <p className="text-white text-2xl font-bold">0</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-600/40 hover:from-purple-700 hover:to-purple-900 transition-all duration-500 transform hover:scale-105 hover:shadow-purple-500/50">
                                    Redeem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-14 w-full">
                    <h5 className="text-white font-semibold text-xl md:text-2xl w-full mb-10 flex items-center gap-4">
                        <MdAddTask className='text-4xl'/> Complete Tasks & Earn
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedTasks.map((task) => (
                            <StylishDiv>
                                <div className="relative z-10 flex flex-col">
                                    <div className="flex items-start justify-between mb-5">
                                        <div
                                            className={`w-14 h-14 ${task.bgColor} rounded-xl flex items-center justify-center shadow-lg shadow-black/30`}
                                        >
                                            <span className="text-white font-bold text-xl">{task.icon}</span>
                                        </div>
                                        <FaInfoCircle className="w-5 h-5 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer" />
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-white font-bold text-lg mb-2 tracking-wide">{task.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-300">Earn upto</span>
                                            <FaMoneyBillWave className="w-4 h-4 text-green-500" />
                                            <span className="text-white font-semibold">{task.reward}</span>
                                        </div>
                                        <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-2 rounded-xl font-medium shadow-md shadow-purple-600/40 hover:from-purple-700 hover:to-purple-900 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                                            CLAIM
                                        </button>
                                    </div>
                                </div>
                            </StylishDiv>
                        ))}
                    </div>

                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setShowAllTasks(!showAllTasks)}
                          className="px-6 py-2 rounded-xl text-sm font-semibold 	bg-white/10 backdrop-blur-md border border-white/20 	text-purple-300 hover:text-white 	hover:bg-purple-500/30 transition-all duration-300 	shadow-lg shadow-purple-900/40"
                        >
                            
                                {showAllTasks ? "Show Less" : "View More"}
                             </button>
                    </div>

                </div>

            </div>
        </section>
    )
}

const NeedHelp = () => {
    return (
        <section className='py-10 '>
            <div className='flex flex-col gap-4 max-w-[95%] md:max-w-[85%] m-auto '>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">When will I be eligible for a referral reward?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">You will be eligible for referral reward only when your friend successfully signups using your unique referral code.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">When does referral reward get credited to my account?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">The referral reward gets credited to your account within 24 hours.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What if my friend doesn't use my referral code?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">To ensure you receive your reward, please make sure that your friend uses your referral code during the signup process. Reward will not be granted if the referral code is not used.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What should I do if my referral reward is not credited?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">In the event that your referral reward is not credited, please don't hesitate to reach out to our support team. We are here to assist you.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can this referral reward policy change in future?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Please be aware that this referral reward policy may be subject to change in future. We will notify you of any modifications.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can my referral cash expire?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">No, referral cash does not have an expiration date. However, please be aware that STAN reserves the right to cancel your referral cash if any suspicious activity is detected.</div>
                </div>
                <div className="collapse collapse-arrow" style={{ backgroundColor: '#211f2a20', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">How many times in a day can I redeem referral cash?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">There is no limit on the number of times you can redeem referral cash in a day.</div>
                </div>
            </div>
        </section>
    )
}

