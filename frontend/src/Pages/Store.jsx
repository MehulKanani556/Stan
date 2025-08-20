import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import '../css/Store.css';

import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";

import game1 from '../images/game1.jpg';
import game2 from '../images/game2.jpg';
import game3 from '../images/game3.jpg';
import game4 from '../images/game4.webp';
import game5 from '../images/game5.jpg';
import game6 from '../images/game6.jpg';
import { FaArrowRight } from "react-icons/fa";

const games = [
  { id: 1, title: 'Game One', price: 1999, image: game1, tag: 'Action', discount: 15 },
  { id: 2, title: 'Game Two', price: 2499, image: game2, tag: 'Adventure', discount: 0 },
  { id: 3, title: 'Game Three', price: 1499, image: game3, tag: 'Casual', discount: 10 },
  { id: 4, title: 'Game Four', price: 2999, image: game4, tag: 'RPG', discount: 20 },
  { id: 5, title: 'Game Five', price: 1799, image: game5, tag: 'Strategy', discount: 0 },
  { id: 6, title: 'Game Six', price: 2199, image: game6, tag: 'Shooter', discount: 5 },
];

const Store = () => {
  return (
    <>
      <section className="bg-black pt-16">
        {/* HERO section */}
        <div className="relative w-full">
          <Swiper
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1000}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]"
          >
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game1} alt="Game 1" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game2} alt="Game 2" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game3} alt="Game 3" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game4} alt="Game 4" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game5} alt="Game 5" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img src={game6} alt="Game 6" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="container px-4 sm:px-6 md:px-8 lg:px-0">
          {/* Trending section */}
          <div className='py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14'>
            <div className="">
              <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                <div>
                  <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>Trending</p>
                </div>
                <div className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 hover:text-white transition-colors cursor-pointer'>
                  <FaArrowRight />
                </div>
              </div>

              <div className='overflow-x-auto scrollbar-hide'>
                <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max pb-2 sm:pb-3 md:pb-4 pl-4 sm:pl-0 pr-4 sm:pr-0'>
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="group relative bg-[#151517] rounded-lg sm:rounded-xl overflow-hidden border border-white/5 hover:border-[#ab99e1]/40 transition-all duration-300 w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 shadow-lg hover:shadow-2xl hover:shadow-[#ab99e1]/20"
                    >
                      <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img
                          src={game.image}
                          alt={game.title}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                          <div className='flex items-center gap-1.5 sm:gap-2'>
                            <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-[#221f2a] text-[#ab99e1] tracking-wide font-medium'>
                              {game.tag}
                            </span>
                            {game.discount > 0 && (
                              <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-green-500/20 text-green-400 tracking-wide font-medium'>
                                -{game.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game.title}</p>
                        </div>
                      </div>

                      <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                        <div>
                          <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>₹{game.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#ab99e1] text-black font-medium hover:bg-[#b8a8e6] transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                          Buy
                          <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Popular section */}
          <div className='py-6 sm:py-8 md:py-10 lg:py-12'>
            <div className="">
              <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                <div>
                  <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>Popular Games</p>
                </div>
                <div className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 hover:text-white transition-colors cursor-pointer'>
                  <FaArrowRight />
                </div>
              </div>

              <div className='overflow-x-auto scrollbar-hide'>
                <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max pb-2 sm:pb-3 md:pb-4 pl-4 sm:pl-0 pr-4 sm:pr-0'>
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="group relative bg-[#151517] rounded-lg sm:rounded-xl overflow-hidden border border-white/5 hover:border-[#ab99e1]/40 transition-all duration-300 w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 shadow-lg hover:shadow-2xl hover:shadow-[#ab99e1]/20"
                    >
                      <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img
                          src={game.image}
                          alt={game.title}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                          <div className='flex items-center gap-1.5 sm:gap-2'>
                            <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-[#221f2a] text-[#ab99e1] tracking-wide font-medium'>
                              {game.tag}
                            </span>
                            {game.discount > 0 && (
                              <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-green-500/20 text-green-400 tracking-wide font-medium'>
                                -{game.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game.title}</p>
                        </div>
                      </div>

                      <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                        <div>
                          <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>₹{game.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#ab99e1] text-black font-medium hover:bg-[#b8a8e6] transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                          Buy
                          <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action section */}
          <div className='py-6 sm:py-8 md:py-10 lg:py-12'>
            <div className="">
              <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                <div>
                  <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>Action Games</p>
                </div>
                <div className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 hover:text-white transition-colors cursor-pointer'>
                  <FaArrowRight />
                </div>
              </div>

              <div className='overflow-x-auto scrollbar-hide'>
                <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max pb-2 sm:pb-3 md:pb-4 pl-4 sm:pl-0 pr-4 sm:pr-0'>
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="group relative bg-[#151517] rounded-lg sm:rounded-xl overflow-hidden border border-white/5 hover:border-[#ab99e1]/40 transition-all duration-300 w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 shadow-lg hover:shadow-2xl hover:shadow-[#ab99e1]/20"
                    >
                      <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img
                          src={game.image}
                          alt={game.title}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                          <div className='flex items-center gap-1.5 sm:gap-2'>
                            <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-[#221f2a] text-[#ab99e1] tracking-wide font-medium'>
                              {game.tag}
                            </span>
                            {game.discount > 0 && (
                              <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-green-500/20 text-green-400 tracking-wide font-medium'>
                                -{game.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game.title}</p>
                        </div>
                      </div>

                      <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                        <div>
                          <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>₹{game.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#ab99e1] text-black font-medium hover:bg-[#b8a8e6] transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                          Buy
                          <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PS-5 games section */}
          <div className='py-6 sm:py-8 md:py-10 lg:py-12'>
            <div className="">
              <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
                <div>
                  <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>PS-5 Games</p>
                </div>
                <div className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 hover:text-white transition-colors cursor-pointer'>
                  <FaArrowRight />
                </div>
              </div>

              <div className='overflow-x-auto scrollbar-hide'>
                <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max pb-2 sm:pb-3 md:pb-4 pl-4 sm:pl-0 pr-4 sm:pr-0'>
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="group relative bg-[#151517] rounded-lg sm:rounded-xl overflow-hidden border border-white/5 hover:border-[#ab99e1]/40 transition-all duration-300 w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 shadow-lg hover:shadow-2xl hover:shadow-[#ab99e1]/20"
                    >
                      <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img
                          src={game.image}
                          alt={game.title}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>

                        <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                          <div className='flex items-center gap-1.5 sm:gap-2'>
                            <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-[#221f2a] text-[#ab99e1] tracking-wide font-medium'>
                              {game.tag}
                            </span>
                            {game.discount > 0 && (
                              <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-green-500/20 text-green-400 tracking-wide font-medium'>
                                -{game.discount}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game.title}</p>
                        </div>
                      </div>

                      <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
                        <div>
                          <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                          <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>₹{game.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#ab99e1] text-black font-medium hover:bg-[#b8a8e6] transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                          Buy
                          <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Store;

