import React, { useState } from "react";
import ScratchCard from "./ScratchCard";
import { SiScratch } from "react-icons/si";

const ScratchGame = () => {
  const prizes = [
    "🎉 WIN $100! 🎉",
    "🏆 JACKPOT $500! 🏆",
    "🎁 FREE GIFT! 🎁",
    "💰 WIN $50! 💰",
    "🎪 TRY AGAIN! 🎪",
  ];

  const [cards, setCards] = useState(generateCards());

  function generateCards() {
    return Array.from({ length: 5 }, () => {
      return prizes[Math.floor(Math.random() * prizes.length)];
    });
  }

  const resetAll = () => {
    setCards(generateCards());
  };

  return (
    <div className="mt-8">
      <h3 className="text-white font-semibold text-base md:text-lg flex items-center gap-2 mb-3">
        <SiScratch className="text-[18px] text-purple-300" /> Scratch
      </h3>

      {/* Multiple cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((prize, index) => (
          <ScratchCard key={index} prize={prize} />
        ))}
      </div>
    </div>
  );
};

export default ScratchGame;
