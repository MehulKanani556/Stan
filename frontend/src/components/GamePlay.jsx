import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import { fetchGameBySlug, clearSelectedGame } from '../Redux/Slice/freeGame.slice'

const GamePlay = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const { selectedGame: game, loading } = useSelector((state) => state.freeGame)
    const [iframeError, setIframeError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const iframeRef = useRef(null)

    useEffect(() => {
        if (slug) {
            setIsLoading(true)
            setIframeError(false)
            dispatch(fetchGameBySlug(slug))
        }
        return () => {
            dispatch(clearSelectedGame())
        }
    }, [dispatch, slug])

    const handleIframeLoad = () => {
        setIsLoading(false)
        // Automatically enter full-screen when game loads
        enterFullScreen()
    }

    const handleIframeError = () => {
        setIframeError(true)
        setIsLoading(false)
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
                <div className='flex items-center justify-between sm:flex-row flex-col gap-4'>
                    <h1 className='text-white text-2xl font-semibold uppercase'>{game ? game.name : 'Game'}</h1>
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