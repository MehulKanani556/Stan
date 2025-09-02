 import React from 'react';
 
 export default function OrderListSkeleton({ count = 6 }) {
     const cards = Array.from({ length: count }, (_, i) => i);
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
            {cards.map((i) => (
                <div key={i} className="relative bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl rounded-3xl p-4 border border-white/10 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-2xl opacity-10"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-white/10" />
                            <div>
                                <div className="h-4 w-36 bg-white/10 rounded mb-1" />
                                <div className="h-3 w-28 bg-white/10 rounded" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-5 w-20 bg-white/10 rounded-full mb-2" />
                            <div className="h-6 w-12 bg-white/10 rounded ml-auto" />
                        </div>
                    </div>

                    {/* Items Preview */}
                    <div className="mb-3 space-y-2">
                        {[0, 1].map((j) => (
                            <div key={j} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10" />
                                    <div>
                                        <div className="h-3 w-40 bg-white/10 rounded mb-1" />
                                        <div className="h-3 w-20 bg-white/10 rounded" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="h-4 w-10 bg-white/10 rounded ml-auto" />
                                    <div className="h-3 w-16 bg-white/10 rounded mt-1 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-10 bg-white/10 rounded" />
                            <div className="h-3 w-10 bg-white/10 rounded" />
                        </div>
                        <div className="h-7 w-24 bg-white/10 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}


