import React from 'react';

const TopGamesSkeleton = () => {
  // console.log('is called')
  return (
    <div className="text-white w-full max-w-[95%] md:max-w-[85%] bg-base-600 rounded-box mx-auto pb-12 sm:pb-16 md:pb-20">
      <div className="">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-slate-700 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-5 sm:h-6 md:h-7 lg:h-8 bg-slate-700 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Games Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:gap-8 gap-5">
          {/* Top Sellers Column */}
          <div>
            <div className="">
              {/* Section Header Skeleton */}
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                {/* Icon container skeleton */}
                <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
                {/* Title skeleton */}
                <div className="h-6 sm:h-7 md:h-8 bg-slate-700 rounded-lg w-32 animate-pulse"></div>
              </div>

              {/* Games List Skeleton */}
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {[1, 2].map((item) => (
                  <div key={item} className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                    {/* Image container skeleton */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <div className="w-full h-full bg-slate-700 animate-pulse">
                        {/* Shimmer effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>

                    {/* Content container skeleton */}
                    <div className="relative p-5">
                      {/* Title skeleton */}
                      <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse"></div>
                      
                      {/* Price/Free badge skeleton */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 bg-slate-700 rounded-full w-20 animate-pulse"></div>
                          <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button Skeleton */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
                <div className="w-full h-12 bg-slate-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Top Free Games Column */}
          <div>
            <div className="">
              {/* Section Header Skeleton */}
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                {/* Icon container skeleton */}
                <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
                {/* Title skeleton */}
                <div className="h-6 sm:h-7 md:h-8 bg-slate-700 rounded-lg w-40 animate-pulse"></div>
              </div>

              {/* Games List Skeleton */}
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {[1, 2].map((item) => (
                  <div key={item} className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                    {/* Image container skeleton */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <div className="w-full h-full bg-slate-700 animate-pulse">
                        {/* Shimmer effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>

                    {/* Content container skeleton */}
                    <div className="relative p-5">
                      {/* Title skeleton */}
                      <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse"></div>
                      
                      {/* Price/Free badge skeleton */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 bg-slate-700 rounded-full w-20 animate-pulse"></div>
                          <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button Skeleton */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
                <div className="w-full h-12 bg-slate-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* New Games Column */}
          <div>
            <div className="">
              {/* Section Header Skeleton */}
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                {/* Icon container skeleton */}
                <div className="sm:w-12 sm:h-12 h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
                {/* Title skeleton */}
                <div className="h-6 sm:h-7 md:h-8 bg-slate-700 rounded-lg w-28 animate-pulse"></div>
              </div>

              {/* Games List Skeleton */}
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {[1, 2].map((item) => (
                  <div key={item} className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                    {/* Image container skeleton */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <div className="w-full h-full bg-slate-700 animate-pulse">
                        {/* Shimmer effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>

                    {/* Content container skeleton */}
                    <div className="relative p-5">
                      {/* Title skeleton */}
                      <div className="h-6 bg-slate-700 rounded mb-3 animate-pulse"></div>
                      
                      {/* Price/Free badge skeleton */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 bg-slate-700 rounded-full w-20 animate-pulse"></div>
                          <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button Skeleton */}
              <div className="mt-6 sm:mt-8 pt-6 border-t border-purple-500/30">
                <div className="w-full h-12 bg-slate-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopGamesSkeleton;
