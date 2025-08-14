import React from 'react'
import { NavLink } from 'react-router-dom'
import greenGem from "../images/green-gem.png"
import gemesLogo from "../images/gens-logo1.png"
import { FaGem, FaWhatsapp, FaInfoCircle, FaMoneyBillWave, FaArrowUp } from "react-icons/fa";
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
import Header from './Header';
import Footer from './Footer';

// Custom CSS for Swiper pagination
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

    // Inject custom styles
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
            {/* <Header /> */}
            <section className='w-full'>
                <div className='container'>
                    <div className='flex items-center justify-between text-center text-sm md:text-lg'>
                        <div onClick={() => setIsActive("redeem")} className={`w-1/2 pt-2    cursor-pointer   `}>
                            Redeem & Win
                            <div className={`w-full h-1 mt-1 transition-all ease-in duration-500 ${isActive === "redeem" ? 'bg-[#aa98fe] ' : "bg-transparent"} `}></div>
                        </div>
                        <div onClick={() => setIsActive("refer")} className={`w-1/2 pt-2 cursor-pointer   `}>
                        Need Help?
                            <div className={`w-full h-1 mt-1  transition-all ease-in duration-500 ${isActive === "refer" ? 'bg-[#aa98fe] ' : "bg-transparent"} `}></div>
                        </div>
                    </div>
                    {
                        isActive === "redeem" ? <RedeemAndWin /> : <NeedHelp />
                    }

                </div>
            </section>
            <Footer />
        </>
    )
}

