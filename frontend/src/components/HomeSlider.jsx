import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../Redux/Slice/game.slice";
import { Link } from "react-router-dom";
// import "./style.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";


import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
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
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const games = useSelector((state) => state.game.games)?.slice(5, 15) || [];
    const listRef = useRef(null);
    const carouselRef = useRef(null);
    const timeRunning = 3000;
    const timeAutoNext = 3000;
    const runTimeOut = useRef(null);
    const runNextAuto = useRef(null);
    const timeBarRef = useRef(null);

    // Function to get image URL with fallback
    const getImageUrl = (slide) => {
        // Check if slide has cover_image url
        if (slide?.cover_image?.url) {
            return slide.cover_image.url;
        }
        // Fallback to default image if no cover_image
        return "https://via.placeholder.com/800x600/333333/ffffff?text=No+Image";
    };

    const resetTimeAnimation = () => {
        if (timeBarRef.current) {
            timeBarRef.current.style.animation = "none";
            void timeBarRef.current.offsetHeight;
            timeBarRef.current.style.animation = null;
            timeBarRef.current.style.animation = "runningTime 7s linear 1 forwards";
        }
    };

    const showSlider = (type) => {
        const list = listRef.current;
        const carousel = carouselRef.current;
        if (!list || !carousel) return;

        const items = list.querySelectorAll(".item");

        // Check if items exist and have length
        if (!items || items.length === 0) return;

        if (type === "next") {
            // Check if first item exists before trying to append it
            if (items[0]) {
                list.appendChild(items[0]);
                carousel.classList.add("next");
            }
        } else {
            // Check if last item exists before trying to prepend it
            if (items[items.length - 1]) {
                list.prepend(items[items.length - 1]);
                carousel.classList.add("prev");
            }
        }

        clearTimeout(runTimeOut.current);
        runTimeOut.current = setTimeout(() => {
            carousel.classList.remove("next");
            carousel.classList.remove("prev");
        }, timeRunning);

        clearTimeout(runNextAuto.current);
        runNextAuto.current = setTimeout(() => {
            showSlider("next");
        }, timeAutoNext);

        resetTimeAnimation();
    };

    useEffect(() => {
        // Only start auto-slide if games are loaded
        if (games && games.length > 0) {
            runNextAuto.current = setTimeout(() => {
                showSlider("next");
            }, timeAutoNext);
            resetTimeAnimation();
        }

        return () => {
            clearTimeout(runNextAuto.current);
            clearTimeout(runTimeOut.current);
        };
    }, [games]);

    // Don't render carousel until games are loaded
    if (!games || games.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="sp_slider">
        <div className="carousel w-full h-[500px]  md:h-[500px] lg:h-[500px] xl:h-[700px]" ref={carouselRef}>
            <div className="list hidden md:flex" ref={listRef}>
                {games.map((slide, i) => {
                    const imageUrl = getImageUrl(slide);
                    console.log('img', i, imageUrl);

                    return (
                        <div
                            className="item"
                            style={{
                                backgroundImage: `url("${imageUrl}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                minHeight: '10px'
                            }}
                            key={slide.id || i}
                        >
                            <div className="image-overlay" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 1
                            }}></div>
                            <div className="blob md:w-[50%] w-full h-[600px] absolute bottom-0 right-0 bg-[#141414]/70 z-[2] bg-[0,0,0,0.1] ms-0" >
                                <div className="content w-[80%] m-auto  w-full z-10  md:h-full h-full flex flex-col lg:justify-center 3xl:px-16 xl:px-8 px-4 sp_font py-10" style={{ position: 'relative', zIndex: 2 }}>
                                    <div className="name xl:text-[50px] md:text-[28px] text-[24px] z-10">{slide.title || slide.name || 'Untitled'}</div>
                                    <div className="des xl:text-base md:text-sm  text-xs text-[#ccc]">{slide.description?.slice(0, 100) + '...' || 'No description available'}</div>
                                    <Link to={'/single/' + slide._id} className='flex justify-center mt-5'>
                                        <button className='btn xl:text-base md:text-sm  text-xs  p-2 md:px-8 px-4 bg-white text-black rounded mx-auto border hover:bg-transparent hover:text-white'>
                                            Learn More
                                        </button>
                                    </Link>
                                </div>
                            </div>



                            <img
                                className=""
                                src={imageUrl}
                                alt={slide.title || slide.name || 'Game image'}
                                style={{ display: 'none' }}
                                onError={() => console.warn('Image failed to load:', imageUrl)}
                                onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                            />
                        </div>
                    );
                })}
            </div>
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
                    {games && games.length > 0 ? (
                        games.slice(0, 5).map((game, index) => (
                            <SwiperSlide key={index}>
                                <div className="relative md:flex w-full md:h-[500px]  h-[600px] xl:h-[700px] overflow-hidden bg-[#141414]">
                                    <div className='blob md:w-[60%] w-full h-[600px]' >
                                        <img
                                            src={game?.cover_image?.url}
                                            alt={game.title || `Game ${index + 1}`}
                                            className="w-full lg:h-[600px] xl:h-[700px] object-center object-cover "
                                        />
                                        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div> */}

                                    </div>

                                    <div className='md:w-[40%] w-full  md:h-full h-[40%] flex flex-col justify-center 3xl:px-16 xl:px-8 px-4 sp_font  '>
                                        <div className="xl:text-[50px] md:text-[28px] text-[24px] z-10 ">{game.title}</div>
                                        <p className='xl:text-base md:text-sm  text-xs text-[#ccc]'>
                                            {game.description.slice(0, 200) + '...'}
                                        </p>
                                        <Link to={'/single/' + game._id} className='flex justify-center mt-5'>
                                            <button className='xl:text-base md:text-sm  text-xs  p-2 md:px-8 px-4 bg-white text-black rounded mx-auto border hover:bg-transparent hover:text-white'>
                                                Learn More
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <p className="text-center text-white py-10">No games available</p>
                    )}
                </Swiper>
            </div>
            <div className="arrows hidden">
                <button className="prev hidden md:block" onClick={() => showSlider("prev")}>&lt;</button>
                <button className="next hidden  md:block" onClick={() => showSlider("next")}>&gt;</button>
            </div>


            {/* old slider */}
            {/* <div className="relative w-full sp_slider_dot ">
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-white">Loading games...</span>
              </div>
            ) : games && games.length > 0 ? (
              games.slice(0, 5).map((game, index) => (
                <SwiperSlide key={index}>
                  <div className="relative md:flex w-full md:h-[500px]  h-[600px] xl:h-[700px] overflow-hidden bg-[#141414]">
                    <div className='blob md:w-[60%] w-full h-[600px]' >
                      <img
                        src={game?.cover_image?.url || game1}
                        alt={game.title || `Game ${index + 1}`}
                        className="w-full lg:h-[600px] xl:h-[700px] object-center object-cover "
                      />

                    </div>

                    <div className='md:w-[40%] w-full  md:h-full h-[40%] flex flex-col justify-center 3xl:px-16 xl:px-8 px-4 sp_font  '>
                      <div className="xl:text-[50px] md:text-[28px] text-[24px] z-10 ">{game.title}</div>
                      <p className='xl:text-base md:text-sm  text-xs text-[#ccc]'>
                        {game.description.slice(0, 200) + '...'}
                      </p>
                      <Link to={'/single/' + game._id} className='flex justify-center mt-5'>
                        <button className='xl:text-base md:text-sm  text-xs  p-2 md:px-8 px-4 bg-white text-black rounded mx-auto border hover:bg-transparent hover:text-white'>
                          Learn More
                        </button>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-center text-white py-10">No games available</p>
            )}
          </Swiper>
        </div> */}
            {/* <div className="timeRunning" ref={timeBarRef}></div> */}
        </div>
        </div>
    );
}