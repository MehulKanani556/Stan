import React, { Children } from 'react'

export const Background = ({children}) => {
    return (
        <div className={`relative z-10 min-h-screen `}>
          {/* Background layer fixed to viewport */}
          <div className="fixed inset-0 h-40  w-40 z-100 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0f0d12] to-[#141216]">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full bg-secondary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl" />
          </div>
          {children}
        </div>
      );
}
