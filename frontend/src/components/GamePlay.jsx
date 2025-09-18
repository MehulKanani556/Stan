import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '../context/SocketContext'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import { fetchGameBySlug, clearSelectedGame } from '../Redux/Slice/freeGame.slice'

// Helper to format minutes and seconds
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

const GamePlay = () => {
    const { getServerTime, storeGamePlayTime } = useSocket();
    // State to store server time
    const [serverTime, setServerTime] = useState(null);
    // Retrieve server time on mount
    useEffect(() => {
        let isMounted = true;
        if (!getServerTime) return;

        getServerTime()
            .then(time => {
                console.log("Server time received:", time);
                
                if (isMounted) setServerTime(time);
            })
            .catch(() => {
                if (isMounted) setServerTime(null);
            });
        return () => { isMounted = false; };
    }, [getServerTime]);
    // console.log("Server Time:", serverTime);    
    const { slug } = useParams()
    const dispatch = useDispatch()
    const { selectedGame: game, loading } = useSelector((state) => state.freeGame)
    const [iframeError, setIframeError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const iframeRef = useRef(null)

    // Helper to check localStorage availability
    const safeLocalStorage = {
        get(key) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    return window.localStorage.getItem(key);
                }
            } catch (e) { }
            return null;
        },
        set(key, value) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem(key, value);
                }
            } catch (e) { }
        }
    };

    // Track play time in seconds, persist per game and total
    const [playSeconds, setPlaySeconds] = useState(0);
    const [totalPlaySeconds, setTotalPlaySeconds] = useState(0);

    // Use refs to store current values for cleanup
    const playSecondsRef = useRef(0);
    const totalPlaySecondsRef = useRef(0);

    const playTimerRef = useRef(null);
    const isTabVisible = useRef(true);

    // Update refs when state changes
    useEffect(() => {
        playSecondsRef.current = playSeconds;
    }, [playSeconds]);

    useEffect(() => {
        totalPlaySecondsRef.current = totalPlaySeconds;
    }, [totalPlaySeconds]);

    // Load play time from localStorage for this game and total
    useEffect(() => {
        if (slug) {
            setIsLoading(true)
            setIframeError(false)
            dispatch(fetchGameBySlug(slug))

            // Load previous play time for this slug
            const saved = safeLocalStorage.get(`gameplay_time_${slug}`);
            const gameTime = saved ? parseInt(saved, 10) : 0;
            setPlaySeconds(gameTime);
            playSecondsRef.current = gameTime;

            // Load total play time
            const totalSaved = safeLocalStorage.get('gameplay_time_total');
            const totalTime = totalSaved ? parseInt(totalSaved, 10) : 0;
            setTotalPlaySeconds(totalTime);
            totalPlaySecondsRef.current = totalTime;
        }

        return () => {
            dispatch(clearSelectedGame())

            // Save play time for this slug using ref values
            if (slug) {
                safeLocalStorage.set(`gameplay_time_${slug}`, playSecondsRef.current.toString());
            }
            // Save total play time using ref values
            safeLocalStorage.set('gameplay_time_total', totalPlaySecondsRef.current.toString());

            // Store game play time in database when leaving the page
            if (slug && playSecondsRef.current > 0 && storeGamePlayTime) {
                const durationMinutes = Math.floor(playSecondsRef.current / 60);
                if (durationMinutes > 0) {
                    storeGamePlayTime(slug, durationMinutes);
                    safeLocalStorage.set(`gameplay_time_${slug}`, 0);
                    console.log(`Storing ${durationMinutes} minutes of playtime for game: ${slug}`);
                }
            }

            // Clear timer on unmount
            if (playTimerRef.current) {
                clearInterval(playTimerRef.current);
                playTimerRef.current = null;
            }
            // Remove visibility listener
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, slug])

    // Save play time when it changes (immediate save)
    useEffect(() => {
        if (slug && playSeconds > 0) {
            safeLocalStorage.set(`gameplay_time_${slug}`, playSeconds.toString());
        }
    }, [playSeconds, slug]);

    // Save total play time when it changes (immediate save)
    useEffect(() => {
        if (totalPlaySeconds > 0) {
            safeLocalStorage.set('gameplay_time_total', totalPlaySeconds.toString());
        }
    }, [totalPlaySeconds]);

    // Handle tab visibility
    const handleVisibilityChange = () => {
        isTabVisible.current = !document.hidden;
    };

    const handleIframeLoad = () => {
        setIsLoading(false)
        // Automatically enter full-screen when game loads
        enterFullScreen()
        // Start play timer only if not already started
        if (!playTimerRef.current) {
            playTimerRef.current = setInterval(() => {
                // Only count time if tab is visible and not error
                if (isTabVisible.current && !iframeError) {
                    setPlaySeconds(prev => {
                        const newValue = prev + 1;
                        playSecondsRef.current = newValue;
                        return newValue;
                    });
                    setTotalPlaySeconds(prev => {
                        const newValue = prev + 1;
                        totalPlaySecondsRef.current = newValue;
                        return newValue;
                    });
                }
            }, 1000);
        }
        // Listen for tab visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    const handleIframeError = () => {
        setIframeError(true)
        setIsLoading(false)
        // Stop timer if error
        if (playTimerRef.current) {
            clearInterval(playTimerRef.current);
            playTimerRef.current = null;
        }
    }

    const openGameInNewTab = () => {
        if (game && game.iframeSrc) {
            window.open(game.iframeSrc, '_blank', 'noopener,noreferrer')
        }
    }

    const enterFullScreen = () => {
        const iframe = iframeRef.current

        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) { // Firefox
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { // IE/Edge
                iframe.msRequestFullscreen();
            }
            setIsFullScreen(true);
        }
    }

    const toggleFullScreen = () => {
        enterFullScreen();
    }

    return (
        <>
            <div className='container pt-28 pb-24'>
                {/* Show server time if available */}
                {serverTime && (
                    <div className='mb-4 text-purple-200 text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10'>
                        Server Time: {serverTime}
                    </div>
                )}
                <div className='flex items-center justify-between lg:flex-row flex-col gap-4'>
                    <div className='flex flex-col md:flex-row md:items-center gap-2'>
                        <h1 className='text-white text-2xl font-semibold uppercase'>{game ? game.name : 'Game'}</h1>
                        {/* Show play time if game loaded and not error */}
                        {game && !iframeError && (
                            <span className='ml-0 md:ml-4 text-purple-200 text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10'>
                                Play Time: {formatTime(playSeconds)}
                            </span>
                        )}
                        {/* Show total play time always */}
                        <span className='ml-0 md:ml-4 text-purple-300 text-xs bg-white/5 px-2 py-1 rounded border border-white/5'>
                            Total Play Time: {formatTime(totalPlaySeconds)}
                        </span>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={toggleFullScreen}
                            className="px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40"
                        >
                            Full Screen
                        </button>
                        <Link to='/games' className="px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40">Back to Games</Link>
                    </div>
                </div>
                {game ? (
                    <div className='mt-4 bg-[#221f2a] rounded-xl overflow-hidden relative'>
                        {(isLoading || loading) && (
                            <div className='absolute inset-0 flex items-center justify-center bg-[#221f2a] z-10'>
                                <div className='text-white text-lg'>Loading game...</div>
                            </div>
                        )}

                        {iframeError ? (
                            <div className='p-8 text-center'>
                                <div className='text-white text-lg mb-4'>
                                    This game cannot be played directly in the browser.
                                </div>
                                <button
                                    onClick={openGameInNewTab}
                                    className='bg-[#ab99e1] hover:bg-[#9a8ad0] text-white px-6 py-3 rounded-lg font-medium transition-colors'
                                >
                                    Play Game in New Tab
                                </button>
                                <div className='text-gray-400 text-sm mt-4'>
                                    Click the button above to open the game in a new tab
                                </div>
                            </div>
                        ) : (
                            <iframe
                                ref={iframeRef}
                                title={game.name}
                                src={game.iframeSrc}
                                width='100%'
                                height='720'
                                scrolling='no'
                                frameBorder='0'
                                allowFullScreen
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-top-navigation-by-user-activation"
                                allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; gamepad; accelerometer; gyroscope; magnetometer"
                                referrerPolicy="origin-when-cross-origin"
                            />
                        )}
                    </div>
                ) : (
                    <p className='text-gray-300 mt-4'>Game not found.</p>
                )}
            </div>
        </>
    )
}

export default GamePlay