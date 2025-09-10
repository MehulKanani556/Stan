import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';
import { FaArrowRight, FaHeart, FaShoppingCart, FaRegHeart } from "react-icons/fa";
import LazyGameCard from '../lazyLoader/LazyGameCard';
import TopGames from '../components/TopGames';
import ExploreGames from '../images/ExploreGames.webp';
import ExploreBannerSkeleton from '../lazyLoader/ExploreBannerSkeleton';
import Trailer from '../components/Trailer';
import ReviewHome from '../components/ReviewHome';
import MultiHome from '../components/MultiHome';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getAllCategories, getAllGames, getAllActiveGames } from '../Redux/Slice/game.slice';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice';
import { addToCart, fetchCart } from '../Redux/Slice/cart.slice';
import HomeSlider from '../components/HomeSlider';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
import { allorders } from '../Redux/Slice/Payment.slice';

// Constants
const SWIPER_BREAKPOINTS = {
  320: { slidesPerView: 1, spaceBetween: 8 },
  425: { slidesPerView: 1.5, spaceBetween: 10 },
  575: { slidesPerView: 1.8, spaceBetween: 10 },
  640: { slidesPerView: 2, spaceBetween: 12 },
  768: { slidesPerView: 2.5, spaceBetween: 14 },
  1024: { slidesPerView: 3, spaceBetween: 14 },
  1280: { slidesPerView: 3.5, spaceBetween: 14 },
  1480: { slidesPerView: 4.2, spaceBetween: 16 },
};

const BUTTON_STYLES = {
  inactive: 'text-gray-300 hover:text-[#ab99e1] hover:bg-white/5',
  active: 'bg-[#ab99e1]/10 text-[#ab99e1] shadow-lg shadow-purple-500/20 border-purple-300'
};

// Custom hooks
const useImageLoader = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return isLoaded;
};

// Custom hook for mouse drag scrolling
const useMouseDragScroll = (ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!ref.current) return;

    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);

    // Prevent text selection during drag
    ref.current.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (ref.current) {
      ref.current.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !ref.current) return;

    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiply by 2 to increase scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove
  };
};


// Utility functions
const isNewGame = (createdAt) => {
  if (!createdAt) return false;
  const createdDate = new Date(createdAt);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return createdDate >= oneMonthAgo && createdDate <= new Date();
};

