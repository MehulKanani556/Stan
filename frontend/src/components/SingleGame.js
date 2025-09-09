import React, { useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHeart, FaPlay, FaRegStar, FaShoppingCart, FaStar, FaStarHalfAlt, FaWindows } from 'react-icons/fa'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import gta from '../images/gta.mp4'
import gta5 from '../images/gta5.jpeg'
import game from '../images/game_img.jpeg'
import game1 from '../images/game_img2.jpeg'
import game2 from '../images/game_img3.jpeg'
import game3 from '../images/game_img4.jpeg'
import game4 from '../images/game_img5.jpeg'
import gtav from '../images/gtalogo.avif'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createWishlist, getGameById, getGameRating } from '../Redux/Slice/game.slice'
import { GoDotFill } from "react-icons/go";
import { addToCart, fetchCart, removeFromCart } from '../Redux/Slice/cart.slice'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../Redux/Slice/wishlist.slice'
import { allorders, createOrder, verifyPayment } from '../Redux/Slice/Payment.slice'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import ReviewForm from './ReviewForm'
import { MdDateRange } from "react-icons/md";
import { decryptData } from "../Utils/encryption";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'


import SingleGameSkeleton from '../lazyLoader/SingleGameSkeleton'

const stripePromise = loadStripe("pk_test_51R8wmeQ0DPGsMRTSHTci2XmwYmaDLRqeSSRS2hNUCU3xU7ikSAvXzSI555Rxpyf9SsTIgI83PXvaaQE3pJAlkMaM00g9BdsrOB");

