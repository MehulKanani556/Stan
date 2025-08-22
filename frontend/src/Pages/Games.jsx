import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, getFreeGames } from '../Redux/Slice/freeGame.slice'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Games = () => {
	const dispatch = useDispatch()
	const { games, loading, error } = useSelector((state) => state.freeGame)

	const scrollContainerRef = useRef(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(true)
	const [showAll, setShowAll] = useState(false)

	const safeGames = Array.isArray(games) ? games : []
	const displayedGames = showAll ? [] : safeGames
	const additionalGames = showAll ? safeGames : []

	// Fetch games
	useEffect(() => {
		dispatch(getFreeGames())
	}, [dispatch])

	// Clear error on unmount
	useEffect(() => {
		return () => dispatch(clearError())
	}, [dispatch])

	useEffect(() => {
		updateScrollButtons()
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' })
		}
	}, [showAll, games])

	const scroll = (direction) => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			const scrollAmount = 320
			container.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth',
			})
			setTimeout(updateScrollButtons, 300)
		}
	}

	const updateScrollButtons = () => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			setCanScrollLeft(container.scrollLeft > 0)
			setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
		}
	}

	return (
		<div className="max-w-[95%] md:max-w-[85%] m-auto pt-28 pb-24">

			<div className="flex items-center justify-between mb-8">
				<h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">
					Free Games
				</h2>
				<div className="flex items-center gap-4">
					{!showAll && (
						<div className="flex items-center gap-2">
							<button
								onClick={() => scroll('left')}
								disabled={!canScrollLeft}
								className={`p-2 rounded-full shadow-lg transition ${canScrollLeft
									? 'bg-gradient-to-r from-purple-400 to-purple-600  hover:from-purple-500 hover:to-purple-700 text-white hover:scale-110'
									: 'bg-gray-700 text-gray-500 cursor-not-allowed'
									}`}
							>
								<FaChevronLeft size={18} />
							</button>
							<button
								onClick={() => scroll('right')}
								disabled={!canScrollRight}
								className={`p-2 rounded-full shadow-lg transition ${canScrollRight
									? 'bg-gradient-to-r from-purple-400 to-purple-600  hover:from-purple-500 hover:to-purple-700 text-white hover:scale-110'
									: 'bg-gray-700 text-gray-500 cursor-not-allowed'
									}`}
							>
								<FaChevronRight size={18} />
							</button>
						</div>
					)}
					<button
						onClick={() => setShowAll(!showAll)}
						className="px-6 py-2 rounded-xl text-sm font-semibold 	bg-white/10 backdrop-blur-md border border-white/20 	text-purple-300 hover:text-white 	hover:bg-purple-500/30 transition-all duration-300 	shadow-lg shadow-purple-900/40"
					>
						{showAll ? 'View Less' : 'View More'}
					</button>

				</div>
			</div>

			{/* Horizontal Row */}
			{!showAll && (
				<div
					ref={scrollContainerRef}
					onScroll={updateScrollButtons}
					className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
				>
					{displayedGames.map((game) => (
						<Link key={game._id} to={`/games/${game.slug}`} className="group flex-shrink-0">
							<div className="relative w-64 aspect-[4/3] rounded-2xl overflow-hidden 
								bg-gradient-to-b from-[#2b2737] to-[#1a1823] 
								shadow-lg shadow-purple-900/40 transform hover:scale-105 
								transition duration-500">
								<img
									src={game.image}
									alt={game.name}
									className="w-full h-full object-cover rounded-2xl group-hover:opacity-80 transition"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
									<p className="text-white font-semibold">{game.name}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}

			{/* Grid Layout */}
			{showAll && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
					{additionalGames.map((game) => (
						<Link key={game._id} to={`/games/${game.slug}`} className="group">
							<div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden 
								bg-gradient-to-b from-[#2b2737] to-[#1a1823] 
								shadow-lg shadow-purple-900/40 hover:scale-105 transition duration-500">
								<img
									src={game.image}
									alt={game.name}
									className="w-full h-full object-cover rounded-2xl group-hover:opacity-80 transition"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
									<p className="text-white font-semibold">{game.name}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default Games
