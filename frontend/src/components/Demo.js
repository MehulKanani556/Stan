import React, { useState, useMemo, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  { id: 1, name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", game: "Resident Evil Village", rating: 5, review: "An absolute masterpiece! The atmosphere is chilling, and the storyline kept me hooked till the end." },
  { id: 2, name: "Maria Gomez", avatar: "https://i.pravatar.cc/150?img=2", game: "The Last of Us Part II", rating: 4, review: "Incredible storytelling and emotional depth. Gameplay is smooth, but pacing could have been tighter." },
  { id: 3, name: "James Lee", avatar: "https://i.pravatar.cc/150?img=3", game: "Minecraft", rating: 5, review: "Endless creativity! It never gets old. Perfect for solo adventures or playing with friends." },
  { id: 4, name: "Sophia Turner", avatar: "https://i.pravatar.cc/150?img=4", game: "Elden Ring", rating: 5, review: "A breathtaking open world with challenging combat. Easily one of the best games I’ve ever played." },
  { id: 5, name: "Ethan Brown", avatar: "https://i.pravatar.cc/150?img=5", game: "Cyberpunk 2077", rating: 4, review: "Amazing world-building and graphics. Still has some bugs, but definitely enjoyable." },
];

export default function Demo() {
  const [selected, setSelected] = useState(0);
  const [offset, setOffset] = useState(0); 
  const [gap, setGap] = useState(340); // dynamic GAP (depends on card width)

  const dragging = useRef(false);
  const startX = useRef(null);
  const n = reviews.length;
  const visibleRange = 2;

  // 🔹 Update GAP responsively based on screen size
  useEffect(() => {
    const updateGap = () => {
      if (window.innerWidth < 640) setGap(260); // mobile
      else if (window.innerWidth < 1024) setGap(300); // tablet
      else setGap(360); // desktop
    };
    updateGap();
    window.addEventListener("resize", updateGap);
    return () => window.removeEventListener("resize", updateGap);
  }, []);

  const handleStart = (e) => {
    dragging.current = true;
    startX.current = e.clientX || e.touches[0].clientX;
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const x = e.clientX || e.touches[0].clientX;
    const diff = x - startX.current;
    setOffset(diff);
  };

  const handleEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const movedSlides = Math.round(offset / gap);
    let newIndex = (selected - movedSlides + n) % n;

    setSelected(newIndex);
    setOffset(0);
  };

  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      let delta = (i - selected + n) % n;
      if (delta > n / 2) delta -= n;

      const abs = Math.abs(delta);
      const visible = abs <= visibleRange;

      const z = 100 - abs;
      const scale = 1 - abs * 0.08;
      const opacity = 1 - abs * 0.18;

      const baseTransform = `translate(-50%, -50%)`;
      const translateX = `translateX(${delta * gap + offset}px)`;
      const transform = `${baseTransform} ${translateX} scale(${scale})`;

      arr.push({
        index: i,
        visible,
        style: visible
          ? { zIndex: z, opacity, transform, transition: dragging.current ? "none" : "transform 0.6s ease, opacity 0.6s ease" }
          : {
              zIndex: 0,
              opacity: 0,
              transform: `${baseTransform} translateX(${(delta >= 0 ? 1 : -1) * (visibleRange + 2) * gap}px) scale(0.7)`,
              pointerEvents: "none",
            },
      });
    }
    return arr;
  }, [selected, n, offset, gap]);

  return (
    <main className="relative flex flex-col items-center">
      {/* Carousel */}
      <div
        id="carousel"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {positions.map((p) => {
          const r = reviews[p.index];
          return (
            <div key={r.id} className="slide" style={p.style}>
              <div className="ds_review_card">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-[90px] h-[90px] rounded-full object-cover border border-gray-700"
                  />
                  <div className="text-center mt-3">
                    <p className="font-semibold text-white">{r.name}</p>
                    <p className="text-sm text-gray-400">{r.game}</p>
                  </div>
                </div>
                <div className="flex mb-3 mt-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 mx-1 ${i < r.rating ? "text-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-[15px] leading-relaxed mt-4 flex-grow text-center">
                  {r.review}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-4">
        {reviews.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === selected ? "bg-white scale-125" : "bg-gray-500"
            }`}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
    </main>
  );
}
