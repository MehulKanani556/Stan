import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { games } from '../data/games'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Games = () => {
	const scrollContainerRef = useRef(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)
	const [showAll, setShowAll] = useState(false)

	const VISIBLE_COUNT = 6
	const displayedGames = games;
	const additionalGames = showAll ? games : []

	const cardWidthClass = 'w-64 md:w-64'
	const cardBaseClass = 'rounded-xl overflow-hidden bg-[#221f2a] ring-1 ring-transparent group-hover:ring-[#ab99e1] transition'
	const cardImageClass = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'

	useEffect(() => {
		updateScrollButtons()
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' })
		}
	}, [showAll])

	useEffect(() => {
		updateScrollButtons()
	}, [])

	const scroll = (direction) => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			const scrollAmount = 300
			if (direction === 'left') {
				container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
			} else {
				container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
			}
			setTimeout(() => {
				updateScrollButtons()
			}, 300)
		}
	}

	const updateScrollButtons = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			setCanScrollLeft(container.scrollLeft > 0)
			setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
		}
	}

	const toggleShowAll = () => {
		setShowAll((prev) => !prev)
	}

	return (
		<>
			<Header />
			<div className='container pt-28 pb-24'>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-white text-2xl font-semibold'>Free Games</h2>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scroll('left')}
								disabled={!canScrollLeft}
								className={`p-2 rounded-full transition-colors ${
									canScrollLeft 
										? 'bg-[#ab99e1] hover:bg-[#9a8ad0] text-white' 
										: 'bg-gray-600 text-gray-400 cursor-not-allowed'
								}`}
							>
								<FaChevronLeft size={16} />
							</button>
							<button
								onClick={() => scroll('right')}
								disabled={!canScrollRight}
								className={`p-2 rounded-full transition-colors ${
									canScrollRight 
										? 'bg-[#ab99e1] hover:bg-[#9a8ad0] text-white' 
										: 'bg-gray-600 text-gray-400 cursor-not-allowed'
								}`}
							>
								<FaChevronRight size={16} />
							</button>
						</div>
						<button 
							onClick={toggleShowAll}
							className='text-[#ab99e1] hover:text-white hover:underline transition-colors font-medium'
						>
							{showAll ? 'View Less' : 'View More'}
						</button>
					</div>
				</div>

				{/* Top horizontal row - identical card width */}
				<div 
					ref={scrollContainerRef}
					className='flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4'
					onScroll={updateScrollButtons}
				>
					{displayedGames.map((game) => (
						<Link 
							key={game.slug} 
							to={`/games/${game.slug}`} 
							className='group flex-shrink-0'
						>
							<div className={`${cardWidthClass} aspect-[4/3] ${cardBaseClass}`}>
								<img src={game.image} alt={game.name} className={cardImageClass} />
							</div>
							<p className='mt-2 text-white text-sm md:text-base group-hover:text-[#ab99e1]'>
								{game.name}
							</p>
						</Link>
					))}
				</div>

				{/* Additional section shown below when View More - same card width, flex-wrap */}
				{showAll && additionalGames.length > 0 && (
					<div className='mt-6 flex flex-wrap gap-4 md:gap-6'>
						{additionalGames.map((game) => (
							<Link 
								key={game.slug}
								to={`/games/${game.slug}`}
								className='group'
							>
								<div className={`${cardWidthClass} aspect-[4/3] ${cardBaseClass}`}>
									<img src={game.image} alt={game.name} className={cardImageClass} />
								</div>
								<p className='mt-2 text-white text-sm md:text-base group-hover:text-[#ab99e1]'>
									{game.name}
								</p>
							</Link>
						))}
					</div>
				)}
			</div>
			<Footer />
		</>
	)
}

export default Games