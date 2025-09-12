import React from "react";

const HeroSliderSkeleton2 = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[500px] xl:h-[700px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-xl border border-slate-700/50">
      
      {/* Top Banner Image Skeleton */}
      <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Bottom Content Section */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 px-6 md:px-12 lg:px-20 py-6 flex flex-col justify-center">
        
        {/* Title Skeleton */}
        <div className="h-8 w-48 bg-slate-600 rounded mb-4 animate-pulse"></div>
        
        {/* Description Skeleton */}
        <div className="h-4 w-3/4 bg-slate-500 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-2/3 bg-slate-600 rounded mb-6 animate-pulse"></div>
        
        {/* Button Skeleton */}
        <div className="h-10 w-32 bg-slate-600 rounded-lg animate-pulse"></div>
      </div>

      {/* Pagination Dots Skeleton */}
      {/* <div className="absolute bottom-4 w-full flex justify-center space-x-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-slate-600 animate-pulse"></div>
        ))}
      </div> */}
    </div>
  );
};

export default HeroSliderSkeleton2;
