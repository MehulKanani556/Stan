import { useState, useRef, useEffect } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";


import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

import ad1 from '../images/ad1.jpg';
import ad2 from '../images/ad2.webp';
import ad3 from '../images/ad3.jpg';
import ad4 from '../images/ad4.jpg';
import ad5 from '../images/game2.jpg';
import { FaArrowRight, FaHeart, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import LazyGameCard from '../lazyLoader/LazyGameCard';

import game1 from '../images/game1.jpg';
import game2 from '../images/game2.jpg';
import game3 from '../images/game3.jpg';
import game4 from '../images/game4.webp';
import game5 from '../images/game5.jpg';
import game6 from '../images/game6.jpg';
import TopGames from '../components/TopGames';
import ExploreGames from '../images/ExploreGames.webp';
import ExploreBannerSkeleton from '../lazyLoader/ExploreBannerSkeleton';
import Trailer from '../components/Trailer';
import ReviewHome from '../components/ReviewHome';
import MultiHome from '../components/MultiHome';
import StylishDiv from '../components/StylishDiv';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, getAllGames } from '../Redux/Slice/game.slice';
import { Link, useNavigate } from 'react-router-dom';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice';
import { addToCart, addToCartLocal, fetchCart } from '../Redux/Slice/cart.slice';
import { BiLogoWindows } from 'react-icons/bi';
import { BsWindows } from 'react-icons/bs';
import Demo from '../components/Demo';
import HomeSlider from '../components/HomeSlider';

