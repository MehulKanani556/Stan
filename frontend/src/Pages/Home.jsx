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
import { FaArrowRight, FaHeart, FaShoppingCart , FaRegHeart} from "react-icons/fa";

import game1 from '../images/game1.jpg';
import game2 from '../images/game2.jpg';
import game3 from '../images/game3.jpg';
import game4 from '../images/game4.webp';
import game5 from '../images/game5.jpg';
import game6 from '../images/game6.jpg';
import TopGames from '../components/TopGames';
import ExploreGames from '../images/ExploreGames.webp';
import Trailer from '../components/Trailer';
import ReviewHome from '../components/ReviewHome';
import MultiHome from '../components/MultiHome';
import StylishDiv from '../components/StylishDiv';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, getAllGames } from '../Redux/Slice/game.slice';
import { useNavigate } from 'react-router-dom';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice';
import { addToCart, addToCartLocal, fetchCart } from '../Redux/Slice/cart.slice';

export default function Home() {
  const categorySwiperRef = useRef(null);
  const [activeTab, setActiveTab] = useState(null);
  const gameSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const gameData = useSelector((state) => state?.game?.games)
  const dispatch = useDispatch()
  const cateData = useSelector((state) => state?.game?.category)
  const wishlist = useSelector((state)=> state.wishlist.items)
  const [mainGameData, setMainGameData] = useState(gameData)
  const navigate = useNavigate();
  const { wishlistStatus } = useSelector((state) => state.wishlist);
  

  // console.log("Hello Bachho", gameData);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedGameTitle, setAddedGameTitle] = useState("");
  const cartItems = useSelector((state) => state.cart.cart);
  console.log("cart",cartItems);

  
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
    dispatch(getAllCategories())
      .then((value) => {
        //  console.log("hihi" , );
        //  setActiveTab(value?.payload[0]?.categoryName)
      })
      dispatch(fetchWishlist())
      dispatch(fetchCart())
  }, [])

  useEffect(() => {
    dispatch(getAllGames());

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


  const handle = (cate) => {
    setActiveTab(cate)
    if (cate === null) {
      setMainGameData(gameData)
    }
    else {
      const filter = gameData?.filter((ele) => {
        return ele?.category?.categoryName === cate
      })
      console.log("YESYE", filter);
      setMainGameData(filter)
    }
  }

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


  const handleAddWishlist = (ele) =>{
    // alert("a")
    dispatch(addToWishlist({gameId :ele._id}));
  }

  const handleRemoveFromWishlist = (gameId) => {
    dispatch(removeFromWishlist({ gameId }));
  };
  // Track cart changes for notifications


  const handleAddToCart = (ele) => {
    dispatch(addToCart({ gameId: ele._id, platform: "windows", qty:1 }));
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
      
      <section className="">
        <div className="relative w-full">
          <Swiper
            modules={[EffectFade, Pagination, Autoplay]}
            effect="fade"
            speed={1200}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]"
          >
            {games && games.length > 0 ? (
              games.slice(-6).map((game, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                    <img
                      src={game?.cover_image?.url || game1}
                      alt={game.title || `Game ${index + 1}`}
                      className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-center text-white py-10">Loading...</p>
            )}
          </Swiper>
        </div>

        <div className=" mx-auto flex flex-col items-center sm:max-w-full">
          <div className='py-4 sm:py-6 md:py-8 lg:py-10 w-full'>
            {/* Tab buttons */}
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10  max-w-[95%] md:max-w-[85%]  mx-auto gap-2 sm:gap-3 md:gap-4 px-4 sm:px-0">
              {/* All Categories Button */}
             
              <div ref={scrollRef}  className="flex space-x-2 overflow-x-auto ds_home_scrollbar cursor-grab active:cursor-grabbing select-none">
                 <button
                   className={`
                     px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
                     rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
                     transition-all duration-200 ease-out
                     border border-transparent
                     whitespace-nowrap
                     ${activeTab === null
                       ? 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
                       : 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5'
                     }
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                   `}
                   onClick={() => handle(null)}
                 >
                   All Games
                 </button>
               {cateData?.map((element) => (
                <button
                  className={`
                    px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
                    rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
                    transition-all duration-200 ease-out
                    border border-transparent
                    whitespace-nowrap
                    ${activeTab === null
                      ? 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
                      : 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5'
                    }
                  `}
                  onClick={() => handle(null)}
                >
                  All Games
                </button>
               ))}
              </div>
            </div>

            {/* Tab content - Game cards */}
            <div className="w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto">
              <div className=''>
                <div className="">
                  <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                    <div>
                      <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>
                        {activeTab ? `${activeTab} Games` : 'All Games'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (gameSwiperRef.current && typeof gameSwiperRef.current.slidePrev === 'function') {
                            gameSwiperRef.current.slidePrev();
                          }
                        }}
                        disabled={isBeginning}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isBeginning
                          ? 'bg-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
                          } text-white rotate-180`}
                      >
                        <FaArrowRight size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (gameSwiperRef.current && typeof gameSwiperRef.current.slideNext === 'function') {
                            gameSwiperRef.current.slideNext();
                          }
                        }}
                        disabled={isEnd}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isEnd
                          ? 'bg-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
                          } text-white`}
                      >
                        <FaArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Game Cards Container */}
                  <Swiper
                    modules={[Navigation]}
                    spaceBetween={12}
                    slidesPerView={1.1}
                    breakpoints={{
                      320: { slidesPerView: 1, spaceBetween: 8 },
                      425: { slidesPerView: 2, spaceBetween: 10 },
                      500: { slidesPerView: 2, spaceBetween: 10 },
                      640: { slidesPerView: 2, spaceBetween: 12 },
                      768: { slidesPerView: 2.5, spaceBetween: 14 },
                      1024: { slidesPerView: 3, spaceBetween: 14 },
                      1280: { slidesPerView: 3.5, spaceBetween: 14 },
                      1480: { slidesPerView: 4.2, spaceBetween: 16 }
                    }}
                    style={{
                      padding: '20px 4px'
                    }}
                    className="game-swiper"
                    ref={gameSwiperRef}
                    onSwiper={(swiper) => {
                      gameSwiperRef.current = swiper;
                      // Delay the initial state check to ensure proper initialization
                      setTimeout(() => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                      }, 100);
                    }}
                    onSlideChange={(swiper) => {
                      // Add a small delay to ensure accurate state detection
                      setTimeout(() => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                      }, 50);
                    }}
                    onResize={(swiper) => {
                      // Recalculate states when screen size changes
                      setTimeout(() => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                      }, 100);
                    }}
                  >
                    {mainGameData?.map((element) => (
                      <SwiperSlide key={element?._id}>
                        <div
                          onClick={() => navigate(`/single/${element?._id}`)}
                          className="w-64 sm:w-72 md:w-80 lg:w-96 cursor-pointer"
                        >
                          <StylishDiv>
                            <div className="group relative overflow-hidden  transition-all duration-300 w-full">
                              <div className='relative w-full h-40 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                                <img
                                  src={element?.cover_image?.url}
                                  alt={element?.title}
                                  className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                                <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>

                                </div>

                                <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                                  <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{element?.title}</p>
                                </div>
                              </div>

                              <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                                <div>
                                  <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                                  <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>
                                    ${element?.platforms?.windows?.price?.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <button className='p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddWishlist(element);
                                      // handle add to cart logic
                                    }}
                                   >
                                
                                    {wishlistStatus[element?._id] ? (
                                      <FaHeart size={16} className="text-white" onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFromWishlist(element?._id);
                                      }}/>
                                    ) : (
                                      <FaRegHeart size={16} className="text-white" onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddWishlist(element);
                                      }}/>
                                    )}
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(element);                                  
                                    
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                      cartItems.some(item => item.game._id === element?._id) 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-black/50 hover:bg-black/70'
                                    }`}
                                  >

                                    <FaShoppingCart 
                                      size={16} 
                                    
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </StylishDiv>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TopGames />

        {/* game banner  */}
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
      </section>

      <Trailer />
      <ReviewHome />
      <MultiHome />
    </>
  )
}