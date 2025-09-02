import React from 'react';

export default function ProfileSkeleton() {
    return (
        <div className="text-white md:max-w-[85%] max-w-[95%] mx-auto animate-pulse">
            <div className="sticky top-0 z-40 border-b border-white/25">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="h-6 w-24 bg-white/10 rounded" />
                </div>
            </div>

            <div className='flex flex-col md:flex-row items-stretch min-h-[500px]'>
                {/* Side menu */}
                <div className='h-full px-4 py-6'>
                    <div className='xl:w-[300px] md:w-[200px] w-full space-y-3'>
                        {[0,1,2,3].map((i) => (
                            <div key={i} className="h-12 bg-white/10 rounded-2xl" />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className='px-4 py-6 w-full space-y-6'>
                    <div className="rounded-2xl p-6 border border-white/25">
                        <div className='flex justify-end'>
                            <div className="h-6 w-16 bg-white/10 rounded" />
                        </div>
                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden">
                                <div className="w-full h-full bg-white/10" />
                            </div>
                            <div className="h-6 w-48 bg-white/10 rounded mt-3" />
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 border border-white/25 space-y-4">
                        <div className="h-5 w-56 bg-white/10 rounded" />
                        <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg">
                            <div className="h-5 w-5 bg-white/10 rounded" />
                            <div className="flex-1 h-5 bg-white/10 rounded" />
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg">
                            <div className="h-5 w-5 bg-white/10 rounded" />
                            <div className="flex-1 h-5 bg-white/10 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


