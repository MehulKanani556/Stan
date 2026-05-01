import React from 'react'

const FreeGamesSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-8">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="w-full max-w-[380px] mx-auto animate-pulse">
            <div className="rounded-2xl bg-[#141414] border border-slate-600/30 overflow-hidden">
              {/* Image Skeleton */}
              <div className="relative w-full h-32 ms:h-48 md:h-52 lg:h-36 xl:h-36 bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              
              {/* Content Skeleton */}
              <div className="ms:p-4 p-2 md:p-6 space-y-4 bg-slate-800/50">
                <div className="bg-slate-700 h-6 rounded-lg w-3/4" />
                
                <div className="bg-slate-700/60 rounded-xl px-3 py-2 sm:py-3 h-12 w-full flex items-center">
                  <div className="h-4 bg-slate-600 rounded w-1/2 ml-2" />
                </div>
                
                <div className="h-10 bg-slate-700 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FreeGamesSkeleton


