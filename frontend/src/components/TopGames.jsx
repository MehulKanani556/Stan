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

const GameCard = ({ image, title, price, status }) => (
  <div className="flex-none flex-col sm:flex-col xl:flex-row justify-center items-stretch md:items-center gap-4 md:gap-5 p-5  relative rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 hover:from-gray-800/90 hover:to-gray-700/90 transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-[#ab99e1]/50 hover:shadow-xl hover:shadow-[#ab99e1]/20 hover:-translate-y-1 overflow-hidden h-[275px] md:h-[290px] md:w-full sm:w-[80%] w-full m-auto ">
    <div className="relative overflow-hidden rounded-lg w-full  sm:shrink-0">
      <img
        src={image}
        alt={title}
        className="w-full  xs:h-40 sm:h-36 md:h-40 lg:h-44 rounded-md object-cover flex-shrink-0 md:group-hover:scale-110 transition-transform duration-500"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/240x176/2d2d2d/ffffff?text=Game"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Image overlay badge for status */}
      {status && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#ab99e1] text-black shadow-lg">
            {status}
          </span>
        </div>
      )}
    </div>

    <div className="min-w-0 flex-1 w-full">
      <h3 className="text-white text-base sm:text-lg md:text-xl font-bold break-words line-clamp-2 transition-colors duration-300 mb-2 sm:mb-2 mt-2">{title}</h3>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {price && (
          price === "Free" ? (
            <span className="bg-gradient-to-r from-[#ab99e1] to-[#b8a8e6] text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">FREE</span>
          ) : (
            <span className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold">{price}</span>
          )
        )}
      </div>
    </div>

    {/* Hover arrow button */}
    <div className="w-10 h-10 absolute top-1/2 right-8 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ab99e1] to-[#b8a8e6] items-center justify-center shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden group-hover:flex">
      <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

function TopGames() {
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
      const newSections = [
        {
          title: "Top Paid-Ons",
          items: [
            { image: game1, title: "Bee Positive Pack", price: "₹332" },
            { image: game2, title: "Hexed & Haunted Pack", price: "₹1,332" },
            { image: game3, title: "Rocket League S19 Veteran", price: "₹369" },
            { image: game4, title: "Rocket League Rocketeer", price: "₹1,479" },
            { image: game5, title: "Cyberpunk: Phantom Liberty", price: "₹1,499" },
            { image: game6, title: "Shadow Realms Expansion", price: "₹899" },
          ],
        },
        {
          title: "Top Free Games",
          items: [
            { image: BlockPixels, title: "Fortnite Battle Royale", price: "Free" },
            { image: ColorPuzzle, title: "Rocket League", price: "Free" },
            { image: GrassLand, title: "Genshin Impact", price: "Free" },
            { image: PrettySheepRun, title: "Honkai: Star Rail", price: "Free" },
            { image: ShadowFighter, title: "Zenless Zone Zero", price: "Free" },
            { image: StackCrash3D, title: "Apex Legends", price: "Free" },
          ],
        },
        {
          title: "Top New",
          items: [
            { image: game6, title: "Battlefield 6 Open Beta", status: "Live Now", price: "₹899" },
            { image: game1, title: "Prologue Demo", status: "Live Now", price: "₹899" },
            { image: game2, title: "Hell Is Us Demo", status: "Live Now", price: "₹899" },
            { image: game3, title: "Half Sword Demo", status: "Try Now", price: "₹899" },
            { image: game4, title: "EA SPORTS FC™ 25", status: "Demo", price: "₹899" },
            { image: game5, title: "Mystic Forge Demo", status: "Coming Soon", price: "₹899" },
          ],
        },
      ];
      setSections(newSections);
    };

    initializeSections();
  }, []); // Empty dependency array means this runs only once

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto py-12 sm:py-16 md:py-20">
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
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#ab99e1]">
                    {section.title}
                  </h3>
                  <div className="w-12 h-12 rounded-full bg-[#ab99e1]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#ab99e1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                {/* Games List */}
                <div className="space-y-4 md:space-y-5 lg:space-y-6">
                  {section.items.map((item, j) => (
                    <GameCard key={j} {...item} />
                  ))}
                </div>

                {/* View All Button */}
                <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-700/50">
                  <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ab99e1]/20 to-[#b8a8e6]/20 hover:from-[#ab99e1]/30 hover:to-[#b8a8e6]/30 border border-[#ab99e1]/30 text-[#ab99e1] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    View All {section.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopGames;
