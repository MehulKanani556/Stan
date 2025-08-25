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
import { FaArrowRight } from "react-icons/fa";

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

export default function Home() {
  const categorySwiperRef = useRef(null);
  const [activeTab, setActiveTab] = useState(null);
  const gameSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const gameData = useSelector((state)=> state?.game?.games)
  const disaptch = useDispatch()
  const cateData = useSelector((state)=> state?.game?.category)
  const [mainGameData, setMainGameData] = useState(gameData)
  const navigate = useNavigate()

  console.log("Hello Bachho" , gameData);
  // console.log("cateData" , cateData);

  useEffect(()=>{
    disaptch(getAllGames())
  },[])

  useEffect(()=>{
    disaptch(getAllCategories())
    .then((value)=>{
      //  console.log("hihi" , );
      //  setActiveTab(value?.payload[0]?.categoryName)
    })
  },[])

  useEffect(()=>{
    setMainGameData(gameData)
  },[gameData])

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

  const gamesByCategory = [
    // Thriller games (index 0)
    [
      { id: 1, title: "Resident Evil Village", price: 2999, discount: 15, tag: "Horror", image: game1 },
      { id: 2, title: "The Last of Us Part II", price: 3499, discount: 10, tag: "Survival", image: game2 },
      { id: 3, title: "Dead Space Remake", price: 3999, discount: 0, tag: "Sci-Fi", image: game3 },
      { id: 4, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game4 },
      { id: 29, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game5 },
      { id: 30, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game6 },
      { id: 1, title: "Resident Evil Village", price: 2999, discount: 15, tag: "Horror", image: game1 },
      { id: 2, title: "The Last of Us Part II", price: 3499, discount: 10, tag: "Survival", image: game2 },
      { id: 3, title: "Dead Space Remake", price: 3999, discount: 0, tag: "Sci-Fi", image: game3 },
      { id: 4, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game4 },
      { id: 29, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game5 },
      { id: 30, title: "Alan Wake 2", price: 3299, discount: 5, tag: "Psychological", image: game6 },
    ],

    // Racing games (index 1)
    [
      { id: 5, title: "Forza Horizon 5", price: 3499, discount: 20, tag: "Open World", image: game4 },
      { id: 6, title: "Need for Speed Unbound", price: 2999, discount: 25, tag: "Arcade", image: game2 },
      { id: 7, title: "Gran Turismo 7", price: 3799, discount: 10, tag: "Simulation", image: game1 },
      { id: 8, title: "Gran Turismo 7", price: 3799, discount: 10, tag: "Simulation", image: game3 },
      { id: 31, title: "F1 2023", price: 3599, discount: 15, tag: "Simulation", image: game4 }
    ],

    // Fighting games (index 2)
    [
      { id: 9, title: "Street Fighter 6", price: 3499, discount: 0, tag: "Competitive", image: game5 },
      { id: 10, title: "Mortal Kombat 1", price: 3999, discount: 5, tag: "Gore", image: game2 },
      { id: 11, title: "Tekken 8", price: 3799, discount: 0, tag: "3D Fighter", image: game6 },
      { id: 12, title: "Dragon Ball FighterZ", price: 1999, discount: 30, tag: "Anime", image: game1 }
    ],

    // Adventure games (index 3)
    [
      { id: 13, title: "The Legend of Zelda: Tears of the Kingdom", price: 4999, discount: 0, tag: "Open World", image: game3 },
      { id: 14, title: "God of War Ragnarök", price: 3999, discount: 10, tag: "Action", image: game1 },
      { id: 15, title: "Hogwarts Legacy", price: 4499, discount: 15, tag: "RPG", image: game2 },
      { id: 16, title: "Elden Ring", price: 3499, discount: 20, tag: "Souls-like", image: game6 }
    ],

    // Strategy games (index 4)
    [
      { id: 17, title: "Civilization VI", price: 1999, discount: 50, tag: "Turn-based", image: game5 },
      { id: 18, title: "Total War: Warhammer III", price: 3499, discount: 25, tag: "RTS", image: game2 },
      { id: 19, title: "XCOM 2", price: 1499, discount: 60, tag: "Tactical", image: game6 },
      { id: 20, title: "Age of Empires IV", price: 2499, discount: 30, tag: "Historical", image: game4 }
    ],

    // Sports games (index 5)
    [
      { id: 21, title: "EA Sports FC 24", price: 3999, discount: 10, tag: "Football", image: game1 },
      { id: 22, title: "NBA 2K24", price: 4499, discount: 15, tag: "Basketball", image: game2 },
      { id: 23, title: "WWE 2K23", price: 3499, discount: 20, tag: "Wrestling", image: game4 },
      { id: 24, title: "FIFA 23", price: 2999, discount: 40, tag: "Football", image: game3 }
    ],

    // Puzzle games (index 6)
    [
      { id: 25, title: "Portal 2", price: 999, discount: 75, tag: "First-person", image: game3 },
      { id: 26, title: "The Witness", price: 1499, discount: 50, tag: "Exploration", image: game6 },
      { id: 27, title: "Tetris Effect: Connected", price: 1999, discount: 30, tag: "Classic", image: game4 },
      { id: 28, title: "It Takes Two", price: 2499, discount: 20, tag: "Co-op", image: game2 }
    ]
  ];

  const handle = (cate) => {
     setActiveTab(cate)
     if(cate === null){
        setMainGameData(gameData)
     }
     else{
       const filter = gameData?.filter((ele)=>{
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

  return (
    <>
      <section className="">
        <div className="relative w-full">
          <Swiper
            modules={[EffectFade, Pagination, Autoplay]}
            effect="fade"
            speed={1200}
            slidesPerView={1}
            pagination={{
              clickable: true
            }}
            autoplay={{
              delay: 5000
            }}
            loop={true}
            className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]"
          >
            <SwiperSlide>
              <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                <img
                  src={ad1}
                  alt="Game 1"
                  className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                <img
                  src={ad5}
                  alt="Game 1"
                  className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                <img
                  src={ad2}
                  alt="Game 2"
                  className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                <img
                  src={ad3}
                  alt="Game 3"
                  className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                <img
                  src={ad4}
                  alt="Game 4"
                  className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className=" mx-auto flex flex-col items-center sm:max-w-full">
          <div className='py-4 sm:py-6 md:py-8 lg:py-10 w-full'>
            {/* Tab buttons */}
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10  max-w-[95%] md:max-w-[85%]  mx-auto gap-2 sm:gap-3 md:gap-4 px-4 sm:px-0">
              {/* All Categories Button */}
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
                  key={element?._id}
                  className={`
                   px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
                   rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
                   transition-all duration-200 ease-out
                   border border-transparent
                   whitespace-nowrap
                   ${activeTab === element?.categoryName
                     ? 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
                     : 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5'
                   }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                 `}
                  onClick={() =>  handle(element?.categoryName)}
                >
                  {element?.categoryName}
                </button>
              ))}
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
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                          isBeginning
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
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                          isEnd
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
                      500: { slidesPerView: 1.5, spaceBetween: 10 },
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
                              <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                                <img
                                  src={element?.cover_image?.url}
                                  alt={element?.title}
                                  className='w-full h-full object-cover'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                                <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                                  {/* Tags can be added here if needed */}
                                </div>

                                <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                                  <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{element?.title}</p>
                                </div>
                              </div>

                              <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                                <div>
                                  <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                                  <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>
                                    ₹{element?.platforms?.windows?.price?.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-gradient-to-r capitalize from-[#621df2] to-[#b191ff] text-white font-medium transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                                  Buy
                                  <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                                </button>
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