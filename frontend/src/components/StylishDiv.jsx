import React from 'react'

export default function StylishDiv({ children }) {
    return (
        <div

            className="relative group bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl rounded-2xl p-6  border border-purple-500/30 shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden "
        >
            {/* Floating Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            {children}
        </div>
    )
}
