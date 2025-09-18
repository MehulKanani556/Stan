import React, { useState } from 'react';
import mountain from '../images/mountain.png'
import mountain1 from '../images/mountain1.jpg'
import bronzehunter from '../images/bronzehunter.png'
const Demo = () => {
    const [userDiamonds, setUserDiamonds] = useState(300);

    // Stage thresholds with dark theme colors
    const stages = [
        { id: 1, name: "Starter Island", threshold: 500, baseColor: "#4B5563", topColor: "#6B7280", icon:bronzehunter },
        { id: 2, name: "Adventure Isle", threshold: 1500, baseColor: "#7C3AED", topColor: "#8B5CF6", icon: mountain },
        { id: 3, name: "Crystal Peaks", threshold: 3000, baseColor: "#059669", topColor: "#10B981", icon: mountain },
        { id: 4, name: "Diamond Kingdom", threshold: 6000, baseColor: "#DC2626", topColor: "#EF4444", icon: mountain }
    ];

    // Calculate current stage and progress
    const getCurrentStage = (diamonds) => {
        for (let i = 0; i < stages.length; i++) {
            if (diamonds < stages[i].threshold) {
                return {
                    currentStage: i,
                    progress: i === 0 ? (diamonds / stages[i].threshold) * 100 :
                        ((diamonds - stages[i - 1].threshold) / (stages[i].threshold - stages[i - 1].threshold)) * 100,
                    previousThreshold: i === 0 ? 0 : stages[i - 1].threshold,
                    nextThreshold: stages[i].threshold
                };
            }
        }
        return {
            currentStage: stages.length,
            progress: 100,
            previousThreshold: stages[stages.length - 1].threshold,
            nextThreshold: stages[stages.length - 1].threshold
        };
    };

    const stageInfo = getCurrentStage(userDiamonds);

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-transparent min-h-screen">
            {/* Header
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">Diamond Journey</h2>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-2xl border border-gray-700/50">
                    <div className="flex items-center justify-center gap-3 text-white">
                        <span className="text-3xl drop-shadow-lg">💎</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            {userDiamonds.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-gray-300 mt-2 font-medium">
                        Stage {Math.min(stageInfo.currentStage + 1, 4)} - {stageInfo.progress.toFixed(1)}% Complete
                    </div>
                </div>
            </div> */}

            {/* Progress Controls */}
            {/* <div className="text-center mb-8">
                <div className="inline-block bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-700/50">
                    <input
                        type="range"
                        min="0"
                        max="7000"
                        value={userDiamonds}
                        onChange={(e) => setUserDiamonds(parseInt(e.target.value))}
                        className="w-80 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(userDiamonds / 7000) * 100}%, #374151 ${(userDiamonds / 7000) * 100}%, #374151 100%)`
                        }}
                    />
                    <div className="mt-3 text-gray-300 text-sm font-medium">Drag to simulate different diamond amounts</div>
                </div>
            </div> */}

            {/* 3D Map Container */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-700/50">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900" style={{ height: '500px' }}>
                    <svg viewBox="0 0 1000 500" className="w-full h-full">
                        {/* SVG Filters for 3D effects */}
                        <defs>
                            <filter id="depth" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" />
                            </filter>
                            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feOffset dx="0" dy="0" />
                                <feGaussianBlur stdDeviation="3" result="offset-blur" />
                                <feFlood floodColor="rgba(0,0,0,0.4)" />
                                <feComposite in2="offset-blur" operator="in" />
                            </filter>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6B7280" />
                                <stop offset="100%" stopColor="#4B5563" />
                            </linearGradient>
                            {/* Stars background */}
                            <pattern id="stars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="30" r="1" fill="rgba(255,255,255,0.3)" />
                                <circle cx="60" cy="10" r="0.8" fill="rgba(255,255,255,0.2)" />
                                <circle cx="80" cy="70" r="1.2" fill="rgba(255,255,255,0.4)" />
                                <circle cx="40" cy="80" r="0.6" fill="rgba(255,255,255,0.3)" />
                                <circle cx="10" cy="60" r="0.9" fill="rgba(255,255,255,0.2)" />
                            </pattern>
                        </defs>

                        {/* Star background */}
                        <rect width="1000" height="500" fill="url(#stars)" opacity="0.5" />

                        {/* Continent-style paths */}
                        {[
                            {
                                from: { x: 180, y: 350 },
                                to: { x: 320, y: 220 },
                                d: "M 180 350 Q 220 300 250 280 Q 280 250 320 220"
                            },
                            {
                                from: { x: 320, y: 220 },
                                to: { x: 580, y: 250 },
                                d: "M 320 220 Q 400 180 450 190 Q 520 200 580 250"
                            },
                            {
                                from: { x: 580, y: 250 },
                                to: { x: 750, y: 320 },
                                d: "M 580 250 Q 640 270 680 280 Q 720 290 750 320"
                            }
                        ].map((path, index) => {
                            const isActive = index < stageInfo.currentStage;
                            const isCurrentPath = index === stageInfo.currentStage - 1 && stageInfo.currentStage > 0;

                            return (
                                <g key={index}>
                                    {/* Path shadow */}
                                    <path
                                        d={path.d}
                                        fill="none"
                                        stroke="rgba(0,0,0,0.6)"
                                        strokeWidth="18"
                                        strokeLinecap="round"
                                        transform="translate(3, 6)"
                                    />
                                    {/* Path base */}
                                    <path
                                        d={path.d}
                                        fill="none"
                                        stroke={isActive ? "#6B7280" : "#374151"}
                                        strokeWidth="16"
                                        strokeLinecap="round"
                                        opacity={isActive ? "1" : "0.4"}
                                    />
                                    {/* Path highlight */}
                                    <path
                                        d={path.d}
                                        fill="none"
                                        stroke={isActive ? "#9CA3AF" : "#4B5563"}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        opacity={isActive ? "0.8" : "0.3"}
                                    />
                                    {/* Moving progress dot */}
                                    {isCurrentPath && (
                                        <circle r="8" fill="#FFD700" filter="url(#glow)">
                                            <animateMotion dur="4s" repeatCount="indefinite" path={path.d} />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}

                        {/* 3D Continent-style Islands */}
                        {stages.map((stage, index) => {
                            const positions = [
                                { x: 180, y: 350, shape: "M -80,-40 Q -60,-60 -20,-55 Q 20,-50 60,-45 Q 80,-30 70,10 Q 50,40 10,45 Q -30,50 -70,30 Q -85,10 -80,-40 Z" },
                                { x: 320, y: 220, shape: "M -70,-50 Q -40,-70 0,-65 Q 40,-60 75,-40 Q 85,-10 80,20 Q 70,50 30,55 Q -10,60 -50,45 Q -75,25 -70,-50 Z" },
                                { x: 580, y: 250, shape: "M -85,-45 Q -50,-75 -10,-70 Q 30,-65 70,-50 Q 90,-20 85,15 Q 75,45 35,50 Q -5,55 -45,40 Q -70,20 -85,-45 Z" },
                                { x: 750, y: 320, shape: "M -75,-55 Q -45,-80 -5,-75 Q 35,-70 70,-55 Q 85,-25 80,10 Q 70,40 30,45 Q -10,50 -50,35 Q -80,15 -75,-55 Z" }
                            ];

                            const pos = positions[index];
                            const isCompleted = userDiamonds >= stage.threshold;
                            const isCurrent = index === stageInfo.currentStage && !isCompleted;
                            const isLocked = index > stageInfo.currentStage;

                            return (
                                <g key={stage.id} transform={`translate(${pos.x}, ${pos.y})`}>
                                    {/* Continent shadow */}
                                    {/* <path
                                        d={pos.shape}
                                        fill="rgba(0,0,0,0.5)"
                                        transform="translate(6, 10)"
                                    /> */}

                                    {/* Continent base (darker) */}
                                    {/* <path
                                        d={pos.shape}
                                        fill={isLocked ? "#374151" : stage.baseColor}
                                        opacity={isLocked ? "0.5" : "1"}
                                        filter="url(#innerShadow)"
                                    /> */}

                                    {/* Continent top layer */}
                                    {/* <path
                                        d={pos.shape}
                                        fill={isLocked ? "#4B5563" : stage.topColor}
                                        opacity={isLocked ? "0.6" : "0.9"}
                                        transform="translate(-2, -4)"
                                    /> */}

                                    {/* Continent highlight */}
                                    {/* <path
                                        d="M -40,-30 Q -20,-40 0,-35 Q 20,-30 35,-20 Q 25,-10 5,-5 Q -15,0 -35,-10 Q -45,-20 -40,-30 Z"
                                        fill="rgba(255,255,255,0.2)"
                                        opacity={isLocked ? "0.1" : "0.3"}
                                    /> */}

                                    {/* Glowing edge for current stage */}
                                    {/* {isCurrent && (
                                        <path
                                            d={pos.shape}
                                            fill="none"
                                            stroke="#FFD700"
                                            strokeWidth="2"
                                            opacity="0.6"
                                            filter="url(#glow)"
                                            transform="translate(-2, -4)"
                                        />
                                    )} */}

                                    {/* Stage icon */}
                                    <image
                                        x="-100"
                                        y="-100"
                                        width="200"
                                        height="200"
                                        href={stage.icon}
                                        className={isLocked ? "grayscale" : ""}
                                        filter="url(#depth)"
                                    />

                                    {/* Progress ring for current stage */}
                                    {/* {isCurrent && (
                                        <circle
                                            cx="0"
                                            cy="0"
                                            r="65"
                                            fill="none"
                                            stroke="#FFD700"
                                            strokeWidth="4"
                                            strokeDasharray={`${(stageInfo.progress / 100) * 408} 408`}
                                            transform="rotate(-90)"
                                            opacity="0.8"
                                            filter="url(#glow)"
                                        />
                                    )} */}

                                    {/* Completion badge */}
                                    {isCompleted && (
                                        <g transform="translate(45, -45)">
                                            <circle cx="3" cy="3" r="18" fill="rgba(34, 197, 94, 0.3)" />
                                            <circle cx="0" cy="0" r="16" fill="#22C55E" filter="url(#depth)" />
                                            <circle cx="0" cy="0" r="12" fill="#4ADE80" />
                                            <text x="0" y="6" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">✓</text>
                                        </g>
                                    )}

                                    {/* Labels */}
                                    <text
                                        x="0"
                                        y="85"
                                        textAnchor="middle"
                                        fontSize="16"
                                        fill="#E5E7EB"
                                        className="font-bold drop-shadow-lg"
                                    >
                                        {stage.name}
                                    </text>
                                    <text
                                        x="0"
                                        y="105"
                                        textAnchor="middle"
                                        fontSize="14"
                                        fill="#9CA3AF"
                                        className="drop-shadow-md"
                                    >
                                        {stage.threshold.toLocaleString()} 💎
                                    </text>
                                </g>
                            );
                        })}

                        {/* Current position indicator */}
                        {stageInfo.currentStage < stages.length && (
                            <g transform={`translate(${180 + stageInfo.currentStage * 190}, ${350 - stageInfo.currentStage * 43})`}>
                                <circle cx="3" cy="-87" r="14" fill="rgba(239, 68, 68, 0.3)" />
                                <circle cx="0" cy="-90" r="12" fill="#EF4444" filter="url(#glow)" />
                                <circle cx="0" cy="-90" r="8" fill="#FCA5A5" />
                                <text x="0" y="-65" textAnchor="middle" fontSize="14" fill="#E5E7EB" className="font-bold drop-shadow-lg">
                                    YOU
                                </text>
                            </g>
                        )}

                        {/* Decorative nebula effects */}
                        <g opacity="0.1">
                            <circle cx="150" cy="100" r="30" fill="url(#stars)" />
                            <circle cx="400" cy="80" r="25" fill="url(#stars)" />
                            <circle cx="700" cy="120" r="35" fill="url(#stars)" />
                            <circle cx="850" cy="150" r="20" fill="url(#stars)" />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Progress Details Cards */}
            {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stages.map((stage, index) => {
                        const isCompleted = userDiamonds >= stage.threshold;
                        const isCurrent = index === stageInfo.currentStage;

                        return (
                            <div
                                key={stage.id}
                                className={`text-center p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm ${isCompleted ? 'bg-green-900/30 border-green-600/30 shadow-lg shadow-green-500/10' :
                                    isCurrent ? 'bg-yellow-900/30 border-yellow-600/30 shadow-lg shadow-yellow-500/10' :
                                        'bg-gray-800/30 border-gray-600/30'
                                    }`}
                            >
                                <div className="text-2xl mb-2 drop-shadow-lg">{stage.icon}</div>
                                <div className="text-sm font-bold text-gray-100 mb-1 drop-shadow-sm">{stage.name}</div>
                                <div className="text-xs text-gray-400 mb-2">{stage.threshold.toLocaleString()} 💎</div>
                                {isCurrent && (
                                    <div className="text-xs font-bold text-yellow-400 drop-shadow-sm">
                                        {stageInfo.progress.toFixed(0)}% Complete
                                    </div>
                                )}
                                {isCompleted && (
                                    <div className="text-xs font-bold text-green-400 drop-shadow-sm">✓ Unlocked</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div> */}

            {/* Next milestone progress bar */}
            {/* {stageInfo.currentStage < stages.length && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-4">
                    <div className="text-center text-gray-300 mb-3">
                        <div className="text-sm font-medium drop-shadow-sm">
                            Next milestone: {(stageInfo.nextThreshold - userDiamonds).toLocaleString()} more diamonds needed
                        </div>
                    </div>
                    <div className="relative w-full bg-gray-700/50 rounded-full h-4 shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-700 shadow-lg"
                            style={{
                                width: `${stageInfo.progress}%`,
                                boxShadow: '0 2px 10px rgba(251, 191, 36, 0.5)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )} */}

            <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(145deg, #FFD700, #FFA500);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(145deg, #FFD700, #FFA500);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3);
          border: none;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default Demo;