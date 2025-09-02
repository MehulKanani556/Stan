import React from 'react';

const ExploreBannerSkeleton = () => {
  return (
    <section className="relative w-full bg-base-600 mx-auto h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden shadow-2xl flex items-center">
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>

      {/* Left content skeleton */}
      <div className="relative z-10 sm:w-full w-[60%] max-w-[95%] md:max-w-[85%] ps-5 sm:ps-0 sm:mx-auto flex flex-col items-start md:items-start md:text-left">
        <div className="h-6 sm:h-7 md:h-8 lg:h-10 bg-slate-700/70 rounded mb-3 w-3/4 animate-pulse"></div>
        <div className="h-4 md:h-5 bg-slate-700/70 rounded mb-6 w-2/3 animate-pulse"></div>
        <div className="h-9 md:h-10 w-28 sm:w-32 md:w-36 rounded-full bg-slate-700/80 animate-pulse"></div>
      </div>
    </section>
  );
};

export default ExploreBannerSkeleton;


