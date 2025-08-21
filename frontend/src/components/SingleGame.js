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


const SingleGame = () => {

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);  
  const videoRefs = useRef([]);  
  const [slidesToShow, setSlidesToShow] = useState(5) 



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
      }else {
        setSlidesToShow(1); // for extra small devices
      }
    };
  
    updateSlides(); // run once on mount
    window.addEventListener("resize", updateSlides);
  
    return () => window.removeEventListener("resize", updateSlides);
  }, []);
  
  



  return (
    <div className='bg-black'>
        <div className="container">
            <div>
                <h2 className='md:text-[40px] ms:text-[30px] text-[24px] font-[700] pt-5'>Eriksholm: The Stolen Dream</h2>
                <div className="flex mb-3 mt-2">
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                 </div>
            </div>

            <div className="flex mt-11">
                <div className='xl:w-3/4 w-full'>
                    <div>
                    <Slider {...mainSettings} className='ds_single_slider'>
                       <div> 
                          <video  ref={(el) => (videoRefs.current[0] = el)}
                            src={gta} 
                            autoPlay   muted   loop className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover  shadow-lg bg-black"/>
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
                            <img src={gta5} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                            <FaPlay className="absolute inset-0 m-auto text-black text-4xl transition" />
                          </div>
                         <div className="flex justify-center px-2">
                           <img src={game} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         </div>
                         <div className="flex justify-center px-2">
                           <img src={game1} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         </div>
                         <div className="flex justify-center px-2">
                           <img src={game2} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         </div>
                         <div className="flex justify-center px-2">
                           <img src={game3} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         </div>
                         <div className="flex justify-center px-2">
                           <img src={game4} alt="" className="lg:h-[130px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         </div>
                       </Slider>
                    </div>
                    </div>
                </div>
                <div className="xl:w-1/4 w-full">
                
                </div>
            </div>
        </div>
    </div>
  )
}

export default SingleGame