const RedeemAndWin = () => {
    const [showAllTasks, setShowAllTasks] = React.useState(false);
    const [copySuccess, setCopySuccess] = React.useState(false);
    const [showPopup, setShowPopup] = React.useState(false);
    const [showGoUp, setShowGoUp] = React.useState(false);

    // Handle scroll to show/hide go up button
    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowGoUp(true);
            } else {
                setShowGoUp(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

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
        <section className='pb-10 px-4'>
            {/* Copy Success Popup */}
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

            {/* Go Up Button */}
            {showGoUp && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-6 z-50 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                    title="Go to top"
                >
                    <FaArrowUp className="w-5 h-5" />
                </button>
            )}

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

                    <div className="bg-black flex items-center justify-center py-5 w-full pb-16 relative">
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={10}
                            autoplay={false}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full"
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-[#1b1724] rounded-2xl flex flex-col items-center p-5 shadow-lg mx-auto w-full max-w-[200px]">
                                        {/* Logo */}
                                        <img
                                            src={phonePe}
                                            alt="PhonePe"
                                            className="w-14 h-14 lg:w-20 lg:h-20 object-contain bg-white rounded-md p-1"
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
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>


                <div className="py-10 w-full">
                    <h5 className="text-white font-semibold text-base md:text-xl w-full">
                        Amazon EGift Voucher
                    </h5>

                    <div className="bg-black flex items-center justify-center py-5 w-full pb-16 relative">
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={10}
                            autoplay={false}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper w-full"
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 15,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                            }}
                        >
                            {cards.map((card, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-[#1b1724] rounded-2xl flex flex-col items-center p-5 shadow-lg mx-auto w-full max-w-[200px]">
                                        {/* Logo */}
                                        <img
                                            src={Amazon}
                                            alt="Amazon"
                                            className="w-14 h-14 lg:w-20 lg:h-20 object-contain bg-white rounded-md p-1"
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
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <div className='py-10 w-full pb-16'>
                    <div className='flex items-center justify-between mb-6'>
                        <h5 className="text-white font-semibold text-base md:text-xl">Exciting Coupons</h5>

                    </div>

                    {/* Exciting Coupons Cards */}
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={20}
                        autoplay={false}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper w-full"
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {[
                            { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                            { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' },
                            { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                            { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' },
                            { name: 'Dominos', logo: dominos, bgGradient: 'from-blue-400 to-blue-600' },
                            { name: 'Flipkart', logo: flipkart, bgGradient: 'from-yellow-400 to-yellow-500' }
                        ].map((card, index) => (
                            <SwiperSlide key={index}>
                                <div className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-4 flex items-center gap-4 shadow-lg mx-auto w-full max-w-[380px]`}>
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
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='flex flex-col w-full  items-center justify-center md:pt-20 pt-10 pb-20'>
                    <img src={referlcash} className='max-w-[1000px] w-[100%]' />
                </div>

                <div className='pb-10 w-full'>
                    <h5 className="text-white font-semibold text-base md:text-xl w-full mb-6">
                        Earn With
                    </h5>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Refer & Get Card */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full translate-y-12 translate-x-12"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-yellow-400 font-bold text-xl lg:text-2xl mb-2">Refer & Get</h3>
                                        <div className="flex  items-center gap-2 mb-4">
                                            <span className="text-white text-3xl lg:text-4xl font-bold">₹45</span>
                                            <span className="text-gray-300 text-sm lg:text-base flex items-center gap-1">Per Install <FaInfoCircle className="w-5 h-5 text-gray-400" /></span>

                                        </div>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="border border-dashed border-gray-500 rounded-lg p-3 py-1 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-300 text-xs lg:text-base">Invite Code: <span className="text-white font-mono">CyjcfXGT</span></span>

                                                    <button
                                                        onClick={() => copyToClipboard('CyjcfXGT')}
                                                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                        title="Copy invite code"
                                                    >
                                                        <MdOutlineContentCopy className={`w-4 h-4 ${copySuccess ? 'text-green-500' : 'text-gray-300'} transition-colors`} />
                                                    </button>

                                                </div>
                                            </div>

                                        </div>

                                        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105">
                                            REFER NOW
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Earn & Redeem Card */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -translate-y-14 translate-x-14"></div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full translate-y-10 translate-x-10"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex flex-col">
                                    <div className="flex-1">
                                        <p className="text-gray-300 text-sm lg:text-base mb-2">Complete all the quests and redeem coupons</p>
                                        <h3 className="text-yellow-400 font-bold text-xl lg:text-2xl mb-4">Earn & Redeem</h3>

                                        <div className="bg-[#2a2a3e] rounded-lg p-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">₹</span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-300 text-sm lg:text-base">Referral Cash Balance</p>
                                                    <p className="text-white text-xl lg:text-2xl font-bold">0</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105">
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center '>

                    </div>
                </div>

                {/* Task Cards Section */}
                <div className='py-10 w-full'>
                    <h5 className="text-white font-semibold text-base md:text-xl w-full mb-6">
                        Complete Tasks & Earn
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayedTasks.map((task) => (
                            <div key={task.id} className="bg-[#1a1a2e] rounded-xl p-4 relative">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 ${task.bgColor} rounded-lg flex items-center justify-center`}>
                                        <span className="text-white font-bold text-lg">{task.icon}</span>
                                    </div>
                                    <FaInfoCircle className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-white font-semibold text-lg mb-1">{task.title}</h4>
                                    <p className="text-gray-300 text-sm">{task.description}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-300 text-sm">earn upto</span>
                                        <FaMoneyBillWave className="w-4 h-4 text-green-500" />
                                        <span className="text-white font-semibold">{task.reward}</span>
                                    </div>
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                                        CLAIM
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View More Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => setShowAllTasks(!showAllTasks)}
                            className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-colors"
                        >
                            {showAllTasks ? 'Show Less' : 'View More'}
                        </button>
                    </div>
                </div>

            </div>
        </section>
    )
}

const NeedHelp = () => {
    return (
        <section className='py-10 px-4'>
            <div className='flex flex-col gap-4'>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">When will I be eligible for a referral reward?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">You will be eligible for referral reward only when your friend successfully signups using your unique referral code.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">When does referral reward get credited to my account?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">The referral reward gets credited to your account within 24 hours.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What if my friend doesn't use my referral code?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">To ensure you receive your reward, please make sure that your friend uses your referral code during the signup process. Reward will not be granted if the referral code is not used.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">What should I do if my referral reward is not credited?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">In the event that your referral reward is not credited, please don't hesitate to reach out to our support team. We are here to assist you.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can this referral reward policy change in future?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">Please be aware that this referral reward policy may be subject to change in future. We will notify you of any modifications.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">Can my referral cash expire?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">No, referral cash does not have an expiration date. However, please be aware that STAN reserves the right to cancel your referral cash if any suspicious activity is detected.</div>
                </div>
                <div className="collapse collapse-arrow" style={{backgroundColor: '#211f2a', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                    <input type="radio" name="my-accordion-2" />
                    <div className="collapse-title font-semibold text-white text-xs md:text-base">How many times in a day can I redeem referral cash?</div>
                    <div className="collapse-content text-xs md:text-sm text-white">There is no limit on the number of times you can redeem referral cash in a day.</div>
                </div>
            </div>
        </section>
    )
}

