import React from 'react';

export default function BackgroundColor({ children, className = '' }) {
  return (
    <div className={`relative z-10 h-full text-gray-200 ${className}`}>
      {/* Background layer fixed to viewport */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#4B2A64] to-[#3A1E54]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-24 w-[420px] h-[420px] rounded-full bg-[#7B4BA8]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#C459A9]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[320px] h-[320px] rounded-full bg-[#4BB9C7]/15 blur-2xl" />
      </div>
      {children}
    </div>
  );
}
