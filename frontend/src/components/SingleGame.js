import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPlay, FaRegStar, FaShoppingCart, FaStar, FaStarHalfAlt, FaWindows } from 'react-icons/fa'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById, getGameRating } from '../Redux/Slice/game.slice'
import { GoDotFill } from "react-icons/go"
import { addToCart, fetchCart, removeFromCart } from '../Redux/Slice/cart.slice'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice'
import { allorders, createOrder } from '../Redux/Slice/Payment.slice'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './PaymentForm'
import ReviewForm from './ReviewForm'
import { MdDateRange } from "react-icons/md"
import { decryptData } from "../Utils/encryption"
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import SingleGameSkeleton from '../lazyLoader/SingleGameSkeleton'
import { fanCoinsuse } from '../Redux/Slice/user.slice'
import { getUserById } from '../Redux/Slice/user.slice'


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

// Custom hooks
const useResponsiveSlides = () => {
  const [slidesToShow, setSlidesToShow] = useState(5)

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth
      if (width >= 1650) setSlidesToShow(5)
      else if (width >= 1280) setSlidesToShow(4)
      else if (width >= 768) setSlidesToShow(4)
      else if (width >= 576) setSlidesToShow(3)
      else if (width >= 426) setSlidesToShow(3)
      else if (width >= 376) setSlidesToShow(3)
      else if (width >= 321) setSlidesToShow(2)
      else setSlidesToShow(1)
    }

    updateSlides()
    window.addEventListener("resize", updateSlides)
    return () => window.removeEventListener("resize", updateSlides)
  }, [])

  return slidesToShow
}

// Reusable components
const StarRating = ({ rating, size = "h-5 w-5" }) => {
  const fullStars = Math.floor(rating || 0)
  const hasHalfStar = (rating || 0) % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} className={`text-yellow-400 ${size} mx-0.5`} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className={`text-yellow-400 ${size} mx-0.5`} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <FaRegStar key={`empty-${i}`} className={`text-yellow-400 ${size} mx-0.5`} />
      ))}
      <span className="ml-2 text-white text-sm">{rating?.toFixed(1) || '0.0'}</span>
    </div>
  )
}

// const CustomArrow = ({ direction, onClick, className = "" }) => {
//   const Icon = direction === 'next' ? FaChevronRight : FaChevronLeft
//   const positionClass = direction === 'next' ? 'right-4' : 'left-4'

//   return (
//     <div
//       onClick={onClick}
//       className={`absolute top-1/2 ${positionClass} z-10 -translate-y-1/2 
//                  bg-black/50 hover:bg-black/70 text-white p-2 rounded-full 
//                  cursor-pointer transition ${className}`}
//     >
//       <Icon size={20} />
//     </div>
//   )
// }

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ms:p-3 p-2 rounded-full cursor-pointer transition"
  >
    <FaChevronRight size={20} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ms:p-3 p-2 rounded-full cursor-pointer transition"
  >
    <FaChevronLeft size={20} />
  </div>
);


const ThumbArrow = ({ direction, onClick }) => {
  const Icon = direction === 'next' ? FaChevronRight : FaChevronLeft
  const positionClass = direction === 'next' ? '-right-6' : '-left-6'

  return (
    <div
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 
                bg-gray-800 hover:bg-gray-600 text-white p-2 rounded-full 
                 cursor-pointer transition z-10`}
    >
      <Icon size={18} />
    </div>
  )
}

const GameInfo = ({ single }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-5">
      <InfoItem label="Memory" value={single?.platforms?.windows?.system_requirements?.memory} />
      <InfoItem label="Storage" value={single?.platforms?.windows?.system_requirements?.storage} />
      <InfoItem
        label="Graphics"
        value={`(${single?.platforms?.windows?.system_requirements?.graphics})`}
      />
    </div>
    <div className="space-y-5">
      <InfoItem
        label="OS"
        value={single?.platforms?.windows?.system_requirements?.os}
        capitalize
      />
      <InfoItem
        label="Processor"
        value={single?.platforms?.windows?.system_requirements?.processor}
        capitalize
      />
    </div>
  </div>
)

const InfoItem = ({ label, value, capitalize = false }) => (
  <div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-white text-sm ${capitalize ? 'capitalize' : ''}`}>{value || '-'}</p>
  </div>
)

