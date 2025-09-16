import React, { useRef, useEffect, useState } from "react";

const ScratchCard = ({ prize }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    initCanvas();
    setRevealed(false);
    setScratchPercentage(0);
  }, [prize]);

  // Initialize scratch surface
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 200;

    ctx.fillStyle = "#C0C0C0"; // Silver background
    ctx.fillRect(0, 0, 300, 200);

    ctx.fillStyle = "#666";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", 150, 90);
    ctx.font = "14px Arial";
    ctx.fillText("TO WIN A PRIZE", 150, 120);
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
    if (scratchPercentage >= 30 && !revealed) {
      revealAll();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 reward-glow">
      <div className="relative mb-4">
        {/* Prize background */}
        <div className="absolute inset-0 bg-yellow-200 rounded-lg flex items-center justify-center border-2 border-yellow-400">
          <div className="text-xl font-bold text-center text-purple-800 px-4">
            {prize}
          </div>
        </div>

        {/* Scratch Canvas */}
        <div className="relative z-10 w-full h-auto rounded-lg overflow-hidden bg-white/10">
          <canvas
            ref={canvasRef}
            className="w-full h-auto cursor-crosshair block"
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

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-white/70 mb-1">
          <span>Scratched: {scratchPercentage.toFixed(0)}%</span>
          {revealed && (
            <span className="text-green-600 font-semibold">🎉 Revealed!</span>
          )}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#b191ff] to-[#621df2] h-2 rounded-full transition-all duration-300"
            style={{ width: `${scratchPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScratchCard;
