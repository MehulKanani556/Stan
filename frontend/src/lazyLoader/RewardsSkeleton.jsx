import React from 'react';

const RewardsSkeleton = () => {
  return (
    <section className='pb-12 overflow-x-hidden'>
      <div className='max-w-[90%] md:max-w-[85%] m-auto overflow-x-hidden'>
        {/* Hero skeleton */}
        <div className='relative mt-6 sm:mt-10 md:mt-16 rounded-2xl sm:rounded-3xl bg-white/5 overflow-hidden'>
          <div className='relative z-10 px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6'>
            <div className='w-full lg:w-auto'>
              <div className='h-6 w-40 bg-white/10 rounded-full animate-pulse mb-3' />
              <div className='h-8 sm:h-10 md:h-12 w-56 sm:w-72 md:w-96 bg-white/10 rounded-lg animate-pulse' />
              <div className='mt-3 h-4 w-72 sm:w-96 md:w-[32rem] bg-white/10 rounded animate-pulse' />
            </div>
            <div className='flex flex-row items-center gap-2 sm:gap-6 w-full lg:w-auto'>
              <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[110px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                <div className='h-3 w-20 bg-white/10 rounded mx-auto animate-pulse' />
                <div className='h-8 sm:h-9 md:h-10 w-24 bg-white/10 rounded mt-2 mx-auto animate-pulse' />
              </div>
              <div className='glass-card rounded-2xl p-3 sm:p-4 min-w-[110px] sm:min-w-[140px] text-center w-full sm:w-auto'>
                <div className='h-3 w-20 bg-white/10 rounded mx-auto animate-pulse' />
                <div className='h-8 sm:h-9 md:h-10 w-24 bg-white/10 rounded mt-2 mx-auto animate-pulse' />
              </div>
            </div>
          </div>
        </div>

        {/* Top grid: My Points + Earn more points */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10'>
          {/* My Points card */}
          <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 reward-glow h-fit'>
            <div className='h-4 w-28 bg-white/10 rounded mb-4 sm:mb-5 animate-pulse' />
            <div className='bg-[#171423] rounded-xl p-4 sm:p-6 md:p-7 border border-white/10'>
              <div className='h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 bg-white/10 rounded-full mx-auto mb-3 animate-pulse' />
              <div className='h-8 sm:h-10 md:h-12 w-24 sm:w-28 md:w-32 bg-white/10 rounded mx-auto animate-pulse' />
              <div className='h-4 w-24 bg-white/10 rounded mx-auto mt-3 animate-pulse' />
              <div className='h-4 w-40 bg-white/10 rounded mx-auto mt-3 animate-pulse' />
            </div>
          </div>

          {/* Earn more points list */}
          <div className='glass-card rounded-2xl p-4 sm:p-6 md:p-7 reward-glow'>
            <div className='flex items-center justify-between mb-4 sm:mb-5'>
              <div className='h-4 w-32 bg-white/10 rounded animate-pulse' />
              <div className='h-3 w-20 bg-white/10 rounded animate-pulse' />
            </div>
            <div className='space-y-3 sm:space-y-4'>
              {[1,2,3].map(i => (
                <div key={i} className='flex items-center justify-between bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10'>
                  <div className='flex items-center gap-3 sm:gap-4'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 animate-pulse' />
                    <div>
                      <div className='h-4 w-40 sm:w-48 bg-white/10 rounded animate-pulse' />
                      <div className='h-3 w-20 bg-white/10 rounded mt-2 animate-pulse' />
                    </div>
                  </div>
                  <div className='h-8 w-20 bg-white/10 rounded-lg animate-pulse' />
                </div>
              ))}
              <div className='w-full h-10 rounded-xl bg-white/10 animate-pulse' />
            </div>
          </div>
        </div>

        {/* Daily Tasks + Weekly Quests */}
        <div className='mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
          {/* Daily tasks */}
          <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='h-4 w-28 bg-white/10 rounded animate-pulse' />
              <div className='h-3 w-16 bg-white/10 rounded animate-pulse' />
            </div>
            <div className='space-y-3'>
              {[1,2,3].map(i => (
                <div key={i} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='h-4 w-36 bg-white/10 rounded animate-pulse' />
                    <div className='h-3 w-10 bg-white/10 rounded animate-pulse' />
                  </div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='h-3 w-16 bg-white/10 rounded animate-pulse' />
                    <div className='h-3 w-10 bg-white/10 rounded animate-pulse' />
                  </div>
                  <div className='w-full h-2 bg-white/10 rounded animate-pulse' />
                  <div className='w-full h-8 bg-white/10 rounded-lg mt-3 animate-pulse' />
                </div>
              ))}
            </div>
          </div>

          {/* Weekly quests */}
          <div className='glass-card rounded-2xl p-4 sm:p-6 lg:col-span-2 reward-glow'>
            <div className='flex items-center justify-between mb-4'>
              <div className='h-4 w-28 bg-white/10 rounded animate-pulse' />
              <div className='h-3 w-20 bg-white/10 rounded animate-pulse' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4'>
              {[1,2,3,4].map(i => (
                <div key={i} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10'>
                  <div className='h-4 w-40 bg-white/10 rounded animate-pulse' />
                  <div className='flex items-center justify-between mt-2'>
                    <div className='h-3 w-16 bg-white/10 rounded animate-pulse' />
                    <div className='h-3 w-10 bg-white/10 rounded animate-pulse' />
                  </div>
                  <div className='mt-3 w-full h-2 bg-white/10 rounded animate-pulse' />
                  <div className='mt-3 w-full h-8 bg-white/10 rounded-lg animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Redeem grid */}
        <div className='mt-8 sm:mt-12'>
          <div className='flex items-center justify-between mb-3'>
            <div className='h-4 w-24 bg-white/10 rounded animate-pulse' />
            <div className='h-3 w-24 bg-white/10 rounded animate-pulse' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className='glass-card rounded-2xl p-3 sm:p-4 md:p-5 reward-glow'>
                <div className='bg-white/10 h-28 sm:h-32 md:h-40 rounded-xl mb-3 sm:mb-4 animate-pulse' />
                <div className='h-4 w-40 bg-white/10 rounded animate-pulse' />
                <div className='mt-3 h-4 w-20 bg-white/10 rounded animate-pulse' />
                <div className='mt-3 w-full h-2 bg-white/10 rounded animate-pulse' />
                <div className='mt-4 w-full h-8 bg-white/10 rounded-xl animate-pulse' />
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard & Activity */}
        <div className='mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8'>
          <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow lg:col-span-2'>
            <div className='flex items-center justify-between mb-4'>
              <div className='h-4 w-32 bg-white/10 rounded animate-pulse' />
              <div className='h-3 w-24 bg-white/10 rounded animate-pulse' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
              {[1,2,3,4].map(i => (
                <div key={i} className='bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 flex items-center justify-between'>
                  <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
                    <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 animate-pulse' />
                    <div className='min-w-0 flex-1'>
                      <div className='h-4 w-32 bg-white/10 rounded animate-pulse' />
                      <div className='h-3 w-20 bg-white/10 rounded mt-2 animate-pulse' />
                    </div>
                  </div>
                  <div className='h-4 w-16 bg-white/10 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
          <div className='glass-card rounded-2xl p-4 sm:p-6 reward-glow'>
            <div className='h-4 w-32 bg-white/10 rounded mb-4 animate-pulse' />
            <div className='space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-auto pr-1'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3'>
                  <div className='min-w-0 flex-1'>
                    <div className='h-4 w-40 bg-white/10 rounded animate-pulse' />
                    <div className='h-3 w-24 bg-white/10 rounded mt-2 animate-pulse' />
                  </div>
                  <div className='h-4 w-10 bg-white/10 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className='mt-8 sm:mt-12'>
          <div className='flex items-center justify-between mb-3'>
            <div className='h-4 w-40 bg-white/10 rounded animate-pulse' />
            <div className='h-3 w-24 bg-white/10 rounded animate-pulse' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {[1,2,3,4].map(i => (
              <div key={i} className='glass-card rounded-2xl p-4 sm:p-5 reward-glow'>
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-10 h-10 rounded-full bg-white/10 animate-pulse' />
                  <div className='min-w-0 flex-1'>
                    <div className='h-4 w-32 bg-white/10 rounded animate-pulse' />
                    <div className='h-3 w-20 bg-white/10 rounded mt-2 animate-pulse' />
                  </div>
                </div>
                <div className='w-full h-2 bg-white/10 rounded animate-pulse' />
                <div className='flex items-center justify-between mt-2'>
                  <div className='h-3 w-12 bg-white/10 rounded animate-pulse' />
                  <div className='h-3 w-10 bg-white/10 rounded animate-pulse' />
                </div>
                <div className='mt-3 w-full h-8 bg-white/10 rounded-xl animate-pulse' />
              </div>
            ))}
          </div>
          <div className='mt-3 h-3 w-48 bg-white/10 rounded animate-pulse' />
        </div>
      </div>
    </section>
  );
};

export default RewardsSkeleton;
