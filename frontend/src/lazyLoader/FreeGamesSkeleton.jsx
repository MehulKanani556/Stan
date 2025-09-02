import React from 'react'

const FreeGamesSkeleton = () => {
  return (
    <div className="max-w-[95%] md:max-w-[85%] m-auto pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24 px-3 sm:px-4">
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="h-7 sm:h-8 md:h-10 w-40 sm:w-56 md:w-64 bg-white/10 rounded animate-pulse" />
        <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full animate-pulse" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 rounded-full animate-pulse" />
          <div className="h-9 sm:h-10 px-10 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#2b2737] to-[#1a1823] shadow-lg shadow-purple-900/40">
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
            <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
              <div className="h-5 sm:h-6 w-2/3 bg-white/20 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FreeGamesSkeleton


