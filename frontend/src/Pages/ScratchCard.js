import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gameFallback from "../images/game1.jpg";
import { revealScratchCard } from "../Redux/Slice/reward.slice";
import { useDispatch } from "react-redux";

const ScratchCard = ({ prize, onDetailsClick }) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(prize.isRevealed);
  const navigate = useNavigate();
  console.log(prize.isRevealed);

  useEffect(() => {
    setRevealed(prize.isRevealed);
    if (prize.isRevealed) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 150;
      // If already revealed, set scratch percentage to 100% and skip canvas initialization
      setScratchPercentage(100);
    } else {
      initCanvas();
      // Only initialize canvas if not revealed
      setScratchPercentage(0);
    }
  }, [prize]);

  // Initialize scratch surface
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 150;

    ctx.fillStyle = "#252327"; // Silver background
    ctx.fillRect(0, 0, 300, 150);

    ctx.fillStyle = "#666";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", 150, 70);
    ctx.font = "14px Arial";
    ctx.fillText("TO WIN A PRIZE", 150, 90);
  };

  const getMousePos = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.type.includes("touch")) {
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const scratch = (e, isStart = false) => {
    if (revealed) return; // stop if already revealed
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getMousePos(canvas, e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 30;

    if (isStart) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.fill();
      setLastPos(pos);
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.fill();
      setLastPos(pos);
    }
    updateProgress();
  };

  const updateProgress = () => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }

    const percent = (transparent / (canvas.width * canvas.height)) * 100;
    setScratchPercentage(Math.min(percent, 100));
  };

  const revealAll = () => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setScratchPercentage(100);
    setRevealed(true);
    dispatch(revealScratchCard({ cardId: prize._id }));
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    scratch(e, true);
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    scratch(e, false);
  };

  const handleEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);

    // ✅ On release, check percentage
    if (scratchPercentage >= 15 && !revealed) {
      revealAll();
    }
  };
  let isExpired = false;
  if (prize?.expiresAt) {
    const now = new Date();
    const expires = new Date(prize.expiresAt);
    isExpired = expires - now <= 0;
  }
  return (
    <div
      className="glass-card rounded-2xl p-4 sm:p-5 reward-glow cursor-pointer"
      onClick={() => (onDetailsClick && revealed) && onDetailsClick(prize)}
    >
      <div className={`relative h-full`}>
        {/* Prize background - always rendered */}
        <div className={`absolute inset-0 rounded-lg overflow-hidden border-2 border-[#1d1931] h-full${isExpired ? " grayscale" : ""}`}>
          {typeof prize === "object" && prize?.reward.type === "game" ? (() => {
            // Calculate expiration
           
            return (
              <div className="w-full h-full relative">
                <img
                  src={prize?.reward?.game?.cover_image?.url || gameFallback}
                  alt={prize?.reward?.game?.title || "Game"}
                  className={`absolute inset-0 w-full h-full object-cover${isExpired ? " grayscale" : ""}`}
                  style={isExpired ? { filter: "grayscale(100%)" } : {}}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
                <div className="relative z-10 h-full flex items-center justify-center px-4">
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">
                      {prize?.reward?.game?.title || "Paid Game"}
                    </div>
                    <div className="text-purple-300 text-sm mt-1">
                      {prize?.reward?.message}
                    </div>
                  </div>
                </div>
                <div
                  className={`absolute ${revealed ? '' : 'hidden'}`}
                  style={{
                    top: "5px",
                    right: "5px",
                    zIndex: 30,
                    // transform: "rotate(45deg)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className=" py-1 rounded-full bg-black/80 text-white text-xs  shadow-lg border border-white/10"
                    style={{
                      minWidth: "64px",
                      textAlign: "center",
                      letterSpacing: "0.02em",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {(() => {
                      if (!prize?.expiresAt) return null;
                      const now = new Date();
                      const expires = new Date(prize.expiresAt);
                      const diffTime = expires - now;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays > 1) {
                        return `${diffDays} d left`;
                      } else if (diffDays === 1) {
                        return `1 d left`;
                      } else if (diffTime > 0) {
                        // Show hours left instead of "Less than 1 day left"
                        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                        return `${diffHours}h left`;
                      } else {
                        return `Expired`;
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="w-full h-full bg-[#171423] flex items-center justify-center">
              <div className="text-xl font-bold text-center text-purple-500 px-4">
                {typeof prize === "object" ? prize?.reward?.message : String(prize?.reward?.message)}
              </div>
            </div>
          )}
        </div>

        {/* Scratch Canvas - Only show if not revealed */}

        <div className="relative z-10 w-full h-auto rounded-lg overflow-hidden bg-white/10 h-full">
          <canvas
            ref={canvasRef}
            className={`w-full h-full  block ${revealed ? '' : 'cursor-crosshair'}`}
            style={{ touchAction: "none" }}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>

      </div>





      {/* {revealed && prize && typeof prize === "object" && prize.reward.type === "game" && prize.reward.game?._id && (
        <div className="mt-3">
          <button
            onClick={() => navigate(`/single/${prize.reward.game._id}`)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300"
          >
            Play now
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ScratchCard;