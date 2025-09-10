import React, { useState, useEffect, useRef } from "react";
import "../App.css";

const PuzzleCaptcha = ({ 
    sliderBarTitle = "Slide to verify",
    cardTitle = "Complete the puzzle",
    initialColor = "#4F46E5",
    successColor = "#10B981",
    imageWidth = 320,
    imageHeight = 150,
    pieceWidth = 50,
    pieceHeight = 50,
    tolerance = 10,
    showResetBtn = true,
    onSuccess = () => {},
    onFailure = () => {}
}) => {
    const maxCanvasWidth = 320;
    const renderWidth = Math.min(imageWidth, maxCanvasWidth);
    const renderHeight = imageHeight;

    const canvasRef = useRef(null);      // Background image with star hole
    const pieceCanvasRef = useRef(null); // Draggable star-shaped puzzle piece
    const wrapperRef = useRef(null);     // Responsive wrapper
    const [scale, setScale] = useState(1);
    const [gapX, setGapX] = useState(0); // X-coordinate of the star gap
    const [gapY, setGapY] = useState(0); // Y-coordinate of the star gap
    const [sliderValue, setSliderValue] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load a random image and pick a star gap in the right half of the image.
    const loadImage = () => {
        setIsLoading(true); // Begin loading
        const sources = [
            `https://picsum.photos/${renderWidth}/${renderHeight}?random=${Math.random()}`,
            `https://placekitten.com/${renderWidth}/${renderHeight}`,
            `https://dummyimage.com/${renderWidth}x${renderHeight}/ccc/000?text=Puzzle Captcha`
        ];
        let index = 0;

        function tryNext() {
            if (index >= sources.length) {
                // All failed
                setIsLoading(false);
                // Maybe set an error state or fallback UI
                return;
            }
            const newImg = new Image();
            newImg.crossOrigin = "anonymous"; // enable cross-origin
            newImg.src = `https://picsum.photos/${renderWidth}/${renderHeight}?random=${Math.random()}`;
            newImg.onload = () => {
                setIsLoading(false); // Done loading

                // Position the star gap in the right half of the image so user must slide from left to right.
                const minX = Math.floor(renderWidth / 2);
                const maxX = renderWidth - pieceWidth - 10;
                const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

                // Random y position (with small margins)
                const minY = 10;
                const maxY = renderHeight - pieceHeight - 10;
                const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

                setGapX(x);
                setGapY(y);
                setSliderValue(0);
                setIsSolved(false);

                drawBackground(newImg, x, y);
                drawStarPiece(newImg, x, y);
            };

            newImg.onerror = () => {
                tryNext();
            };
        }

        tryNext();
    };

    // Draw the background image and create a star-shaped hole (semi-transparent).
    const drawBackground = (image, x, y) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, renderWidth, renderHeight);
        ctx.drawImage(image, 0, 0, renderWidth, renderHeight);

        // Draw the star hole
        ctx.save();
        ctx.beginPath();
        createStarPath(
            ctx,
            x + pieceWidth / 2, // center X
            y + pieceHeight / 2, // center Y
            5,                   // star points
            pieceWidth * 0.45,   // outer radius
            pieceWidth * 0.2     // inner radius
        );

        // Fill the hole with semi-transparent overlay
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fill();

        // Add a white outline around the star hole
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    };

    // Draw the star puzzle piece by clipping the piece canvas to a star path
    // and then drawing the corresponding cropped image region.
    const drawStarPiece = (image, cropX, cropY) => {
        const canvas = pieceCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, pieceWidth, pieceHeight);

        // 1) Clip to star shape
        ctx.save();
        ctx.beginPath();
        createStarPath(
            ctx,
            pieceWidth / 2,
            pieceHeight / 2,
            5, // number of spikes
            pieceWidth * 0.45, // outer radius
            pieceWidth * 0.2   // inner radius
        );
        ctx.clip();

        // 2) Draw the cropped portion of the image into the star
        ctx.drawImage(
            image,
            cropX,
            cropY,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
        );
        ctx.restore();
    };

    // Creates a star path with the given parameters.
    // (cx, cy) is the center, spikes is how many points, outerRadius/innerRadius define star shape.
    const createStarPath = (
        ctx,
        cx,
        cy,
        spikes,
        outerRadius,
        innerRadius
    ) => {
        let rotation = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rotation) * outerRadius;
            y = cy + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x, y);
            rotation += step;

            x = cx + Math.cos(rotation) * innerRadius;
            y = cy + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x, y);
            rotation += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    };

    // When the slider changes, update the piece's x position and check if it's near the gapX.
    // Instead of checking success in onChange, just store the slider value
    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSliderValue(value);
    };

    // Do the success check only when the user stops dragging
    const handleSliderRelease = () => {
        // If the piece is within tolerance on release, mark solved; otherwise fail
        if (Math.abs(sliderValue - gapX) < tolerance) {
            setIsSolved(true);
            onSuccess(); // Call the success callback
        } else {
            setIsFailed(true);
            onFailure(); // Call the failure callback
            setTimeout(() => {
                handleReset()
            }, 2000)
        }
    };

    // Reset with a new random image
    const handleReset = () => {
        setIsSolved(false)
        setIsFailed(false)
        loadImage();
    };

    // Responsive scaling based on wrapper width
    useEffect(() => {
        const updateScale = () => {
            if (!wrapperRef.current) return;
            const wrapperWidth = wrapperRef.current.offsetWidth || imageWidth;
            const nextScale = Math.max(0.4, Math.min(1, wrapperWidth / imageWidth));
            setScale(nextScale);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderWidth]);

    useEffect(() => {
        loadImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [renderWidth, renderHeight, tolerance]);

    return (
        <div className="card mb-3 shadow p-2 w-full bg-white/10 border  border-white/20 backdrop-blur-md rounded-2xl mx-auto"  style={{ maxWidth: renderWidth }}>
            <div className="card-header bg-transparent">{cardTitle}</div>
            <div className="card-body ">
                <div ref={wrapperRef} className=" relative rounded-xl p-2 bg-white/10 border border-white/20 backdrop-blur-md w-full" style={{ maxWidth: renderWidth, width: "100%" }}>

                    {/* Add Dynamic Styling for slider arrow */}
                    {!isLoading && (
                        <style>
                            {`
                                /* WebKit-based browsers */
                                input[type="range"]::-webkit-slider-thumb {
                                    background: ${isSolved ? successColor : initialColor
                                                            } url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M8.5 12l4 4 4-4'/%3E%3C/svg%3E") 
                                    no-repeat center !important;
                                    background-size: 16px 16px;
                                }

                                /* Firefox */
                                input[type="range"]::-moz-range-thumb {
                                    background: ${isSolved ? successColor : initialColor
                                                            } url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M8.5 12l4 4 4-4'/%3E%3C/svg%3E") 
                                    no-repeat center !important;
                                    background-size: 16px 16px;
                                }
      
                             `}
                        </style>
                    )}

                    {/* LOADING OVERLAY */}
                    {isLoading && (
                        <div className="captcha-loading-overlay absolute top-0 left-0 right-0 bottom-0 rounded-xl z-10 bg-black/70 flex items-center justify-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* Background image with star hole */}
                    <div className="w-full" style={{ position: "relative", height: renderHeight * scale, width: "100%" }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: renderWidth, height: renderHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                            <canvas
                                ref={canvasRef}
                                width={renderWidth}
                                height={renderHeight}
                                style={{ position: "absolute", top: 0, left: 0, width: renderWidth, height: renderHeight }}
                            />
                            {/* Draggable puzzle piece */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: gapY,
                                    left: sliderValue,
                                    width: pieceWidth,
                                    height: pieceHeight,
                                }}
                            >
                                <canvas
                                    ref={pieceCanvasRef}
                                    width={pieceWidth}
                                    height={pieceHeight}
                                    style={{
                                        cursor: "pointer",
                                        border: "2px solid #fff",
                                        boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                                    }}
                                />
                            </div>
                        </div>

                        {  /* Refresh icon */
                            showResetBtn &&
                            <div className="captcha-refresh-icon absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 hover:scale-110 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer z-10" onClick={handleReset} title="Refresh Captcha">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                </svg>
                            </div>
                        }
                    </div>

                    {/* Slider */}
                    <div className="captcha-slider-container relative rounded-3xl px-5 mt-4 transition-all duration-300 ease-in-out flex items-center md:h-12 h-10 w-full" style={{ backgroundColor: isSolved ? successColor : initialColor }}>
                        <input
                            type="range"
                            min={0}
                            max={renderWidth - pieceWidth}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            onMouseUp={handleSliderRelease}
                            onTouchEnd={handleSliderRelease}
                            disabled={isLoading || isFailed || isSolved}
                            className={`captcha-slider w-full h-[6px] bg-white/30 rounded outline-none appearance-none cursor-pointer transition duration-300 ease-in-out ${isSolved ? "[&::-webkit-slider-thumb]:bg-emerald-500" : ""}`}
                        />

                        {/* Centered label */}
                        {/* <div className="captcha-slider-label">{sliderBarTitle}</div> */}
                    </div>

                    {/* If failed */}
                    {isFailed ? (
                        <p className='text-danger mt-4  text-break text-red-500' style={{ width: "90%" }}>
                            Captcha Failed. Please Let's try once more!
                        </p>
                    ) : (
                        <div className="text-center mt-2 ">{sliderBarTitle}</div>
                    )}

                    {/* Status message */}
                    <div className="text-center mt-4">
                        {isSolved && (
                            <span style={{ color: successColor, fontWeight: "bold" }} className="text-green-500">Captcha Verified!</span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PuzzleCaptcha;
