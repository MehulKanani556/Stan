import React from 'react';

const GameCardSkeleton = () => {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-slate-600/50 shadow-xl">

        {/* Image Container Skeleton */}
        <div className="relative w-full h-32 ms:h-48 md:h-52 lg:h-36 xl:h-36 overflow-hidden rounded-t-2xl bg-slate-800">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>

          {/* Top Badge Skeleton */}
          <div className="absolute ms:top-4 ms:left-4 top-1 left-1">
            <div className="w-12 h-6 bg-slate-600 rounded-full animate-pulse"></div>
          </div>

          {/* Wishlist Button Skeleton */}
          <div className="absolute ms:top-4 ms:right-4 top-2 right-2">
            <div className="w-8 h-8 bg-slate-600 rounded-xl animate-pulse"></div>
          </div>

          {/* Game Title Skeleton */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-6 bg-slate-600 rounded animate-pulse w-2/3"></div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="ms:p-4 p-2 md:p-6 ms:space-y-4 space-y-2 bg-gradient-to-br from-slate-700/95 to-slate-800/95">

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#06060690] rounded-xl px-2 sm:px-3 sm:py-2 py-2 md:px-4 md:py-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-16 h-4 bg-slate-600 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-slate-600 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-slate-600 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-slate-600 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="w-full h-10 bg-slate-600 rounded-xl animate-pulse"></div>
        </div>

        {/* Decorative Elements Skeleton */}
        <div className="absolute top-2 left-2 opacity-20">
          <div className="w-16 h-16 border-2 border-slate-600 rounded-lg transform rotate-45 animate-pulse"></div>
        </div>

        <div className="absolute bottom-2 right-2 opacity-20">
          <div className="w-12 h-12 border-2 border-slate-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default GameCardSkeleton;
