import React from "react";

const HeroSkeleton = () => {
    return (
        <div className="relative w-full h-[500px] md:h-[500px] xl:h-[700px] bg-gray-200 overflow-hidden">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

            {/* Right Side Content */}
            <div className="absolute left-1/2 inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
                {/* Title */}
                <div className="h-10 w-40 bg-gray-500 rounded mb-4 animate-pulse"></div>

                {/* Subtitle */}
                <div className="h-6 w-80 md:w-96 bg-gray-600 rounded mb-6 animate-pulse"></div>

                {/* Button */}
                <div className="h-10 w-32 bg-gray-500 rounded animate-pulse"></div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-24 left-2/3 transform -translate-x-1/2 flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-500 animate-pulse"></div>
                <div className="w-10 h-10 rounded-full bg-gray-500 animate-pulse"></div>
            </div>

            {/* Bottom Thumbnails */}
            <div className="absolute bottom-4 right-0 transform -translate-x-1/2 flex space-x-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-20 h-28 bg-gray-500 rounded-lg animate-pulse"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HeroSkeleton;
