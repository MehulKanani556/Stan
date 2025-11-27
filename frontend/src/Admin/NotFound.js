import React from 'react'
import { useNavigate } from 'react-router-dom';
import BackgroundColor from '../component/BackgroundColor';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <BackgroundColor>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animate-slide-in {
                    animation: slideIn 0.8s ease-out;
                }

                .animate-bounce-custom {
                    animation: bounce 2s infinite;
                }

                .floating-element-1 {
                    animation-delay: 0s;
                }

                .floating-element-2 {
                    animation-delay: 2s;
                }

                .floating-element-3 {
                    animation-delay: 4s;
                }

                .error-code {
                    background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
                }

                @media (max-width: 768px) {
                    .error-code-mobile { font-size: 6rem !important; }
                    .title-mobile { font-size: 2rem !important; }
                    .subtitle-mobile { font-size: 1rem !important; }
                }
            `}</style>

            <div className="m-0 p-0 box-border min-h-[calc(100vh-70px)] flex items-center justify-center overflow-hidden relative">
                {/* Background Animation */}
                <div className="absolute w-full h-full overflow-hidden z-10">
                    <div className="absolute top-[20%] left-[10%] opacity-50 text-5xl animate-float floating-element-1">
                        🎮
                    </div>
                    <div className="absolute top-[60%] right-[10%] opacity-50 text-5xl animate-float floating-element-2">
                        ⚔️
                    </div>
                    <div className="absolute bottom-[20%] left-[20%] opacity-50 text-5xl animate-float floating-element-3">
                        🏆
                    </div>
                </div>
                {/* Content Container */}
                <div className="relative z-20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl blur opacity-60" />
                    <div className="text-center text-white max-w-[600px] p-8 bg-[#1b1920]/90 border border-white/10 backdrop-blur-lg rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-slide-in z-10 mx-4 md:mx-0">

                        {/* Game Controller Icon */}
                        <div className="text-6xl mb-4 animate-bounce-custom">
                            🎮
                        </div>

                        {/* Error Code */}
                        <div className="text-7xl font-bold mb-4 error-code error-code-mobile">
                            <span className='gradient-text'>404</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl mb-4 drop-shadow-lg title-mobile">
                            No Page Found!
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base mb-8 opacity-90 leading-relaxed subtitle-mobile">
                            Oops! The page you're looking for has respawned elsewhere.<br />
                            Don't worry, even the best players get lost sometimes.
                        </p>

                        {/* Button */}
                        <button
                            className="bg-gradient-primary px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95 w-full max-w-xs"
                            onClick={() => navigate('/admin')}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </BackgroundColor>
    );
}