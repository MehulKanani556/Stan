import React from 'react';

const RewardsSkeleton = () => {
  return (
    <section className='pb-10'>
      <div className='max-w-[95%] md:max-w-[85%] m-auto'>
        {/* Gem Balance Section Skeleton */}
        <div className="flex flex-col w-full items-center justify-center md:pt-20 pt-10">
          {/* Large Gem Image Skeleton */}
          <div className="md:w-[150px] w-[100px] h-[150px] md:h-[150px] mb-10 bg-gray-600/30 rounded-full animate-pulse"></div>

          {/* Balance Card Skeleton */}
          <div className="w-full max-w-md bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-600/40 rounded-full animate-pulse"></div>
                <div className="flex flex-col gap-2">
                  <div className="w-24 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                  <div className="w-16 h-6 bg-gray-600/40 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-600/40 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* PhonePe Vouchers Section Skeleton */}
        <div className="py-10 w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
            <div className="w-48 h-6 bg-gray-600/40 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center justify-center pt-8 w-full relative">
            <div className="w-full px-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-center w-full">
                    <div className="bg-black/20 rounded-2xl flex flex-col items-center justify-between p-5 sm:p-6 shadow-lg w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] max-h-[300px] sm:h-[320px]">
                      {/* Voucher Image Skeleton */}
                      <div className="bg-gray-600/40 rounded-xl shadow-md w-full h-32 animate-pulse"></div>
                      {/* Price Skeleton */}
                      <div className="w-16 h-6 bg-gray-600/40 rounded mt-2 animate-pulse"></div>
                      {/* Gems Skeleton */}
                      <div className="bg-gray-600/40 rounded-lg px-4 py-1 flex items-center gap-2 mt-4 w-20 h-8 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amazon Vouchers Section Skeleton */}
        <div className="py-10 w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
            <div className="w-48 h-6 bg-gray-600/40 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center justify-center pt-8 w-full relative">
            <div className="w-full px-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 justify-items-center">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex justify-center w-full">
                    <div className="bg-black/20 rounded-2xl flex flex-col items-center justify-between p-5 sm:p-6 shadow-lg w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] max-h-[300px] sm:h-[320px]">
                      {/* Voucher Image Skeleton */}
                      <div className="bg-gray-600/40 rounded-xl shadow-md w-full h-32 animate-pulse"></div>
                      {/* Price Skeleton */}
                      <div className="w-16 h-6 bg-gray-600/40 rounded mt-2 animate-pulse"></div>
                      {/* Gems Skeleton */}
                      <div className="bg-gray-600/40 rounded-lg px-4 py-1 flex items-center gap-2 mt-4 w-20 h-8 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Section Skeleton */}
        <div className="py-10 w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-600/40 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center justify-center pt-8 w-full relative">
            <div className="w-full px-4">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-items-center">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex justify-center w-full">
                    <div className="bg-gradient-to-br from-gray-600/40 to-gray-700/40 rounded-2xl flex items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-5 lg:p-6 shadow-lg w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
                      {/* Logo Section Skeleton */}
                      <div className="flex flex-col items-center gap-2 min-w-[50px] sm:min-w-[60px] lg:min-w-[70px]">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-500/40 rounded-lg animate-pulse"></div>
                        <div className="w-12 h-3 bg-gray-500/40 rounded animate-pulse"></div>
                      </div>
                      {/* Main Logo Skeleton */}
                      <div className="flex-1 flex justify-center w-full">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gray-500/40 rounded-xl animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Earn With Section Skeleton */}
        <div className="py-10 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-600/40 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Refer & Get Card Skeleton */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 rounded-2xl p-8 backdrop-blur-xl border border-purple-500/30 shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="w-32 h-6 bg-gray-600/40 rounded animate-pulse"></div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-16 h-8 bg-gray-600/40 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                </div>
                <div className="border border-gray-600/40 rounded-lg p-3 py-2 bg-black/30">
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-600/40 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-gray-600/40 rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Earn & Redeem Card Skeleton */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 rounded-2xl p-8 backdrop-blur-xl border border-blue-500/30 shadow-lg">
              <div className="flex flex-col gap-4">
                <div className="w-48 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                <div className="w-32 h-6 bg-gray-600/40 rounded animate-pulse"></div>
                <div className="bg-[#2a2a3e]/70 rounded-lg p-5 border border-gray-600/40">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-600/40 rounded animate-pulse mb-2"></div>
                      <div className="w-16 h-6 bg-gray-600/40 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-12 bg-gray-600/40 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section Skeleton */}
        <div className="py-14 w-full">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-gray-600/40 rounded-full animate-pulse"></div>
            <div className="w-48 h-6 bg-gray-600/40 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-gray-600/40 rounded-xl animate-pulse"></div>
                    <div className="w-5 h-5 bg-gray-600/40 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-32 h-5 bg-gray-600/40 rounded mb-2 animate-pulse"></div>
                    <div className="w-40 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                      <div className="w-4 h-4 bg-gray-600/40 rounded-full animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-600/40 rounded animate-pulse"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-600/40 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button Skeleton */}
          <div className="flex justify-center mt-12">
            <div className="w-32 h-10 bg-gray-600/40 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSkeleton;
