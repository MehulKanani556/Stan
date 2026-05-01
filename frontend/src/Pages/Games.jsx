import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, getFreeGames } from '../Redux/Slice/freeGame.slice'
import { getAllCategories } from '../Redux/Slice/category.slice'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaChevronLeft, FaChevronRight, FaGamepad, FaPlay, FaTh, FaList, FaStar, FaFire } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/navigation'
import FreeGamesSkeleton from '../lazyLoader/FreeGamesSkeleton'
import Advertize from '../components/Advertize'
import game1 from '../images/game1.jpg';

const Games = () => {
	const dispatch = useDispatch()
	const { games, loading, error } = useSelector((state) => state.freeGame)
	const { categories } = useSelector((state) => state.category)
	const swiperRef = useRef(null)
	const scrollRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [scrollLeft, setScrollLeft] = useState(0)

	const [showAll, setShowAll] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('All')
	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)

	const safeGames = Array.isArray(games) ? games : []

	useEffect(() => {
		dispatch(getFreeGames())
		dispatch(getAllCategories())
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

	const handleMouseDown = (e) => {
		setIsDragging(true)
		setStartX(e.pageX - scrollRef.current.offsetLeft)
		setScrollLeft(scrollRef.current.scrollLeft)
	}

	const handleMouseLeave = () => {
		setIsDragging(false)
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleMouseMove = (e) => {
		if (!isDragging) return
		e.preventDefault()
		const x = e.pageX - scrollRef.current.offsetLeft
		const walk = (x - startX) * 2 // Scroll speed
		scrollRef.current.scrollLeft = scrollLeft - walk
	}

	const isInitialLoading = loading && (!Array.isArray(games) || games.length === 0)

	const filteredGames = selectedCategory === 'All'
		? safeGames
		: safeGames.filter(game => game.category === selectedCategory || (categories.find(c => c.categoryName === selectedCategory)?._id === game.category))

	// Error state
	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<div className="text-center max-w-md bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
					<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaGamepad className="w-10 h-10 text-red-400" />
					</div>
					<h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
					<p className="text-gray-400 mb-6">{error}</p>
					<button
						onClick={() => dispatch(getFreeGames())}
						className="px-6 py-3 style_btn_color text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
					>
						Try Again
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen ">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-r to-orange-900/30 via-pink-900/20 from-yellow-900/30">
				<div className="absolute inset-0 opacity-30">
					<div
						className="absolute inset-0 animate-pulse"
						style={{
							backgroundImage: 'radial-gradient(circle at 20% 50%, #ed6c39 0%, transparent 50%), radial-gradient(circle at 80% 20%, #eded4a 0%, transparent 50%), radial-gradient(circle at 40% 80%, #f53bc6 0%, transparent 50%)',
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
						<div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-yellow-500/30 rounded-full text-orange-300 text-sm font-semibold mb-8 backdrop-blur-sm shadow-lg">
							<FaGamepad className="w-4 h-4 mr-2" />
							Free Games Collection
							<FaFire className="w-4 h-4 ml-2 text-amber-300" />
						</div>

						<h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-black text-white mb-8 leading-tight">
							Epic
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400"> Games</span>
						</h1>

						<p className=" md:text-2xl sm:text-xl text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
							Discover amazing free games and dive into endless adventures. From action-packed thrillers to mind-bending puzzles.
						</p>

						{!isInitialLoading && safeGames.length > 0 && (
							<div className="flex items-center justify-center sx:space-x-12 space-x-5 text-gray-300">
								<div className="text-center">
									<div className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-lg font-bold text-white mb-1">{safeGames?.length - 3}+</div>
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
			<>
				<Advertize limitImages={true} />

				{/* Category Filter */}
				<div className="w-full max-w-[95%] md:max-w-[75%] mx-auto mt-11 px-1">
					<div
						ref={scrollRef}
						onMouseDown={handleMouseDown}
						onMouseLeave={handleMouseLeave}
						onMouseUp={handleMouseUp}
						onMouseMove={handleMouseMove}
						className="flex space-x-2 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing select-none"
					>
						<button
							onClick={() => setSelectedCategory('All')}
							className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6  font-medium text-xs sm:text-sm md:text-base lg:text-lg rounded-lg  whitespace-nowrap transition-all duration-300 ${selectedCategory === 'All'
								? 'text-[var(--color-change)] bg-gray-700/50  shadow-lg shadow-orange-500/20'
								: 'hover:text-[var(--color-change)] hover:bg-gray-700/50'
								}`}
						>
							All Games
						</button>
						{categories.filter(cat => safeGames.some(game => game.category === cat._id || game.category === cat.categoryName)).map((cat) => (
							<button
								key={cat._id}
								onClick={() => setSelectedCategory(cat.categoryName)}
								className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 rounded-lg font-medium text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.categoryName
									? 'text-[var(--color-change)] bg-gray-700/50  shadow-lg shadow-orange-500/20'
									: ' hover:text-[var(--color-change)] hover:bg-gray-700/50'
									}`}
							>
								{cat.categoryName}
							</button>
						))}
					</div>
				</div>

				<div className="w-full max-w-[95%] md:max-w-[75%] mx-auto mt-6 pt-2 pb-5">
					<div className="flex flex-col ms:flex-row lg:items-center ms:items-start items-center sm:justify-between ms:gap-8 gap-4 mb-12">
						<div className="space-y-3">
							<h2 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-2xl font-bold text-white">
								{selectedCategory === "All" ? "All games"  : selectedCategory }
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
											className={`group md:w-12 md:h-12 ms:w-10 ms:h-10 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isBeginning
												? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
												: 'style_btn_color  text-white hover:scale-110 shadow-lg hover:shadow-orange-500/25'
												}`}
										>
											<FaChevronLeft className="ms:w-5 ms:h-5 w-3 h-3" />
										</button>
										<button
											onClick={goNext}
											disabled={isEnd}
											className={`group md:w-12 md:h-12 ms:w-10 ms:h-10 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isEnd
												? 'bg-gray-700/50 text-gray-500 cursor-not-allowed opacity-50'
												: 'style_btn_color text-white hover:scale-110 shadow-lg hover:shadow-orange-500/25'
												}`}
										>
											<FaChevronRight className="ms:w-5 ms:h-5 w-3 h-3" />
										</button>
									</div>
								)}

								<button
									onClick={() => setShowAll(!showAll)}
									className="group flex items-center gap-3 text-sm px-6 md:py-3 ms:py-2 py-2  style_btn_color text-white rounded-xl font-semibold transition-all duration-300   "
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
						<FreeGamesSkeleton />
					)}

					{!isInitialLoading && (
						<>
							{!showAll && safeGames.length > 0 && (
								<div className="relative">
									<Swiper
										ref={swiperRef}
										spaceBetween={30}
										slidesPerView={1}
										slidesPerGroup={1}
										speed={600}
										grabCursor={true}
										onSwiper={syncEdges}
										onSlideChange={handleSlideChange}
										onResize={syncEdges}
										onBreakpoint={syncEdges}
										breakpoints={{
											320: { slidesPerView: 1.8, spaceBetween: 10 },
											450: { slidesPerView: 2, spaceBetween: 20 },
											640: { slidesPerView: 2, spaceBetween: 30 },
											768: { slidesPerView: 2, spaceBetween: 28 },
											1024: { slidesPerView: 3, spaceBetween: 32 },
											1280: { slidesPerView: 3.5, spaceBetween: 36 },
											1536: { slidesPerView: 5, spaceBetween: 20 },
										}}
										className="!py-8 !px-2"
									>
										{filteredGames.map((game, index) => (
											<SwiperSlide key={game._id}>
												<GameCard game={game} index={index} />
											</SwiperSlide>
										))}
									</Swiper>
								</div>
							)}

							{showAll && (
								<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ms:gap-8 gap-4  gap-y-6 " >
									{filteredGames.map((game, index) => (
										<GameCard key={game._id} game={game} index={index} />
									))}
								</div>
							)}

							{filteredGames.length === 0 && (
								<div className="text-center py-20">
									<div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
										<FaGamepad className="w-16 h-16 text-gray-400" />
									</div>
									<h3 className="text-3xl font-bold text-white mb-4">No Games Available</h3>
									<p className="text-gray-400 mb-8 text-lg">Check back later for awesome new games!</p>
									<button
										onClick={() => dispatch(getFreeGames())}
										className="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
									>
										Refresh Games
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</>

			<style jsx>{`
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				

				.swiper-slide {
					transition: transform 0.4s ease;
					height: auto;
				}
				
				.swiper-slide:hover {
					transform: translateY(-4px);
				}
				
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-5px); }
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

	const isNewGame = useMemo(() => {
		if (!game?.createdAt) return false;
		const createdDate = new Date(game.createdAt);
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(new Date().getMonth() - 1);
		return createdDate >= oneMonthAgo && createdDate <= new Date();
	}, [game?.createdAt]);

	return (
		<Link
			to={`/games/${game.slug}`}
			className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] cursor-pointer mx-auto"
			style={{
				animationDelay: `${index * 0.1}s`,
			}}
		>
			<div className="group relative overflow-hidden rounded-2xl bg-[#141414] border border-slate-600/50 shadow-[0_4px_33px_#0000000d] hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-500/70">
				<div className="absolute inset-0 bg-[#141414] opacity-100 transition-opacity duration-700" />
				<div className="relative w-full h-32 ms:h-48 md:h-52 lg:h-36 xl:h-36 overflow-hidden rounded-t-2xl">
					<img
						src={game?.image || game1}
						alt={game?.name}
						className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 rounded-t-2xl"
						loading="lazy"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">
						{isNewGame && (
							<div className="absolute ms:top-4 ms:left-4 top-1 left-1">
								<div className="px-3 ms:py-1.5 py-1 bg-[var(--color-change)] rounded-full backdrop-blur-sm border border-orange-400/30 shadow-lg">
									<div className="ms:text-xs text-[8px] font-bold text-white tracking-wider flex justify-center items-center"><p>NEW</p></div>
								</div>
							</div>
						)}

						<div className="absolute bottom-4 left-4 right-4">
							<div className="ms:p-4 p-0">
								<h3 className="text-white font-bold ms:text-sm text-xs sm:text-base md:text-lg lg:text-xl leading-tight">
									{game?.name}
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div className="ms:p-4 p-2 md:p-6 ms:space-y-4 space-y-2 bg-gradient-to-br from-slate-700/95 to-slate-800/95">
					<div className="grid grid-cols-1 gap-4">
						<div className="bg-[#06060690] rounded-xl relative z-10 px-3 sm:px-4 sm:py-3 py-2 md:px-6 md:py-3.5">
							<div className="flex flex-wrap items-center space-x-2">
								<span className="ms:text-sm text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Status:</span>
								<span className="ms:text-lg text-xs font-black text-white">Free to Play</span>
							</div>
						</div>
					</div>
					<button className="w-full relative overflow-hidden rounded-xl transition-all duration-500 transform bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
						<div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
							<FaPlay className="text-white md:w-5 ms:h-5 h-3 w-3" />
							<span className="text-white font-bold text-sm tracking-wider uppercase ms:text-sm text-xs">Play Now</span>
						</div>
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
					</button>
				</div>
				<div className="absolute top-1 left-1 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
					<div className="ms:w-16 ms:h-16 h-12 w-12 border-2 border-emerald-400/30 rounded-lg transform rotate-45"></div>
				</div>
			</div>
		</Link>
	)
}

export default Games