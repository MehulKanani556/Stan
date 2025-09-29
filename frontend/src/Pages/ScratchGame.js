import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScratchCard from "./ScratchCard";
import { SiScratch } from "react-icons/si";
import {
  FaGamepad, FaCalendarAlt, FaGift, FaTrophy, FaFireAlt,
  FaStar, FaRocket, FaCoins, FaGem,
  FaArrowLeft
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllActiveGames } from "../Redux/Slice/game.slice";
import { createScratchCard, getScratchCard } from "../Redux/Slice/reward.slice";
import gameFallback from "../images/game1.jpg";
import { CgCloseO } from "react-icons/cg";

const PrizeConfetti = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const generateConfetti = () => {
      const confettiCount = 50;
      const newConfetti = Array.from({ length: confettiCount }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        color: [
          'text-purple-500', 'text-pink-500', 'text-yellow-500',
          'text-blue-500', 'text-green-500'
        ][Math.floor(Math.random() * 5)],
        size: `text-${['xs', 'sm', 'base', 'lg'][Math.floor(Math.random() * 4)]}`,
        icon: [
          FaStar, FaGem, FaRocket, FaCoins
        ][Math.floor(Math.random() * 4)]
      }));
      setConfetti(newConfetti);
    };

    generateConfetti();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`absolute animate-falling-confetti ${item.color} ${item.size}`}
            style={{
              left: item.left,
              animationDelay: item.animationDelay,
              top: '-20px'
            }}
          >
            <Icon />
          </div>
        );
      })}
    </div>
  );
};

const ScratchCardDetailsModal = ({ prize, onClose }) => {
  const navigate = useNavigate();
  const [animationClass, setAnimationClass] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [interactionEffect, setInteractionEffect] = useState('');

  let isExpired = false;
  if (prize?.expiresAt) {
    const now = new Date();
    const expires = new Date(prize.expiresAt);
    isExpired = expires - now <= 0;
  }
  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!prize) return null;

  const renderPrizeDetails = ({ onClose }) => {
    if (prize.reward.type === "game") {
      const game = prize.reward.game;
      const expirationDate = new Date(prize.expiresAt);
      const daysLeft = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24));

      const handlePlayNow = () => {
        setInteractionEffect('animate-ping');
        setTimeout(() => {
          // Download the game file if download_link exists
          if (game?.download_link) {
            window.open(game.download_link);
          }
          onClose();
        }, 300);
      };
      let isExpired = false;
      if (prize?.expiresAt) {
        const now = new Date();
        const expires = new Date(prize.expiresAt);
        isExpired = expires - now <= 0;
      }

      return (
        <div
          className="relative w-full  sm:p-6 p-4 rounded-3xl 
         from-gray-900/90 via-purple-900/60 to-black/80 
        backdrop-blur-2xl shadow-[0_0_25px_rgba(168,85,247,0.5)] 
        border border-purple-500/30 overflow-hidden 
        animate-fadeInUp"
        >

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white 
            bg-red-500/30 hover:bg-red-500/50 rounded-full py-1 px-1 transition-all z-[1]"
          >
            <CgCloseO className="text-xl" />
          </button>

          {/* Floating Trophy Badge */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
            <div className=" from-purple-500 to-purple-800 
            rounded-full ms:p-5 p-3 shadow-2xl border-4 border-white/20 
            animate-bounce-slow ring-4 ring-purple-500/40">
              <FaTrophy className="ms:text-5xl text-3xl text-yellow-300 drop-shadow-lg" />
            </div>
          </div>

          {/* Game Image */}
          <div className="ms:mt-7  relative group rounded-2xl overflow-hidden">
            <img
              src={game.cover_image?.url || gameFallback}
              alt={game.title}
              className="w-full h-64 object-cover rounded-2xl 
              transform transition-transform duration-500 
              group-hover:scale-110 brightness-90 group-hover:brightness-100"
            />
            {/* Neon overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
            opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute -inset-1 rounded-2xl border border-purple-500/50 blur opacity-40 group-hover:opacity-70"></div>
          </div>

          {/* Title */}
          <h2
            className="mt-6 text-center ms:text-3xl text-2xl font-extrabold text-purple-300 
            flex items-center justify-center gap-3 tracking-wide"
          >
            <FaGamepad className="text-purple-500 animate-bounce" />
            {game.title}
            <FaFireAlt className="text-red-500 animate-pulse" />
          </h2>

          {/* Prize Message */}
          <p
            className="mt-3 text-center ms:text-xl text-lg italic font-medium 
            bg-gradient-to-r from-purple-400 to-pink-500 
            bg-clip-text text-transparent"
          >
            "{prize.reward.message}"
          </p>

          {/* Info Badges */}
          <div className="mt-6 grid sm:grid-cols-2 grid-cols-2 sm:gap-4 gap-2">
            <div
              className="bg-white/10 backdrop-blur-md rounded-xl sm:p-4 p-2 
              text-center border border-purple-500/30 
              hover:scale-105 hover:shadow-purple-500/30 transition-all"
            >
              <FaCalendarAlt className="mx-auto text-2xl text-purple-400 mb-2" />
              <span className="text-sm text-white/80">
                {daysLeft > 0 ? `${daysLeft} Days Left` : "Expires Soon"}
              </span>
            </div>
            <div
              className="bg-white/10 backdrop-blur-md rounded-xl sm:p-4 p-2 
              text-center border border-purple-500/30 
              hover:scale-105 hover:shadow-purple-500/30 transition-all"
            >
              <FaGift className="mx-auto text-2xl text-pink-400 mb-2 animate-pulse" />
              <span className="text-sm text-white/80">Scratch Card Prize</span>
            </div>
          </div>

          {/* Download Button */}
          {game._id && (
            <button
              onClick={isExpired ? handleClose : handlePlayNow}
              className="mt-6 w-full py-4 rounded-xl text-lg font-bold 
              bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 
              shadow-[0_0_20px_rgba(236,72,153,0.5)] text-white 
              hover:from-purple-700 hover:via-pink-700 hover:to-purple-900 
              transition-all duration-300 hover:scale-105 active:scale-95 
              flex items-center justify-center gap-3 relative"
            >
              {isExpired ? (
                <>
                  <FaArrowLeft className="group-active:animate-ping" />
                  Back
                </>
              ) : (
                <>
                  <FaGamepad className="group-active:animate-ping" />
                  Download
                </>
              )}
            </button>
          )}

        </div>
      );
    }

    return (
      <div
        className="relative w-full sm:p-6 p-4 rounded-3xl 
        from-gray-900/90 via-purple-900/60 to-black/80 
        backdrop-blur-2xl shadow-[0_0_25px_rgba(168,85,247,0.5)] 
        border border-purple-500/30 overflow-hidden 
        animate-fadeInUp"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white 
          bg-red-500/30 hover:bg-red-500/50 rounded-full py-1 px-1 transition-all z-[1]"
        >
          <CgCloseO className="text-xl" />
        </button>

        <div className="flex flex-col items-center justify-center py-12">
          <FaGift className="text-6xl text-yellow-300 mb-6 animate-bounce" />
          <p
            className="text-2xl font-bold text-center 
            bg-gradient-to-r from-pink-400 to-purple-600 
            bg-clip-text text-transparent"
          >
            {prize.reward.message}
          </p>
        </div>
      </div>
    );

  };

  const handleClose = () => {
    setAnimationClass('animate-fade-out');
    setShowConfetti(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {showConfetti && <PrizeConfetti />}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center 
        bg-black/30 backdrop-blur-lg p-4 ${animationClass}`}
      >
        <div
          className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl 
    shadow-[0_0_40px_rgba(168,85,247,0.6)] scrollbar-thin scrollbar-thumb-purple-500/50"
        >
          {/* Close Button */}

          {renderPrizeDetails({ onClose })}
        </div>
      </div>
    </>
  );
};

const ScratchGame = () => {
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.game);
  const { scratchCard: scratchCards, error } = useSelector((state) => state.reward);

  const [selectedPrize, setSelectedPrize] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const [cardPrices] = useState([
    { price: 1.99, label: "Basic Pack" },
    { price: 4.99, label: "Premium Pack" },
    { price: 9.99, label: "Ultimate Pack" }
  ]);

  useEffect(() => {
    if (!Array.isArray(games) || games.length === 0) {
      dispatch(getAllActiveGames({ page: 1, limit: 50 }));
    }
    if (!Array.isArray(scratchCards) || scratchCards.length === 0) {
      dispatch(getScratchCard());
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

  const handlePurchaseScratchCards = (priceOption) => {
    dispatch(createScratchCard({
      type: priceOption.price
    }));
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-left">
          <h3 className='text-white font-semibold text-base md:text-lg flex items-center gap-2'><SiScratch className='text-purple-300' /> Scratch Card Game</h3>
          <p className="text-sm sm:text-base md:text-lg text-white/70 mt-2">Scratch and win exciting prizes!</p>
        </div>
        {Array.isArray(scratchCards) && scratchCards.length > 8 && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300"
            >
              {showAll ? 'View less' : 'View all'}
            </button>
          </div>
        )}
      </div>

      {/* Scratch Card Purchase Options */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cardPrices.map((option, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-center hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold text-purple-300 mb-2">{option.label}</h3>
            <p className="text-white/80 mb-4">${option.price.toFixed(2)}</p>
            <button
              onClick={() => handlePurchaseScratchCards(option)}
              className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {'Buy Now'}
            </button>
          </div>
        ))}
      </div> */}

      {/* Scratch Card Display */}
      {Array.isArray(scratchCards) && scratchCards.length > 0 ? (
        <div className="grid ms:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3 gap-4">
          {[...scratchCards]
            .reverse().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, showAll ? undefined : 8)
            .map((prize, index) => (
              <ScratchCard
                key={index}
                prize={prize}
                onDetailsClick={setSelectedPrize}
              />
            ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16">
          <p className="text-white/70 text-center">
            No scratch cards available right now.
          </p>
        </div>
      )}



      {/* Modal */}
      {selectedPrize && (
        <ScratchCardDetailsModal
          prize={selectedPrize}
          onClose={() => setSelectedPrize(null)}
        />
      )}
    </div>
  );
};

export default ScratchGame;
