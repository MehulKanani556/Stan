import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import gta from '../images/gta.mp4'
import forza from '../images/forza.mp4'
import black from '../images/Myth.mp4'

import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeTrailer } from '../Redux/Slice/game.slice';
   
const Trailer = () => {
  const swiperRef = useRef(null);
  const videoRefs = useRef([]); 
  const trailerData = useSelector((state)=>state?.game?.trailer)
  const dispatch = useDispatch()    

  // console.log("HIHIHI" , trailerData);
  

  useEffect(()=>{
    //  dispatch(getHomeTrailer())
  },[])

  const handleSlideChange = (swiper) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === swiper.activeIndex) {
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

  return (
    <div className="">
      <Swiper className='ds_trailer'
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        // onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
      >
        <SwiperSlide>
          <div className="flex justify-center xl:h-[900px] lg:h-[850px] md:h-[750px] ms:h-[550px] h-[400px] relative">
            <video 
              ref={(el) => (videoRefs.current[0] = el)}
              src={gta}  
              autoPlay  
              muted  
              loop
              className="w-full h-full object-cover  shadow-lg bg-black"
            />
            <div className='absolute xl:w-1/3 ms:w-1/2 md:top-[40%] ms:top-[25%] top-[15px] left-[20px]'>
              <h2 className='ms:text-[40px] text-[24px] text-gray-300 font-[700]' style={{ fontFamily: "arial, cursive" }}>
                Grand Theft Auto VI
              </h2>
              <p className='mt-2 ms:text-[16px] text-[14px]'>Here’s an eye-catching official artwork from Grand Theft Auto VI (GTA VI) featuring the protagonists and the neon-lit ambiance of Vice City—perfect for illustrating your website’s description!</p>
              <button className='bg-white rounded-[5px] border-[1px] border-white text-black ms:w-[150px] w-[100px] py-2 mt-5 hover:bg-transparent hover:text-white ease-in-out transition-all duration-300'>Buy Now</button>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex justify-center xl:h-[900px] lg:h-[850px] md:h-[750px] ms:h-[550px] h-[400px] relative">
            <video 
              ref={(el) => (videoRefs.current[1] = el)}
              src={forza}  
              autoPlay  
              muted  
              loop
              className="w-full h-full object-cover shadow-lg bg-black"
            />
            <div className='absolute xl:w-1/3 ms:w-1/2 md:top-[40%] ms:top-[25%] top-[15px] left-[20px]'>
              <h2 className='ms:text-[40px] text-[24px] text-gray-300 font-[700]' style={{ fontFamily: "arial, cursive" }}>   
                  Forza Horizon 5
              </h2>
              <p className='mt-2 ms:text-[16px] text-[14px]'>Forza Horizon 5 is an award-winning open-world racing game set in a vibrant, ever-evolving version of Mexico. Featuring the largest and most diverse map in the Horizon series, the game offers dynamic weather, breathtaking landscapes, and hundreds of cars to collect, customize, and race.</p>
              <button className='bg-white rounded-[5px] border-[1px] border-white text-black ms:w-[150px] w-[100px] py-2 mt-5 hover:bg-transparent hover:text-white ease-in-out transition-all duration-300'>Buy Now</button>
            </div>
          </div>
            
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex justify-center xl:h-[900px] lg:h-[850px] md:h-[750px] ms:h-[550px] sm:h-[400px] h-[350px] relative">
            <video 
              ref={(el) => (videoRefs.current[2] = el)}
              src={black}  
              autoPlay  
              muted  
              loop
              className="w-full h-full object-cover shadow-lg bg-black"
            />
            <div className='absolute xl:w-1/3 ms:w-1/2 md:top-[40%] ms:top-[25%] top-[15px] left-[20px]'>
              <h2 className='ms:text-[40px] text-[24px] text-gray-300 font-[700]' style={{ fontFamily: "arial, cursive" }}>
                Black Myth: Wukong
              </h2>
              <p className='mt-2 ms:text-[16px] text-[14px]'>Black Myth: Wukong is an epic action RPG inspired by the Chinese classic Journey to the West, where you play as the Destined One on a mythical quest.</p>
              <button className='bg-white rounded-[5px] border-[1px] border-white text-black ms:w-[150px] w-[100px] py-2 mt-5 hover:bg-transparent hover:text-white ease-in-out transition-all duration-300'>Buy Now</button>
            </div>
          </div>
           
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Trailer
