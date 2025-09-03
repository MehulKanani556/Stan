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
import LazyGameCard from '../lazyLoader/LazyGameCard';


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
    allGames: useRef(null),
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
    // <LazyGameCard>
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
              onClick={() => scrollLeft(sectionRef)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center 
             bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110 text-white rotate-180">
              <FaArrowRight size={16} />
            </button>

            <button
              onClick={() => scrollRight(sectionRef)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center 
             bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110 text-white">
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>

        <div
      ref={sectionRef}
      className='overflow-x-auto scrollbar-hide'
      onMouseDown={(e) => handleMouseDown(e, sectionRef)}
    >
      <div className='flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-max py-4 px-2 '>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <LazyGameCard key={i} />  
          ))
        ) : games && games.length > 0 ? (
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
    // {/* </LazyGameCard> */}
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
        className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
      >
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70">

          {/* Enhanced Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Image Container with Enhanced Effects */}
          <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
            <img
              src={imageUrl}
              alt={game?.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

              {/* Top Badge */}
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                  <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                </div>
              </div>

              {/* Wishlist Button */}
              <button
                className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${wishlistStatus[game?._id]
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                  : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  wishlistStatus[game?._id]
                    ? handleRemoveFromWishlist(game._id)
                    : handleAddWishlist(game);
                }}
              >
                {wishlistStatus[game?._id] ? (
                  <FaHeart size={16} className="text-white animate-pulse" />
                ) : (
                  <FaRegHeart size={16} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                )}
              </button>

              {/* Game Title */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                    {game?.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-5 md:p-6 space-y-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Price */}
              <div className="bg-slate-700/50 rounded-xl relative z-10 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                <div className="flex flex-wrap items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
                  <span className="text-lg font-black text-white">
                    ${game?.platforms?.windows?.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">USD</span>
                </div>
                <div className="flex flex-wrap items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-semibold uppercase tracking-wider">Size</span>
                  <span className="text-lg font-black text-white">
                    {game?.platforms?.windows?.size || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(game);
              }}
              disabled={cartItems.some(item => item.game?._id === game?._id)}
              className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${cartItems.some(item => item.game?._id === game?._id)
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                <div>
                  {cartItems.some(item => item.game?._id === game?._id) ? (
                    <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <FaShoppingCart size={18} className="text-white" />
                  )}
                </div>
                <span className="text-white font-bold text-sm tracking-wider uppercase">
                  {cartItems.some(item => item.game?._id === game?._id)
                    ? "Added to Cart"
                    : "Add to Cart"}
                </span>
              </div>

              {/* Button Effects */}
              {!cartItems.some(item => item.game?._id === game?._id) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <div className="w-16 h-16 border-2 border-blue-400/30 rounded-lg transform rotate-45"></div>
          </div>

          <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <div className="w-12 h-12 border-2 border-pink-400/30 rounded-full"></div>
          </div>
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
            sectionRef={scrollContainerRefs.allGames}
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