import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, getFreeGames } from '../Redux/Slice/freeGame.slice'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaChevronLeft, FaChevronRight, FaGamepad, FaPlay, FaTh, FaList, FaStar, FaFire } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/navigation'
import FreeGamesSkeleton from '../lazyLoader/FreeGamesSkeleton'

const Games = () => {
	const dispatch = useDispatch()
	const { games, loading, error } = useSelector((state) => state.freeGame)
	const swiperRef = useRef(null)

	const [showAll, setShowAll] = useState(false)
	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)

	const safeGames = Array.isArray(games) ? games : []

	useEffect(() => {
		dispatch(getFreeGames())
	}, [dispatch])

	useEffect(() => {
		return () => dispatch(clearError())
	}, [dispatch])

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}, [])

	const goNext = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext()
		}
	}

	const goPrev = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev()
		}
	}

	const handleSlideChange = (swiper) => {
		setIsBeginning(swiper.isBeginning)
		setIsEnd(swiper.isEnd)
	}

	const syncEdges = (swiper) => {
		if (!swiper) return
		setIsBeginning(swiper.isBeginning)
		setIsEnd(swiper.isEnd)
	}

	useEffect(() => {
		const swiper = swiperRef.current?.swiper
		if (swiper) {
			setTimeout(() => syncEdges(swiper), 0)
		}
	}, [safeGames])

	const isInitialLoading = loading && (!Array.isArray(games) || games.length === 0)

	// Error state
	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
				<div className="text-center max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
					<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaGamepad className="w-10 h-10 text-red-400" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
					<p className="text-gray-400 mb-6">{error}</p>
					<button 
						onClick={() => dispatch(getFreeGames())}
						className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-pink-900/30">
				<div className="absolute inset-0 opacity-30">
					<div 
						className="absolute inset-0 animate-pulse"
						style={{
							backgroundImage: 'radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%), radial-gradient(circle at 40% 80%, #3b82f6 0%, transparent 50%)',
						}}
					></div>
				</div>
				
				<div 
					className="absolute inset-0 opacity-20"
					style={{
						backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				></div>
				
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-20 md:pb-16 pt-11 pb-11">
					<div className="text-center">
						<div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-8 backdrop-blur-sm shadow-lg">
							<FaGamepad className="w-4 h-4 mr-2" />
							Free Games Collection
							<FaFire className="w-4 h-4 ml-2 text-orange-400" />
						</div>
						
						<h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-black text-white mb-8 leading-tight">
							Epic
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"> Games</span>
						</h1>
						
						<p className=" md:text-2xl sm:text-xl text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
							Discover amazing free games and dive into endless adventures. From action-packed thrillers to mind-bending puzzles.
						</p>

						{!isInitialLoading && safeGames.length > 0 && (
							<div className="flex items-center justify-center sx:space-x-12 space-x-5 text-gray-300">
								<div className="text-center">
									<div className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold text-white mb-1">{safeGames.length}+</div>
									<div className="text-sm uppercase tracking-wide text-gray-400">Games Available</div>
								</div>
								<div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
								<div className="text-center">
									<div className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold text-white mb-1 flex items-center justify-center">
										100%
										<FaStar className="sm:w-6 sm:h-6 w-4 h-4 text-yellow-400 ml-2" />
									</div>
									<div className="text-sm uppercase tracking-wide text-gray-400">Free to Play</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="w-full max-w-[95%] md:max-w-[85%] mx-auto mt-11 pt-2 pb-5">
				<div className="flex flex-col ms:flex-row lg:items-center ms:items-start items-center sm:justify-between ms:gap-8 gap-4 mb-12">
					<div className="space-y-3">
						<h2 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold text-white">
							Featured Games
						</h2>
						<p className="md:text-xl text-lg text-gray-400">Handpicked games just for you</p>
					</div>
					
					{!isInitialLoading && safeGames.length > 0 && (
						<div className="flex items-center gap-4">
							{!showAll && (
								<div className="flex items-center gap-3">
									<button
										onClick={goPrev}
										disabled={isBeginning}
										className={`group md:w-12 md:h-12 ms:w-10 ms:h-10 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
											isBeginning
												? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
												: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-110 shadow-lg hover:shadow-purple-500/25'
										}`}
									>
										<FaChevronLeft className="ms:w-5 ms:h-5 w-3 h-3" />
									</button>
									<button
										onClick={goNext}
										disabled={isEnd}
										className={`group md:w-12 md:h-12 ms:w-10 ms:h-10 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
											isEnd
												? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
												: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-110 shadow-lg hover:shadow-purple-500/25'
										}`}
									>
										<FaChevronRight className="ms:w-5 ms:h-5 w-3 h-3" />
									</button>
								</div>
							)}
							
							<button
								onClick={() => setShowAll(!showAll)}
								className="group flex items-center gap-3 text-sm px-6 md:py-3 ms:py-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
							>
								{showAll ? (
									<>
										<FaList className="ms:w-5 ms:h-5 w-3 h-3" />
										Show Carousel
									</>
								) : (
									<>
										<FaTh className="ms:w-5 ms:h-5 w-3 h-3" />
										View All
									</>
								)}
							</button>
						</div>
					)}
				</div>

				{isInitialLoading && (
					<div className="grid grid-cols-2 ms:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="animate-pulse">
								<div className="bg-gray-700/50 rounded-2xl mb-4 w-full h-64 sm:h-72 md:h-64 lg:h-72 xl:h-64 2xl:h-80"></div>
								<div className="h-4 bg-gray-700/50 rounded-lg mb-2"></div>
								<div className="h-3 bg-gray-700/30 rounded-lg w-2/3"></div>
							</div>
						))}
					</div>
				)}

				{!isInitialLoading && (
					<>
						{!showAll && safeGames.length > 0 && (
							<div className="relative  px-4">
								<Swiper
									ref={swiperRef}
									spaceBetween={32}
									slidesPerView={1}
									slidesPerGroup={1}
									speed={600}
									grabCursor={true}
									onSwiper={syncEdges}
									onSlideChange={handleSlideChange}
									onResize={syncEdges}
									onBreakpoint={syncEdges}
									breakpoints={{
										320: { slidesPerView: 2, spaceBetween: 0 },
										640: { slidesPerView: 2, spaceBetween: 30 },
										768: { slidesPerView: 2, spaceBetween: 28 },
										1024: { slidesPerView: 3, spaceBetween: 32 },
										1280: { slidesPerView: 3.5, spaceBetween: 36 },
										1536: { slidesPerView: 5, spaceBetween: 20 },
									}}
									className="!pb-8"
								>
									{safeGames.map((game, index) => (
										<SwiperSlide key={game._id}>
											<GameCard game={game} index={index} />
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						)}

						{showAll && (
							<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ms:gap-8 gap-y-6 " >
								{safeGames.map((game, index) => (
									<GameCard key={game._id} game={game} index={index} />
								))}
							</div>
						)}

						{safeGames.length === 0 && (
							<div className="text-center py-20">
								<div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
									<FaGamepad className="w-16 h-16 text-gray-400" />
								</div>
								<h3 className="text-3xl font-bold text-white mb-4">No Games Available</h3>
								<p className="text-gray-400 mb-8 text-lg">Check back later for awesome new games!</p>
								<button 
									onClick={() => dispatch(getFreeGames())}
									className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
								>
									Refresh Games
								</button>
							</div>
						)}
					</>
				)}
			</div>

			<style jsx>{`
				.swiper-slide {
					transition: transform 0.4s ease;
					height: auto;
				}
				
				.swiper-slide:hover {
					transform: translateY(-8px);
				}
				
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
				
				.animate-float {
					animation: float 3s ease-in-out infinite;
				}
			`}</style>
		</div>
	)
}

// Game Card Component with Fixed Image Dimensions
const GameCard = ({ game, index = 0 }) => {
	const [imageLoaded, setImageLoaded] = useState(false)
	const [imageError, setImageError] = useState(false)

	return (
		<Link 
			to={`/games/${game.slug}`} 
			className="group block h-full w-full ms:px-0 px-1 "
			style={{ 
				animationDelay: `${index * 0.1}s`,
			}}
		>
			<div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/10 group h-full flex flex-col">
				
				{/* Image Container with Fixed Dimensions Across All Breakpoints */}
				<div className="relative bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden flex-shrink-0 w-full sm:h-40 h-32 ms:h-72 md:h-64 lg:h-72 xl:h-64 2xl:h-80">
					{/* Loading State */}
					{!imageLoaded && !imageError && (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-700">
							<div className="relative">
								<div className="animate-spin rounded-full h-12 w-12 border-3 border-purple-500 border-t-transparent"></div>
								<div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-purple-400 opacity-20"></div>
							</div>
						</div>
					)}
					
					{/* Error State */}
					{imageError && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
							<FaGamepad className="text-gray-400 mb-3 w-16 h-16 sm:w-20 sm:h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28" />
							<span className="text-gray-400 text-xs sm:text-sm">Image unavailable</span>
						</div>
					)}
					
					{/* Game Image with Fixed Aspect Ratio */}
					{!imageError && (
						<img
							src={game.image}
							alt={game.name}
							onLoad={() => setImageLoaded(true)}
							onError={() => setImageError(true)}
							className={`
								w-full  h-full object-cover transition-all duration-700 group-hover:scale-110
								${imageLoaded ? 'opacity-100' : 'opacity-0'}
							`}
							style={{ objectFit: 'cover', objectPosition: 'center' }}
						/>
					)}
					
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					
					{/* Play Button Overlay */}
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
						<div className="w-16 h-16 sm:w-20 sm:h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 xl:w-20 xl:h-20 2xl:w-22 2xl:h-22 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border-2 border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
							<FaPlay className="text-white ml-1 w-6 h-6 sm:w-8 sm:h-8 md:w-7 md:h-7 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-8 2xl:h-8" />
						</div>
					</div>

					{/* Free Badge */}
					<div className="absolute ms:top-4 ms:right-4 top-0 right-1 px-3 py-1  sm:px-4 sm:py-2 md:px-3 md:py-1.5 lg:px-5 lg:py-2.5 xl:px-4 xl:py-2 2xl:px-5 2xl:py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-[10px] sm:text-sm md:text-xs lg:text-sm xl:text-sm 2xl:text-base">
						FREE
					</div>

					
				</div>

				{/* Card Content */}
				<div className="flex-grow ms:flex flex-col p-2 sm:p-6 md:p-5 lg:p-7 xl:p-6 2xl:p-8">
					<h3 className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight mb-3 flex-grow text-sm sm:text-xl md:text-lg lg:text-2xl xl:text-xl ">
						{game.name}
					</h3>
					
				</div>

				{/* Hover Glow Effect */}
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-pink-600/10 transition-all duration-500 pointer-events-none"></div>
			</div>
		</Link>
	)
}

export default Games