import React from 'react';

const HomeGameCardSkeleton = () => (
  <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] mx-auto">
    <div className="group relative overflow-hidden rounded-2xl bg-[#141414] border border-slate-600/50 shadow-lg">
      {/* Image Container Skeleton */}
      <div className="relative w-full h-32 ms:h-48 md:h-52 lg:h-36 xl:h-36 overflow-hidden rounded-2xl bg-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Section Skeleton */}
      <div className="ms:p-4 p-2 md:p-6 ms:space-y-4 space-y-2 bg-gradient-to-br from-slate-700/95 to-slate-800/95">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#06060690] rounded-xl px-2 sm:px-3 sm:py-2 py-2 md:px-4 md:py-3 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-4 bg-slate-600 rounded animate-pulse"></div>
              <div className="w-20 h-6 bg-slate-600 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-6 h-6 bg-slate-600 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="w-full h-12 bg-slate-600/30 rounded-xl animate-pulse mt-4"></div>
      </div>
    </div>
  </div>
);

export default HomeGameCardSkeleton;
