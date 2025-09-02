import React from 'react';

const GameCardSkeleton = () => {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl">

        {/* Image Container Skeleton */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>

          {/* Top Badge Skeleton */}
          <div className="absolute top-4 left-4">
            <div className="w-16 h-6 bg-slate-600 rounded-full animate-pulse"></div>
          </div>

          {/* Wishlist Button Skeleton */}
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 bg-slate-600 rounded-xl animate-pulse"></div>
          </div>

          {/* Game Title Skeleton */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4">
              <div className="h-6 bg-slate-600 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-slate-600 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="p-4 sm:p-5 md:p-6 space-y-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95">

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-700/50 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
              {/* Price Skeleton */}
              <div className="flex flex-wrap items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <div className="w-12 h-3 bg-slate-500 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-slate-500 rounded animate-pulse"></div>
                <div className="w-8 h-3 bg-slate-500 rounded animate-pulse"></div>
              </div>

              {/* Size Skeleton */}
              <div className="flex flex-wrap items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <div className="w-10 h-3 bg-slate-500 rounded animate-pulse"></div>
                <div className="w-20 h-6 bg-slate-500 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="w-full h-12 bg-slate-600 rounded-xl animate-pulse"></div>
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
