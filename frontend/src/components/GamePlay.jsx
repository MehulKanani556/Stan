import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { getGameBySlug } from '../data/games'

const GamePlay = () => {
    const { slug } = useParams()
    const game = getGameBySlug(slug)

    return (
        <>
            <Header />
            <div className='container pt-28 pb-24'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-white text-2xl font-semibold'>{game ? game.name : 'Game'}</h1>
                    <Link to='/games' className='text-[#ab99e1] hover:underline'>Back to Games</Link>
                </div>
                {game ? (
                    <div className='mt-4 bg-[#221f2a] rounded-xl overflow-hidden'>
                        <iframe
                            title={game.name}
                            src={game.iframeSrc}
                            width='100%'
                            height='720'
                            scrolling='no'
                            frameBorder='0'
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className='text-gray-300 mt-4'>Game not found.</p>
                )}
            </div>
            <Footer />
        </>
    )
}

export default GamePlay 