export default function Home() {
  const categorySwiperRef = useRef(null);
  const [activeTab, setActiveTab] = useState(null);
  const gameSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const gameData = useSelector((state) => state?.game?.games)
  const { pagination, loading } = useSelector((state) => state.game);
  const dispatch = useDispatch()
  const cateData = useSelector((state) => state?.game?.category)
  const wishlist = useSelector((state) => state.wishlist.items)
  const [mainGameData, setMainGameData] = useState(gameData)
  const navigate = useNavigate();
  const { wishlistStatus } = useSelector((state) => state.wishlist);

  const { currentUser } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  // console.log("Hello Bachho", gameData);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedGameTitle, setAddedGameTitle] = useState("");
  const cartItems = useSelector((state) => state.cart.cart);
  // console.log("cart",cartItems);

  // Explore banner loading state
  const [isExploreLoaded, setIsExploreLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = ExploreGames;
    img.onload = () => setIsExploreLoaded(true);
  }, []);

  const prevCartLengthRef = useRef(0);

  // Momentum effect after mouse up
  useEffect(() => {
    let animationFrame;
    const momentum = () => {
      if (Math.abs(velocity) > 0.1) {
        categorySwiperRef.current.scrollLeft -= velocity;
        setVelocity(velocity * 0.95); // friction
        animationFrame = requestAnimationFrame(momentum);
      }
    };
    if (!isDragging && Math.abs(velocity) > 0.1) {
      animationFrame = requestAnimationFrame(momentum);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, velocity]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - categorySwiperRef.current.offsetLeft);
    setScrollLeft(categorySwiperRef.current.scrollLeft);
    setLastX(e.pageX);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categorySwiperRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // drag speed multiplier
    categorySwiperRef.current.scrollLeft = scrollLeft - walk;

    // calculate velocity for momentum
    setVelocity(e.pageX - lastX);
    setLastX(e.pageX);
  };

  // console.log("Hello Bachho" , gameData);
  const { games } = useSelector((state) => state.game);

  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);

  // console.log("Hello Bachho" , gameData);
  // console.log("cateData" , cateData);



  useEffect(() => {

    const userId = authUser?._id || currentUser?._id || localStorage.getItem("userId");
    if (userId) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }

  }, [])

  useEffect(() => {
    dispatch(getAllGames({ page: 1, limit: 20 })); // Load first 20 games
    dispatch(getAllCategories())
  }, [dispatch]);

  useEffect(() => {
    setMainGameData(gameData)
  }, [gameData])


  // useEffect(() => {
  //   dispatch(addToCart());
  // }, [dispatch]);

  // Add CSS to hide scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .game-slider::-webkit-scrollbar {
        display: none;
      }
      .game-slider {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .game-swiper .swiper-button-next,
      .game-swiper .swiper-button-prev {
        display: none !important;
      }
      .game-swiper .swiper-pagination {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle window resize for better mobile button states
  useEffect(() => {
    const handleResize = () => {
      if (gameSwiperRef.current) {
        setTimeout(() => {
          setIsBeginning(gameSwiperRef.current.isBeginning);
          setIsEnd(gameSwiperRef.current.isEnd);
        }, 200);
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial check after component mounts
    setTimeout(handleResize, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const categories = [
    "Thriller",
    "Racing",
    "Fighting",
    "Adventure",
    "Strategy",
    "Sports",
    "Puzzle"
  ];


  const handle = (cateId) => {
    setActiveTab(cateId);
    if (!cateId) {
      setMainGameData(gameData); // Show all games
    } else {
      const filtered = gameData?.filter(
        (game) => game?.category?._id === cateId
      );
      setMainGameData(filtered);
    }

    // Reset swiper to first slide after category change
    if (gameSwiperRef.current && typeof gameSwiperRef.current.slideTo === 'function') {
      gameSwiperRef.current.slideTo(0);
    }
  };

  // Set initial state to show all games
  useEffect(() => {
    if (gameData && gameData.length > 0) {
      setMainGameData(gameData);
    }
  }, [gameData]);


  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const mouseDown = (e) => {
      setIsDown(true);
      setStartX(e.pageX - slider.offsetLeft);
      setScrollLeft(slider.scrollLeft);
    };

    const mouseLeave = () => setIsDown(false);
    const mouseUp = () => setIsDown(false);

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // multiplier for speed
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, [isDown, startX, scrollLeft]);


  const handleAddWishlist = (ele) => {
    // alert("a")
    dispatch(addToWishlist({ gameId: ele._id }));
  }

  const handleRemoveFromWishlist = (gameId) => {
    dispatch(removeFromWishlist({ gameId }));
  };
  // Track cart changes for notifications
  const handleAddToCart = (ele) => {
    dispatch(addToCart({ gameId: ele._id, platform: "windows", qty: 1 }));
  }

  return (
    <>
      {/* Success Notification */}
      {showAddedToCart && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in">
          <div className="flex items-center gap-2">
            <FaShoppingCart />
            <span>{addedGameTitle} added to cart!</span>
          </div>
        </div>
      )}

      <section className="relative">
    
       <HomeSlider/>

        <div className="mx-auto flex flex-col items-center sm:max-w-full">
          <div className="py-4 sm:py-6 md:py-8 lg:py-10 w-[85%] mx-auto">
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10 max-w-[95%] md:max-w-[85%] mx-auto gap-2 sm:gap-3 md:gap-4 px-4 sm:px-0">
              <div
                ref={scrollRef}
                className="flex space-x-2 overflow-x-auto ds_home_scrollbar cursor-grab active:cursor-grabbing select-none"
              >
                {/* All Games */}
                <button
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
                    rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
                    transition-all duration-200 ease-out border border-transparent whitespace-nowrap
                    ${activeTab === null
                      ? 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
                      : 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5'}
                  `}
                  onClick={() => handle(null)}
                >
                  All Games
                </button>

                {/* Dynamic Categories */}
                {cateData?.map((element) => (
                  <button
                    key={element._id}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
                      rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
                      transition-all duration-200 ease-out border border-transparent whitespace-nowrap
                      ${activeTab === element._id
                        ? 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
                        : 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5'}
                    `}
                    onClick={() => handle(element._id)}
                  >
                    {element.name || element.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Heading + Navigation */}
            <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white">
                  {activeTab
                    ? `${cateData?.find(c => c._id === activeTab)?.name || "Category"} Games`
                    : "All Games"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/allGames')}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-lg 
    font-medium text-sm transition-all duration-200 ease-out
    bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
    text-white shadow-lg shadow-fuchsia-500/30
    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
    active:scale-95 focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  All Games
                </button>
                <button
                  onClick={() => gameSwiperRef.current?.slidePrev()}
                  disabled={isBeginning}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isBeginning
                    ? 'bg-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'} text-white rotate-180`}
                >
                  <FaArrowRight size={16} />
                </button>
                <button
                  onClick={() => gameSwiperRef.current?.slideNext()}
                  disabled={isEnd}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isEnd
                    ? 'bg-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'} text-white`}
                >
                  <FaArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Game Cards */}
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView={1.1}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 8 },
                425: { slidesPerView: 1.5, spaceBetween: 10 },
                575: { slidesPerView: 1.8, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 2.5, spaceBetween: 14 },
                1024: { slidesPerView: 3, spaceBetween: 14 },
                1280: { slidesPerView: 3.5, spaceBetween: 14 },
                1480: { slidesPerView: 4.2, spaceBetween: 16 },
              }}
              style={{ padding: '20px 4px' }}
              className="game-swiper"
              ref={gameSwiperRef}
              onSwiper={(swiper) => {
                gameSwiperRef.current = swiper;
                setTimeout(() => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }, 100);
              }}
              onSlideChange={(swiper) => {
                setTimeout(() => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }, 50);
              }}
              onResize={(swiper) => {
                setTimeout(() => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }, 100);
              }}
            >
              {mainGameData?.map((element) => (
                <SwiperSlide key={element?._id}>
                  <LazyGameCard>
                    <div
                      onClick={() => navigate(`/single/${element?._id}`)}
                      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
                    >
                      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70">

                        {/* Enhanced Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Image Container with Enhanced Effects */}
                        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-2xl">
                          <img
                            src={element?.cover_image?.url}
                            alt={element?.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 rounded-2xl"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

                            {/* Top Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                                <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                              </div>
                            </div>

                            {/* Wishlist Button */}
                            <button
                              className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${wishlistStatus[element?._id]
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                                : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                wishlistStatus[element?._id]
                                  ? handleRemoveFromWishlist(element?._id)
                                  : handleAddWishlist(element);
                              }}
                            >
                              {wishlistStatus[element?._id] ? (
                                <FaHeart size={16} className="text-white animate-pulse" />
                              ) : (
                                <FaRegHeart size={16} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                              )}
                            </button>

                            {/* Game Title */}
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="p-4">
                                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                                  {element?.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 sm:p-5 md:p-6 space-y-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95">

                          {/* Stats Grid */}
                          <div className="grid grid-cols-1 gap-4">
                            {/* Price */}
                            <div className="bg-slate-700/50 rounded-xl relative z-10 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                              <div className="flex flex-wrap items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
                                <span className="text-lg font-black text-white">
                                  ${element?.platforms?.windows?.price?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">USD</span>
                              </div>
                              <div className="flex flex-wrap items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-green-400 font-semibold uppercase tracking-wider">Size</span>
                                <span className="text-lg font-black text-white">
                                  {element?.platforms?.windows?.size || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(element);
                            }}
                            disabled={cartItems.some(item => item.game?._id === element?._id)}
                            className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${cartItems.some(item => item.game?._id === element?._id)
                              ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
                              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                              }`}
                          >
                            <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                              <div>
                                {cartItems.some(item => item.game?._id === element?._id) ? (
                                  <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                                  </div>
                                ) : (
                                  <FaShoppingCart size={18} className="text-white" />
                                )}
                              </div>
                              <span className="text-white font-bold text-sm tracking-wider uppercase">
                                {cartItems.some(item => item.game?._id === element?._id)
                                  ? "Added to Cart"
                                  : "Add to Cart"}
                              </span>
                            </div>

                            {/* Button Effects */}
                            {!cartItems.some(item => item.game?._id === element?._id) && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          <div className="w-16 h-16 border-2 border-blue-400/30 rounded-lg transform rotate-45"></div>
                        </div>

                        <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          <div className="w-12 h-12 border-2 border-pink-400/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </LazyGameCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <TopGames />

        {/* game banner  */}
        {isExploreLoaded ? (
          <section className="relative w-full bg-base-600 mx-auto h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden shadow-2xl flex items-center group">
            <img
              src={ExploreGames}
              alt="Ubisoft+ Background"
              className="absolute inset-0 w-full h-full object-cover  z-0 transform transition-transform duration-500 ease-in-out group-hover:scale-105"
            />

            <div className="relative z-10 sm:w-full w-[60%] max-w-[95%] md:max-w-[85%] ps-5 sm:ps-0 sm:mx-auto flex flex-col items-start md:items-start md:text-left text-white ">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 leading-tight">
                100+ games, worlds. Explore them all with Stan
              </h2>
              <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                All of our games, in their most premium editions.
              </p>
              <button className="bg-gradient-to-r from-purple-400 to-purple-600
                  hover:from-purple-500 hover:to-purple-700 font-semibold
                  text-sm py-1 px-3 sm:text-base sm:py-2 sm:px-4 md:py-2.5 md:px-6
                  rounded-full shadow-md transition-all duration-300
                  hover:scale-105 active:scale-95">
                Buy Now
              </button>
            </div>
          </section>
        ) : (
          <ExploreBannerSkeleton />
        )}
      </section>
      <MultiHome />

      <Trailer />
      <ReviewHome />
      {/* <Demo/> */}
    </>
  )
}