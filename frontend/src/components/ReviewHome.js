import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { FaStar } from 'react-icons/fa'

// Import slick styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import StylishDiv from './StylishDiv'

const ReviewHome = () => {

  const [slidesToShow, setSlidesToShow] = useState(1)

  const reviews = [
    {
      id: 1,
      name: 'Parth',
      avatar: 'https://i.pravatar.cc/150?img=1',
      game: 'Resident Evil Village',
      rating: 5,
      review:
        'An absolute masterpiece! The atmosphere is chilling, and the storyline kept me hooked till the end.',
    },
    {
      id: 2,
      name: 'Jay',
      avatar: 'https://i.pravatar.cc/150?img=2',
      game: 'The Last of Us Part II',
      rating: 4,
      review:
        'Incredible storytelling and emotional depth. Gameplay is smooth, but pacing could have been tighter.',
    },
    {
      id: 3,
      name: 'Akshay',
      avatar: 'https://i.pravatar.cc/150?img=3',
      game: 'Minecraft',
      rating: 5,
      review:
        'Endless creativity! It never gets old. Perfect for solo adventures or playing with friends.',
    },
    {
      id: 4,
      name: 'Darshit',
      avatar: 'https://i.pravatar.cc/150?img=4',
      game: 'Elden Ring',
      rating: 5,
      review:
        'A breathtaking open world with challenging combat. Easily one of the best games I’ve ever played.',
    },
  ]

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth >= 1280) setSlidesToShow(3)
      else if (window.innerWidth >= 1024) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    updateSlides()
    window.addEventListener('resize', updateSlides)
    return () => window.removeEventListener('resize', updateSlides)
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // below 1024px
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // below 768px
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 480, // below 480px
        settings: { slidesToShow: 1 },
      },
    ],
  }




  return (
    <div className=" pt-11">
      <section className="md:py-12 text-white">
        <h2 className="md:text-[35px] text-[28px] font-bold  text-center">
          Player Reviews
        </h2>
        <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
          <Slider {...settings} className="ds_review_slider flex items-center justify-center py-5">
            {reviews.map((r) => (
              <div key={r.id} className="flex justify-center h-full relative  px-8">
                <div className="max-w-[100%] w-full h-full flex ">
                  <div className=" rounded-2xl   transition flex flex-col h-full w-full">
                    <div className="flex items-center gap-4 mb-4 sm:block hidden">
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className=" sm:absolute md:h-[150px] h-[100px] aspect-square top-[50%] -translate-y-1/2 left-[20px] object-cover border border-gray-700 rounded-xl z-10"
                      />
                    </div>
                    <div className='bg-white/10 backdrop-blur-md border border-white/10  py-4  md:h-[200px] sm:h-[180px] h-full sm:ms-[25px] md:ps-[120px] sm:ps-[70px] sm:pe-3 ps-5 pe-5 rounded-xl sm:text-start text-center'>
                    <div className="flex items-center justify-center gap-4 mb-4 sm:hidden ">
                      <img
                        src={r.avatar}
                        alt={r.name}
                        className="md:h-[150px] h-[100px] aspect-square  object-cover border border-gray-700 sm:rounded-xl rounded-full z-10"
                      />
                    </div>
                      <div className=''>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-sm text-gray-400">{r.game}</p>
                      </div>
                      <div className="flex   my-3 justify-center sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-5 w-5 mx-1 ${i < r.rating ? 'text-yellow-400' : 'text-gray-600'
                              }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-300 sm:text-[14px] text-[12px] leading-relaxed flex-grow ">
                        {r.review}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

      </section>
    </div>
  )

}

export default ReviewHome
