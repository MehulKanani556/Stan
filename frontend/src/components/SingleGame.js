import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlay, FaStar } from 'react-icons/fa'

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


const SingleGame = () => {

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const videoRefs = useRef([]);
  const [slidesToShow, setSlidesToShow] = useState(5)
  const { id } = useParams()
  


  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
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




  return (
    <div className=''>
      <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
        <div>
          <h2 className='md:text-[40px] ms:text-[30px] text-[24px] font-[800] pt-5'>Grand Theft Auto V Enhanced</h2>
          <div className="flex mb-3 mt-2">
            <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`} />
            <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`} />
            <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`} />
            <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`} />
            <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`} />
          </div>
        </div>

        <div className="flex flex-col-reverse xl:flex-row md:mt-11">
          <div className='xl:w-3/4 w-full '>
            <div>
              <Slider {...mainSettings} className='ds_single_slider'>
                <div>
                  <video ref={(el) => (videoRefs.current[0] = el)}
                    src={gta}
                    autoPlay muted loop className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover  shadow-lg bg-black" />
                </div>
                <div>
                  <img src={game} alt="" className=" w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover rounded-lg" />
                </div>
                <div>
                  <img src={game1} alt="" className=" w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover rounded-lg" />
                </div>
                <div>
                  <img src={game2} alt="" className=" w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover rounded-lg" />
                </div>
                <div>
                  <img src={game3} alt="" className=" w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover rounded-lg" />
                </div>
                <div>
                  <img src={game4} alt="" className=" w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover rounded-lg" />
                </div>
              </Slider>

              <div className='px-5'>
                <Slider {...thumbSettings} className='mt-3 ds_mini_slider' >
                  <div className="flex justify-center px-2 relative">
                    <img src={gta5} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                    <FaPlay className="absolute inset-0 m-auto text-white text-4xl transition" />
                  </div>
                  <div className="flex justify-center px-2">
                    <img src={game} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex justify-center px-2">
                    <img src={game1} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex justify-center px-2">
                    <img src={game2} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex justify-center px-2">
                    <img src={game3} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                  </div>
                  <div className="flex justify-center px-2">
                    <img src={game4} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                  </div>
                </Slider>
              </div>


              {/* Features Section */}
              <div className="py-10 md:px-4">
                <div className="">
                  <h2 className="text-base md:text-lg mb-12 text-left">
                    Experience entertainment blockbusters Grand Theft Auto V and Grand Theft Auto Online — now upgraded for a new generation with stunning visuals, faster loading, 3D audio, and more, plus exclusive content for GTA Online players.
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-black/15 p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg md:text-2xl font-semibold mb-4 text-[#ab99e1]">Genres</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Action', 'Adventure', 'Open World'].map((genre, index) => (
                          <span key={index} className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-500/40 cursor-pointer">
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
                    <h3 className="text-lg md:text-2xl font-bold mb-1 text-[#ab99e1]">Grand Theft Auto V Enhanced</h3>
                    <p className="mb-4">(also Includes Grand Theft Auto V Legacy)</p>
                    <p className="text-gray-300 text-sm md:text-base">
                      This purchase includes both GTAV Enhanced and GTAV Legacy for PC (included for hardware that does not meet the minimum system requirements needed for the upgrades in GTAV Enhanced.)
                    </p>
                  </div>
                </div>


                <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                  {/* Header */}
                  <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">Windows</h3>
                  <h4 className="text-base font-semibold mb-6">Minimum Recommended</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                    <div>
                        <p className="text-gray-400 text-sm">Memory</p>
                        <p className="text-white text-sm">8GB RAM</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Storage</p>
                        <p className="text-white text-sm">105GB SSD Required</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Graphics</p>
                        <p className="text-white text-sm">
                          NVIDIA® GeForce® GTX 1630 (4GB VRAM) <br />
                          AMD Radeon™ RX 6400 (4GB VRAM)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                    <div>
                        <p className="text-gray-400 text-sm">OS</p>
                        <p className="text-white text-sm">Windows 10 (latest update)</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Processor</p>
                        <p className="text-white text-sm">
                          Intel® Core™ i7-4770 | AMD FX™-9590
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* right side copntent */}
          <div className="xl:w-1/4 w-full xl:pl-6 mt-10 xl:mt-0 ">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <img src={gtav} alt="Game Logo" className="w-[180px] h-auto" />
              </div>
              <p className="text-xl font-bold text-white mb-6">$2,499</p>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>

              <div className="mb-2 flex justify-between">
                <h4 className="text-base text-gray-400 mb-3">Epic Rewards</h4>
                <p className="text-white text-base">Earn 20% Back</p>
              </div>
              <hr className="mb-4 border-gray-700 !mt-0" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-base text-gray-400 mb-3">Refund Type</p>
                  <p className="text-white text-base">Refundable</p>
                </div>
                <hr className="mb-4 border-gray-700 !mt-0" />

                <div className="flex justify-between">
                  <p className="text-base text-gray-400 mb-3">Developer</p>
                  <p className="text-white text-base">Rockstar Games</p>
                </div>
                <hr className="mb-4 border-gray-700 !mt-0" />

                <div className="flex justify-between">
                  <p className="text-base text-gray-400 mb-3">Publisher</p>
                  <p className="text-white text-base">Rockstar Games</p>
                </div>
                <hr className="mb-4 border-gray-700 !mt-0" />

                <div className="flex justify-between">
                  <p className="text-base text-gray-400 mb-3">Release Date</p>
                  <p className="text-white text-base">03/04/25</p>
                </div>
              </div>
              <hr className="my-6 border-gray-700 !mt-0" />

              <div>
                <h4 className="text-xl font-bold text-white mb-3">Platform</h4>
                <div className="flex space-x-2">
                  <span className="bg-gray-800 text-white px-3 py-1 rounded">PC</span>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded">PS5</span>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded">XBOX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleGame
