import React, { useState, useEffect } from 'react';
import game1 from '../images/game1.jpg';
import game2 from '../images/game2.jpg';
import game3 from '../images/game3.jpg';
import game4 from '../images/game4.webp';
import game5 from '../images/game5.jpg';
import game6 from '../images/game6.jpg';
import BlockPixels from '../images/Block.Pixels.jpg';
import ColorPuzzle from '../images/ColorPuzzle.jpg';
import GrassLand from '../images/GrassLand.jpg';
import PrettySheepRun from '../images/PrettySheepRun.jpg';
import ShadowFighter from '../images/ShadowFighter.jpg';
import StackCrash3D from '../images/StackCrash3D.jpg';
import LazyCat from '../images/lazy-cat.png';
import { useDispatch, useSelector } from 'react-redux';
import { getAllActiveGames } from '../Redux/Slice/game.slice';
import { getFreeGames } from '../Redux/Slice/freeGame.slice';
import { Link, Links } from 'react-router-dom';
import LazyGameCard from '../lazyLoader/LazyGameCard';
import GameCardSkeleton from '../lazyLoader/GameCardSkeleton';
import TopGamesSkeleton from '../lazyLoader/TopGamesSkeleton';

const GameCard = ({ item, isLoading }) => {
  if (isLoading) {
    return (
      <div className='block mb-6'>
        <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          {/* Image container skeleton */}
          <div className="relative h-48 sm:h-52 overflow-hidden">
            <div className="w-full h-full bg-slate-700 animate-pulse">
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
          </div>

          {/* Content container skeleton */}
          <div className="relative p-5">
            {/* Title skeleton */}
            <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse"></div>
            
            {/* Price/Free badge skeleton */}
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
  }

  return (
    <Link to={`${!item?.platforms?.windows?.price ? `/games` : `/single/${item?._id}`}`} className='block mb-6' >
      <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/60 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 cursor-pointer">

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Image container */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          <img
            src={item?.cover_image?.url || item?.image}
            alt={item?.title || item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/2d2d2d/ffffff?text=Game"; }}
          />

          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Status badge */}
          {item?.status && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 text-black shadow-lg backdrop-blur-sm">
                {item?.status}
              </span>
            </div>
          )}

          {/* Play button overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div> */}
        </div>

        {/* Content container */}
        <div className="relative p-5">
          {/* Title */}
          <h3 className="text-white text-lg font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
            {item?.title || item.name}
          </h3>

          {/* Price/Free badge */}
          <div className="flex items-center justify-between">
            {!item?.platforms?.windows?.price ? (
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  FREE
                </span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">${item?.platforms?.windows?.price}</span>
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
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
};

function TopGames() {
  const dispatch = useDispatch();
  const [length, setLength] = useState(5);
  const game = useSelector((state) => state.game.games);
  const freeGame = useSelector((state) => state.freeGame.games);
  const gameLoading = useSelector((state) => state.game.topGamesInitialLoading);
  const freeGameLoading = useSelector((state) => state.freeGame.topGamesInitialLoading);
  useEffect(() => {
    console.log('TopGames: Dispatching API calls...');
    // dispatch(getAllActiveGames())
    dispatch(getFreeGames())
  }, [])

  // Array of all available game images
  const gameImages = [
    game1, game2, game3, game4, game5, game6,
    BlockPixels, ColorPuzzle, GrassLand, PrettySheepRun,
    ShadowFighter, StackCrash3D, LazyCat
  ];

  // State to store fixed images that won't change on re-renders
  const [sections, setSections] = useState([]);

  // Initialize sections with fixed images only once
  useEffect(() => {
    // Don't initialize sections while loading
    if (gameLoading || freeGameLoading) {
      console.log('TopGames: Skipping section initialization - still loading...');
      return;
    }

    const initializeSections = () => {
      console.log('TopGames: Initializing sections with data:', { game: game.length, freeGame: freeGame.length });
      const newGames = [...game] // clone the array first
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      if (game.length < 5 || freeGame.length < 5 || newGames.length < 5) {
        var minLength = Math.min(game.length, freeGame.length, newGames.length)
        setLength(minLength);
        console.log('TopGames: Setting length to:', minLength);
      }
      else {
        setLength(5);
        console.log('TopGames: Setting length to: 5');
      }
      const newSections = [
        {
          title: "Top Sellers",
          items: game,
          link: '/store'
        },
        {
          title: "Top Free Games",
          items: freeGame,
          link: '/games'
        },
        {
          title: "New Games",
          items: newGames,
          link: '/store'
        },
      ];
      setSections(newSections);
      console.log('TopGames: Sections initialized:', newSections.length);

    };

    initializeSections();
  }, [game, freeGame, gameLoading, freeGameLoading]); // Added loading states to dependencies

  // Show skeleton while loading or if no data is available yet
  if (gameLoading || freeGameLoading || !game || !freeGame || game.length === 0 || freeGame.length === 0) {
    console.log('TopGames: Showing skeleton - loading or no data:', { gameLoading, freeGameLoading, gameLength: game?.length, freeGameLength: freeGame?.length });
    return <TopGamesSkeleton />;
  }

  // Check if we have data but sections are still being initialized
  if (sections.length === 0 && (game.length > 0 || freeGame.length > 0)) {
    console.log('TopGames: Showing skeleton - sections not initialized yet:', { sectionsLength: sections.length, gameLength: game.length, freeGameLength: freeGame.length });
    return <TopGamesSkeleton />;
  }

  // Show loading overlay if data is being refreshed
  const isRefreshing = gameLoading || freeGameLoading;

  // Check if we're in a loading state but have some data
  const isLoadingWithData = (gameLoading || freeGameLoading) && (game.length > 0 || freeGame.length > 0);

  console.log('TopGames: Rendering component with data:', { 
    sectionsLength: sections.length, 
    gameLength: game.length, 
    freeGameLength: freeGame.length,
    isRefreshing,
    isLoadingWithData
  });

  return (
    <div className="text-white w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto pb-12 sm:pb-16 md:pb-20 relative">
      {/* Loading overlay for refresh */}
      <div className="">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Top Games
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Discover the most popular and trending games across all platforms
          </p>
          {/* Loading indicator */}
          {(gameLoading || freeGameLoading) && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:gap-8 gap-5">
          {sections && sections.length > 0 ? (
            sections.map((section, i) => (
              <div key={i}>
                <div className="">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    {/* Icon container */}
                    <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-gradient-to-tr from-[#ab99e1]/30 to-[#7d6bcf]/30 flex items-center justify-center group shadow-md hover:shadow-lg hover:shadow-[#ab99e1]/40 transition-all duration-300">
                      <svg
                        className="sm:w-6 sm:h-6  h-5 w-5 text-[#ab99e1] transition-all duration-300 group-hover:fill-[#ab99e1] group-hover:scale-110"
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

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#ab99e1] tracking-wide">
                      {section.title}
                    </h3>

                    {/* Loading indicator for section */}
                    {isRefreshing && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {/* Games List */}
                  {/* {console.log(section.items , length)} */}
                  <div className="space-y-4 md:space-y-5 lg:space-y-6">
                    {section.items && section.items.length > 0 ? (
                      section.items.slice(0, length).map((item, j) => (
                        <GameCard key={j} item={item} />
                      ))
                    ) : (gameLoading || freeGameLoading) ? (
                      // Show skeleton cards while loading
                      Array.from({ length: 2 }).map((_, j) => (
                        <GameCard key={j} isLoading={true} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No games available
                      </div>
                    )}
                  </div>

                  {/* View All Button */}
                  <Link to={section.link}>
                    <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
                      <button className="w-full sm:py-3 py-2 sm:px-4 px-3 sm:text-base text-sm rounded-xl bg-gradient-to-r from-[#ab99e1]/20 to-[#b8a8e6]/20 hover:from-[#ab99e1]/30 hover:to-[#b8a8e6]/30 border border-[#ab99e1]/30 text-[#ab99e1] font-semibold transition-all duration-300 hover:shadow-lg">
                        View All {section.title}
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (gameLoading || freeGameLoading) ? (
            // Show skeleton while sections are being initialized
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="">
                  {/* Section Header Skeleton */}
                  <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
                    <div className="h-6 sm:h-7 md:h-8 bg-slate-700 rounded-lg w-32 animate-pulse"></div>
                  </div>

                  {/* Games List Skeleton */}
                  <div className="space-y-4 md:space-y-5 lg:space-y-6">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <GameCard key={j} isLoading={true} />
                    ))}
                  </div>

                  {/* View All Button Skeleton */}
                  <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
                    <div className="w-full h-12 bg-slate-700 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No sections available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
