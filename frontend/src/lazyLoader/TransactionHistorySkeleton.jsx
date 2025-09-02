import React from 'react';

export default function TransactionHistorySkeleton() {
    return (
        <div className="px-4 py-6 animate-pulse">
            <section className='w-full border border-white/25 rounded-2xl sm:p-6 p-1 text-white flex flex-col'>
                <div className=''>
                    {/* Header */}
                    <div className='flex items-center justify-between px-2 sm:px-4 py-4 backdrop-blur-xl sticky top-0 z-20 border-b border-white/25'>
                        <div className='h-6 w-40 bg-white/10 rounded' />
                        <div className='h-7 w-20 bg-white/10 rounded-xl' />
                    </div>

                    {/* Tabs */}
                    <div className='flex items-center justify-between text-center text-sm md:text-lg backdrop-blur-xl px-4'>
                        {[0,1,2].map((i) => (
                            <div key={i} className='w-1/3 pt-4'>
                                <div className='mx-auto h-4 w-24 bg-white/10 rounded' />
                                <div className='w-full h-1 mt-2 bg-white/10 rounded' />
                            </div>
                        ))}
                    </div>

                    {/* Grid of cards */}
                    <div className='px-3 sm:px-4 py-4 sm:py-6'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'>
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className='relative rounded-3xl p-4 border border-white/20 bg-white/5 overflow-hidden'>
                                    <div className='absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl' />
                                    <div className='absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl' />
                                    <div className='relative'>
                                        <div className='flex justify-between mb-4'>
                                            <div className='space-y-2'>
                                                <div className='h-5 w-40 bg-white/10 rounded' />
                                                <div className='h-4 w-32 bg-white/10 rounded' />
                                            </div>
                                            <div className='h-6 w-12 bg-white/10 rounded' />
                                        </div>
                                        <div className='pt-4 border-t border-white/10'>
                                            <div className='h-4 w-20 bg-white/10 rounded' />
                                            <div className='mt-2 space-y-2'>
                                                <div className='h-4 w-full bg-white/5 rounded' />
                                                <div className='h-4 w-3/4 bg-white/5 rounded' />
                                                <div className='h-4 w-2/3 bg-white/5 rounded' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


