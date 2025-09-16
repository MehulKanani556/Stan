import React, { useState, useEffect, useCallback, useMemo, use, memo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllActiveGames, getHomeTopGame } from '../Redux/Slice/game.slice';
import { getFreeGames } from '../Redux/Slice/freeGame.slice';
import TopGamesSkeleton from '../lazyLoader/TopGamesSkeleton';

// Constants
const DEFAULT_ITEMS_COUNT = 5;
const MIN_REQUIRED_ITEMS = 5;

const SECTION_CONFIG = [
  {
    title: "Top Sellers",
    dataKey: 'game',
    link: '/store',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    )
  },
  {
    title: "Top Free Games",
    dataKey: 'freeGame',
    link: '/games',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    )
  },
  {
    title: "New Games",
    dataKey: 'newGames',
    link: '/store',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    )
  }
];

// Skeleton GameCard Component
const GameCardSkeleton = () => (
  <div className='block mb-6'>
    <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden aspect-[16/9]">
        <div className="w-full h-full bg-slate-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      </div>
      <div className="relative p-4 sm:p-5">
        <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 bg-slate-700 rounded-full w-20 animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);



// Optimized GameCard Component
const GameCard = React.memo(({ item, isLoading = false }) => {
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/400x300/2d2d2d/ffffff?text=Game";
  }, []);

  if (isLoading) {
    return <GameCardSkeleton />;
  }

  const isFree = !item?.platforms?.windows?.price;
  const linkTo = isFree ? `/games/${item.slug}` : `/single/${item?._id}`;
  const price = item?.platforms?.windows?.price;
  return (
    <Link to={linkTo} className='block '>
      <div className="group relative bg-gradient-to-br cursor-pointer md:mb-0 mb-6 from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/60 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer">

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image container */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={item?.cover_image?.url || item?.image}
            alt={item?.title || item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={handleImageError}
            loading="lazy"
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Status badge */}
          {item?.status && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 text-black shadow-lg backdrop-blur-sm">
                {item.status}
              </span>
            </div>
          )}
        </div>

        {/* Content container */}
        <div className="relative p-4 sm:p-5">
          {/* Title */}
          <h3 className="text-white text-lg font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
            {item?.title || item?.name}
          </h3>

          {/* Price/Free badge */}
          <div className="flex items-center justify-between">
            {isFree ? (
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  FREE
                </span>
                {/* <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />  */}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">${price}</span>
                <span className="text-slate-400 text-sm">USD</span>
              </div>
            )}

            {/* Arrow icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </Link>
  );
});

GameCard.displayName = 'GameCard';

// Section Header Component
const SectionHeader = React.memo(({ title, isRefreshing }) => (
  <div className="flex items-center gap-4 mb-6 sm:mb-8">
    <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-gradient-to-tr from-[#ab99e1]/30 to-[#7d6bcf]/30 flex items-center justify-center group shadow-md hover:shadow-lg hover:shadow-[#ab99e1]/40 transition-all duration-300">
      <svg
        className="sm:w-6 sm:h-6 h-5 w-5 text-[#ab99e1] transition-all duration-300 group-hover:fill-[#ab99e1] group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </div>

    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#ab99e1] tracking-wide">
      {title}
    </h3>

    {/* {isRefreshing && (
      <div className="ml-auto">
        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )} */}
  </div>
));

SectionHeader.displayName = 'SectionHeader';

// Loading Indicator Component
const LoadingIndicator = () => (
  <div className="mt-4 flex items-center justify-center gap-2">
    {[0, 0.1, 0.2].map((delay, i) => (
      <div
        key={i}
        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}
  </div>
);

// Game Section Component
const GameSection = React.memo(({ section, items, length, isRefreshing }) => (
  <div>
    <SectionHeader title={section.title} isRefreshing={isRefreshing} />
    
    <div className="space-y-4 sm:space-y-0 md:grid md:grid-cols-2 md:gap-4 md:gap-5 lg:grid-cols-1 lg:gap-6">
      {items && items.length > 0 ? (
        items.slice(0, length).map((item) => (
        console.log('data',item),
          <GameCard key={item._id || item.id} item={item} />
        ))
      ) : isRefreshing ? (
        Array.from({ length: 2 }, (_, j) => (
          <GameCard key={`skeleton-${j}`} isLoading={true} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-400">
          No games available
        </div>
      )}
    </div>

    <Link to={section.link}>
      <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
        <button className="w-full sm:py-3 py-2 sm:px-4 px-3 sm:text-base text-sm rounded-xl bg-gradient-to-r from-[#ab99e1]/20 to-[#b8a8e6]/20 hover:from-[#ab99e1]/30 hover:to-[#b8a8e6]/30 border border-[#ab99e1]/30 text-[#ab99e1] font-semibold transition-all duration-300 hover:shadow-lg">
          View All {section.title}
        </button>
      </div>
    </Link>
  </div>
));

GameSection.displayName = 'GameSection';

// Main TopGames Component
function TopGames() {
  const dispatch = useDispatch();
  const [length, setLength] = useState(DEFAULT_ITEMS_COUNT);
  
  const Homegames = useSelector(state => ({
    ...state.game.homeTopGame,
    loading: state.game.topGamesInitialLoading
  }), shallowEqual);
  
  console.log('gamesss', Homegames);
  
  // Extract games and loading states once
  
  // Create gameData object directly
  const gameData = useMemo(() => ({
    game: Homegames?.topSelling || [],
    freeGame: Homegames?.freegames || [],
    newGames: Homegames?.newGames || []
  }), [Homegames]);
  
  // Compute loading and data availability
  const isLoading = useMemo(() => {
    return Homegames?.loading;
  }, [Homegames?.loading]);

  // const hasData = gameData.length > 0;
  
  // Calculate display length when appropriate
  useEffect(() => {
    if (isLoading) return;
    // console.log('gameData', gameData , isLoading)
    const minLength = Math.min(
      gameData.game?.length,
      gameData.freeGame?.length,
      gameData.newGames?.length
    );
  
    setLength(minLength < MIN_REQUIRED_ITEMS ? minLength : DEFAULT_ITEMS_COUNT);
  }, [isLoading, gameData]);
  // Fetch data on mount
  useEffect(() => {
    if(!isLoading){
      dispatch(getHomeTopGame());
    }
  }, [dispatch]);

  // Show skeleton while loading or no data
  // if (isLoading) {
  //   return <TopGamesSkeleton />;
  // }

  return (
    <div className="text-white w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-16 sm:pb-14 relative">
      {/* Section Header */}
      <div className="text-center mb-8 ms:mb-16">
        <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
          Top Games
        </h2>
        <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
          Discover the most popular and trending games across all platforms
        </p>
        {/* {isLoading && <LoadingIndicator />} */}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:gap-8 gap-5">
        {SECTION_CONFIG.map((section, i) => (
          <GameSection
            key={section.title}
            section={section}
            items={gameData[section.dataKey]}
            length={length}
            isRefreshing={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(TopGames);