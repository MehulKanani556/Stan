import React from "react";

const ReviewCardSkeleton = () => {
  return (
    <div className="px-2 sm:px-3">
      <div className="card relative w-full min-h-[320px] md:min-h-[360px] rounded-[18px] border border-[#2d2d2d] bg-gradient-to-br from-[#161616] to-[#1b1b1b] overflow-hidden p-6">
        {/* Background shimmer */}
        <div className="card__bg absolute inset-0 rounded-[18px] bg-gradient-to-tr from-[#902F7E]/20 to-[#6f35ff]/20 animate-pulse"></div>

        {/* Profile image */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-[96px] h-[96px] rounded-full bg-slate-700/50 animate-pulse border-2 border-[#902F7E] shadow-[0_8px_24px_rgba(144,47,126,0.35)]" />

          {/* Name + Game */}
          <div className="text-center mt-3 space-y-2">
            <div className="h-5 w-32 bg-slate-700/50 rounded mx-auto animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-700/50 rounded mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Stars */}
        <div className="flex mb-3 mt-6 justify-center relative z-10 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded bg-slate-700/50 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Review text */}
        <div className="space-y-2 relative z-10">
          <div className="h-4 w-5/6 bg-slate-700/50 rounded mx-auto animate-pulse"></div>
          <div className="h-4 w-3/4 bg-slate-700/50 rounded mx-auto animate-pulse"></div>
          <div className="h-4 w-4/6 bg-slate-700/50 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardSkeleton;
