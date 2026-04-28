import React from 'react'

export default function StylishDiv({ children }) {
    return (
        <div

            className="relative group bg-gradient-to-br p-6 from-[#2e231a]/80 to-[#3d3115]/80 backdrop-blur-xl rounded-2xl  border border-orange-500/30 shadow-md hover:shadow-orange-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden ds_height_manage"
        >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-red-400 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            {children}
        </div>
    )
}
