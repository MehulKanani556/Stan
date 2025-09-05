import React from 'react'

export default function HomesliderSkeleton() {
  return (
    <div className="sp_slider">
      <div className="hidden md:grid grid-cols-12 gap-4 w-full min-h-[500px] lg:min-h-[500px] xl:min-h-[700px]">

        <div className="col-span-12 md:col-span-3 xl:col-span-2">
          <div className="h-[500px] xl:h-[700px] overflow-hidden ">
            <div className="h-full overflow-y-auto no-scrollbar py-3 space-y-3 px-3">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="block w-full rounded-md overflow-hidden bg-black/40"
                >
                  <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                    <div className="w-full h-full rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="col-span-12 md:col-span-6 xl:col-span-8">
          <div className="relative h-[500px] xl:h-[700px] rounded-lg overflow-hidden border border-white/10">
            <div className="absolute inset-0 w-full h-full bg-white/10 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-[1] h-full flex items-end p-6 md:p-8 lg:p-10">
              <div className="max-w-2xl w-full">
                <div className="h-8 md:h-10 lg:h-12 w-2/3 bg-white/20 rounded animate-pulse mb-3" />
                <div className="space-y-2 mb-5">
                  <div className="h-3 md:h-4 w-full bg-white/10 rounded animate-pulse" />
                  <div className="h-3 md:h-4 w-11/12 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 md:h-4 w-10/12 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-9 md:h-10 w-32 bg-white/30 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>


        <div className="col-span-12 md:col-span-3 xl:col-span-2">
          <div className="h-[500px] xl:h-[700px] overflow-hidden ">
            <div className="h-full overflow-y-auto no-scrollbar py-3 space-y-3 px-3">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="block w-full rounded-md overflow-hidden bg-black/40"
                >
                  <div className="w-full h-24 md:h-28 xl:h-32 flex items-center justify-center">
                    <div className="w-full h-full rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="relative w-full sp_slider_dot md:hidden">
        <div className="w-full h-48 sm:h-80 md:h-96 lg:h-[500px] xl:h-[700px]">
          <div className="relative md:flex w-full md:h-[500px] h-[600px] xl:h-[700px] overflow-hidden bg-[#141414]">
            <div className='blob md:w-[60%] w-full h-[600px]'>
              <div className="w-full lg:h-[600px] xl:h-[700px] h-full bg-white/10 animate-pulse" />
            </div>
            <div className='md:w-[40%] w-full md:h-full h-[40%] flex flex-col justify-center 3xl:px-16 xl:px-8 px-4 sp_font'>
              <div className="h-8 md:h-10 w-2/3 bg-white/20 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-3 md:h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-11/12 bg-white/10 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-9/12 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-8 w-28 bg-white/30 rounded animate-pulse mt-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
