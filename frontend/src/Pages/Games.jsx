import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearError, getFreeGames } from '../Redux/Slice/freeGame.slice'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
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
		// After games load or breakpoint recalculations, ensure edge states are correct
		const swiper = swiperRef.current?.swiper
		if (swiper) {
			// Small delay to allow Swiper to recalc slidesPerView for current breakpoint
			setTimeout(() => syncEdges(swiper), 0)
		}
	}, [safeGames])

	const isInitialLoading = loading && (!Array.isArray(games) || games.length === 0)

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="max-w-[95%] md:max-w-[85%] m-auto pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24 px-3 sm:px-4">



			<div className="flex flex-col gap-4 mb-6 sm:mb-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide text-center sm:text-left">
					Free Games
				</h2>
				{!isInitialLoading && (
					<div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">

						{
							!showAll && (
								<>
									<button
										onClick={goPrev}
										disabled={isBeginning}
										className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isBeginning
												? 'bg-gray-500 cursor-not-allowed opacity-50'
												: 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
											} text-white`}
									>
										<FaChevronLeft size={16} />
									</button>
									<button
										onClick={goNext}
										disabled={isEnd}
										className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${isEnd
												? 'bg-gray-500 cursor-not-allowed opacity-50'
												: 'bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 hover:scale-110'
											} text-white`}
									>
										<FaChevronRight size={16} />
									</button>
								</>
							)
						}

						<button
							onClick={() => setShowAll(!showAll)}
							className="px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 shadow-lg shadow-purple-900/40"
						>
							{showAll ? 'View Less' : 'View More'}
						</button>
					</div>
				)}
			</div>
			{isInitialLoading && (
				<FreeGamesSkeleton />
			)}

			{!isInitialLoading && !showAll && (
				<div className="relative">
					<Swiper
						ref={swiperRef}
						spaceBetween={12}
						slidesPerView={1}
						slidesPerGroup={1}
						speed={400}
						effect="slide"
						grabCursor={true}
						onSwiper={syncEdges}
						onSlideChange={handleSlideChange}
						onResize={syncEdges}
						onBreakpoint={syncEdges}
						style={{ padding: '20px 8px' }}
						breakpoints={{
							320: {
								slidesPerView: 1.2,
								slidesPerGroup: 1,
								spaceBetween: 10,
							},
							425: {
								slidesPerView: 1.8,
								slidesPerGroup: 1,
								spaceBetween: 12,
							},
							480: {
								slidesPerView: 2,
								slidesPerGroup: 1,
								spaceBetween: 16,
							},
							640: {
								slidesPerView: 2.5,
								slidesPerGroup: 1,
								spaceBetween: 20,
							},
							768: {
								slidesPerView: 3,
								slidesPerGroup: 1,
								spaceBetween: 24,
							},
							1024: {
								slidesPerView: 4,
								slidesPerGroup: 1,
								spaceBetween: 24,
							},
							1280: {
								slidesPerView: 5,
								slidesPerGroup: 1,
								spaceBetween: 24,
							},
						}}
						className="games-swiper"
					>
						{safeGames.map((game) => (
							<SwiperSlide key={game._id}>
								<Link to={`/games/${game.slug}`} className="group block">
									<div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden 
										bg-gradient-to-b from-[#2b2737] to-[#1a1823] 
										shadow-lg shadow-purple-900/40 transform hover:scale-105 
										transition duration-500">
										<img
											src={game.image}
											alt={game.name}
											className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:opacity-80 transition"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2 sm:p-3">
											<p className="text-white font-semibold text-sm sm:text-base">{game.name}</p>
										</div>
									</div>
								</Link>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}


			{!isInitialLoading && showAll && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
					{safeGames.map((game) => (
						<Link key={game._id} to={`/games/${game.slug}`} className="group">
							<div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden 
								bg-gradient-to-b from-[#2b2737] to-[#1a1823] 
								shadow-lg shadow-purple-900/40 hover:scale-105 transition duration-500">
								<img
									src={game.image}
									alt={game.name}
									className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:opacity-80 transition"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2 sm:p-3">
									<p className="text-white font-semibold text-sm sm:text-base">{game.name}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}


			<style jsx>{`
				.games-swiper .swiper-slide {
					transition: transform 0.3s ease;
				}

				.games-swiper .swiper-slide:hover {
					transform: translateY(-8px);
				}
			`}</style>
		</div>
	)
}

export default Games