// Components
const CategoryButton = ({ category, isActive, onClick }) => (
  <button
    className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6
      rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg
      transition-all duration-200 ease-out border border-transparent whitespace-nowrap
      ${isActive ? BUTTON_STYLES.active : BUTTON_STYLES.inactive}`}
    onClick={onClick}
  >
    {category?.name || category?.categoryName || 'All Games'}
  </button>
);

const GameCard = ({
  game,
  onGameClick,
  onWishlistToggle,
  onAddToCart,
  isInWishlist,
  isInCart,
  orders,
  isLoggedIn
}) => {
  const navigate = useNavigate();

  const isPurchased = orders?.some(order =>
    order.items.some(item => item.game?._id === game?._id)
  )
  return (
    <div
      onClick={() => onGameClick(game._id)}
      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
    >
      { }
      <div div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70" >

        {/* Enhanced Glow Effect */}
        < div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Image Container */}
        {/* {console.log('games image',game?.cover_image?.url)} */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-2xl">
          <img
            src={game?.cover_image?.url}
            alt={game?.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 rounded-2xl"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

            {/* New Badge */}
            {isNewGame(game?.createdAt) && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                  <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                </div>
              </div>
            )}

            {/* Wishlist Button */}

            <button
              className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${isInWishlist
                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                isLoggedIn ?
                  onWishlistToggle(game)
                  :
                  navigate('/login')

              }}
            >
              {isInWishlist ? (
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
            <div className="bg-slate-700/50 rounded-xl relative z-10 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
              <div className="flex flex-wrap items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
                <span className="text-lg font-black text-white">
                  ${game?.platforms?.windows?.price?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 font-medium">USD</span>
              </div>
              <div className="flex flex-wrap items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
              isLoggedIn ?
              onAddToCart(game)
              :
              navigate('/login')
            }}
            disabled={isInCart || isPurchased}
            className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${isInCart
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
          >
            <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
              {isLoggedIn ? <>
                <div >
                  {isInCart || isPurchased ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  ) : (
                    <FaShoppingCart size={18} className="text-white" />
                  )}
                </div>
                <span className="text-white font-bold text-sm tracking-wider uppercase">
                  {isInCart
                    ? "Added to Cart"
                    : (isPurchased ? "Purchased" : "Add to Cart")}
                </span>
              </> : <span className="text-white font-bold text-sm tracking-wider uppercase">
                Login to add
              </span>}


              {/* <div>
                {isInCart ? (
                  <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                  </div>
                ) : (
                  <FaShoppingCart size={18} className="text-white" />
                )}
              </div>
              <span className="text-white font-bold text-sm tracking-wider uppercase">
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </span> */}
            </div>

            {/* Button Effects */}
            {!isInCart && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            )}
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <div className="w-16 h-16 border-2 border-blue-400/30 rounded-lg transform rotate-45" />
        </div>
        <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <div className="w-12 h-12 border-2 border-pink-400/30 rounded-circle" />
        </div>
      </div >
    </div>
  )
};

const NotificationToast = ({ show, message }) => (
  show && (
    <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in">
      <div className="flex items-center gap-2">
        <FaShoppingCart />
        <span>{message}</span>
      </div>
    </div>
  )
);

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Refs
  const categorySwiperRef = useRef(null);
  const gameSwiperRef = useRef(null);
  const scrollRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);

  const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));

  // State
  const [activeTab, setActiveTab] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedGameTitle, setAddedGameTitle] = useState("");
  const orders = useSelector((state) => state.payment.orders);
  // Add state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10; // Adjust as needed

  // Redux state
  const { games: gameData, category: cateData, loading } = useSelector(
    (state) => state.game,
    shallowEqual
  );
  const { wishlistStatus } = useSelector((state) => state.wishlist);
  const cartItems = useSelector((state) => state.cart.cart);

  // Add pagination state from Redux
  const pagination = useSelector((state) => state.game.pagination);
  const totalPages = pagination?.totalPages || 1;

  // Custom hooks
  const isExploreLoaded = useImageLoader(ExploreGames);
  const {
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove
  } = useMouseDragScroll(categorySwiperRef);



  const userId = useMemo(() =>
    authUser?._id || currentUser?._id || localStorage.getItem("userId"),
    [authUser, currentUser]
  );

  const filteredGames = useMemo(() => {
    if (!activeTab || !gameData) return gameData;
    return gameData.filter(game => game?.category?._id === activeTab);
  }, [gameData, activeTab]);

  const currentSectionTitle = useMemo(() => {
    if (!activeTab) return "All Games";
    const category = cateData?.find(c => c._id === activeTab);
    return `${category?.name || "Category"} Games`;
  }, [activeTab, cateData]);

  // Handlers
  const handleCategoryChange = useCallback((cateId) => {
    setActiveTab(cateId);
    if (gameSwiperRef.current?.slideTo) {
      gameSwiperRef.current.slideTo(0);
    }
  }, []);

  const handleGameClick = useCallback((gameId) => {
    navigate(`/single/${gameId}`);
  }, [navigate]);

  const handleWishlistToggle = useCallback((game) => {
    const isInWishlist = wishlistStatus[game._id];
    if (isInWishlist) {
      dispatch(removeFromWishlist({ gameId: game._id }));
    } else {
      dispatch(addToWishlist({ gameId: game._id }));
    }
  }, [dispatch, wishlistStatus]);

  const handleAddToCart = useCallback((game) => {
    dispatch(addToCart({ gameId: game._id, platform: "windows", qty: 1 }));
    setAddedGameTitle(game.title);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  }, [dispatch]);

  const updateSwiperStates = useCallback((swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  // Add page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Effects
  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchWishlist());
  //     dispatch(fetchCart());
  //   }
  // }, [dispatch, userId]);

  useEffect(() => {
    if (!cateData.length) {
      dispatch(getAllCategories());
    }
  }, [dispatch]);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(allorders());
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentPage != null && gamesPerPage != null && activeTab != null) {
      const handler = setTimeout(() => {
        dispatch(getAllGames({
          page: currentPage,
          limit: gamesPerPage,
          category: activeTab
        }));
      }, 300); // Debounce the API call by 300ms

      return () => {
        clearTimeout(handler); // Clear the timeout if dependencies change before the delay
      };
    }
  }, [currentPage, activeTab, gamesPerPage, dispatch]);



  // Hide scrollbars and navigation
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

  // Handle resize for button states
  useEffect(() => {
    const handleResize = () => {
      if (gameSwiperRef.current) {
        setTimeout(() => updateSwiperStates(gameSwiperRef.current), 200);
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 500);

    return () => window.removeEventListener('resize', handleResize);
  }, [updateSwiperStates]);

  return (
    <>
      {/* <NotificationToast
        show={showAddedToCart}
        message={`${addedGameTitle} added to cart!`}
      /> */}

      <section className="relative">
        <HomeSlider />

        <div className="mx-auto flex flex-col items-center sm:max-w-full">
          <div className="py-4 sm:py-6 md:py-8 lg:py-10 md:w-[85%] w-[95%] mx-auto">

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center mb-6 sm:mb-8 md:mb-10 max-w-[95%] md:max-w-[85%] mx-auto gap-2 sm:gap-3 md:gap-4 px-4 sm:px-0">
              <div
                ref={categorySwiperRef}
                className="flex space-x-2 overflow-x-auto ds_home_scrollbar cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                <CategoryButton
                  category={{ name: 'All Games' }}
                  isActive={activeTab === null}
                  onClick={() => handleCategoryChange(null)}
                />
                {cateData?.map((category) => (
                  <CategoryButton
                    key={category._id}
                    category={category}
                    isActive={activeTab === category._id}
                    onClick={() => handleCategoryChange(category._id)}
                  />
                ))}
              </div>
            </div>

            {/* Header with Navigation */}
            <div className="k-trending-heading mb-4 sm:mb-5 md:mb-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white">
                  {currentSectionTitle}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/allGames')}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 
                    font-medium text-sm transition-all duration-200 ease-out
                    border-[1px] border-[#933BE2]
                    rounded-xl
                    text-white
                    hover:bg-[#933BE2] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  All Games
                </button>
                <button
                  onClick={() => gameSwiperRef.current?.slidePrev()}
                  disabled={isBeginning}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isBeginning
                    ? 'bg-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
                    } text-white rotate-180`}
                >
                  <FaArrowRight size={16} />
                </button>
                <button
                  onClick={() => gameSwiperRef.current?.slideNext()}
                  disabled={isEnd}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isEnd
                    ? 'bg-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
                    } text-white`}
                >
                  <FaArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Games Swiper */}
            {gameData.length > 0 ? filteredGames && filteredGames.length > 0 ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.1}
                breakpoints={SWIPER_BREAKPOINTS}
                style={{ padding: '20px 4px' }}
                className="game-swiper"
                onSwiper={(swiper) => {
                  gameSwiperRef.current = swiper;
                  setTimeout(() => updateSwiperStates(swiper), 100);
                }}
                onSlideChange={updateSwiperStates}
                onResize={updateSwiperStates}
              >
                {filteredGames.map((game) => (
                  <SwiperSlide key={game._id}>
                    <GameCard
                      game={game}
                      onGameClick={handleGameClick}
                      onWishlistToggle={handleWishlistToggle}
                      onAddToCart={handleAddToCart}
                      isInWishlist={wishlistStatus[game._id]}
                      isInCart={cartItems.some(item => item.game?._id === game._id)}
                      orders={orders}
                      isLoggedIn={isLoggedIn}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-10 text-gray-400 text-lg sm:text-xl md:text-2xl">
                No games found for this category.
              </div>
            ) :
              <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.1}
                breakpoints={SWIPER_BREAKPOINTS}>
                <div >
                  {Array.from({ length: 4 }, (_, i) => (
                    <SwiperSlide key={i}>
                      <LazyGameCard key={i} />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>}

          </div>
        </div>

        <TopGames />

        {/* Explore Banner */}
        {isExploreLoaded ? (
          <section className="relative w-full bg-base-600 mx-auto h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden shadow-2xl flex items-center group">
            <img
              src={ExploreGames}
              alt="Explore Games Background"
              className="absolute inset-0 w-full h-full object-cover z-0 transform transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="relative z-10 sm:w-full w-[60%] max-w-[95%] md:max-w-[85%] ps-5 sm:ps-0 sm:mx-auto flex flex-col items-start md:items-start md:text-left text-white">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 leading-tight">
                100+ games, worlds. Explore them all with Stan
              </h2>
              <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
                All of our games, in their most premium editions.
              </p>
              <NavLink
                to="/allGames"
                className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 font-semibold text-sm py-1 px-3 sm:text-base sm:py-2 sm:px-4 md:py-2.5 md:px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                View More
              </NavLink>
            </div>
          </section>
        ) : (
          <ExploreBannerSkeleton />
        )}
      </section>

      <MultiHome />
      <Trailer />
      <ReviewHome />
    </>
  );
}