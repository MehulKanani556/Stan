import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import '../css/Store.css';

import { Navigation } from "swiper/modules";
import game1 from '../images/game1.jpg';
import { FaArrowRight, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { getAllGames, getAllActiveGames, getPopularGames, getTopGames, getTrendingGames } from '../Redux/Slice/game.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../Redux/Slice/category.slice';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCart } from '../Redux/Slice/cart.slice';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice';
import { allorders } from '../Redux/Slice/Payment.slice';
import LazyGameCard from '../lazyLoader/LazyGameCard';
import StoreSlider from '../components/StoreSlider';

// Constants
const SWIPER_CONFIG = {
  spaceBetween: 12,
  slidesPerView: 1.1,
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 8 },
    425: { slidesPerView: 1.5, spaceBetween: 10 },
    575: { slidesPerView: 1.8, spaceBetween: 10 },
    640: { slidesPerView: 2, spaceBetween: 12 },
    768: { slidesPerView: 2.5, spaceBetween: 14 },
    1024: { slidesPerView: 3, spaceBetween: 14 },
    1280: { slidesPerView: 3.5, spaceBetween: 14 },
    1480: { slidesPerView: 4.2, spaceBetween: 16 },
  },
  style: { padding: '20px 4px' },
  className: "game-swiper"
};

const BUTTON_STYLES = {
  primary: 'px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2.5 rounded-md font-medium text-xs sm:text-sm transition-all duration-200 ease-out bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-white shadow-lg shadow-fuchsia-500/30 hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
  navActive: 'w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110 text-white',
  navDisabled: 'w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center bg-gray-500 cursor-not-allowed opacity-50 text-white'
};

// Custom hook for swiper navigation state
const useSwiperNavigation = () => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  const updateNavigationState = useCallback((swiper) => {
    setTimeout(() => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }, 50);
  }, []);

  const swiperEvents = useMemo(() => ({
    onSwiper: (swiper) => {
      swiperRef.current = swiper;
      setTimeout(() => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      }, 100);
    },
    onSlideChange: updateNavigationState,
    onResize: updateNavigationState
  }), [updateNavigationState]);

  return { isBeginning, isEnd, swiperRef, swiperEvents };
};

// Custom hook for cart and wishlist operations - Optimized with caching
const useGameActions = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  const wishlistStatus = useSelector((state) => state.wishlist.wishlistStatus);
  const orders = useSelector((state) => state.payment.orders);

  // Cache for cart and wishlist status to prevent unnecessary re-renders
  const cartCache = useRef(new Map());
  const wishlistCache = useRef(new Map());
  const purchasedCache = useRef(new Map());

  const handleAddToCart = useCallback((game) => {
    dispatch(addToCart({ gameId: game._id, platform: "windows", qty: 1 }));
  }, [dispatch]);

  const handleAddWishlist = useCallback((game) => {
    dispatch(addToWishlist({ gameId: game._id }));
  }, [dispatch]);

  const handleRemoveFromWishlist = useCallback((gameId) => {
    dispatch(removeFromWishlist({ gameId }));
  }, [dispatch]);

  const isInCart = useCallback((gameId) => {
    if (cartCache.current.has(gameId)) {
      return cartCache.current.get(gameId);
    }
    const result = cartItems.some(item => item.game?._id === gameId);
    cartCache.current.set(gameId, result);
    return result;
  }, [cartItems]);

  const isInWishlist = useCallback((gameId) => {
    if (wishlistCache.current.has(gameId)) {
      return wishlistCache.current.get(gameId);
    }
    const result = wishlistStatus[gameId];
    wishlistCache.current.set(gameId, result);
    return result;
  }, [wishlistStatus]);

  const isPurchased = useCallback((gameId) => {
    if (purchasedCache.current.has(gameId)) {
      return purchasedCache.current.get(gameId);
    }
    const result = Array.isArray(orders) && orders.some(order =>
      order?.status === 'paid' && Array.isArray(order?.items) && order.items.some(item => item?.game?._id === gameId)
    );
    purchasedCache.current.set(gameId, result);
    return result;
  }, [orders]);

  // Clear cache when cart or wishlist changes
  useEffect(() => {
    cartCache.current.clear();
  }, [cartItems]);

  useEffect(() => {
    wishlistCache.current.clear();
  }, [wishlistStatus]);

  useEffect(() => {
    purchasedCache.current.clear();
  }, [orders]);

  return {
    handleAddToCart,
    handleAddWishlist,
    handleRemoveFromWishlist,
    isInCart,
    isInWishlist,
    wishlistStatus,
    isPurchased
  };
};

