import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { games } from '../data/games'

const Games = () => {
    return (
        <>
            {/* header section */}
            <Header />
            {/* games section */}
            <div className='container pt-28 pb-24'>
                <h2 className='text-white text-2xl font-semibold mb-6'>Free Games</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                    {games.map((game) => (
                        <Link key={game.slug} to={`/games/${game.slug}`} className='group'>
                            <div className='w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#221f2a] ring-1 ring-transparent group-hover:ring-[#ab99e1] transition'>
                                <img src={game.image} alt={game.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                            </div>
                            <p className='mt-2 text-white text-sm md:text-base group-hover:text-[#ab99e1]'>{game.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Games