const AccordionItem = ({ title, children, defaultOpen = false }) => (
  <details className="group open:shadow-lg open:bg-black/20 transition-all" open={defaultOpen}>
    <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
      <span className="text-lg font-semibold">{title}</span>
      <svg
        className="w-5 h-5 transition-transform group-open:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div className="pb-5 px-4 md:px-5">
      {children}
    </div>
  </details>
)

const ReviewItem = ({ review, gameRating }) => {
  const fullStars = Math.floor(review?.rating || 0)
  const hasHalfStar = (review?.rating || 0) % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`
  }

  return (
    <div className='mt-2' key={review?._id}>
      <div className='flex items-center'>
        <img
          src={review?.user?.profilePic}
          className='w-[50px] h-[50px] object-cover rounded-full'
          alt={decryptData(review?.user?.name)}
        />
        <div className='ms-3'>
          <div>{decryptData(review?.user?.name)}</div>
          <div className='flex items-center'>
            {Array.from({ length: fullStars }).map((_, i) => (
              <FaStar key={`full-${i}`} className="text-yellow-400 h-4 w-4 mx-0.5" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 h-4 w-4 mx-0.5" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <FaRegStar key={`empty-${i}`} className="text-yellow-400 h-4 w-4 mx-0.5" />
            ))}
            <span className="ms-2 text-white text-[14px]">{review?.rating?.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className='mt-2 text-[13px]'>{review?.review}</p>
      <p className='text-[13px] mt-1 flex items-center'>
        <MdDateRange className='text-[16px] me-2' />
        {formatDate(review?.createdAt)}
      </p>
      <div className='h-[1px] bg-gray-700 mt-3'></div>
    </div>
  )
}

const SingleGame = () => {
  // Refs
  const sliderRef1 = useRef(null)
  const sliderRef2 = useRef(null)
  const videoRefs = useRef([])
  const navigate = useNavigate();
  // State
  const [nav1, setNav1] = useState(null)
  const [nav2, setNav2] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [currentOrderId, setCurrentOrderId] = useState(null)
  const [amountToPay, setAmountToPay] = useState(0)
  const [open, setOpen] = useState(false)

  // Fan coin state
  const [useFanCoinsChecked, setUseFanCoinsChecked] = useState(false)
  const [fanCoinsToUse, setFanCoinsToUse] = useState(0)
  const [finalAmount, setFinalAmount] = useState(0)

  const { currentUser } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  const fanCoins = currentUser?.fanCoins || 0;

  const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));

  // Custom hooks
  const slidesToShow = useResponsiveSlides()

  // Redux
  const { id } = useParams()
  const dispatch = useDispatch()

  // Selectors
  const single = useSelector((state) => state?.game?.singleGame)
  const { loading: gameLoading } = useSelector((state) => state?.game)
  const cartItems = useSelector((state) => state.cart.cart)
  const { wishlistStatus } = useSelector((state) => state.wishlist)
  const gameRating = useSelector((state) => state?.game?.singleGameReview?.data)
  const { orders, loading: ordersLoading } = useSelector((state) => state.payment)

  // Computed values
  const ratings = useMemo(() => single?.reviews || [], [single?.reviews])
  const isInCart = useMemo(() =>
    Array.isArray(cartItems) && cartItems.some(item => item?.game?._id === single?._id),
    [cartItems, single?._id]
  )
  const isInWishlist = useMemo(() =>
    Boolean((wishlistStatus || {})[single?._id]),
    [wishlistStatus, single?._id]
  )
  const isBuyed = useMemo(() =>
    Array.isArray(orders) && orders.some(order =>
      order?.status === 'paid' &&
      order?.items?.some(item => item?.game?._id === id)
    ),
    [orders, id]
  )

  // Reset states when game price changes
  useEffect(() => {
    setUseFanCoinsChecked(false)
    setFanCoinsToUse(0)
    setFinalAmount(single?.platforms?.windows?.price || 0)
  }, [single?.platforms?.windows?.price])

  // Handle fan coin checkbox change
  const handleFanCoinCheckboxChange = useCallback((checked) => {
    // Check if user is authenticated before proceeding
    if (!isLoggedIn) {
      console.error('User not authenticated')
      alert('Please login to use Fan Coins')
      return
    }

    if (!fanCoins || fanCoins <= 0) {
      console.error('No fan coins available')
      alert('You have no Fan Coins available')
      return
    }

    setUseFanCoinsChecked(checked)

    const gamePrice = single?.platforms?.windows?.price || 0

    if (checked) {
      // Calculate maximum applicable Fan Coins
      const maxApplicableCoins = Math.min(fanCoins, gamePrice)

      setFanCoinsToUse(maxApplicableCoins)
      setFinalAmount(Math.max(0, gamePrice - maxApplicableCoins))
    } else {
      setFanCoinsToUse(0)
      setFinalAmount(gamePrice)
    }
  }, [authUser, fanCoins, single?.platforms?.windows?.price])

  // Effects
  useEffect(() => {
    setNav1(sliderRef1)
    setNav2(sliderRef2)
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getGameById(id))
      dispatch(getGameRating(id))
    }

    const userId = localStorage.getItem("userId")
    if (userId) {

      dispatch(allorders())
    }
  }, [dispatch, id])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (open || showPaymentForm) {
      const userId = localStorage.getItem("userId")
      if (userId) {
        dispatch(fetchWishlist())
        dispatch(fetchCart())
      }
    }
  }, [open, showPaymentForm, dispatch])

  // Handlers
  const handleSlideChange = useCallback((oldIndex, newIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === newIndex) {
          video.currentTime = 0
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Video play interrupted:", error)
            })
          }
        } else {
          video.pause()
        }
      }
    })
  }, [])

  const handleAddToCart = useCallback((game) => {
    dispatch(addToCart({ gameId: game._id, platform: "windows", qty: 1 }))
  }, [dispatch])

  const handleAddWishlist = useCallback((game) => {
    dispatch(addToWishlist({ gameId: game._id }))
  }, [dispatch])

  const handleRemoveFromWishlist = useCallback((gameId) => {
    dispatch(removeFromWishlist({ gameId }))
  }, [dispatch])

  const handleCheckout = useCallback(async () => {
    if (!single || !single._id) {
      console.error("Game data is not available for checkout.")
      return
    }

    try {
      const resultAction = await dispatch(createOrder({
        items: [{
          game: single._id,
          name: single.title,
          platform: "windows",
          price: Number(single.platforms?.windows?.price || 0),
        }],
        amount: finalAmount, // Use final amount after fan coins
        fanCoinsUsed: fanCoinsToUse || 0,
        fanCoinDiscount: fanCoinsToUse || 0
      }))

      if (createOrder.fulfilled.match(resultAction)) {
        const {  order } = resultAction.payload
   
        setCurrentOrderId(order._id)
        setAmountToPay(finalAmount)
        // setShowOrderSummary(true)
        handleProceedToPayment();

      }
    } catch (error) {
      console.error("Checkout failed:", error)
    }
  }, [dispatch, single, finalAmount, fanCoinsToUse])

  const handleProceedToPayment = useCallback(async () => {
    // If fan coins are selected, apply them
    
    if (useFanCoinsChecked && fanCoinsToUse > 0 && currentUser?._id) {
      try {
        const fanCoinResult = await dispatch(fanCoinsuse({
          userId: currentUser._id,
          gamePrice: single?.platforms?.windows?.price || 0,
          fanCoinsToUse: fanCoinsToUse
        }))

        if (fanCoinResult.type === 'user/fanCoinsuse/fulfilled') {
          console.log('Fan coins applied successfully:', fanCoinResult.payload)
          setAmountToPay(fanCoinResult.payload.discountedPrice || finalAmount)

          // Update user data to reflect the new fan coin balance
          dispatch(getUserById(localStorage.getItem("userId")))
        } else {
          console.error('Failed to apply Fan Coins', fanCoinResult)
          alert('Failed to apply Fan Coins. Proceeding with original amount.')
          // Reset fan coin states on failure
          setUseFanCoinsChecked(false)
          setFanCoinsToUse(0)
          setFinalAmount(single?.platforms?.windows?.price || 0)
        }
      } catch (error) {
        console.error('Failed to use fan coins:', error)
        alert('Failed to apply Fan Coins. Proceeding with original amount.')
        // Reset fan coin states on error
        setUseFanCoinsChecked(false)
        setFanCoinsToUse(0)
        setFinalAmount(single?.platforms?.windows?.price || 0)
      }
    }

    setShowOrderSummary(false)
    setShowPaymentForm(true)
  }, [dispatch, authUser, single, useFanCoinsChecked, fanCoinsToUse, finalAmount])

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentForm(false)
    setClientSecret("")
    setCurrentOrderId(null)
    setAmountToPay(0)
    setUseFanCoinsChecked(false)
    setFanCoinsToUse(0)
    setFinalAmount(0)
    if(isInCart){
      dispatch(removeFromCart({gameId:id,platform:"windows"}))
    }
  }, [])

  // Slider settings
  const mainSettings = useMemo(() => ({
    asNavFor: nav2,
    beforeChange: handleSlideChange,
    nextArrow: <NextArrow direction="next" />,
    prevArrow: <PrevArrow direction="prev" />,
  }), [nav2, handleSlideChange])

  const thumbSettings = useMemo(() => ({
    asNavFor: nav1,
    slidesToShow,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: true,
    nextArrow: <ThumbArrow direction="next" />,
    prevArrow: <ThumbArrow direction="prev" />,
    responsive: [
      { breakpoint: 1650, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 4, centerMode: false } },
      { breakpoint: 576, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 426, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 376, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 321, settings: { slidesToShow: 2, centerMode: false } },
    ],
  }), [nav1, slidesToShow])

  // Loading state
  if (gameLoading || !single) {
    return <SingleGameSkeleton />
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <div className=''>
      <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
        <div>
          <h2 className='md:text-[40px] ms:text-[30px] text-[24px] font-[800] pt-5 capitalize'>
            {single?.title}
          </h2>
        </div>

        <div className="flex flex-col-reverse lg:flex-row lg:mt-11">
          <div className='3xl:w-3/4 2xl:w-2/3 xl:w-3/5 lg:w-3/5 w-full xl:mt-0 mt-5 xl:px-0 lg:px-5 order-2 lg:order-1'>
            <div>
              <Slider {...mainSettings} ref={setNav1} className="ds_single_slider">
                {/* {console.log(single.video)} */}
                {single?.video?.url && (
                  <div>
                    <video
                      src={single.video.url}
                      autoPlay
                      muted
                      loop
                      controls
                      className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover object-center rounded-lg bg-black shadow-lg"
                    />
                  </div>
                )}
                {single?.images?.map((element) => (
                  <div key={element._id}>
                    <img
                      src={element.url}
                      alt="Game screenshot"
                      className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover object-center rounded-lg"
                    />
                  </div>
                ))}
              </Slider>

              {/* Thumbnail Slider */}
              <div className='px-5'>
                <Slider {...thumbSettings} ref={setNav2} className='mt-3 ds_mini_slider'>
                  {single?.video?.url && (
                    <div className="flex justify-center relative w-full">
                      <video
                        src={single.video.url}
                        muted
                        className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer"
                      />
                      <FaPlay className="absolute inset-0 m-auto text-white sm:text-4xl text-[20px] transition" />
                    </div>
                  )}
                  {single?.images?.map((element) => (
                    <div key={element._id} className="flex justify-center relative w-full">
                      <img
                        src={element.url}
                        alt="Thumbnail"
                        className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer"
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Game Details */}
              <div className="py-10 md:px-4">
                <h2 className="text-base md:text-lg mb-12 text-left">
                  {single?.description}
                </h2>

                {/* Genres */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                  <div className="bg-black/30 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg md:text-2xl font-semibold mb-4 text-[#ab99e1]">Genres</h3>
                    <div className="flex flex-wrap gap-3">
                      {single?.tags?.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-500/40 cursor-pointer capitalize"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Game Description */}
                <div className="bg-black/30 p-8 rounded-lg shadow-lg mb-8">
                  <h3 className="text-lg md:text-2xl font-bold mb-1 text-[#ab99e1] capitalize">
                    {single?.title}
                  </h3>
                  <p className="mb-4">(also Includes {single?.title} Legacy)</p>
                  <p className="text-gray-300 text-sm md:text-base">
                    {single?.description}
                  </p>
                </div>

                {/* System Requirements */}
                <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                  <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">
                    Windows
                  </h3>
                  <h4 className="text-base font-semibold mb-6">System Requirements</h4>
                  <GameInfo single={single} />
                </div>

                {/* Instructions */}
                {single?.instructions?.length > 0 && (
                  <div className='mt-5 pt-2'>
                    <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                      <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">
                        Instructions
                      </h3>
                      {single.instructions.map((instruction, index) => (
                        <div key={index} className='flex items-center mb-1'>
                          <GoDotFill className='me-2 text-[12px]' />
                          {instruction}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right side copntent */}
          <div className="3xl:w-1/4  2xl:w-1/3 xl:w-2/5 lg:w-2/5 w-full xl:pl-6 mt-10 xl:mt-0 order-1 lg:order-2">
            <div className="p-6 sticky top-24 bg-black/30 ">
              <div className="flex justify-center mb-6">
                <img
                  src={single?.cover_image?.url}
                  alt="Game Cover"
                  className="w-[330px] h-auto"
                />
              </div>

              {/* Price */}
              <div className="flex mb-6">
                <p className="text-xs font-bold text-white">
                  Price <strong className='text-xl font-bold text-white'>
                    ${single?.platforms?.windows?.price}
                  </strong>
                </p>
              </div>

              {/* Action Buttons */}
              {isLoggedIn ?
                <div className="space-y-4">
                  <div className='flex sx:gap-4 gap-2'>
                    {/* Wishlist Button */}
                    {isInWishlist ? (
                      <button
                        onClick={() => handleRemoveFromWishlist(single._id)}
                        className="w-full flex items-center justify-center gap-2 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    >
                      <FaHeart size={16} />
                      <span className="text-xs">WishListed</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddWishlist(single)}
                      className="w-full flex items-center justify-center gap-2 
                                font-bold py-3 sm:px-4 px-1 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        <FaHeart size={16} />
                        <span className="text-xs">Add To WishList</span>
                      </button>
                    )}

                    {/* Cart Button */}
                    {!isBuyed ? isInCart ? (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        <FaShoppingCart size={16} />
                        <span className="text-xs">Added to cart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(single)}
                        className="w-full flex items-center justify-center gap-2 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        <FaShoppingCart size={16} />
                        <span className="text-xs">Add To Cart</span>
                      </button>
                    ) : null}
               
                  </div>

                  {/* Purchase/Review Buttons */}

                  {isBuyed ? (
                    <>
                      <button
                        className="w-full cursor-not-allowed 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        <span className="text-white font-bold text-sm me-2">✓</span>
                        Purchased
                      </button>
                      <button
                        onClick={() => setOpen(true)}
                        className="w-full cursor-pointer 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      >
                        Review
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowOrderSummary(true)}
                      className="w-full cursor-pointer 
                                font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                                bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
                    text-white shadow-lg shadow-fuchsia-500/30
                    hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
                    active:scale-95 focus-visible:outline-none 
                    focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    >
                      Buy Now
                    </button>
                  )}
                </div> :
                <button
                  onClick={() => navigate('/login')}
                  className="w-full cursor-pointer
                        font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out
                        bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899]
            text-white shadow-lg shadow-fuchsia-500/30
            hover:from-[#7C3AED] hover:via-[#9333EA] hover:to-[#DB2777] hover:scale-110
            active:scale-95 focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  login to Buy
                </button>}

              {/* Payment Modal */}
              <Dialog
                open={!!(showPaymentForm  && currentOrderId)}
                onClose={() => setShowPaymentForm(false)}
                className="relative z-50"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/75" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-md rounded-xl bg-gray-900 sm:p-6 p-4 shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Complete Your Purchase
                    </h3>
                    <Elements stripe={stripePromise} >
                      <PaymentForm
                        orderId={currentOrderId}
                        amount={amountToPay}
                        onPaymentSuccess={handlePaymentSuccess}
                        fromCartPage={false}
                        fanCoinsToUse={fanCoinsToUse}
                        fanCoinsApplied={useFanCoinsChecked}
                      />
                    </Elements>
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="mt-4 text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </DialogPanel>
                </div>
              </Dialog>

              {/* Order Summary Modal */}
              <Dialog
                open={showOrderSummary}
                onClose={() => setShowOrderSummary(false)}
                className="relative z-50"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/75" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-md rounded-xl bg-gray-900 sm:p-6 p-4 shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Order Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <img
                            src={single?.cover_image?.url}
                            alt={single?.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{single?.title}</h4>
                            <p className="text-gray-400 text-sm">Windows Platform</p>
                          </div>
                        </div>
                        <p className="text-white font-bold">${finalAmount?.toFixed(2)}</p>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal</span>
                          <span>${single?.platforms?.windows?.price?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 mt-2">
                          <span>Tax</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-white font-bold mt-2 text-lg">
                          <span>Total</span>
                          <span>${finalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                      {/* Fan Coin Usage Section */}
                      {isLoggedIn && (
                        <div className="fan-coin-section p-4 rounded-xl border border-gray-700">
                          <div className="flex flex-col justify-between">
                            <div className="flex flex-col">
                              <label
                                htmlFor="useFanCoins"
                                className={`text-white flex items-center ${(!isLoggedIn || !fanCoins || fanCoins <= 0) ? 'text-gray-500' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  id="useFanCoins"
                                  checked={useFanCoinsChecked}
                                  onChange={(e) => handleFanCoinCheckboxChange(e.target.checked)}
                                  className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={!isLoggedIn || !fanCoins || fanCoins <= 0}
                                />
                                Use Fan Coins
                              </label>
                              <span className="ml-6 text-sm text-gray-400">
                                {!isLoggedIn
                                  ? "(Login to use Fan Coins)"
                                  : (!fanCoins || fanCoins <= 0)
                                    ? "(No Fan Coins available)"
                                    : `(Available: ${fanCoins.toFixed(2)})`
                                }
                              </span>
                            </div>
                            {useFanCoinsChecked && (
                              <div className="text-sm text-green-400">
                                1 Fan Coin = $1 Discount
                              </div>
                            )}
                          </div>

                          {useFanCoinsChecked && (
                            <div className="relative mt-3">
                              <input
                                type="number"
                                value={fanCoinsToUse}
                                onChange={(e) => {
                                  const inputValue = parseFloat(e.target.value) || 0;
                                  const gamePrice = single?.platforms?.windows?.price || 0;
                                  const maxApplicableCoins = Math.min(fanCoins, gamePrice);

                                  // Validate input: cannot exceed available fan coins or game price
                                  const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                  // Always update both states together
                                  setFanCoinsToUse(validatedCoins);
                                  setFinalAmount(Math.max(0, gamePrice - validatedCoins));
                                }}
                                onBlur={(e) => {
                                  // On blur, ensure the input field shows the validated value
                                  const inputValue = parseFloat(e.target.value) || 0;
                                  const gamePrice = single?.platforms?.windows?.price || 0;
                                  const maxApplicableCoins = Math.min(fanCoins, gamePrice);
                                  const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                  // Force update the input value to match the validated state
                                  if (validatedCoins !== inputValue) {
                                    e.target.value = validatedCoins;
                                    setFanCoinsToUse(validatedCoins);
                                    setFinalAmount(Math.max(0, gamePrice - validatedCoins));
                                  }
                                }}
                                min="0"
                                max={Math.min(fanCoins, single?.platforms?.windows?.price || 0)}
                                step="1"
                                className="w-full p-2 rounded-xl bg-gray-700/20 text-white border border-gray-600 focus:border-purple-400 focus:ring-purple-500"
                                placeholder={`Max: ${Math.min(fanCoins, single?.platforms?.windows?.price || 0)}`}
                              />
                              <div className="text-xs text-gray-400 mt-1">
                                Available: {fanCoins} Fan Coins | Max Applicable: {Math.min(fanCoins, single?.platforms?.windows?.price || 0)}
                                {fanCoinsToUse > 0 && (
                                  <span className="text-green-400 ml-2">
                                    Discount: ${fanCoinsToUse} | Final: ${finalAmount.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => setShowOrderSummary(false)}
                        className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-white rounded-lg hover:opacity-90 transition"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>

              {/* Accordion Sections */}
              <div className="divide-y divide-gray-700/60 rounded-xl overflow-hidden bg-black/30 mt-6">
                <AccordionItem title="Platform">
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded flex items-center">
                      <FaWindows className='me-2' /> Windows
                    </span>
                  </div>
                </AccordionItem>

                <AccordionItem title="Rating">
                  <StarRating rating={ratings.averageRating} />

                  {gameRating && (
                    <div className="mt-4">
                      {gameRating.map((element) => {
                        let FullStar = Math.floor(element?.rating);
                        let HasHalfStar = element?.rating % 1 >= 0.5;
                        let EmptyStars = 5 - FullStar - (HasHalfStar ? 1 : 0);

                        return (
                          <div className="mt-2" key={element?._id}>
                            <div className="flex items-center">
                              <img
                                src={element?.user?.profilePic}
                                className="w-[50px] h-[50px] object-cover rounded-full"
                                alt=""
                              />
                              <div className="ms-3">
                                <div className="font-medium">
                                  {decryptData(element?.user?.name)?.split(" ")[0]}
                                </div>
                                <div className="flex items-center">
                                  {Array.from({ length: FullStar }).map((_, i) => (
                                    <FaStar
                                      key={`full-${i}`}
                                      className="text-yellow-400 h-4 w-4 mx-0.5"
                                    />
                                  ))}
                                  {HasHalfStar && (
                                    <FaStarHalfAlt className="text-yellow-400 h-4 w-4 mx-0.5" />
                                  )}
                                  {Array.from({ length: EmptyStars }).map((_, i) => (
                                    <FaRegStar
                                      key={`empty-${i}`}
                                      className="text-yellow-400 h-4 w-4 mx-0.5"
                                    />
                                  ))}
                                  <span className="ms-2 text-white text-[14px]">
                                    {element?.rating?.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="mt-2 text-[13px]">{element?.review}</p>
                            <p className="text-[13px] mt-1 flex">
                              <MdDateRange className="text-[16px] me-2" />{" "}
                              {formatDate(element?.createdAt)}
                            </p>
                            <div className="h-[1px] bg-gray-700 mt-3"></div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionItem>

                <AccordionItem title="Purchase Info">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">Game Size</h4>
                      <p className="text-white text-base">{single?.platforms?.windows?.size}</p>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">YOYO Rewards</h4>
                      <p className="text-white text-base">Earn 10% Back</p>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title="More Details">
                  <div className="space-y-4">
                    {/* <div className="flex justify-between">
                      <p className="text-base text-gray-400">Refund Type</p>
                      <p className="text-white text-base">{single?.refund_type || '-'}</p>
                    </div> */}
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Developer</p>
                      <p className="text-white text-base">{single?.developer || 'Yoyo game'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Publisher</p>
                      <p className="text-white text-base">{single?.publisher || 'Yoyo game'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Release Date</p>
                      <p className="text-white text-base">
                        {single?.createdAt ? new Date(single.createdAt).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Total Download</p>
                      <p className="text-white text-base">{single?.totalDownloads || 0}</p>
                    </div>
                  </div>
                </AccordionItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {open && (
        <ReviewForm open={open} onClose={() => setOpen(false)} game={id} />
      )}
    </div>
  )
}

export default SingleGame;