import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { getReviewData } from "../Redux/Slice/game.slice";
import { decryptData } from "../Utils/encryption";


const reviews = [
  { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", game: "Resident Evil Village", rating: 5, review: "An absolute masterpiece! The atmosphere is chilling, and the storyline kept me hooked till the end." },
  { id: 2, name: "Maria Gomez", avatar: "https://i.pravatar.cc/150?img=2", game: "The Last of Us Part II", rating: 4, review: "Incredible storytelling and emotional depth. Gameplay is smooth, but pacing could have been tighter." },
  { id: 3, name: "James Lee", avatar: "https://i.pravatar.cc/150?img=3", game: "Minecraft", rating: 5, review: "Endless creativity! It never gets old. Perfect for solo adventures or playing with friends." },
  { id: 4, name: "Sophia Turner", avatar: "https://i.pravatar.cc/150?img=4", game: "Elden Ring", rating: 5, review: "A breathtaking open world with challenging combat. Easily one of the best games I’ve ever played." },
  { id: 5, name: "Ethan Brown", avatar: "https://i.pravatar.cc/150?img=5", game: "Cyberpunk 2077", rating: 4, review: "Amazing world-building and graphics. Still has some bugs, but definitely enjoyable." },
];

export default function ReviewHomeSlick() {
  const [slidesToShow, setSlidesToShow] = useState(3);
  const dispatch = useDispatch()

  const revieData = useSelector((state)=> state?.game?.reviewData?.result?.ratings)

  console.log("CVCVCVC" , revieData);
  

  useEffect(()=>{
    dispatch(getReviewData())
  },[])

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1280) setSlidesToShow(3);
      else if (window.innerWidth >= 1024) setSlidesToShow(3);
      else setSlidesToShow(1);
    };
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    infinite: true,
    centerMode: true,
    centerPadding: "0px",
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    cssEase: "ease-in-out",
    arrows: false,
    dots: false,
    slidesToShow, // controlled by state + useEffect
    responsive: [
      {
        breakpoint: 1536, // ≥1536px (2XL screens)
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 1280, // ≥1280px (XL screens)
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 1024, // ≥1024px (LG screens)
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768, // ≥768px (MD screens)
        settings: { slidesToShow: 1 }
      },
      {
        breakpoint: 640, // ≥640px (SM screens)
        settings: { slidesToShow: 1 }
      },
      {
        breakpoint: 480, // extra small phones
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <section className="relative ds_reviewHome_slide py-14 text-white bg-[#101012] overflow-hidden">
      <h2 className="md:text-[36px] text-[28px] font-bold text-center mb-10">
        Player Reviews
      </h2>

      <div className="mx-auto w-[94%] md:w-[86%]">
        <Slider {...settings} className="ds_review_slider">
          {revieData?.map((r) => (
            <div key={r?._id} className="px-2 sm:px-3">
              <motion.div
                className="card-wrapper"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card">
                  <div className="card__bg" aria-hidden />
                  <div className="card__shine" aria-hidden />

                  <div className="flex flex-col items-center">
                    <motion.img
                      // src={r?.avatar}
                      // alt={r?.name}
                      className="w-[96px] h-[96px] rounded-full object-cover border-2 border-[#902F7E] shadow-[0_8px_24px_rgba(144,47,126,0.35)]"
                    />
                    <div className="text-center mt-3">
                      <p className="font-semibold text-white text-lg">{decryptData(r?.user?.name)}</p>
                      <p className="text-sm text-gray-400">{r?.game?.title || ""}</p>
                    </div>
                  </div>

                  <div className="flex mb-3 mt-6 justify-center">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <FaStar
                        key={j}
                        className={`h-5 w-5 mx-1 ${
                          j < r?.rating ? "text-yellow-400" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-[15px] leading-relaxed mt-2 text-center">
                    {r?.review}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .ds_reviewHome_slide .slick-slide {
          transform: scale(0.78);
          opacity: 0.5;
          transition: all 0.5s ease;
          padding: 10px;
        }
        .ds_reviewHome_slide .slick-center {
          transform: scale(1);
          opacity: 1;
        }
        .ds_reviewHome_slide .card {
          position: relative;
          width: 100%;
          min-height: 320px;
          border-radius: 18px;
          border: 1px solid #2d2d2d;
          padding: 18px;
          background: linear-gradient(145deg, #161616 0%, #1b1b1b 100%);
          box-shadow: 0 20px 50px rgba(0,0,0,0.55);
          overflow: hidden;
        }
        @media (min-width:768px){
          .ds_reviewHome_slide .card{ min-height: 360px; padding: 22px; }
        }
        .ds_reviewHome_slide .card__bg {
          position: absolute; inset: 0; border-radius: 18px; overflow: hidden; pointer-events: none;
          background: radial-gradient(600px 220px at 30% 0%, rgba(144,47,126,0.2), transparent 55%),
                      radial-gradient(600px 220px at 70% 100%, rgba(111,53,255,0.18), transparent 55%);
          transform: scale(1.06);
        }
        .ds_reviewHome_slide .card__shine {
          position: absolute; inset: 0; border-radius: 18px; pointer-events: none;
        }
        .ds_reviewHome_slide .card__shine::before {
          content: ""; position: absolute; inset: -40%; background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.09) 50%, transparent 60%);
          transform: translateX(-60%) rotate(10deg);
          animation: sheen 4.6s linear infinite;
        }
        @keyframes sheen { to { transform: translateX(60%) rotate(10deg); } }
      `}</style>
    </section>
  );
}
