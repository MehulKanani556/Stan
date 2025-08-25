import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPlay, FaRegStar, FaShoppingCart, FaStar, FaStarHalfAlt, FaWindows } from 'react-icons/fa'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import gta from '../images/gta.mp4'
import gta5 from '../images/gta5.jpeg'
import game from '../images/game_img.jpeg'
import game1 from '../images/game_img2.jpeg'
import game2 from '../images/game_img3.jpeg'
import game3 from '../images/game_img4.jpeg'
import game4 from '../images/game_img5.jpeg'
import gtav from '../images/gtalogo.avif'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../Redux/Slice/game.slice'
import { GoDotFill } from "react-icons/go";


const SingleGame = () => {

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const videoRefs = useRef([]);
  const [slidesToShow, setSlidesToShow] = useState(5)
  const { id } = useParams()
  const dispatch = useDispatch()
  const single = useSelector((state) => state?.game?.singleGame)

  // console.log("HIHIHI" , single);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  useEffect(() => {
    dispatch(getGameById(id))
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  const handleSlideChange = (oldIndex, newIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === newIndex) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Video play interrupted:", error);
            });
          }
        } else {
          video.pause();
        }
      }
    });
  };

  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ms:p-3 p-2 rounded-full cursor-pointer transition"
    >
      <FaChevronRight size={20} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ms:p-3 p-2 rounded-full cursor-pointer transition"
    >
      <FaChevronLeft size={20} />
    </div>
  );

  const ThumbNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute -right-6 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 text-white ms:p-2 p-1 rounded-full cursor-pointer transition z-10"
    >
      <FaChevronRight size={18} />
    </div>
  );

  const ThumbPrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute -left-6 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 text-white ms:p-2 p-1 rounded-full cursor-pointer transition z-10"
    >
      <FaChevronLeft size={18} />
    </div>
  );

  const mainSettings = {
    asNavFor: nav2,
    ref: (slider) => (sliderRef1 = slider),
    beforeChange: handleSlideChange,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const thumbSettings = {
    asNavFor: nav1,
    ref: (slider) => (sliderRef2 = slider),
    slidesToShow,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: true,
    nextArrow: <ThumbNextArrow />,
    prevArrow: <ThumbPrevArrow />,
    responsive: [
      {
        breakpoint: 1650, // <= 1650px
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1280, // <= 1280px
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // <= 768px
        settings: {
          slidesToShow: 4,
          centerMode: false,
        },
      },
      {
        breakpoint: 576, // <= 768px
        settings: {
          slidesToShow: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 426, // <= 480px
        settings: {
          slidesToShow: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 376, // <= 480px
        settings: {
          slidesToShow: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 321, // <= 480px
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
    ],
  };

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;

      if (width >= 1650) {
        setSlidesToShow(5);  // default
      } else if (width >= 1280) {
        setSlidesToShow(4);
      } else if (width >= 768) {
        setSlidesToShow(4);
      } else if (width >= 576) {
        setSlidesToShow(3);
      } else if (width >= 426) {
        setSlidesToShow(3);
      } else if (width >= 376) {
        setSlidesToShow(3);
      } else if (width >= 321) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1); // for extra small devices
      }
    };

    updateSlides(); // run once on mount
    window.addEventListener("resize", updateSlides);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const ratings = single?.ratings || [];
  const total = ratings.reduce((sum, r) => sum + (r?.rating || 0), 0);
  const rating = ratings.length ? total / ratings.length : 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);



  return (
    <div className=''>
      <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
        <div>
          <h2 className='md:text-[40px] ms:text-[30px] text-[24px] font-[800] pt-5 capitalize'>{single?.title}</h2>
        </div>

        <div className="flex flex-col-reverse xl:flex-row md:mt-11">
          <div className='2xl:w-3/4 xl:w-2/3 w-full '>
            <div>
              <Slider {...mainSettings} className='ds_single_slider'>
                {single?.video?.url ? (
                  <div>
                    <video
                      src={single.video.url}
                      autoPlay
                      muted
                      loop
                      controls
                      className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover object-center rounded-lg bg-black shadow-lg"
                    />
                  </div>
                ) : ""}

                {single?.images?.map((element) => (
                  <div key={element._id}>
                    <img
                      src={element.url}
                      alt=""
                      className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover object-center rounded-lg"
                    />
                  </div>
                ))}
              </Slider>

              <div className='px-5'>
                <Slider {...thumbSettings} className='mt-3 ds_mini_slider' >

                  {single?.video?.url ? (
                    <div className="flex justify-center  relative w-full">
                      <video src={single?.video?.url} muted className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                      <FaPlay className="absolute inset-0 m-auto text-white text-4xl transition" />
                    </div>
                  ) : ""}

                  {single?.images?.map((element) => {
                    return (
                      <div className="flex justify-center  relative w-full">
                        {/* <img src={gta5} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         <FaPlay className="absolute inset-0 m-auto text-white text-4xl transition" /> */}
                        <img src={element?.url} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                      </div>
                    )
                  })}
                </Slider>
              </div>


              {/* Features Section */}
              <div className="py-10 md:px-4">
                <div className="">
                  <h2 className="text-base md:text-lg mb-12 text-left">
                    {single?.description}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-black/15 p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg md:text-2xl font-semibold mb-4 text-[#ab99e1]">Genres</h3>
                      <div className="flex flex-wrap gap-3">
                        {single?.tags?.map((genre, index) => (
                          <span key={index} className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-500/40 cursor-pointer capitalize">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/15 p-6 rounded-lg shadow-lg ">
                      <h3 className="text-lg md:text-2xl font-semibold mb-4 text-[#ab99e1]">Features</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Achievements', 'Co-op', 'Multiplayer', 'Single Player'].map((feature, index) => (
                          <span key={index} className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-500/40 cursor-pointer">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/15 p-8 rounded-lg shadow-lg mb-8">
                    <h3 className="text-lg md:text-2xl font-bold mb-1 text-[#ab99e1] capitalize">{single?.title}</h3>
                    <p className="mb-4">(also Includes {single?.title} Legacy)</p>
                    <p className="text-gray-300 text-sm md:text-base">
                      {single?.description}
                    </p>
                  </div>
                </div>


                <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                  {/* Header */}
                  <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">Windows</h3>
                  <h4 className="text-base font-semibold mb-6">System Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div>
                        <p className="text-gray-400 text-sm">Memory</p>
                        <p className="text-white text-sm">{single?.platforms?.windows?.system_requirements?.memory}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Storage</p>
                        <p className="text-white text-sm">{single?.platforms?.windows?.system_requirements?.storage}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Graphics</p>
                        <p className="text-white text-sm">({single?.platforms?.windows?.system_requirements?.graphics})</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-gray-400 text-sm">OS</p>
                        <p className="text-white text-sm capitalize">{single?.platforms?.windows?.system_requirements?.os}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Processor</p>
                        <p className="text-white text-sm capitalize">{single?.platforms?.windows?.system_requirements?.processor}</p>
                      </div>

                    </div>
                  </div>
                </div>

                {single?.instructions?.length > 0 ? <div className='mt-5 pt-2'>
                  <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                    {/* Header */}
                    <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">Instructions</h3>
                    {single?.instructions?.map((element, index) => {
                      return (
                        <div key={index} className='flex items-center mb-1'><GoDotFill className='me-2 text-[12px]' />{element} </div>
                      )
                    })}
                  </div>
                </div> : ""}
              </div>
            </div>
          </div>

          {/* right side copntent */}
          <div className="2xl:w-1/4 xl:w-1/3 w-full xl:pl-6 mt-10 xl:mt-0 ">
            <div className="p-6 sticky top-24 bg-black/15 ">
              <div className="flex justify-center mb-6">
                <img src={single?.cover_image?.url} alt="Game Logo" className="w-[180px] h-auto" />
              </div>
              <p className="text-xl font-bold text-white mb-6">${single?.platforms?.windows?.price}</p>

              <div className="">
                <div className='flex gap-4'>
                  <button className="w-full flex items-center gap-2 bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                    <FaHeart size={16} />
                    <span className="text-xs">Add To WishList</span>
                  </button>
                  <button className="w-full flex items-center gap-2 bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                    <FaShoppingCart size={16} />
                    <span className="text-xs">Add To Cart</span>
                  </button>
                </div>
                <button className="w-full bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>

              {/* Accordion */}
              <div className="divide-y divide-gray-700/60 rounded-xl overflow-hidden bg-black/10">
                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Platform</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5">
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gray-900 text-white px-3 py-1 rounded flex items-center"><FaWindows className='me-2' /> Windows</span>
                      <span className="bg-gray-900 text-white px-3 py-1 rounded flex items-center">PS5</span>
                      <span className="bg-gray-900 text-white px-3 py-1 rounded flex items-center">XBOX</span>
                    </div>
                  </div>
                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Rating</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5">
                    <div className="flex mt-2">
                      {Array.from({ length: fullStars }).map((_, i) => (
                        <FaStar key={`full-${i}`} className="text-yellow-400 h-5 w-5 mx-0.5" />
                      ))}
                      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 h-5 w-5 mx-0.5" />}
                      {Array.from({ length: emptyStars }).map((_, i) => (
                        <FaRegStar key={`empty-${i}`} className="text-yellow-400 h-5 w-5 mx-0.5" />
                      ))}
                      <span className="ml-2 text-white font-medium">{rating?.toFixed(1)}</span>
                    </div>
                  </div>
                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Purchase Info</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5 space-y-3">
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">Game Size</h4>
                      <p className="text-white text-base">{single?.platforms?.windows?.size}</p>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">Epic Rewards</h4>
                      <p className="text-white text-base">Earn 20% Back</p>
                    </div>
                  </div>
                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">More Details</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5 space-y-4">
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Refund Type</p>
                      <p className="text-white text-base">Refundable</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Developer</p>
                      <p className="text-white text-base">Rockstar Games</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Publisher</p>
                      <p className="text-white text-base">Rockstar Games</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Release Date</p>
                      <p className="text-white text-base">03/04/25</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Total Download</p>
                      <p className="text-white text-base">{single?.downloads || 0}</p>
                    </div>
                  </div>
                </details>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleGame
