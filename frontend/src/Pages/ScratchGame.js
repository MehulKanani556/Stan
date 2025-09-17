import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScratchCard from "./ScratchCard";
import { SiScratch } from "react-icons/si";
import { 
  FaGamepad, FaCalendarAlt, FaGift, FaTrophy, FaFireAlt, 
  FaStar, FaRocket, FaCoins, FaGem 
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllActiveGames } from "../Redux/Slice/game.slice";
import { createScratchCard, getScratchCard } from "../Redux/Slice/reward.slice";
import gameFallback from "../images/game1.jpg";

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

  const renderPrizeDetails = () => {
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

      return (
        <div 
          className={`text-white relative transform transition-all duration-300 ${interactionEffect}`}
        >
          {/* Floating Trophy Badge */}
          <div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 
            bg-gradient-to-br from-purple-600 to-purple-800 rounded-full p-4 
            shadow-2xl border-4 border-white/20 opacity-40 "
          >
            <FaTrophy className="text-4xl text-yellow-300 " />
          </div>
          
          <div className="mt-8 text-center">
            {/* Game Image with Glowing Effect */}
            <div className="mb-6 relative group">
              <div 
                className="absolute -inset-2 bg-purple-500/30 rounded-lg 
                blur-lg group-hover:opacity-75 transition-all duration-300"
              ></div>
              <div 
                className="relative z-10 overflow-hidden rounded-lg 
                border-4 border-transparent group-hover:border-purple-500 
                transition-all duration-300"
              >
                <img 
                  src={game.cover_image?.url || gameFallback} 
                  alt={game.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 
                  transition-transform duration-300 brightness-90 group-hover:brightness-100"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/70 
                  via-transparent to-black/30 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300"
                />
              </div>
            </div>
            
            {/* Game Title with Animated Icon */}
            <h2 
              className="text-3xl font-bold text-purple-300 mb-2 tracking-wider 
              flex items-center justify-center gap-3 animate-pulse-slow"
            >
              <FaGamepad className="text-purple-500 animate-bounce-slow" />
              {game.title}
              <FaFireAlt className="text-red-500 animate-pulse-slow" />
            </h2>
            
            {/* Prize Message */}
            <p 
              className="text-white/80 mb-4 italic text-xl 
              bg-gradient-to-r from-purple-400 to-pink-600 
              bg-clip-text text-transparent"
            >
              "{prize.reward.message}"
            </p>
            
            {/* Additional Prize Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className="bg-[#2a2a4a] rounded-lg p-4 text-center 
                transform hover:scale-105 transition-transform"
              >
                <FaCalendarAlt 
                  className="mx-auto text-2xl text-purple-400 mb-2 
                  "
                />
                <span className="text-sm text-white/70">
                  {daysLeft > 0 ? `${daysLeft} Days Left` : 'Expires Soon'}
                </span>
              </div>
              <div 
                className="bg-[#2a2a4a] rounded-lg p-4 text-center 
                transform hover:scale-105 transition-transform"
              >
                <FaGift 
                  className="mx-auto text-2xl text-purple-400 mb-2 
                  animate-pulse-slow"
                />
                <span className="text-sm text-white/70">
                  Scratch Card Prize
                </span>
              </div>
            </div>
            
            {/* Play Now Button */}
            {game._id && (
              <button
                onClick={handlePlayNow}
                className="w-full py-3 rounded-xl text-lg font-bold 
                bg-gradient-to-r from-purple-600 to-purple-800 
                text-white hover:from-purple-700 hover:to-purple-900 
                transition-all duration-300 transform hover:scale-105 
                flex items-center justify-center gap-3 
                active:scale-95 group"
              >
                <FaGamepad className="group-active:animate-ping" /> 
                Download
              </button>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div 
        className="text-white text-center bg-gradient-to-br from-purple-600 
        to-purple-900 p-6 rounded-xl animate-float"
      >
        <FaGift 
          className="mx-auto text-5xl text-yellow-300 mb-4 
          animate-bounce-slow"
        />
        <p 
          className="text-2xl text-white font-bold 
          bg-gradient-to-r from-pink-400 to-purple-600 
          bg-clip-text text-transparent"
        >
          {prize.reward.message}
        </p>
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
        className={`fixed inset-0 z-50 flex items-center justify-center 
          bg-black/70 p-4 ${animationClass}`}
        style={{ 
          animation: animationClass ? 
            (animationClass === 'animate-bounce' ? 
              'bounce 0.5s ease-in-out' : 
              'fadeOut 0.3s ease-in-out forwards') 
            : '' 
        }}
      >
        <div 
          className="bg-[#1d1931] rounded-3xl p-6 max-w-md w-full relative 
          shadow-2xl border-4 border-purple-500/30 overflow-hidden 
          transform  transition-transform duration-300"
        >
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-white/70 hover:text-white 
              bg-red-500/20 hover:bg-red-500/40 rounded-full px-2 py-1 
              transition-all duration-300 transform "
          >
            ✕
          </button>
          {renderPrizeDetails()}
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
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-300 flex items-center justify-center gap-3">
          <SiScratch /> Scratch Card Game
        </h1>
        <p className="text-white/70 mt-2">Scratch and win exciting prizes!</p>
      </div>

      {/* Scratch Card Purchase Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cardPrices.map((option, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-center hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-semibold text-purple-300 mb-2">{option.label}</h3>
            <p className="text-white/80 mb-4">${option.price.toFixed(2)}</p>
            <button 
              onClick={() => handlePurchaseScratchCards(option)}
              // disabled={loading}
              className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {  'Buy Now'}
            </button>
          </div>
        ))}
      </div>

      {/* Scratch Card Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...scratchCards]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((prize, index) => (
            <ScratchCard 
              key={index} 
              prize={prize} 
              onDetailsClick={setSelectedPrize} 
            />
        ))}
      </div>

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
