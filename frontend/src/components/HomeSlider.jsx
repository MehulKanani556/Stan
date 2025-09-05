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
const slides = [
    {
        img: "https://u.cubeupload.com/Leo21/eagel1.jpg",
        name: "EAGLE",
        desc: "Eagles are majestic birds of prey known for their incredible strength, sharp vision, and powerful talons"
    },
    {
        img: "https://u.cubeupload.com/Leo21/owl1.jpg",
        name: "OWL",
        desc: "Owls are nocturnal birds of prey, shrouded in an aura of mystery and wisdom"
    },
    {
        img: "https://u.cubeupload.com/Leo21/crow.jpg",
        name: "CROW",
        desc: "Crows are highly intelligent and adaptable birds known for their glossy black plumage and distinctive calls."
    },
    {
        img: "https://u.cubeupload.com/Leo21/butterfly1.jpeg",
        name: "BUTTERFLY",
        desc: "Butterflies, with their vibrant wings and graceful flight, are a symbol of transformation and beauty in the natural world"
    },
    {
        img: "https://u.cubeupload.com/Leo21/owl2.jpg",
        name: "OWL",
        desc: "Owls have long been associated with mystery, wisdom, and the supernatural in various cultures"
    },
    {
        img: "https://u.cubeupload.com/Leo21/eagel3.jpg",
        name: "EAGLE",
        desc: "Eagles represent freedom, power, and nobility in many cultures"
    },
    {
        img: "https://u.cubeupload.com/Leo21/kingfirser2.jpeg",
        name: "KINGFISHER",
        desc: "Kingfishers, with their dazzling plumage, are vibrant jewels of the aquatic world"
    },
    {
        img: "https://u.cubeupload.com/Leo21/parrot2.jpg",
        name: "PARROT",
        desc: "Parrots are social creatures, often living in flocks and exhibiting complex communication patterns"
    },
    {
        img: "https://u.cubeupload.com/Leo21/heron.jpeg",
        name: "HERON",
        desc: "Herons are known for their striking appearance, often characterized by graceful necks and stilt-like legs"
    },
    {
        img: "https://u.cubeupload.com/Leo21/butterfly2.jpg",
        name: "BUTTERFLY",
        desc: "Butterflies, with their delicate wings and vibrant colors, are among the most enchanting creatures in the natural world"
    },
    {
        img: "https://u.cubeupload.com/Leo21/parrot1.jpg",
        name: "PARROT",
        desc: "Parrots are known for their long lifespans, with some species living for several decades"
    }
];

export default function HomeSlider() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const games = useSelector((state) => state.game.games) || [];

    
    const leftGames = games.filter((_, index) => index % 2 === 0);
    const rightGames = games.filter((_, index) => index % 2 === 1);

    const [leftIndex, setLeftIndex] = useState(0);
    const [rightIndex, setRightIndex] = useState(0);
    const [centerGame, setCenterGame] = useState(null);
    const [centerSource, setCenterSource] = useState('left'); 
    const rightLockTimeoutRef = useRef(null);

    const leftItemRefs = useRef([]);
    const rightItemRefs = useRef([]);

    const leftIntervalRef = useRef(null);
    const rightIntervalRef = useRef(null);

    const getImageUrl = (slide) => {
        if (slide?.cover_image?.url) return slide.cover_image.url;
        return "https://via.placeholder.com/800x600/333333/ffffff?text=No+Image";
    };

    
    useEffect(() => {
        if (leftGames.length > 0) {
            leftIntervalRef.current && clearInterval(leftIntervalRef.current);
            leftIntervalRef.current = setInterval(() => {
                setLeftIndex((prev) => (prev + 1) % leftGames.length);
            }, 5000);
        }
        if (rightGames.length > 0) {
            rightIntervalRef.current && clearInterval(rightIntervalRef.current);
            rightIntervalRef.current = setInterval(() => {
                setRightIndex((prev) => (prev + 1) % rightGames.length);
            }, 5000);
        }

        return () => {
            clearInterval(leftIntervalRef.current);
            clearInterval(rightIntervalRef.current);
        };
    }, [leftGames.length, rightGames.length]);

    
    useEffect(() => {
        if (leftGames.length > 0 && centerSource !== 'right') {
            setCenterGame(leftGames[leftIndex]);
        }
    }, [leftIndex, leftGames, centerSource]);

    
    useEffect(() => {
        const el = leftItemRefs.current[leftIndex];
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [leftIndex]);

    useEffect(() => {
        const el = rightItemRefs.current[rightIndex];
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [rightIndex]);

    if (!games || games.length === 0) {
        return <HomesliderSkeleton />;
    }

    const activeCenterGame = centerGame || leftGames[leftIndex] || games[0];
    const activeCenterImage = getImageUrl(activeCenterGame);

    return (
        <div className="sp_slider">
          
            <div className="hidden md:grid grid-cols-12 gap-4 w-full min-h-[500px] lg:min-h-[500px] xl:min-h-[700px]">
                {/* Left slider */}
                <div className="col-span-12 md:col-span-3 xl:col-span-2">
                    <div className="h-[500px] xl:h-[700px] overflow-hidden ">
                        <div className="h-full overflow-y-auto no-scrollbar py-3 space-y-3 px-3">
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
                                        className={`block w-full rounded-md overflow-hidden bg-black/40 transition-transform ${isActive && centerSource === 'left' ? 'ring-2 ring-white' : 'hover:scale-[1.01]'}`}
                                        aria-current={isActive ? 'true' : 'false'}
                                    >
                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                                            <img src={img} alt={game.title || 'Game'} className="w-full h-full object-cover rounded" />
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
                    <div className="h-[500px] xl:h-[700px] overflow-hidden ">
                        <div className="h-full overflow-y-auto no-scrollbar py-3 space-y-3 px-3">
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
                                        className={`block w-full rounded-md overflow-hidden bg-black/40 transition-transform ${isActive && centerSource === 'right' ? 'ring-2 ring-white' : 'hover:scale-[1.01]'}`}
                                        aria-current={isActive ? 'true' : 'false'}
                                    >
                                        <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
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