import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGames } from "../Redux/Slice/game.slice";
// import "./style.css";

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

export default function Demo() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    const games = useSelector((state) => state.game.games)?.slice(10, 15) || [];
    const listRef = useRef(null);
    const carouselRef = useRef(null);
    const timeRunning = 3000;
    const timeAutoNext = 7000;
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
        <div className="carousel" ref={carouselRef}>
            <div className="list" ref={listRef}>
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
                                background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                                zIndex: 1
                            }}></div>
                            
                            <div className="content" style={{ position: 'relative', zIndex: 2 }}>
                                <div className="name">{slide.title || slide.name || 'Untitled'}</div>
                                <div className="des">{slide.desc || slide.description || 'No description available'}</div>
                                <div className="btn">
                                    <button>See More</button>
                                    <button>Subscribe</button>
                                </div>
                            </div>

                            <img 
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

            <div className="arrows">
                <button className="prev" onClick={() => showSlider("prev")}>&lt;</button>
                <button className="next" onClick={() => showSlider("next")}>&gt;</button>
            </div>

            <div className="timeRunning" ref={timeBarRef}></div>
        </div>
    );
}