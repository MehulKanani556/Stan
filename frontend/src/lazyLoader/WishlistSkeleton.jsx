import React from "react";

export const WishlistSkeletonCard = () => {
  return (
    <div className="bg-black/15 border border-white/10 p-5 md:p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-6 animate-pulse">
      <div className="w-full lg:w-40 h-48 lg:h-40 shrink-0 bg-white/10 rounded-xl" />
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="flex items-start justify-between">
          <span className="h-6 w-20 bg-white/10 rounded-full" />
          <span className="h-6 w-6 bg-white/10 rounded" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-6 w-2/3 bg-white/10 rounded" />
          <div className="h-4 w-40 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="h-7 w-24 bg-white/10 rounded" />
          <div className="h-9 w-28 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const WishlistSkeletonSummary = () => {
  return (
    <div className="bg-black/15 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 h-fit shadow-lg animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-6 w-28 bg-white/10 rounded" />
        <div className="h-6 w-6 bg-white/10 rounded" />
      </div>
      <div className="h-4 w-3/4 bg-white/10 rounded" />
      <div className="flex flex-col gap-3">
        <div className="h-12 w-full bg-white/10 rounded-xl" />
        <div className="h-12 w-full bg-white/10 rounded-xl" />
      </div>
    </div>
  );
};

export default {
  WishlistSkeletonCard,
  WishlistSkeletonSummary,
};

