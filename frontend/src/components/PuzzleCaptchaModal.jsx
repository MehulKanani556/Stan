import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaRedo } from "react-icons/fa";
import { SlPuzzle } from "react-icons/sl";
import "../App.css";

const PuzzleCaptchaModal = ({
    isOpen,
    onClose,
    onSuccess,
    onFailure,
    sliderBarTitle = "Slide to verify",
    cardTitle = "Complete the puzzle",
    initialColor = "#4F46E5",
    successColor = "#10B981",
    imageWidth = 380,
    imageHeight = 200,
    pieceWidth = 10,
    pieceHeight = 20,
    tolerance = 5,
    showResetBtn = true
}) => {
    const maxCanvasWidth = 380;
    const renderWidth = Math.min(imageWidth, maxCanvasWidth);
    const renderHeight = imageHeight;

    // Responsive dimensions for all screen sizes
    const [screenSize, setScreenSize] = useState('desktop');

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setScreenSize('small-mobile');
            } else if (width < 640) {
                setScreenSize('mobile');
            } else if (width < 768) {
                setScreenSize('tablet');
            } else if (width < 1024) {
                setScreenSize('small-desktop');
            } else {
                setScreenSize('desktop');
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Dynamic dimensions based on screen size
    const getResponsiveDimensions = () => {
        const width = window.innerWidth;
        switch (screenSize) {
            case 'small-mobile':
                return {
                    width: Math.min(320, width - 20),
                    height: Math.min(160, (width - 20) * 0.5),
                    maxWidth: '320px'
                };
            case 'mobile':
                return {
                    width: Math.min(360, width - 30),
                    height: Math.min(180, (width - 30) * 0.5),
                    maxWidth: '360px'
                };
            case 'tablet':
                return {
                    width: Math.min(320, width - 40),
                    height: Math.min(160, (width - 40) * 0.5),
                    maxWidth: '320px'
                };
            case 'small-desktop':
                return {
                    width: Math.min(350, width - 50),
                    height: Math.min(175, (width - 50) * 0.5),
                    maxWidth: '350px'
                };
            default: // desktop
                return {
                    width: renderWidth,
                    height: renderHeight,
                    maxWidth: '400px'
                };
        }
    };

    const { width: responsiveWidth, height: responsiveHeight, maxWidth } = getResponsiveDimensions();
    const isMobile = screenSize === 'small-mobile' || screenSize === 'mobile';

    const canvasRef = useRef(null);      // Background image with puzzle hole
    const pieceCanvasRef = useRef(null); // Draggable puzzle piece
    const wrapperRef = useRef(null);     // Responsive wrapper
    const piecePadding = 3;              // Extra pixels around piece to avoid edge clipping
    const [scale, setScale] = useState(1);
    const [gapX, setGapX] = useState(0); // X-coordinate of the puzzle gap
    const [gapY, setGapY] = useState(0); // Y-coordinate of the puzzle gap
    const [sliderValue, setSliderValue] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentShape, setCurrentShape] = useState('fa-puzzle'); // Current puzzle shape

    // Available puzzle shapes (prioritize jigsaw shapes)
    const puzzleShapes = ['fa-puzzle', 'sl-puzzle', 'classic-jigsaw', 'jigsaw', 'classic-jigsaw', 'jigsaw', 'star', 'triangle', 'circle', 'diamond', 'hexagon'];

    // Get a random puzzle shape
    const getRandomShape = () => {
        const randomIndex = Math.floor(Math.random() * puzzleShapes.length);
        return puzzleShapes[randomIndex];
    };

    // Load a random image and pick a puzzle gap in the right half of the image.
    const loadImage = () => {
        setIsLoading(true); // Begin loading

        // Select a random shape
        const selectedShape = getRandomShape();
        setCurrentShape(selectedShape);

        const sources = [
            `https://picsum.photos/${responsiveWidth}/${responsiveHeight}?random=${Math.random()}`,
            `https://placekitten.com/${responsiveWidth}/${responsiveHeight}`,
            `https://dummyimage.com/${responsiveWidth}x${responsiveHeight}/ccc/000?text=Puzzle Captcha`
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
            newImg.src = `https://picsum.photos/${responsiveWidth}/${responsiveHeight}?random=${Math.random()}`;
            newImg.onload = () => {
                setIsLoading(false); // Done loading

                // Position the puzzle gap in the right half of the image so user must slide from left to right.
                const minX = Math.floor(responsiveWidth / 2);
                const maxX = responsiveWidth - pieceWidth - 10;
                const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

                // Random y position (with small margins)
                const minY = 10;
                const maxY = responsiveHeight - pieceHeight - 10;
                const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

                setGapX(x);
                setGapY(y);
                setSliderValue(0);
                setIsSolved(false);

                drawBackground(newImg, x, y);
                drawPuzzlePiece(newImg, x, y);
            };

            newImg.onerror = () => {
                tryNext();
            };
        }

        tryNext();
    };

    // Draw the background image and create a puzzle-shaped hole (semi-transparent).
    const drawBackground = (image, x, y) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, responsiveWidth, responsiveHeight);
        ctx.drawImage(image, 0, 0, responsiveWidth, responsiveHeight);

        // Draw the puzzle hole
        ctx.save();
        ctx.beginPath();
        createShapePath(
            ctx,
            x + pieceWidth / 2, // center X
            y + pieceHeight / 2, // center Y
            currentShape,
            pieceWidth,
            pieceHeight
        );

        // Fill the hole with semi-transparent overlay
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fill();

        // Add a white outline around the puzzle hole
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    };

    // Draw the puzzle piece by clipping the piece canvas to the selected shape
    // and then drawing the corresponding cropped image region.
    const drawPuzzlePiece = (image, cropX, cropY) => {
        const canvas = pieceCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const paddedWidth = pieceWidth + piecePadding * 2;
        const paddedHeight = pieceHeight + piecePadding * 2;
        // Ensure canvas matches padded size
        if (canvas.width !== paddedWidth || canvas.height !== paddedHeight) {
            canvas.width = paddedWidth;
            canvas.height = paddedHeight;
        }
        ctx.clearRect(0, 0, paddedWidth, paddedHeight);

        // 1) Clip to the selected shape
        ctx.save();
        ctx.beginPath();
        createShapePath(
            ctx,
            pieceWidth / 2 + piecePadding,
            pieceHeight / 2 + piecePadding,
            currentShape,
            pieceWidth,
            pieceHeight
        );
        ctx.clip();

        // 2) Draw the cropped portion of the image into the shape
        ctx.drawImage(
            image,
            cropX,
            cropY,
            pieceWidth,
            pieceHeight,
            piecePadding,
            piecePadding,
            pieceWidth,
            pieceHeight
        );
        ctx.restore();
    };

    // Creates different shape paths based on the shape type
    const createShapePath = (ctx, cx, cy, shapeType, width, height) => {
        const radius = Math.min(width, height) * 0.4;

        switch (shapeType) {
            case 'star':
                createStarPath(ctx, cx, cy, 5, radius, radius * 0.4);
                break;
            case 'fa-puzzle':
                createFaPuzzlePath(ctx, cx, cy, width, height);
                break;
            case 'sl-puzzle':
                createSlPuzzlePath(ctx, cx, cy, width, height);
                break;
            case 'triangle':
                createTrianglePath(ctx, cx, cy, radius);
                break;
            case 'circle':
                createCirclePath(ctx, cx, cy, radius);
                break;
            case 'diamond':
                createDiamondPath(ctx, cx, cy, width, height);
                break;
            case 'hexagon':
                createHexagonPath(ctx, cx, cy, radius);
                break;
            default:
                createFaPuzzlePath(ctx, cx, cy, width, height);
        }
    };

    // Creates a star path with the given parameters.
    const createStarPath = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
        let rotation = Math.PI / 2 * 3;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rotation) * outerRadius;
            let y = cy + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x, y);
            rotation += step;

            x = cx + Math.cos(rotation) * innerRadius;
            y = cy + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x, y);
            rotation += step;
        }

        ctx.closePath();
    };

    // // Creates a jigsaw puzzle piece path (simple version with one tab/blank per side)
    // const createJigsawPath = (ctx, cx, cy, width, height) => {
    //     const w = width * 0.7;
    //     const h = height * 0.7;
    //     const x = cx - w / 2;
    //     const y = cy - h / 2;
    //     const tabSize = Math.min(w, h) * 0.15;
    //     const cornerRadius = Math.min(w, h) * 0.05;

    //     ctx.beginPath();

    //     // Start from top-left corner
    //     ctx.moveTo(x + cornerRadius, y);

    //     // Top edge - one tab in the center
    //     ctx.lineTo(x + w * 0.3, y);
    //     // Top tab (outward) - centered
    //     ctx.arc(x + w * 0.5, y, tabSize, Math.PI, 0, false);
    //     ctx.lineTo(x + w * 0.7, y);
    //     ctx.lineTo(x + w - cornerRadius, y);

    //     // Top-right corner
    //     ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius);

    //     // Right edge - one tab in the center
    //     ctx.lineTo(x + w, y + h * 0.3);
    //     // Right tab (outward) - centered
    //     ctx.arc(x + w, y + h * 0.5, tabSize, -Math.PI/2, Math.PI/2, false);
    //     ctx.lineTo(x + w, y + h * 0.7);
    //     ctx.lineTo(x + w, y + h - cornerRadius);

    //     // Bottom-right corner
    //     ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius);

    //     // Bottom edge - one blank in the center
    //     ctx.lineTo(x + w * 0.7, y + h);
    //     // Bottom blank (inward) - centered
    //     ctx.arc(x + w * 0.5, y + h, tabSize, 0, Math.PI, false);
    //     ctx.lineTo(x + w * 0.3, y + h);
    //     ctx.lineTo(x + cornerRadius, y + h);

    //     // Bottom-left corner
    //     ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius);

    //     // Left edge - one blank in the center
    //     ctx.lineTo(x, y + h * 0.7);
    //     // Left blank (inward) - centered
    //     ctx.arc(x, y + h * 0.5, tabSize, Math.PI/2, -Math.PI/2, false);
    //     ctx.lineTo(x, y + h * 0.3);
    //     ctx.lineTo(x, y + cornerRadius);

    //     // Top-left corner
    //     ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);

    //     ctx.closePath();
    // };

    // // Creates a classic jigsaw puzzle piece path (exactly like the image)
    // const createClassicJigsawPath = (ctx, cx, cy, width, height) => {
    //     const w = width * 0.7;
    //     const h = height * 0.7;
    //     const x = cx - w / 2;
    //     const y = cy - h / 2;
    //     const tabSize = Math.min(w, h) * 0.15;
    //     const cornerRadius = Math.min(w, h) * 0.05;

    //     ctx.beginPath();

    //     // Start from top-left corner
    //     ctx.moveTo(x + cornerRadius, y);

    //     // Top edge - one tab in the center
    //     ctx.lineTo(x + w * 0.3, y);
    //     // Top tab (outward) - centered
    //     ctx.arc(x + w * 0.5, y, tabSize, Math.PI, 0, false);
    //     ctx.lineTo(x + w * 0.7, y);
    //     ctx.lineTo(x + w - cornerRadius, y);

    //     // Top-right corner
    //     ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius);

    //     // Right edge - one tab in the center
    //     ctx.lineTo(x + w, y + h * 0.3);
    //     // Right tab (outward) - centered
    //     ctx.arc(x + w, y + h * 0.5, tabSize, -Math.PI/2, Math.PI/2, false);
    //     ctx.lineTo(x + w, y + h * 0.7);
    //     ctx.lineTo(x + w, y + h - cornerRadius);

    //     // Bottom-right corner
    //     ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius);

    //     // Bottom edge - one blank in the center
    //     ctx.lineTo(x + w * 0.7, y + h);
    //     // Bottom blank (inward) - centered
    //     ctx.arc(x + w * 0.5, y + h, tabSize, 0, Math.PI, false);
    //     ctx.lineTo(x + w * 0.3, y + h);
    //     ctx.lineTo(x + cornerRadius, y + h);

    //     // Bottom-left corner
    //     ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius);

    //     // Left edge - one blank in the center
    //     ctx.lineTo(x, y + h * 0.7);
    //     // Left blank (inward) - centered
    //     ctx.arc(x, y + h * 0.5, tabSize, Math.PI/2, -Math.PI/2, false);
    //     ctx.lineTo(x, y + h * 0.3);
    //     ctx.lineTo(x, y + cornerRadius);

    //     // Top-left corner
    //     ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);

    //     ctx.closePath();
    // };

    // Approximate Font Awesome FaPuzzlePiece silhouette



    const createFaPuzzlePath = (ctx, cx, cy, width, height) => {
        // Inset scale to prevent any edge clipping on canvas
        const insetScale = 0.70;
        const w = width * insetScale;
        const h = height * insetScale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        const cornerRadius = Math.min(w, h) * 0.12;
        const knobRadius = Math.min(w, h) * 0.18;
        const socketRadius = knobRadius * 0.9;

        const topCenterX = cx;
        const rightCenterY = cy;
        const bottomCenterX = cx;
        const leftCenterY = cy;

        ctx.beginPath();

        // Start top-left with rounded corner
        ctx.moveTo(x + cornerRadius, y);
        ctx.lineTo(x + w * 0.35, y);

        // Top knob (outward circle) centered
        ctx.arc(topCenterX, y, knobRadius, Math.PI, 0, false);
        ctx.lineTo(x + w - cornerRadius, y);

        // Top-right rounded corner
        ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius);

        // Right edge to before right knob
        ctx.lineTo(x + w, y + h * 0.35);
        // Right knob (outward)
        ctx.arc(x + w, rightCenterY, knobRadius, -Math.PI / 2, Math.PI / 2, false);
        ctx.lineTo(x + w, y + h - cornerRadius);

        // Bottom-right corner
        ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius);

        // Bottom edge with socket (inward circle)
        ctx.lineTo(x + w * 0.65, y + h);
        ctx.arc(bottomCenterX, y + h, socketRadius, 0, Math.PI, true);
        ctx.lineTo(x + cornerRadius, y + h);

        // Bottom-left corner
        ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius);

        // Left edge with socket (inward circle)
        ctx.lineTo(x, y + h * 0.65);
        ctx.arc(x, leftCenterY, socketRadius, Math.PI / 2, -Math.PI / 2, true);
        ctx.lineTo(x, y + cornerRadius);

        // Top-left corner to close
        ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
        ctx.closePath();
    };

    // Creates a SlPuzzle shape path (based on react-icons/sl SlPuzzle)
    const createSlPuzzlePath = (ctx, cx, cy, width, height) => {
        // Inset scale to prevent any edge clipping on canvas
        const insetScale = 0.7;
        const w = width * insetScale;
        const h = height * insetScale;
        const x = cx - w / 2;
        const y = cy - h / 2;

        const cornerRadius = Math.min(w, h) * 0.05;
        const knobRadius = Math.min(w, h) * 0.2;
        const socketRadius = knobRadius * 0.9;

        ctx.beginPath();

        // Start from top-left corner
        ctx.moveTo(x + cornerRadius, y);

        // Top edge with outward knob in center
        ctx.lineTo(x + w * 0.35, y);
        ctx.arc(cx, y, knobRadius, Math.PI, 0, false);
        ctx.lineTo(x + w - cornerRadius, y);

        // Top-right corner
        ctx.arcTo(x + w, y, x + w, y + cornerRadius, cornerRadius);

        // Right edge - straight (no knob)
        ctx.lineTo(x + w, y + h - cornerRadius);

        // Bottom-right corner
        ctx.arcTo(x + w, y + h, x + w - cornerRadius, y + h, cornerRadius);

        // Bottom edge - straight (no socket)
        ctx.lineTo(x + cornerRadius, y + h);

        // Bottom-left corner
        ctx.arcTo(x, y + h, x, y + h - cornerRadius, cornerRadius);

        // Left edge with inward socket in center
        ctx.lineTo(x, y + h * 0.65);
        ctx.arc(x, cy, socketRadius, Math.PI / 2, -Math.PI / 2, true);
        ctx.lineTo(x, y + cornerRadius);

        // Top-left corner to close
        ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
        ctx.closePath();
    };

    // Creates a triangle path
    const createTrianglePath = (ctx, cx, cy, radius) => {
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx + radius * 0.866, cy + radius * 0.5);
        ctx.lineTo(cx - radius * 0.866, cy + radius * 0.5);
        ctx.closePath();
    };

    // Creates a circle path
    const createCirclePath = (ctx, cx, cy, radius) => {
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    };

    // Creates a diamond path
    const createDiamondPath = (ctx, cx, cy, width, height) => {
        const w = width * 0.4;
        const h = height * 0.4;
        ctx.moveTo(cx, cy - h);
        ctx.lineTo(cx + w, cy);
        ctx.lineTo(cx, cy + h);
        ctx.lineTo(cx - w, cy);
        ctx.closePath();
    };

    // Creates a hexagon path
    const createHexagonPath = (ctx, cx, cy, radius) => {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
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

    // Reset with a new random image and shape
    const handleReset = () => {
        setIsSolved(false)
        setIsFailed(false)
        loadImage();
    };

    // Handle modal close
    const handleClose = () => {
        onClose();
    };

    // Responsive scaling based on wrapper width
    useEffect(() => {
        const updateScale = () => {
            if (!wrapperRef.current) return;
            const wrapperWidth = wrapperRef.current.offsetWidth || responsiveWidth;
            const targetWidth = responsiveWidth;
            const minScale = screenSize === 'small-mobile' ? 0.6 :
                screenSize === 'mobile' ? 0.7 :
                    screenSize === 'tablet' ? 0.8 : 0.4;
            const nextScale = Math.max(minScale, Math.min(1, wrapperWidth / targetWidth));
            setScale(nextScale);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [responsiveWidth, screenSize]);

    useEffect(() => {
        if (isOpen) {
            loadImage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, [isOpen, renderWidth, renderHeight, tolerance]);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 md:p-3 lg:p-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full overflow-hidden ${screenSize === 'small-mobile' ? 'max-w-xs mx-1' :
                                screenSize === 'mobile' ? 'max-w-sm mx-2' :
                                    screenSize === 'tablet' ? 'max-w-md mx-3' :
                                        screenSize === 'small-desktop' ? 'max-w-lg mx-4' :
                                            'max-w-xl mx-6'
                            }`}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between border-b border-white/20 ${screenSize === 'small-mobile' ? 'p-2' :
                                screenSize === 'mobile' ? 'p-3' :
                                    'p-4'
                            }`}>
                            <h3 className={`font-semibold text-white ${screenSize === 'small-mobile' ? 'text-sm' :
                                    screenSize === 'mobile' ? 'text-base' :
                                        'text-lg'
                                }`}>{cardTitle}</h3>
                            <button
                                onClick={handleClose}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        {/* Captcha Content */}
                        <div className={`justify-center flex ${screenSize === 'small-mobile' ? 'p-2' :
                                screenSize === 'mobile' ? 'p-3' :
                                    'p-4'
                            }`}>
                            <div ref={wrapperRef} className={`relative rounded-xl bg-white/10 border border-white/20 backdrop-blur-md w-full ${screenSize === 'small-mobile' ? 'p-1 max-w-[320px]' :
                                    screenSize === 'mobile' ? 'p-1.5 max-w-[360px]' :
                                        screenSize === 'tablet' ? 'p-2 max-w-[320px]' :
                                            screenSize === 'small-desktop' ? 'p-2 max-w-[350px]' :
                                                'p-2 max-w-[400px]'
                                }`} style={{ width: "100%" }}>

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
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                                            <span className="text-white mt-2 text-sm">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Background image with puzzle hole */}
                                <div className="w-full overflow-hidden" style={{ position: "relative", height: responsiveHeight * scale, width: "100%", maxWidth }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: responsiveWidth, height: responsiveHeight, transform: `scale(${scale})`, transformOrigin: 'top left', maxWidth }}>
                                        <canvas
                                            ref={canvasRef}
                                            width={responsiveWidth}
                                            height={responsiveHeight}
                                            style={{ position: "absolute", top: 0, left: 0, width: responsiveWidth, height: responsiveHeight }}
                                        />
                                        {/* Draggable puzzle piece */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: gapY - 3,
                                                left: sliderValue - 3,
                                                width: pieceWidth + 6,
                                                height: pieceHeight + 6,
                                            }}
                                        >
                                            <canvas
                                                ref={pieceCanvasRef}
                                                width={pieceWidth + 6}
                                                height={pieceHeight + 6}
                                                style={{
                                                    overflow: "visible",
                                                    cursor: "pointer",
                                                    filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.4)) drop-shadow(0px 2px 4px rgba(0,0,0,0.2)) drop-shadow(0px 1px 2px rgba(0,0,0,0.1))",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Refresh icon */}
                                    {showResetBtn &&
                                        <div className="captcha-refresh-icon absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 hover:scale-110 transition duration-300 ease-in-out flex items-center justify-center cursor-pointer z-10" onClick={handleReset} title="Refresh Captcha">
                                            <FaRedo size={12} color="white" />
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
                                        className={`captcha-range-input captcha-slider w-full h-[6px] bg-white/30 rounded outline-none appearance-none cursor-pointer transition duration-300 ease-in-out ${isSolved ? "[&::-webkit-slider-thumb]:bg-emerald-500" : ""}`}
                                    />
                                </div>


                                {/* If failed */}
                                {isFailed ? (
                                    <p className={`text-danger text-break text-red-500 ${screenSize === 'small-mobile' ? 'mt-2 text-xs' :
                                            screenSize === 'mobile' ? 'mt-3 text-sm' :
                                                'mt-4 text-base'
                                        }`} style={{ width: "90%" }}>
                                        Captcha Failed. Please Let's try once more!
                                    </p>
                                ) : (
                                    <div className={`text-center flex items-center justify-center gap-2 ${screenSize === 'small-mobile' ? 'mt-1' :
                                            screenSize === 'mobile' ? 'mt-1.5' :
                                                'mt-2'
                                        }`}>
                                        <span className={`text-white/80 ${screenSize === 'small-mobile' ? 'text-xs' :
                                                screenSize === 'mobile' ? 'text-sm' :
                                                    'text-base'
                                            }`}>{sliderBarTitle}</span>
                                    </div>
                                )}

                                {/* Status message */}
                                <div className={`text-center ${screenSize === 'small-mobile' ? 'mt-2' :
                                        screenSize === 'mobile' ? 'mt-3' :
                                            'mt-4'
                                    }`}>
                                    {isSolved && (
                                        <span style={{ color: successColor, fontWeight: "bold" }} className="text-green-500">Captcha Verified!</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`border-t border-white/20 ${screenSize === 'small-mobile' ? 'p-2' :
                                screenSize === 'mobile' ? 'p-3' :
                                    'p-4'
                            }`}>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleClose}
                                    disabled={!isSolved}
                                    className={`py-2 rounded-lg transition-all duration-300 ${screenSize === 'small-mobile' ? 'px-2 text-xs' :
                                            screenSize === 'mobile' ? 'px-3 text-sm' :
                                                'px-4 text-base'
                                        } ${isSolved
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    {isSolved ? 'Continue' : (screenSize === 'small-mobile' ? 'Complete puzzle' : 'Complete puzzle first')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PuzzleCaptchaModal;