import React from "react";

const TrailerSkeleton = () => {
  return (
    <section className="relative w-full h-[400px] sm:h-[550px] md:h-[700px] lg:h-[850px] xl:h-[900px] overflow-hidden bg-slate-900">
      {/* Background shimmer (fake video background) */}
      <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

      {/* Overlay content skeleton */}
      <div className="absolute left-6 sm:left-12 md:left-20 bottom-10 w-1/2 z-10 space-y-4">
        {/* Title skeleton */}
        <div className="h-8 sm:h-10 md:h-12 w-3/4 bg-slate-700/70 rounded animate-pulse"></div>

        {/* Description skeleton (3 lines) */}
        <div className="h-4 w-full bg-slate-700/70 rounded animate-pulse"></div>
        <div className="h-4 w-5/6 bg-slate-700/70 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-slate-700/70 rounded animate-pulse"></div>

        {/* Button skeleton */}
        <div className="h-10 w-32 rounded-lg bg-slate-700/80 animate-pulse mt-6"></div>
      </div>
    </section>
  );
};

export default TrailerSkeleton;
