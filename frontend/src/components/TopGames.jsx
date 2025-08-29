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

const GameCard = (item) => (
  <Link to={`${!item?.platforms?.windows?.price ? `/games` : `/single/${item?._id}`}`} className='block mb-6' >
   <div className=" capitalize flex-none flex-col sm:flex-col xl:flex-row justify-center items-stretch md:items-center gap-4 md:gap-5 p-5  relative rounded-2xl bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl border-purple-500/30 hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-300 cursor-pointer group border hover:shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1 overflow-hidden lg:h-[305px] md:w-full w-full m-auto ">
    <div className="relative overflow-hidden rounded-lg w-full  sm:shrink-0">
      <img
        src={item?.cover_image?.url || item?.image}
        alt={item?.title || item.name}
        className="w-full  xs:h-32 sm:h-48 md:h-60 lg:h-44 rounded-md object-cover flex-shrink-0 md:group-hover:scale-110 transition-transform duration-500"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/240x176/2d2d2d/ffffff?text=Game"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {item?.status && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#ab99e1] text-black shadow-lg">
            {item?.status}
          </span>
        </div>
      )}
    </div>

    <div className="min-w-0 flex-1 w-full">
      <h3 className="text-white text-base sm:text-lg md:text-xl font-bold break-words line-clamp-2 transition-colors duration-300 mb-2 sm:mb-2 mt-2">{item?.title || item.name}</h3>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {!item?.platforms?.windows?.price ? (
            <span className="bg-gradient-to-r from-[#ab99e1] to-[#b8a8e6] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">FREE</span>
          ) : (
            <span className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold">${item?.platforms?.windows?.price}</span>
          )
        }
      </div>
    </div>

   {/* <div className="w-10 h-10 absolute top-1/2 right-8 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ab99e1] to-[#b8a8e6] items-center justify-center shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden group-hover:flex">
      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>  */}
    </div>
  </Link>
);

function TopGames() {
  const dispatch = useDispatch();
  const [length,setLength] = useState(5);
  const game = useSelector((state)=>state.game.games);
  const freeGame = useSelector((state)=>state.freeGame.games);

  useEffect(()=>{
    dispatch(getAllActiveGames())
    dispatch(getFreeGames())
  },[])
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
    const initializeSections = () => {
      const newGames = [...game] // clone the array first
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
      if(game.length < 5 || freeGame.length < 5 || newGames.length < 5 ){
        var minLength = Math.min(game.length,freeGame.length,newGames.length)
        setLength(minLength);
        // console.log('length',minLength)
      }
      else {
        setLength(5);

      }
      const newSections = [
        {
          title: "Top Sellers",
          items: game,
          link:'/store'
        },
        {
          title: "Top Free Games",
          items:freeGame,
          link:'/games'
        },
        {
          title: "New Games",
          items: newGames,
          link:'/store'
        },
      ];
      setSections(newSections);
 
    };
   

    initializeSections();
  }, [game,freeGame]); // Empty dependency array means this runs only once

  return (
    <div className="text-white w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto pb-12 sm:pb-16 md:pb-20">
      <div className="">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Top Games
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Discover the most popular and trending games across all platforms
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:gap-8 gap-5">
          {sections.map((section, i) => (
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
                </div>


                {/* Games List */}
                {/* {console.log(section.items , length)} */}
                <div className="space-y-4 md:space-y-5 lg:space-y-6">
                  {section.items.slice(0,length).map((item, j) => (
                    <GameCard key={j} {...item} />
                  ))}
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
