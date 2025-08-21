import React, { useEffect, useRef, useState } from 'react'
import { FaStar } from 'react-icons/fa'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
// import gta from '../images/gta.mp4'
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

  const mainSettings = {
    asNavFor: nav2,
    ref: (slider) => (sliderRef1 = slider),
    beforeChange: handleSlideChange, 
  };

  const thumbSettings = {
    asNavFor: nav1,
    ref: (slider) => (sliderRef2 = slider),
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
  };


  return (
    <div className='bg-black'>
        <div className="container">
            <div>
                <h2 className='text-[40px] font-[700] pt-5'>Eriksholm: The Stolen Dream</h2>
                <div className="flex mb-3 mt-2">
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                      <FaStar className={`h-5 w-5 mx-1 ${'text-white'}`}/>
                 </div>
            </div>

            <div className="flex mt-10">
                <div className='w-3/4'>
                    <div>
                    <Slider {...mainSettings}>
                       <div> 
                          <video  ref={(el) => (videoRefs.current[0] = el)}
                         //   src={gta} 
                            autoPlay   muted   loop className="w-full h-full object-cover  shadow-lg bg-black"/>
                       </div>
                       <div>
                          
                       </div>
                       <div>
                         <h3>3</h3>
                       </div>
                       <div>
                         <h3>4</h3>
                       </div>
                       <div>
                         <h3>5</h3>
                       </div>
                       <div>
                         <h3>6</h3>
                       </div>
                    </Slider>
                    <Slider
                      {...thumbSettings}
                    >
                      <div>
                         <img src={gta5} alt="" className='h-[160px] w-full object-cover' />
                      </div>
                      <div>
                         <img src={game} alt="" className='h-[160px] w-full object-cover' />
                      </div>
                      <div>
                         <img src={game1} alt="" className='h-[160px] w-full object-cover' />
                      </div>
                      <div>
                         <img src={game2} alt="" className='h-[160px] w-full object-cover' />
                      </div>
                      <div>
                        <h3>5</h3>
                      </div>
                      <div>
                        <h3>6</h3>
                      </div>
                    </Slider>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SingleGame
