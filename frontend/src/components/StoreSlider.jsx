import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../Redux/Slice/game.slice";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import HomesliderSkeleton from "../lazyLoader/HomesliderSkeleton";

export default function StoreSlider() {
    const dispatch = useDispatch();

    // Remove duplicate API call - data is already loaded in Store component
    // useEffect(() => {
    //     dispatch(getAllGames());
    // }, [dispatch]);

    const games = useSelector((state) => state.game.games) || [];

    // Limit to 5 games for left slider
    const leftGames = games.slice(0, 5);

    const [leftIndex, setLeftIndex] = useState(0);
    const [centerGame, setCenterGame] = useState(null);

    const displayIntervalRef = useRef(null);

    const getImageUrl = (slide) => {
        if (slide?.cover_image?.url) return slide.cover_image.url;
        return "https://via.placeholder.com/800x600/333333/ffffff?text=No+Image";
    };

    // Auto change active slide every 5s
    useEffect(() => {
        if (leftGames.length > 0) {
            displayIntervalRef.current &&
                clearInterval(displayIntervalRef.current);
            displayIntervalRef.current = setInterval(() => {
                setLeftIndex((prev) => (prev + 1) % leftGames.length);
            }, 5000);
        }

        return () => clearInterval(displayIntervalRef.current);
    }, [leftGames.length]);

    // Update center hero based on the active (middle) left slide
    useEffect(() => {
        if (leftGames.length > 0) {
            const centerIdx = (leftIndex + 2) % leftGames.length;
            setCenterGame(leftGames[centerIdx]);
        }
    }, [leftIndex, leftGames]);

    // Initialize with first center element
    useEffect(() => {
        if (leftGames.length > 0 && !centerGame) {
            const centerIdx = (leftIndex + 2) % leftGames.length;
            setCenterGame(leftGames[centerIdx]);
        }
    }, [leftGames, centerGame, leftIndex]);

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
                    <div className="h-[500px] xl:h-[700px] overflow-hidden">
                        <div className="h-full flex flex-col justify-center p-4 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => {
                                // Infinite scroll index calculation
                                const gameIndex =
                                    (leftIndex + i) % leftGames.length;
                                const game = leftGames[gameIndex];
                                const img = getImageUrl(game);

                                // Active = center (always index 2)
                                const isActive = i === 2;

                                return (
                                    <button
                                        key={game._id || gameIndex}
                                        onClick={() => {
                                            setLeftIndex(gameIndex);
                                        }}
                                        className={`block w-full rounded-md overflow-hidden transition-all duration-500 
                                            drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]
                                            ${isActive
                                                ? "scale-110 opacity-100 z-10 "
                                                : "opacity-40 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                                            }
                                        `}
                                        aria-current={
                                            isActive ? "true" : "false"
                                        }
                                    >
                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                                            <img
                                                src={img}
                                                alt={game.title || "Game"}
                                                className={`w-full h-full object-cover rounded transition-transform duration-500 ${isActive
                                                    ? "scale-110"
                                                    : "scale-90"
                                                    }`}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Center hero  */}
                <div className="col-span-12 md:col-span-9 xl:col-span-10">
                    <div className="relative h-[500px] xl:h-[700px] rounded-lg overflow-hidden border border-white/10">
                        <img
                            src={activeCenterImage}
                            alt={activeCenterGame?.title || "Game"}
                            className="absolute inset-0 w-full h-full object-cover "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="relative z-[1] h-full flex items-end p-6 md:p-8 lg:p-10 w-full">
                            <div className="max-w-2xl">
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
                                    {activeCenterGame?.title || "Untitled"}
                                </h2>
                                <p className="text-white/80 text-sm md:text-base lg:text-lg line-clamp-3 mb-4">
                                    {(activeCenterGame?.description ||
                                        "No description available").slice(
                                            0,
                                            180
                                        )}
                                    {activeCenterGame?.description &&
                                        activeCenterGame.description.length > 180
                                        ? "…"
                                        : ""}
                                </p>
                                <Link
                                    to={"/single/" + (activeCenterGame?._id || "")}
                                >
                                    <button className="xl:text-base md:text-sm text-xs p-2 md:px-8 px-4 bg-white text-black rounded border hover:bg-transparent hover:text-white">
                                        Learn More
                                    </button>
                                </Link>
                            </div>
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
                    {(games && games.length > 0 ? games : [])
                        .slice(0, 6)
                        .map((game, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative md:flex w-full md:h-[500px] h-[600px] xl:h-[700px] overflow-hidden bg-[#141414]">
                                    <div className="blob md:w-[60%] w-full h-[600px]">
                                        <img
                                            src={game?.cover_image?.url}
                                            alt={game.title || `Game ${index + 1}`}
                                            className="w-full lg:h-[600px] xl:h-[700px] object-center object-cover"
                                        />
                                    </div>
                                    <div className="md:w-[40%] w-full md:h-full h-[40%] flex flex-col justify-center 3xl:px-16 xl:px-8 px-4 sp_font">
                                        <div className="xl:text-[50px] md:text-[28px] text-[24px] z-10 ">
                                            {game.title}
                                        </div>
                                        <p className="xl:text-base md:text-sm text-xs text-[#ccc]">
                                            {(game.description || "").slice(
                                                0,
                                                200
                                            )}
                                            {game.description &&
                                                game.description.length > 200
                                                ? "…"
                                                : ""}
                                        </p>
                                        <Link
                                            to={"/single/" + game._id}
                                            className="flex justify-center mt-5"
                                        >
                                            <button className="xl:text-base md:text-sm text-xs p-2 md:px-8 px-4 bg-white text-black rounded mx-auto border hover:bg-transparent hover:text-white">
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