// Game Card Component - Memoized for better performance
const GameCard = ({ game, onNavigate, gameActions }) => {
  const { handleAddToCart, handleAddWishlist, handleRemoveFromWishlist, isInCart, isInWishlist, isPurchased } = gameActions;
  const navigate = useNavigate();

  const isNewGame = useMemo(() => {
    if (!game?.createdAt) return false;
    const createdDate = new Date(game.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(new Date().getMonth() - 1);
    return createdDate >= oneMonthAgo && createdDate <= new Date();
  }, [game?.createdAt]);

  const purchased = isPurchased(game?._id);
  const inCart = isInCart(game?._id);
  const inWishlist = isInWishlist(game?._id);
  const { currentUser } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));

  return (
    <div
      onClick={() => onNavigate(`/single/${game?._id}`)}
      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
    >
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70">

        {/* Enhanced Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Image Container */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-2xl">
          <img
            src={game?.cover_image?.url || game1}
            alt={game?.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 rounded-2xl"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

            {/* NEW Badge */}
            {isNewGame && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                  <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                </div>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${(inWishlist && isLoggedIn)
                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                isLoggedIn ?
                  inWishlist ? handleRemoveFromWishlist(game._id) : handleAddWishlist(game)
                  : navigate('/login')

              }}
            >
              {inWishlist && isLoggedIn ? (
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

          {/* Game Info */}
          <div className="bg-slate-700/50 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
            <div className="flex flex-wrap items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
              <span className="text-lg font-black text-white">
                ${game?.platforms?.windows?.price?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-medium">USD</span>
            </div>
            <div className="flex flex-wrap items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-semibold uppercase tracking-wider">Size</span>
              <span className="text-lg font-black text-white">
                {game?.platforms?.windows?.size || 'N/A'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              isLoggedIn ?
                handleAddToCart(game)
                : navigate('/login')
            }}
            disabled={inCart}
            className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${(inCart || purchased)  && isLoggedIn 
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
          >
            <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
              {isLoggedIn ? <>
                <div>
                  {inCart ? (
                    <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                      <span className="text-emerald-600 font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <FaShoppingCart size={18} className="text-white" />
                  )}
                </div>
                <span className="text-white font-bold text-sm tracking-wider uppercase">
                  {inCart
                    ? (purchased ? "Purchased" : "Added to Cart")
                    : (purchased ? "Purchased" : "Add to Cart")}
                </span>
              </> : <span className="text-white font-bold text-sm tracking-wider uppercase">
                Login to add
              </span>}

            </div>

            {/* Button Effects */}
            {!(inCart || purchased) && (
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

// Memoized GameCard to prevent unnecessary re-renders
const MemoizedGameCard = React.memo(GameCard);

// Navigation Component
const SwiperNavigation = ({ title, onAllGamesClick, onPrev, onNext, isBeginning, isEnd }) => (
  <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
    <p className='font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white'>
      {title}
    </p>
    <div className="flex items-center gap-3">
      <button onClick={onAllGamesClick}  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-2 
                    font-medium text-sm transition-all duration-200 ease-out
                    border-[1px] border-purple-400 
                    rounded-md
                    text-white
                    hover:bg-purple-400  hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900">
        All Games
      </button>
      <button
        onClick={onPrev}
        disabled={isBeginning}
        className={`${isBeginning ? BUTTON_STYLES.navDisabled : BUTTON_STYLES.navActive} rotate-180`}
      >
        <FaArrowRight size={16} />
      </button>
      <button
        onClick={onNext}
        disabled={isEnd}
        className={isEnd ? BUTTON_STYLES.navDisabled : BUTTON_STYLES.navActive}
      >
        <FaArrowRight size={16} />
      </button>
    </div>
  </div>
);

// Main Swiper Section Component
const SwiperSection = ({ title, games = [], gameActions, onNavigate }) => {
  const { isBeginning, isEnd, swiperRef, swiperEvents } = useSwiperNavigation();
  const navigate = useNavigate();

  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);
  const handleAllGames = useCallback(() => navigate('/allGames'), [navigate]);

  if (!games.length) {
    return (
      <div className='py-2 sm:py-4 md:py-4 lg:py-6'>
        <SwiperNavigation
          title={title}
          onAllGamesClick={handleAllGames}
          onPrev={handlePrev}
          onNext={handleNext}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
        <Swiper
          modules={[Navigation]}
          ref={swiperRef}
          {...SWIPER_CONFIG}
          {...swiperEvents}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <SwiperSlide key={i}>
              <LazyGameCard suppressSkeleton={false} delay={100 * i}>
                <div className="w-full h-80 bg-gray-800 rounded-lg animate-pulse"></div>
              </LazyGameCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className='py-2 sm:py-4 md:py-4 lg:py-6'>
      <SwiperNavigation
        title={title}
        onAllGamesClick={handleAllGames}
        onPrev={handlePrev}
        onNext={handleNext}
        isBeginning={isBeginning}
        isEnd={isEnd}
      />

      <Swiper
        modules={[Navigation]}
        ref={swiperRef}
        {...SWIPER_CONFIG}
        {...swiperEvents}
      >
        {games.map((game, index) => (
          <SwiperSlide key={game._id || game.id}>
            {/* <LazyGameCard
              threshold={0.1}
              delay={index * 50} // Staggered loading
              suppressSkeleton={false}
            > */}
              <MemoizedGameCard
                game={game}
                onNavigate={onNavigate}
                gameActions={gameActions}
              />
            {/* </LazyGameCard> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Main Store Component
const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const { games, popularGames, topGames, trendingGames, loading, error, category } = useSelector((state) => state.game);

  // Custom hooks
  const gameActions = useGameActions();
  const featuredNavigation = useSwiperNavigation();

  // Memoized filtered games - Optimized version
  const actionGames = useMemo(() => {
    if (!Array.isArray(games) || games.length === 0) return [];

    // Pre-compile regex for better performance
    const actionRegex = /^action$/i;

    return games.filter((game) => {
      // Early return if no category/tags
      if (!game?.category && !game?.tags) return false;

      // Check category (both populated object and string)
      if (game.category) {
        const categoryName = game.category?.categoryName || game.category?.name || game.category;
        if (typeof categoryName === 'string' && actionRegex.test(categoryName)) {
          return true;
        }
      }

      // Check tags only if category didn't match
      if (Array.isArray(game.tags)) {
        return game.tags.some(tag => actionRegex.test(String(tag)));
      }

      return false;
    }).slice(0, 8); // Limit to 8 games for better performance
  }, [games]);

  const featuredGames = useMemo(() => {
    return Array.isArray(games) ? games.slice(0, 8) : [];
  }, [games]);

  // Parse a size value to MB (supports numbers, "MB", "GB", "TB")
  const parseSizeToMB = useCallback((size) => {
    if (size == null) return -Infinity; // treat missing size as smallest
    if (typeof size === 'number') return size; // assume number is already MB
    if (typeof size !== 'string') return -Infinity;
    const s = size.trim().toUpperCase();
    const match = s.match(/([0-9]*\.?[0-9]+)/);
    if (!match) return -Infinity;
    const value = parseFloat(match[1]);
    if (s.includes('TB')) return value * 1024 * 1024;
    if (s.includes('GB')) return value * 1024;

    return value;
  }, []);

  const featuredMaxSizeGames = useMemo(() => {
    if (!Array.isArray(games)) return [];
    const withSize = games.map((g) => {
      const sizeVal = g?.platforms?.windows?.size ?? g?.size;
      return { game: g, sizeMB: parseSizeToMB(sizeVal) };
    });
    withSize.sort((a, b) => (b.sizeMB - a.sizeMB));
    const sortedGames = withSize.map((x) => x.game).filter(Boolean);
    const top = sortedGames.slice(0, 8);

    return top.length ? top : (Array.isArray(games) ? games.slice(0, 8) : []);
  }, [games, parseSizeToMB]);

  // Effects - Optimized data loading with priority
  useEffect(() => {
    const loadData = async () => {
      // Load critical data first (games for main display)
      const criticalData = await Promise.all([
        dispatch(getAllActiveGames({ page: 1, limit: 20 })), // Limit initial load
        dispatch(getAllCategories())
      ]);

      // Load secondary data after critical data is loaded
      setTimeout(async () => {
        await Promise.all([
          dispatch(getPopularGames({ page: 1, limit: 8 })), // Reduced limit
          dispatch(getTopGames({ page: 1, limit: 8 })), // Reduced limit
          dispatch(getTrendingGames({ page: 1, limit: 8, days: 30 })) // Reduced limit
        ]);
      }, 100); // Small delay to prioritize critical data
    };

    loadData();

    const userId = localStorage.getItem("userId");
    if (userId) {
      // Load user-specific data with lower priority
      setTimeout(() => {
        dispatch(fetchWishlist());
        dispatch(fetchCart());
        dispatch(allorders());
      }, 200);
    }
  }, [dispatch]);

  // Handle resize for better mobile experience
  useEffect(() => {
    const handleResize = () => {
      // Implementation for resize handling if needed
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 500);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add custom styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .game-slider::-webkit-scrollbar { display: none; }
      .game-slider { -ms-overflow-style: none; scrollbar-width: none; }
      .game-swiper .swiper-button-next,
      .game-swiper .swiper-button-prev { display: none !important; }
      .game-swiper .swiper-pagination { display: none !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Navigation handlers
  const handleNavigate = useCallback((path) => navigate(path), [navigate]);
  const handleAllGames = useCallback(() => navigate('/allGames'), [navigate]);

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading games: {error}
      </div>
    );
  }

  return (
    <section>
      <StoreSlider />

      {/* Featured Games Section */}
      <div className="mx-auto flex flex-col items-center sm:max-w-full">
        <div className="py-4 sm:py-6 md:py-8 lg:py-10 w-[85%] mx-auto">
          <SwiperSection
            title="All Games"
            games={Array.isArray(games) ? games.slice(0, 12) : []} // Limit initial display
            gameActions={gameActions}
            onNavigate={handleNavigate}
          />

          <SwiperNavigation
            title="Featured Games"
            onAllGamesClick={handleAllGames}
            onPrev={() => featuredNavigation.swiperRef.current?.slidePrev()}
            onNext={() => featuredNavigation.swiperRef.current?.slideNext()}
            isBeginning={featuredNavigation.isBeginning}
            isEnd={featuredNavigation.isEnd}
          />

          <Swiper
            modules={[Navigation]}
            ref={featuredNavigation.swiperRef}
            {...SWIPER_CONFIG}
            {...featuredNavigation.swiperEvents}
          >
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <SwiperSlide key={i}>
                  <LazyGameCard suppressSkeleton={false} delay={i * 100}>
                    <div className="w-full h-80 bg-gray-800 rounded-lg animate-pulse"></div>
                  </LazyGameCard>
                </SwiperSlide>
              ))
            ) : featuredMaxSizeGames.length > 0 ? (
              featuredMaxSizeGames.map((game, index) => (
                <SwiperSlide key={game._id}>
                  {/* <LazyGameCard
                    threshold={0.1}
                    delay={index * 75}
                    suppressSkeleton={false}
                  > */}
                    <MemoizedGameCard
                      game={game}
                      onNavigate={handleNavigate}
                      gameActions={gameActions}
                    />
                  {/* </LazyGameCard> */}
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="text-center text-white py-10">No featured games available</div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>

      {/* Game Sections */}
      <div className="md:max-w-[85%] max-w-[95%] mx-auto space-y-4">

        <SwiperSection
          title="Trending Games"
          games={Array.isArray(trendingGames) ? trendingGames : []}
          gameActions={gameActions}
          onNavigate={handleNavigate}
        />

        <SwiperSection
          title="Popular Games"
          games={Array.isArray(popularGames) ? popularGames : []}
          gameActions={gameActions}
          onNavigate={handleNavigate}
        />

        <SwiperSection
          title="Action Games"
          games={Array.isArray(actionGames) && actionGames.length > 0 ? actionGames : (Array.isArray(games) ? games.slice(0, 8) : [])}
          gameActions={gameActions}
          onNavigate={handleNavigate}
        />

        <SwiperSection
          title="Top Games"
          games={Array.isArray(topGames) ? topGames : []}
          gameActions={gameActions}
          onNavigate={handleNavigate}
        />
      </div>
    </section>
  );
};

export default Store;