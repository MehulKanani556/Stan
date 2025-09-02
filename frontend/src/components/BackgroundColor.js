import React from 'react';

export default function BackgroundColor({ children, className = '' }) {
  return (
    <div className={`relative z-10 min-h-screen text-gray-200 ${className}`}>
      {/* Background layer fixed to viewport */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0f0d12] to-[#141216]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -right-24 w-[420px] h-[420px] rounded-full bg-[#482679]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#972F7C]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[320px] h-[320px] rounded-full bg-[#2F7E90]/20 blur-2xl" />
      </div>
      {children}
    </div>
  );
}