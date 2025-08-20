import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { getGameBySlug } from '../data/games'

const GamePlay = () => {
    const { slug } = useParams()
    const game = getGameBySlug(slug)
    const [iframeError, setIframeError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (game) {
            setIsLoading(true)
            setIframeError(false)
        }
    }, [game])

    const handleIframeLoad = () => {
        setIsLoading(false)
    }

    const handleIframeError = () => {
        setIframeError(true)
        setIsLoading(false)
    }

    const openGameInNewTab = () => {
        if (game && game.iframeSrc) {
            window.open(game.iframeSrc, '_blank')
        }
    }

    return (
        <>
            <div className='container pt-28 pb-24'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-white text-2xl font-semibold'>{game ? game.name : 'Game'}</h1>
                    <Link to='/games' className='text-[#ab99e1] hover:underline'>Back to Games</Link>
                </div>
                {game ? (
                    <div className='mt-4 bg-[#221f2a] rounded-xl overflow-hidden relative'>
                        {isLoading && (
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
                                title={game.name}
                                src={game.iframeSrc}
                                width='100%'
                                height='720'
                                scrolling='no'
                                frameBorder='0'
                                allowFullScreen
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
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