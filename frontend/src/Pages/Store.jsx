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

import { FaArrowRight, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { getAllGames, getPopularGames, getTopGames } from '../Redux/Slice/game.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../Redux/Slice/category.slice';
import { useNavigate } from 'react-router-dom';
import StylishDiv from '../components/StylishDiv';
import { addToCart, fetchCart } from '../Redux/Slice/cart.slice';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice';


const Store = () => {
  const dispatch = useDispatch();
  const games = useSelector((state) => state.game.games);
  const PopularGames = useSelector((state) => state.game.popularGames);
  // const Category = useSelector((state) => state.game.category);
  const topGames = useSelector((state) => state.game.topGames);
  const loading = useSelector((state) => state.game.loading);
  const error = useSelector((state) => state.game.error);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cart);
  const { wishlistStatus } = useSelector((state) => state.wishlist);



  useEffect(() => {
    dispatch(getAllGames());
    dispatch(fetchCart())
    dispatch(getPopularGames());
    dispatch(fetchWishlist())
    dispatch(getAllCategories());
  }, []);


  useEffect(() => {
    try {
      dispatch(getTopGames());
    } catch (error) {
      console.error("Error dispatching getTopGames:", error);
    }
  }, []);

  const scrollContainerRefs = {
    trending: useRef(null),
    popular: useRef(null),
    action: useRef(null),
    ps5: useRef(null),
    topGames: useRef(null),
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

  const scrollLeft = (sectionRef) => {
    sectionRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  
  const scrollRight = (sectionRef) => {
    sectionRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };
  
  
  const handleAddToCart = (ele) => {
    dispatch(addToCart({ gameId: ele._id, platform: "windows", qty: 1 }));
  }
  const handleAddWishlist = (ele) => {
    // alert("a")
    dispatch(addToWishlist({ gameId: ele._id }));
  }

  const handleRemoveFromWishlist = (gameId) => {
    dispatch(removeFromWishlist({ gameId }));
  };

  const handleAllGames = (title) => {
    switch (title) {
      case "All Games":
        navigate('/allGames');
        break;

    }
  };

  const GameSection = ({ title, games = [], sectionRef }) => (
    <div className='py-2 sm:py-4 md:py-4 lg:py-6'>
      <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
        <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>{title}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/allGames')}
            className='px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-md 
             font-medium text-xs sm:text-sm transition-all duration-200 ease-out
             bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110
             active:scale-95
             focus-visible:outline-none focus-visible:ring-2 
             focus-visible:ring-indigo-400 focus-visible:ring-offset-2 
             focus-visible:ring-offset-gray-900'
          >
            All Games
          </button>
          <button
  onClick={()=>scrollLeft(sectionRef)}
  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center 
             bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110 text-white rotate-180">
  <FaArrowRight size={16} />
</button>

<button
  onClick={()=>scrollRight(sectionRef)}
  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center 
             bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110 text-white">
  <FaArrowRight size={16} />
</button>
        </div>
      </div>

      <div
        ref={sectionRef}
        className='overflow-x-auto scrollbar-hide '
        onMouseDown={(e) => handleMouseDown(e, sectionRef)}
      >
        <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max py-4 px-2 '>
          {games && games.length > 0 ? (
            games.map((game) => (
              <GameCard key={game._id || game.id} game={game} />
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">
              No games available
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const GameCard = ({ game }) => {
    const imageUrl = game?.cover_image?.url || game1;
    const priceCandidateList = [
      game?.platforms?.windows?.price,
      // game?.platforms?.ios?.price,
      // game?.platforms?.android?.price,
    ];
    const priceValue = priceCandidateList.find((p) => typeof p === 'number' && !Number.isNaN(p)) ?? 0;

    return (
      <div
        onClick={() => navigate(`/single/${game?._id}`)}
        className="w-64 sm:w-72 md:w-80 lg:w-96 cursor-pointer"
      >
        <StylishDiv>
          <div className="group relative overflow-hidden transition-all duration-300 w-full">
            <div className='relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
              <img
                src={imageUrl}
                alt={game?.title || 'Game'}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90'>
                <button className=' absolute top-2 sm:top-3 right-2 sm:right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddWishlist(game);
                    // handle add to cart logic
                  }}
                >

                  {wishlistStatus[game?._id] ? (
                    <FaHeart size={16} className="text-white" onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(game?._id);
                    }} />
                  ) : (
                    <FaRegHeart size={16} className="text-white" onClick={(e) => {
                      e.stopPropagation();
                      handleAddWishlist(game);
                    }} />
                  )}
                </button>
              </div>

              <div className='absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between'>
                {/* Tags can be added here if needed */}
              </div>

              <div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3'>
                <p className='text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl'>{game?.title}</p>
              </div>
            </div>

            <div className='p-3 sm:p-4 md:p-5 flex items-center justify-between'>
              <div>
                <p className='text-[10px] sm:text-xs text-gray-400 mb-1'>Price</p>
                <p className='text-white font-semibold text-sm sm:text-base md:text-lg'>
                  ${Number(priceValue).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(game);
                }}
                disabled={cartItems.some(item => item.game?._id === game?._id)} // ✅ use game
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-white font-semibold
    ${cartItems.some(item => item.game?._id === game?._id)
                    ? 'bg-green-600 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:scale-110 hover:from-[#7a42ff] hover:to-[#c4aaff]'
                  }`}
              >
                <FaShoppingCart size={16} />
                {cartItems.some(item => item.game?._id === game?._id) ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </StylishDiv>
      </div>
    );
  };

  return (
    <>
      <section className="">
        {/* Hero Swiper */}
        <div className="relative w-full">
          <Swiper
            modules={[EffectFade, Pagination, Autoplay]}
            effect="fade"
            speed={1200}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]"
          >
            {games && games.length > 0 ? (
              games.slice(-6).map((game, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] overflow-hidden">
                    <img
                      src={game?.cover_image?.url || game1}
                      alt={game.title || `Game ${index + 1}`}
                      className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px] object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <p className="text-center text-white py-10">Loading...</p>
            )}
          </Swiper>
        </div>

        {/* All Games Section (from API) */}
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection
            title="All Games"
            games={Array.isArray(games) ? games : []}
            sectionRef={scrollContainerRefs.action}
            loading={loading}
            error={error}
          />
        </div>
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection
            title="Trending Games"
            games={Array.isArray(games) ? games : []}
            sectionRef={scrollContainerRefs.trending}
            loading={loading}
            error={error}
          />
        </div>
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection
            title="Popular Games"
            games={Array.isArray(PopularGames) ? PopularGames : []}
            sectionRef={scrollContainerRefs.popular}
            loading={loading}
            error={error}
          />
        </div>
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection
            title="Action Games"
            games={Array.isArray(games) ? games.filter((g) => {
              const byCategory = (g?.category?.categoryName || "").toLowerCase() === "action";
              const byTag = Array.isArray(g?.tags) && g.tags.some((t) => String(t).toLowerCase() === "action");
              return byCategory || byTag;
            }) : []}
            sectionRef={scrollContainerRefs.action}
            loading={loading}
            error={error}
          />
        </div>
        {/* <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection title="PS-5 Games" games={games?.ps5 ?? []} sectionRef={scrollContainerRefs.ps5} />
        </div>*/}
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto">
          <GameSection
            title="Top Games"
            games={Array.isArray(topGames) ? topGames : []}
            sectionRef={scrollContainerRefs.topGames}
            loading={loading}
            error={error}
          />
          {error && (
            <div className="text-red-500 text-center py-4">
              Error loading top games: {error}
            </div>
          )}
          {!loading && (!topGames || topGames.length === 0) && (
            <div className="text-gray-400 text-center py-4">
              No top games available
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Store;