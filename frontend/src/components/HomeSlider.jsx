import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../Redux/Slice/game.slice";
import { Link } from "react-router-dom";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import HomesliderSkeleton from '../lazyLoader/HomesliderSkeleton';

export default function HomeSlider() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const games = useSelector((state) => state.game.games) || [];

    // Limit to 5 games on each side
    const leftGames = games.filter((_, index) => index % 2 === 0).slice(0, 5);
    const rightGames = games.filter((_, index) => index % 2 === 1).slice(0, 5);

    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(0);
    const [centerGame, setCenterGame] = useState(null);
    const [centerSource, setCenterSource] = useState('left');
    const [currentDisplayIndex, setCurrentDisplayIndex] = useState(0);
    const rightLockTimeoutRef = useRef(null);

    const leftItemRefs = useRef([]);
    const rightItemRefs = useRef([]);

    const displayIntervalRef = useRef(null);

    const getImageUrl = (slide) => {
        if (slide?.cover_image?.url) return slide.cover_image.url;
        return "https://via.placeholder.com/800x600/333333/ffffff?text=No+Image";
    };


    // Sequential display: left games first, then right games
    useEffect(() => {
        if (leftGames.length > 0 || rightGames.length > 0) {
            displayIntervalRef.current && clearInterval(displayIntervalRef.current);
            displayIntervalRef.current = setInterval(() => {
                setCurrentDisplayIndex((prev) => {
                    const totalGames = leftGames.length + rightGames.length;
                    if (totalGames === 0) return 0;

                    const nextIndex = (prev + 1) % totalGames;

                    if (nextIndex < leftGames.length) {
                        // Show left side game
                        setLeftIndex(nextIndex);
                        setCenterSource('left');
                    } else {
                        // Show right side game
                        const rightGameIndex = nextIndex - leftGames.length;
                        setRightIndex(rightGameIndex);
                        setCenterSource('right');
                    }

                    return nextIndex;
                });
            }, 5000);
        }

        return () => {
            clearInterval(displayIntervalRef.current);
        };
    }, [leftGames.length, rightGames.length]);


    // Update center game when indices or source changes
    useEffect(() => {
        if (centerSource === 'left' && leftGames.length > 0) {
            setCenterGame(leftGames[leftIndex]);
        } else if (centerSource === 'right' && rightGames.length > 0) {
            setCenterGame(rightGames[rightIndex]);
        }
    }, [leftIndex, rightIndex, centerSource, leftGames, rightGames]);

    // Initialize with first left game
    useEffect(() => {
        if (leftGames.length > 0 && !centerGame) {
            setCenterGame(leftGames[0]);
            setCenterSource('left');
        }
    }, [leftGames, centerGame]);

    if (!games || games.length === 0) {
        return <HomesliderSkeleton />;
    }

    const activeCenterGame = centerGame || leftGames[leftIndex] || games[0];
    const activeCenterImage = getImageUrl(activeCenterGame);

    return (
        <div className="sp_slider ">

            <div className="hidden md:grid grid-cols-12 gap-4 w-full min-h-[500px] lg:min-h-[500px] xl:min-h-[700px] ">
                {/* Left slider */}
                <div className="col-span-12 md:col-span-3 xl:col-span-2">
                    <div className="h-[500px] xl:h-[700px] overflow-hidden">
                        <div className="h-full flex flex-col justify-center p-4 space-y-3 ">
                            {leftGames.map((game, index) => {
                                const img = getImageUrl(game);
                                const isActive = index === leftIndex;
                                return (
                                    <button
                                        key={game._id || index}
                                        ref={(el) => (leftItemRefs.current[index] = el)}
                                        onClick={() => {
                                            setLeftIndex(index);
                                            setCenterGame(leftGames[index]);
                                            setCenterSource('left');
                                            if (rightLockTimeoutRef.current) {
                                                clearTimeout(rightLockTimeoutRef.current);
                                            }
                                        }}
                                        className={`block w-full rounded-md overflow-hidden  bg-black/40 transition-all duration-300 ${isActive && centerSource === 'left' ? 'ring-2 ring-white scale-105 z-10 relative opacity-100' : 'hover:scale-[1.02] opacity-50'}`}
                                        aria-current={isActive ? 'true' : 'false'}
                                    >
                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                                            <img src={img} alt={game.title || 'Game'} className=" w-full h-full object-cover rounded" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Center hero  */}
                <div className="col-span-12 md:col-span-6 xl:col-span-8">
                    <div className="relative h-[500px] xl:h-[700px] rounded-lg overflow-hidden border border-white/10">
                        <img src={activeCenterImage} alt={activeCenterGame?.title || 'Game'} className="absolute inset-0 w-full h-full object-cover " />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="relative z-[1] h-full flex items-end p-6 md:p-8 lg:p-10">
                            <div className="max-w-2xl">
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">{activeCenterGame?.title || 'Untitled'}</h2>
                                <p className="text-white/80 text-sm md:text-base lg:text-lg line-clamp-3 mb-4">{(activeCenterGame?.description || 'No description available').slice(0, 180)}{activeCenterGame?.description && activeCenterGame.description.length > 180 ? '…' : ''}</p>
                                <Link to={'/single/' + (activeCenterGame?._id || '')}>
                                    <button className='xl:text-base md:text-sm text-xs p-2 md:px-8 px-4 bg-white text-black rounded border hover:bg-transparent hover:text-white'>
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right slider */}
                <div className="col-span-12 md:col-span-3 xl:col-span-2">
                    <div className="h-[500px] xl:h-[700px] overflow-hidden">
                        <div className="h-full flex flex-col justify-center py-4 space-y-3 px-4">
                            {rightGames.map((game, index) => {
                                const img = getImageUrl(game);
                                const isActive = index === rightIndex;
                                return (
                                    <button
                                        key={game._id || index}
                                        ref={(el) => (rightItemRefs.current[index] = el)}
                                        onClick={() => {
                                            setRightIndex(index);
                                            setCenterGame(game);
                                            setCenterSource('right');
                                            if (rightLockTimeoutRef.current) {
                                                clearTimeout(rightLockTimeoutRef.current);
                                            }
                                            rightLockTimeoutRef.current = setTimeout(() => {
                                                setCenterSource('left');
                                            }, 8000);
                                        }}
                                        className={`block w-full rounded-md overflow-hidden bg-black/40 transition-all duration-300 ${isActive && centerSource === 'right' ? 'ring-2 ring-white scale-105  z-10 relative opacity-100' : 'hover:scale-[1.02] opacity-50'}`}
                                        aria-current={isActive ? 'true' : 'false'}
                                    >

                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center ">
                                            <img src={img} alt={game.title || 'Game'} className="w-full h-full object-cover rounded" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile*/}
            <div className="relative w-full sp_slider_dot md:hidden">
                <Swiper
                    modules={[EffectFade, Pagination, Autoplay]}
                    effect="fade"
                    speed={1200}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                        renderBullet: (index, className) => {
                            return `<span class="${className} custom-bullet"></span>`;
                        },
                    }}
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]"
                >
                    {(games && games.length > 0 ? games : []).slice(0, 6).map((game, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative md:flex w-full md:h-[500px] h-[600px] xl:h-[700px] overflow-hidden bg-[#141414]">
                                <div className='blob md:w-[60%] w-full h-[600px]'>
                                    <img
                                        src={game?.cover_image?.url}
                                        alt={game.title || `Game ${index + 1}`}
                                        className="w-full lg:h-[600px] xl:h-[700px] object-center object-cover"
                                    />
                                </div>
                                <div className='md:w-[40%] w-full md:h-full h-[40%] flex flex-col justify-center 3xl:px-16 xl:px-8 px-4 sp_font'>
                                    <div className="xl:text-[50px] md:text-[28px] text-[24px] z-10 ">{game.title}</div>
                                    <p className='xl:text-base md:text-sm text-xs text-[#ccc]'>
                                        {(game.description || '').slice(0, 200)}{game.description && game.description.length > 200 ? '…' : ''}
                                    </p>
                                    <Link to={'/single/' + game._id} className='flex justify-center mt-5'>
                                        <button className='xl:text-base md:text-sm text-xs p-2 md:px-8 px-4 bg-white text-black rounded mx-auto border hover:bg-transparent hover:text-white'>
                                            Learn More
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}