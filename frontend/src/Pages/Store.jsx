import { useState, useRef, useEffect } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
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
import { createActionGame, getAllGames, getPopularGames } from '../Redux/Slice/game.slice';
import { useDispatch, useSelector } from 'react-redux';


const Store = () => {
  const dispatch = useDispatch();
  const games = useSelector((state) => state.game.games);
  const PopularGames = useSelector((state) => state.game.popularGames);
  const ActionGames = useSelector((state) => state.game.actionGames);

  // console.log(games);
  console.log(ActionGames, "ActionGames");


  useEffect(() => {
    dispatch(getAllGames());
  }, []);

  useEffect(() => {
    dispatch(getPopularGames());
  }, []);

  useEffect(() => {
    dispatch(createActionGame());
  }, []);


  const scrollContainerRefs = {
    trending: useRef(null),
    popular: useRef(null),
    action: useRef(null),
    ps5: useRef(null),
    top: useRef(null),
  };

  const handleMouseDown = (e, ref) => {
    const container = ref.current;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (e) => {
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const GameSection = ({ title, games = [], sectionRef }) => (
    <div className='py-2 sm:py-4 md:py-4 lg:py-6'>
      <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
        <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>{title}</p>
        <FaArrowRight
          className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 hover:text-white transition-colors cursor-pointer'
          onClick={() => scrollRight(sectionRef)}
        />
      </div>

      <div
        ref={sectionRef}
        className='overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing'
        onMouseDown={(e) => handleMouseDown(e, sectionRef)}
      >
        <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max pb-2 sm:pb-3 md:pb-4 pl-4 sm:pl-0 pr-4 sm:pr-0'>
          {games.map((game) => (
            <GameCard key={game._id || game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );

  const GameCard = ({ game }) => {
    const imageUrl = game?.cover_image?.url || game1;
    const tag = (game?.tags && game.tags.length > 0) ? game.tags[0] : 'Game';
    const priceCandidateList = [
      game?.platforms?.windows?.price,
      game?.platforms?.ios?.price,
      game?.platforms?.android?.price,
    ];
    const priceValue = priceCandidateList.find((p) => typeof p === 'number' && !Number.isNaN(p)) ?? 0;

    return (
      <div className="group relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0 hover:shadow-2xl">
        <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
          <img
            src={imageUrl}
            alt={game?.title || 'Game'}
            className='w-full h-full object-cover transition-transform duration-500 '
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'></div>


          {/* <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
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
        </div> */}
          {/* <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
            <div className='flex items-center gap-1.5 sm:gap-2'>
              <span className='px-2 py-1 rounded-full text-[8px] sm:text-[10px] uppercase bg-[#221f2a] text-[#ab99e1] tracking-wide font-medium'>
                {tag}
              </span>
            </div>
          </div> */}

          <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
            <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game?.title}</p>
          </div>
        </div>


        {/* <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
        <div>
          <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
          <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>
            ₹{game.price.toLocaleString('en-IN')}
            {game.discount > 0 && (
              <span className='ml-2 line-through text-gray-400 text-xs'>
                ₹{(game.price / (1 - game.discount / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            )}
          </p>
        </div>
        <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-[#ab99e1] text-black font-medium hover:bg-[#b8a8e6] transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
          Buy
          <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  ); */}
        <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
          <div>
            <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
            <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>
              ₹{Number(priceValue).toLocaleString('en-IN')}
            </p>
          </div>
          <button className='inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg bg-gradient-to-r capitalize from-[#621df2] to-[#b191ff] text-white font-medium transition-all duration-300 text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
            Buy
            <FaArrowRight size={10} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="">
        {/* Hero Swiper */}
        <div className="relative w-full">
          <Swiper
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1000}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]"
          >
            {[game1, game2, game3, game4, game5, game6].map((game, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img src={game} alt={`Game ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* All Games Section (from API) */}
        <div className="container px-4 sm:px-6 md:px-8 lg:px-0 mt-8">
          <GameSection title="Trending Games" games={Array.isArray(games) ? games : []} sectionRef={scrollContainerRefs.trending} />
        </div>
        <div className="container px-4 sm:px-6 md:px-8 lg:px-0 mt-8">
          <GameSection title="Popular Games" games={Array.isArray(PopularGames) ? PopularGames : []} sectionRef={scrollContainerRefs.popular} />
        </div>
        <div className="container px-4 sm:px-6 md:px-8 lg:px-0 mt-8">
          <GameSection title="Action Games" games={Array.isArray(ActionGames) ? ActionGames : []} sectionRef={scrollContainerRefs.action} />
        </div>
        {/*<div className="container px-4 sm:px-6 md:px-8 lg:px-0 mt-8">
          <GameSection title="PS-5 Games" games={games?.ps5 ?? []} sectionRef={scrollContainerRefs.ps5} />
        </div>*/}
        <div className="container px-4 sm:px-6 md:px-8 lg:px-0 mt-8">
          <GameSection title="Top Games" games={games?.top ?? []} sectionRef={scrollContainerRefs.top} />
        </div>
      </section>
    </>
  );
};

export default Store;