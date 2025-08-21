import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { FaStar } from 'react-icons/fa'

// Import slick styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'


const ReviewHome = () => {

  const [slidesToShow, setSlidesToShow] = useState(1) 

  const reviews = [
    {
      id: 1,
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      game: 'Resident Evil Village',
      rating: 5,
      review:
        'An absolute masterpiece! The atmosphere is chilling, and the storyline kept me hooked till the end.',
    },
    {
      id: 2,
      name: 'Maria Gomez',
      avatar: 'https://i.pravatar.cc/150?img=2',
      game: 'The Last of Us Part II',
      rating: 4,
      review:
        'Incredible storytelling and emotional depth. Gameplay is smooth, but pacing could have been tighter.',
    },
    {
      id: 3,
      name: 'James Lee',
      avatar: 'https://i.pravatar.cc/150?img=3',
      game: 'Minecraft',
      rating: 5,
      review:
        'Endless creativity! It never gets old. Perfect for solo adventures or playing with friends.',
    },
    {
      id: 4,
      name: 'Sophia Turner',
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
    <div className="bg-black pt-11">
      <section className="md:py-12 bg-black text-white">
        <h2 className="md:text-[35px] text-[28px] font-bold mb-7 text-center">
          Player Reviews
        </h2>
        <div className="container">
          <Slider {...settings} className='ds_review_slider'>
            {reviews.map((r) => (
              <div key={r.id} className="px-3 h-full flex">
                <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 hover:shadow-2xl transition flex flex-col h-full w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-sm text-gray-400">{r.game}</p>
                    </div>
                  </div>

                  <div className="flex mb-3 mt-6">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-5 w-5 mx-1 ${
                          i < r.rating ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 sm:text-[16px] text-[14px] leading-relaxed mt-5 flex-grow">
                    {r.review}
                  </p>
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
