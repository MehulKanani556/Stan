import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../Redux/Slice/game.slice";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
import HomesliderSkeleton from '../lazyLoader/HomesliderSkeleton';

export default function HomeSlider() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const games = useSelector((state) => state.game.games) || [];

    // Limit to 5 games for left slider
    const leftGames = games.slice(0, 5);

    const [leftIndex, setLeftIndex] = useState(0);
    const [centerGame, setCenterGame] = useState(null);

    const leftItemRefs = useRef([]);
    const displayIntervalRef = useRef(null);

    const getImageUrl = (slide) => {
        if (slide?.cover_image?.url) return slide.cover_image.url;
        return "https://via.placeholder.com/800x600/333333/ffffff?text=No+Image";
    };

    // Auto change active slide every 5s
    useEffect(() => {
        if (leftGames.length > 0) {
            displayIntervalRef.current && clearInterval(displayIntervalRef.current);
            displayIntervalRef.current = setInterval(() => {
                setLeftIndex((prev) => (prev + 1) % leftGames.length);
            }, 5000);
        }

        return () => clearInterval(displayIntervalRef.current);
    }, [leftGames.length]);

    // Update center game when left index changes
    useEffect(() => {
        if (leftGames.length > 0) {
            setCenterGame(leftGames[leftIndex]);
        }
    }, [leftIndex, leftGames]);

    // Initialize with first left game
    useEffect(() => {
        if (leftGames.length > 0 && !centerGame) {
            setCenterGame(leftGames[0]);
        }
    }, [leftGames, centerGame]);

    if (!games || games.length === 0) {
        return <HomesliderSkeleton />;
    }

    const activeCenterGame = centerGame || leftGames[leftIndex] || games[0];
    const activeCenterImage = getImageUrl(activeCenterGame);

    return (
        <div className="sp_slider ">

            {/* Desktop layout (Left slider + Center hero only) */}
            <div className="hidden md:grid grid-cols-12 gap-4 w-full min-h-[500px] lg:min-h-[500px] xl:min-h-[700px] ">
                {/* Left slider */}
                <div className="col-span-12 md:col-span-3 xl:col-span-2">
                    <div className="h-[500px] xl:h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex flex-col space-y-3">
                            {leftGames.map((game, index) => {
                                const img = getImageUrl(game);
                                const isActive = index === leftIndex;
                                return (
                                    <motion.button
                                        key={game._id || index}
                                        onClick={() => {
                                            setLeftIndex(index);
                                            setCenterGame(leftGames[index]);
                                        }}
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.05 : 1,
                                            opacity: isActive ? 1 : 0.6,
                                            boxShadow: isActive
                                                ? "0px 0px 20px rgba(255,255,255,0.6)"
                                                : "0px 0px 0px rgba(0,0,0,0)"
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="block w-full rounded-md overflow-hidden bg-black/40"
                                    >
                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                                            <img
                                                src={img}
                                                alt={game.title || "Game"}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Center hero with animation */}
                <div className="col-span-12 md:col-span-9 xl:col-span-10">
                    <div className="relative h-[500px] xl:h-[700px] rounded-lg overflow-hidden border border-white/10">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeCenterGame?._id || activeCenterImage}
                                src={activeCenterImage}
                                alt={activeCenterGame?.title || 'Game'}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6 }}
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <motion.div
                            key={activeCenterGame?._id}
                            className="relative z-[1] h-full flex items-end p-6 md:p-8 lg:p-10 w-full"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="max-w-2xl">
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
                                    {activeCenterGame?.title || 'Untitled'}
                                </h2>
                                <p className="text-white/80 text-sm md:text-base lg:text-lg line-clamp-3 mb-4">
                                    {(activeCenterGame?.description || 'No description available').slice(0, 180)}
                                    {activeCenterGame?.description && activeCenterGame.description.length > 180 ? '…' : ''}
                                </p>
                                <Link to={'/single/' + (activeCenterGame?._id || '')}>
                                    <button className='xl:text-base md:text-sm text-xs p-2 md:px-8 px-4 bg-white text-black rounded border hover:bg-transparent hover:text-white'>
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
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