const SingleGame = () => {

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);
  const videoRefs = useRef([]);
  const [slidesToShow, setSlidesToShow] = useState(5)
  const { id } = useParams()
  const dispatch = useDispatch()
  const single = useSelector((state) => state?.game?.singleGame);
  const { loading: gameLoading } = useSelector((state) => state?.game);
  const cartItems = useSelector((state) => state.cart.cart);
  const { wishlistStatus } = useSelector((state) => state.wishlist);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);
  const [open, setOpen] = useState(false)
  const gameRating = useSelector((state) => state?.game?.singleGameReview?.data)

  console.log("YYYYYYYYY", gameRating);


  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  useEffect(() => {
    dispatch(getGameById(id));
    dispatch(fetchWishlist());
    dispatch(fetchCart());
  }, [open, showPaymentForm])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    dispatch(getGameRating(id))
  }, [])


  const handleSlideChange = (oldIndex, newIndex) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === newIndex) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Video play interrupted:", error);
            });
          }
        } else {
          video.pause();
        }
      }
    });
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer transition"
      >
        <FaChevronRight size={20} />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer transition"
      >
        <FaChevronLeft size={20} />
      </div>
    );
  };

  const ThumbNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute -right-6 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 text-white ms:p-2 p-1 rounded-full cursor-pointer transition z-10"
    >
      <FaChevronRight size={18} />
    </div>
  );

  const ThumbPrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute -left-6 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-600 text-white ms:p-2 p-1 rounded-full cursor-pointer transition z-10"
    >
      <FaChevronLeft size={18} />
    </div>
  );

  const mainSettings = {
    asNavFor: nav2,
    beforeChange: handleSlideChange,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const thumbSettings = {
    asNavFor: nav1,
    slidesToShow,
    swipeToSlide: true,
    focusOnSelect: true,
    centerMode: true,
    nextArrow: <ThumbNextArrow />,
    prevArrow: <ThumbPrevArrow />,
    responsive: [
      { breakpoint: 1650, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 4, centerMode: false } },
      { breakpoint: 576, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 426, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 376, settings: { slidesToShow: 3, centerMode: false } },
      { breakpoint: 321, settings: { slidesToShow: 2, centerMode: false } },
    ],
  };

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;

      if (width >= 1650) {
        setSlidesToShow(5);  // default
      } else if (width >= 1280) {
        setSlidesToShow(4);
      } else if (width >= 768) {
        setSlidesToShow(4);
      } else if (width >= 576) {
        setSlidesToShow(3);
      } else if (width >= 426) {
        setSlidesToShow(3);
      } else if (width >= 376) {
        setSlidesToShow(3);
      } else if (width >= 321) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(1); // for extra small devices
      }
    };

    updateSlides(); // run once on mount
    window.addEventListener("resize", updateSlides);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const ratings = single?.reviews || [];
  const fullStars = Math.floor(ratings.averageRating);
  const hasHalfStar = ratings.averageRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleWishList = (id) => {
    dispatch(createWishlist(id))

  }
  const handleAddToCart = (ele) => {
    dispatch(addToCart({ gameId: ele._id, platform: "windows", qty: 1 }));
  }
  const handleAddWishlist = (ele) => {
    // alert("a")
    dispatch(addToWishlist({ gameId: ele._id }));
  }

  const handleRemoveFromWishlist = (gameId) => {
    dispatch(removeFromWishlist({ gameId }));
  };
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart({ gameId: id, platform: "windows" }));
  }


  const handleCheckout = async () => {
    if (!single || !single._id) {
      console.error("Game data is not available for checkout.");
      return;
    }
    // alert('is called')
    // 1. Create order (calls backend)
    const resultAction = await dispatch(createOrder({
      items: [
        {
          game: single._id,
          name: single.title,
          platform: "windows", // Assuming "windows" as a default platform
          price: Number(single.platforms?.windows?.price || 0),
        }
      ], amount: single.platforms?.windows?.price || 0
    }));
    if (createOrder.fulfilled.match(resultAction)) {
      const { clientSecret: newClientSecret, order } = resultAction.payload;
      setClientSecret(newClientSecret);
      setCurrentOrderId(order._id);
      setAmountToPay(order.amount);

    }
    setShowPaymentForm(true);
  };

  const formatDate = (dateString) => {

    if (!dateString) return "";
  
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, "0");
  
    const month = String(date.getMonth() + 1).padStart(2, "0");
  
    const year = String(date.getFullYear()).slice(-2);
  
    return `${day}-${month}-${year}`;
  
  };
   

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setClientSecret("");
    setCurrentOrderId(null);
    setAmountToPay(0);
    setHasPaid(true);
  };
  // review modal hadnling

  const { orders, loading: ordersLoading } = useSelector((state) => state.payment);
  console.log('orders', orders)
  const isBuyed = Array.isArray(orders) && orders.some(order =>
    order.status === 'paid' &&
    order?.items?.some(item => item.game._id === id)
  );

  console.log(isBuyed);
  useEffect(() => {
    dispatch(allorders());
  }, [dispatch]);

  // Show skeleton while loading
  if (gameLoading || !single) {
    return <SingleGameSkeleton />;
  }

  // const formatDate = (dateString) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const year = String(date.getFullYear()).slice(-2);
  //   return `${day}-${month}-${year}`;
  // };

  return (
    <div className=''>
      <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
        <div>
          <h2 className='md:text-[40px] ms:text-[30px] text-[24px] font-[800] pt-5 capitalize'>{single?.title}</h2>
        </div>

        <div className="flex  xl:flex-row lg:mt-11">
          <div className='3xl:w-3/4 2xl:w-2/3 xl:w-3/5 w-full xl:mt-0 mt-5'>
            <div>
              <Slider {...mainSettings} ref={setNav1} className="ds_single_slider">
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
                      alt=""
                      className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] object-cover object-center rounded-lg"
                    />
                  </div>
                ))}
              </Slider>

              <div className='px-5'>
                <Slider {...thumbSettings} ref={setNav2} className='mt-3 ds_mini_slider' >

                  {single?.video?.url ? (
                    <div className="flex justify-center  relative w-full">
                      <video src={single?.video?.url} muted className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                      <FaPlay className="absolute inset-0 m-auto text-white sm:text-4xl text-[20px] transition" />
                    </div>
                  ) : ""}

                  {single?.images?.map((element) => {
                    return (
                      <div className="flex justify-center  relative w-full">
                        {/* <img src={gta5} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                         <FaPlay className="absolute inset-0 m-auto text-white text-4xl transition" /> */}
                        <img src={element?.url} alt="" className="lg:h-[100px] sm:h-[90px] h-[70px] w-full object-cover rounded-lg cursor-pointer" />
                      </div>
                    )
                  })}
                </Slider>
              </div>


              {/* Features Section */}
              <div className="py-10 md:px-4">
                <div className="">
                  <h2 className="text-base md:text-lg mb-12 text-left">
                    {single?.description}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                    <div className="bg-black/30 p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg md:text-2xl font-semibold mb-4 text-[#ab99e1]">Genres</h3>
                      <div className="flex flex-wrap gap-3">
                        {single?.tags?.map((genre, index) => (
                          <span key={index} className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-500/40 cursor-pointer capitalize">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-8 rounded-lg shadow-lg mb-8">
                    <h3 className="text-lg md:text-2xl font-bold mb-1 text-[#ab99e1] capitalize">{single?.title}</h3>
                    <p className="mb-4">(also Includes {single?.title} Legacy)</p>
                    <p className="text-gray-300 text-sm md:text-base">
                      {single?.description}
                    </p>
                  </div>
                </div>


                <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                  {/* Header */}
                  <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">Windows</h3>
                  <h4 className="text-base font-semibold mb-6">System Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div>
                        <p className="text-gray-400 text-sm">Memory</p>
                        <p className="text-white text-sm">{single?.platforms?.windows?.system_requirements?.memory}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Storage</p>
                        <p className="text-white text-sm">{single?.platforms?.windows?.system_requirements?.storage}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Graphics</p>
                        <p className="text-white text-sm">({single?.platforms?.windows?.system_requirements?.graphics})</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-gray-400 text-sm">OS</p>
                        <p className="text-white text-sm capitalize">{single?.platforms?.windows?.system_requirements?.os}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Processor</p>
                        <p className="text-white text-sm capitalize">{single?.platforms?.windows?.system_requirements?.processor}</p>
                      </div>

                    </div>
                  </div>
                </div>

                {single?.instructions?.length > 0 ? <div className='mt-5 pt-2'>
                  <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                    {/* Header */}
                    <h3 className="text-lg md:text-2xl font-semibold pb-4 mb-6 border-b border-gray-700 text-[#ab99e1]">Instructions</h3>
                    {single?.instructions?.map((element, index) => {
                      return (
                        <div key={index} className='flex items-center mb-1'><GoDotFill className='me-2 text-[12px]' />{element} </div>
                      )
                    })}
                  </div>
                </div> : ""}
              </div>
            </div>
          </div>

          {/* right side copntent */}
          <div className="3xl:w-1/4  2xl:w-1/3 xl:w-2/5 w-full xl:pl-6 mt-10 xl:mt-0 ">
            <div className="p-6 sticky top-24 bg-black/30 ">
              <div className="flex justify-center mb-6">
                <img src={single?.cover_image?.url} alt="Game Logo" className="w-[330px] h-auto" />
              </div>
              <div className="flex">
                <p className="text-xs font-bold text-white mb-6">Price <strong className='text-xl font-bold text-white'>${single?.platforms?.windows?.price}</strong></p>
              </div>

              <div className="">
                <div className='flex gap-4'>
                  {wishlistStatus[single?._id] ? (
                    <button
                      onClick={() => handleRemoveFromWishlist(single._id)}
                      className="w-full flex items-center gap-2 
                               bg-gradient-to-r from-green-500 to-green-700 
                               hover:from-green-600 hover:to-green-800 
                               active:scale-95 
                               text-white font-bold py-3 px-4 mb-6 
                               rounded-xl shadow-md hover:shadow-lg 
                               transition-all duration-300 ease-in-out"
                    >
                      <FaHeart size={16} />
                      <span className="text-xs">WishListed</span>
                    </button>
                  ) : (

                    <button onClick={() => handleAddWishlist(single)} className="w-full flex items-center gap-2 bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                      <FaHeart size={16} />
                      <span className="text-xs">Add To WishList</span>
                    </button>
                  )}
                  {/* Conditional rendering for Add/Remove to Cart */}
                  {cartItems.some(item => item.game?._id === single?._id) ? (
                    <button
                      disabled
                      className="w-full flex items-center gap-2 
               bg-gradient-to-r from-green-500 to-green-700 
               text-white font-bold py-3 px-4 mb-6 
               rounded-xl shadow-md transition-all duration-300 ease-in-out
               opacity-70 cursor-not-allowed">
                      <FaShoppingCart size={16} />
                      <span className="text-xs">Added to cart</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(single)}
                      className="w-full flex items-center gap-2 
               bg-gradient-to-r from-[#8c71e0] to-[#a493d9] 
               hover:from-[#7a5cd6] hover:to-[#947ce8] 
               active:scale-95 text-white font-bold 
               py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg 
               transition-all duration-300 ease-in-out">
                      <FaShoppingCart size={16} />
                      <span className="text-xs">Add To Cart</span>
                    </button>
                  )}
                </div>
                {isBuyed ? (
                  <>
                    <button
                      className="w-full bg-gradient-to-r cursor-not-allowed from-emerald-600 to-green-600 active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                      <span className="text-white font-bold text-sm me-2">✓</span>
                      Purchased
                    </button>
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                      Review
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleCheckout()}
                    className="w-full bg-gradient-to-r from-[#8c71e0] to-[#a493d9] hover:from-[#7a5cd6] hover:to-[#947ce8] active:scale-95 text-white font-bold py-3 px-4 mb-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    Buy Now
                  </button>
                )}

              </div>

              {/* {showPaymentForm && clientSecret && currentOrderId && ( */}
              <Dialog open={!!(showPaymentForm && clientSecret && currentOrderId)} onClose={() => setShowPaymentForm(false)} className="relative z-50">
                {/* Backdrop */}
                <DialogBackdrop className="fixed inset-0 bg-black/75" />

                {/* Centered panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <DialogPanel className="w-full max-w-md rounded-xl bg-gray-900 sm:p-6 p-4 shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      Complete Your Purchase
                    </h3>

                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm
                        clientSecret={clientSecret}
                        orderId={currentOrderId}
                        amount={amountToPay}
                        onPaymentSuccess={handlePaymentSuccess}
                        fromCartPage={false}
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

              {/* )} */}

              {/* Accordion */}
              <div className="divide-y divide-gray-700/60 rounded-xl overflow-hidden bg-black/30">
                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Platform</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5">
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-gray-900 text-white px-3 py-1 rounded flex items-center"><FaWindows className='me-2' /> Windows</span>
                    </div>
                  </div>
                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Rating</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5">
                    <div className="flex">
                      {console.log(fullStars, emptyStars)}
                      {Array.from({ length: fullStars }).map((_, i) => (
                        <FaStar key={`full-${i}`} className="text-yellow-400 h-5 w-5 mx-0.5" />
                      ))}
                      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 h-5 w-5 mx-0.5" />}
                      {Array.from({ length: emptyStars }).map((_, i) => (
                        <FaRegStar key={`empty-${i}`} className="text-yellow-400 h-5 w-5 mx-0.5" />
                      ))}
                      <span className="ml-2 text-white font-medium">{ratings.averageRating?.toFixed(1)}</span>
                    </div>
                      {gameRating && <div className='mt-4'>
                         {gameRating?.map((element)=>{
                             let FullStar = Math.floor(element?.rating);
                             let HasHalfStar = element?.rating % 1 >= 0.5;
                             let EmptyStars = 5 - FullStar - (HasHalfStar ? 1 : 0);
                            return(
                              <div className='mt-2' key={element?._id}>
                                 <div className='flex items-center'>
                                     <img src={`${element?.user?.profilePic}`} className='w-[50px] h-[50px] object-cover rounded-full' alt="" />
                                     <div className='ms-3'>
                                       <div>{decryptData(element?.user?.name)}</div>
                                       <div className='flex items-center'>
                                          {Array.from({ length: FullStar }).map((_, i) => (
                                                 <FaStar key={`full-${i}`} className="text-yellow-400 h-4 w-4 mx-0.5" />
                                           ))}
                                           {HasHalfStar && <FaStarHalfAlt className="text-yellow-400 h-4 w-4 mx-0.5" />}
                                           {Array.from({ length: EmptyStars }).map((_, i) => (
                                             <FaRegStar key={`empty-${i}`} className="text-yellow-400 h-4 w-4 mx-0.5" />
                                           ))}
                                           <span className="ms-2 text-white text-[14px]">{ratings.averageRating?.toFixed(1)}</span>
                                       </div>
                                     </div>
                                 </div>
                                  <p className='mt-2 text-[13px]'>{element?.review}</p>
                                    <p className='text-[13px] mt-1 flex'><MdDateRange className='text-[16px] me-2' /> {formatDate(element?.createdAt)}</p>
                                  <div className='h-[1px] bg-gray-700 mt-3'></div>
                              </div>  
                            )
                         })}
                      </div>}
                  </div>

                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">Purchase Info</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5 space-y-3">
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">Game Size</h4>
                      <p className="text-white text-base">{single?.platforms?.windows?.size}</p>
                    </div>
                    <div className="flex justify-between">
                      <h4 className="text-base text-gray-400">Epic Rewards</h4>
                      <p className="text-white text-base">Earn 20% Back</p>
                    </div>
                  </div>
                </details>

                <details className="group open:shadow-lg open:bg-black/20 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5 text-white">
                    <span className="text-lg font-semibold">More Details</span>
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </summary>
                  <div className="pb-5 px-4 md:px-5 space-y-4">
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Refund Type</p>
                      <p className="text-white text-base">{single?.refund_type || '-'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Developer</p>
                      <p className="text-white text-base">{single?.developer || '-'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Publisher</p>
                      <p className="text-white text-base">{single?.publisher || '-'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Release Date</p>
                      <p className="text-white text-base">{single?.createdAt ? new Date(single.createdAt).toLocaleDateString() : '-'}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-base text-gray-400">Total Download</p>
                      <p className="text-white text-base">{single?.downloads || 0}</p>
                    </div>
                  </div>
                </details>
                {/* review modal */}
                {open && (
                  <ReviewForm open={open} onClose={() => setOpen(false)} game={id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleGame
