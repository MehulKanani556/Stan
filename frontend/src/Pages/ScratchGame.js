import React, { useEffect, useMemo, useState } from "react";
import ScratchCard from "./ScratchCard";
import { SiScratch } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { getAllActiveGames } from "../Redux/Slice/game.slice";

const ScratchGame = () => {
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.game);

  useEffect(() => {
    if (!Array.isArray(games) || games.length === 0) {
      dispatch(getAllActiveGames({ page: 1, limit: 50 }));
    }
  }, [dispatch]);

  const paidGames = useMemo(() => {
    if (!Array.isArray(games)) return [];
    return games.filter((g) => {
      const price = g?.platforms?.windows?.price || g?.platforms?.ios?.price || g?.platforms?.android?.price || 0;
      return typeof price === "number" && price > 0;
    });
  }, [games]);

  const generateCards = () => {
    const total = 4;
    const winnerIndex = Math.floor(Math.random() * total);
    const randomPaidGame = paidGames.length > 0 ? paidGames[Math.floor(Math.random() * paidGames.length)] : null;
    return Array.from({ length: total }, (_, idx) => {
      if (idx === winnerIndex && randomPaidGame) {
        return {
          type: "paid_game",
          game: randomPaidGame,
          label: `🎉 You won: ${randomPaidGame?.title || "Paid Game"}! Tap to play`,
        };
      }
      return { type: "try_again", label: "🎪 Better luck next time! 🎪" };
    });
  };

  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(generateCards());
  }, [paidGames.length]);

  const resetAll = () => {
    setCards(generateCards());
  };

  return (
    <div className="py-8">
      <h3 className="text-white font-semibold text-base md:text-lg flex items-center gap-2 mb-3">
        <SiScratch className="text-[18px] text-purple-300" /> Scratch
      </h3>

      {/* Multiple cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((prize, index) => (
          <ScratchCard key={index} prize={prize} />
        ))}
      </div>
      <div className="mt-6">
        <button onClick={resetAll} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300">
          Shuffle Cards
        </button>
      </div>
    </div>
  );
};

export default ScratchGame;
