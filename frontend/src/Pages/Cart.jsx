import React, { useEffect, useState, useCallback } from "react";
import { FaWindows, FaPlaystation, FaXbox, FaApple, FaSteamSymbol } from "react-icons/fa";
import { SiOculus, SiNintendoswitch } from "react-icons/si";
import { MdWorkspacePremium } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import game1 from "../images/game1.jpg";
import game2 from "../images/game2.jpg";
import game3 from "../images/game3.jpg";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCartLocal, clearCartLocal, fetchCart, removeFromCart, clearCart } from "../Redux/Slice/cart.slice";
import { useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../Redux/Slice/Payment.slice";
import { CartSkeletonCard, CartSkeletonSummary } from "../lazyLoader/CartSkeleton";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { fanCoinsuse, getUserById } from '../Redux/Slice/user.slice';
import Advertize from "../components/Advertize";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PLATFORM_META = {
    visionPro: { label: 'Vision Pro', icon: FaApple },
    windows: { label: 'PC', icon: FaWindows },
    ps5: { label: 'PS 5', icon: FaPlaystation },
    xbox: { label: 'X Box', icon: FaXbox },
    quest: { label: 'Quest', icon: SiOculus },
    switch1: { label: 'Nintendo Switch 1', icon: SiNintendoswitch },
    switch2: { label: 'Nintendo Switch 2', icon: SiNintendoswitch },
    default: { label: 'Platform', icon: FaSteamSymbol }
};

const getPlatformMeta = (platform) => PLATFORM_META[platform] || PLATFORM_META.default;

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cart);
    const loading = useSelector((state) => state.cart.loading);
    const { currentUser: authUser } = useSelector((state) => state.user);
    const fanCoins = authUser?.fanCoins || 0;
    const navigate = useNavigate();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [amountToPay, setAmountToPay] = useState(0);
    const userId = localStorage.getItem("userId");

    // Fan coin state
    const [useFanCoinsChecked, setUseFanCoinsChecked] = useState(false);
    const [fanCoinsToUse, setFanCoinsToUse] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(getUserById(userId))
    }, [dispatch])

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalDiscount = cartItems.reduce(
        (sum, item) => sum + (item.oldPrice - item.price),
        0
    );
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Reset states when total price changes
    useEffect(() => {
        setUseFanCoinsChecked(false);
        setFanCoinsToUse(0);
        setFinalAmount(totalPrice);
    }, [totalPrice]);

    // Handle fan coin checkbox change
    const handleFanCoinCheckboxChange = useCallback((checked) => {
        // Check if user is authenticated before proceeding
        if (!authUser || !authUser._id) {
            console.error('User not authenticated');
            alert('Please login to use Fan Coins');
            return;
        }

        if (!fanCoins || fanCoins <= 0) {
            console.error('No fan coins available');
            alert('You have no Fan Coins available');
            return;
        }

        setUseFanCoinsChecked(checked);

        if (checked) {
            // Calculate maximum applicable Fan Coins
            const maxApplicableCoins = Math.min(fanCoins, totalPrice);
            // console.log(maxApplicableCoins, fanCoins, totalPrice);

            setFanCoinsToUse(maxApplicableCoins);
            setFinalAmount(Math.max(0, totalPrice - maxApplicableCoins));
        } else {
            setFanCoinsToUse(0);
            setFinalAmount(totalPrice);
        }
    }, [authUser, fanCoins, totalPrice]);

    const handleRemove = (item) => {
        // alert(id)
        // console.log("aaa", item);

        dispatch(removeFromCart({ gameId: item.game._id, platform: item?.platform || "windows" }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleContinueShopping = () => {
        // You can add navigation logic here if needed
        navigate("/store")
    };

    const handleCheckout = async () => {
        if (!cartItems || cartItems.length === 0) {
            alert("Your cart is empty. Please add items before checking out.");
            return;
        }

        const items = (Array.isArray(cartItems) ? cartItems.map(it => ({
            game: it.game?._id || it.game,
            name: it.name,
            platform: it.platform,
            price: Number(it.price || it?.game?.platforms?.[it.platform]?.price || 0),
        })) : []);

        const originalAmount = items.reduce((sum, it) => sum + it.price, 0);
        // console.log('Applying fan coins:', fanCoinsToUse, useFanCoinsChecked);

        try {
            // 1. Create order first with original amount and fan coin details
            const orderResult = await dispatch(createOrder({
                items,
                amount: finalAmount, // Use final amount after fan coins
                fanCoinsUsed: fanCoinsToUse || 0,
                fanCoinDiscount: fanCoinsToUse || 0
            }));

            if (!createOrder.fulfilled.match(orderResult)) {
                alert("Failed to create order. Please try again.");
                return;
            }

            const { order } = orderResult.payload;

            // 2. If fan coins are selected, apply them after order creation
            let finalAmountToPay = originalAmount;
            let actualFanCoinsUsed = 0;

            if (useFanCoinsChecked && fanCoinsToUse > 0 && authUser?._id) {
                try {
                    // console.log('Applying fan coins:', fanCoinsToUse);

                    const fanCoinResult = await dispatch(fanCoinsuse({
                        userId: authUser._id,
                        gamePrice: originalAmount,
                        fanCoinsToUse: fanCoinsToUse
                    }));
                    // console.log(fanCoinResult);


                    if (fanCoinResult.type === 'user/fanCoinsuse/fulfilled') {
                        // console.log('Fan coins applied successfully:', fanCoinResult.payload);
                        finalAmountToPay = fanCoinResult.payload.discountedPrice || finalAmount;
                        actualFanCoinsUsed = fanCoinsToUse;

                        // Update user data to reflect the new fan coin balance
                        dispatch(getUserById(userId));
                    } else {
                        console.error('Failed to apply Fan Coins', fanCoinResult);
                        alert('Failed to apply Fan Coins. Proceeding with original amount.');
                        // Reset fan coin states on failure
                        setUseFanCoinsChecked(false);
                        setFanCoinsToUse(0);
                        setFinalAmount(originalAmount);
                    }
                } catch (error) {
                    console.error('Failed to use fan coins:', error);
                    alert('Failed to apply Fan Coins. Proceeding with original amount.');
                    // Reset fan coin states on error
                    setUseFanCoinsChecked(false);
                    setFanCoinsToUse(0);
                    setFinalAmount(originalAmount);
                }
            }

            // 3. Proceed to payment with final amount
            setCurrentOrderId(order._id);
            setAmountToPay(finalAmountToPay);
            setShowPaymentForm(true);

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        setClientSecret("");
        setCurrentOrderId(null);
        setAmountToPay(0);
        setUseFanCoinsChecked(false);
        setFanCoinsToUse(0);
        setFinalAmount(0);

        // Clear the cart after successful payment
        dispatch(clearCart());

        // Navigate to success page or orders page
        // navigate('/orders'); // Uncomment if you have an orders page

        // alert("Order placed successfully!");
    };

    return (
        <>
            <Advertize limitImages={true} />
            <div className=" md:max-w-[75%] max-w-[95%] mx-auto text-white py-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight">My Cart</h1>

                <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {loading ? (
                            <>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <CartSkeletonCard key={index} />
                                ))}
                            </>
                        ) : cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                const platformMeta = getPlatformMeta(item?.platform);
                                const PlatformIcon = platformMeta.icon;
                                return (
                                <div
                                    key={`${item.game?._id || item._id}-${item.platform}`}
                                    onClick={() => navigate(`/single/${item.game._id}`)}
                                    className="bg-black/15 border border-white/10 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6"
                                >
                                    <div className="w-full lg:w-40 h-36 sm:h-44 lg:h-40 shrink-0">
                                        <img
                                            src={item.game.cover_image.url}
                                            alt={item.game.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <span className="text-xs bg-[#525050] px-2 py-1 rounded tracking-wide">
                                                {item.game.category.categoryName}
                                            </span>

                                            <h2 className="text-lg sm:text-xl font-semibold mt-2 whitespace-normal break-words">{item.game.title}</h2>

                                            <span className="text-gray-300 flex items-center gap-2 text-sm bg-white/5 px-3 py-1 rounded-full w-fit mt-2">
                                                <PlatformIcon className="text-purple-300" />
                                                <span className="font-semibold">{platformMeta.label}</span>
                                            </span>

                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-lg sm:text-xl font-bold text-white">
                                                ${item.price.toLocaleString()}
                                            </p>
                                            <div className="text-white text-xs px-3 py-1 rounded-full">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    handleRemove(item);
                                                    }}
                                                    className="text-red-400 hover:text-red-500 transition text-xl lg:mr-4"
                                                >
                                                    <RiDeleteBin6Line />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-between items-start lg:items-end min-w-0 lg:min-w-[120px]">

                                        </div>
                                    </div>
                                </div>
                            );})
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-20 bg-black/15 rounded-2xl">
                                <p className="text-2xl font-semibold text-gray-300 mb-4">🛒 Your cart is empty</p>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                                <button
                                    onClick={handleContinueShopping}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold hover:scale-105 transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-black/15 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 sm:gap-6 h-fit shadow-lg lg:sticky lg:top-20">
                        <div className="flex justify-between items-center">
                            {loading ? (
                                <div className="w-full">
                                    <CartSkeletonSummary />
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-bold text-xl">Order Summary</h2>
                                    <span className="text-xl font-bold text-purple-400">{cartItems.length}</span>
                                </>
                            )}

                        </div>

                        {!loading && (
                            <div className=" flex flex-col gap-3 border-b border-gray-700 pb-4 text-base">
                                {/* <span className="text-xs bg-[#2c2c2c] px-2 py-1 rounded-md text-gray-300 w-[40%]">
                                Rewards: $0.00
                            </span> */}
                                <div className="flex justify-between">
                                    <span>Price</span>
                                    <span>${totalPrice.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>Taxes</span>
                                    <span>Calculated at Checkout</span>
                                </div>

                                {/* Fan Coin Usage Section */}
                                {authUser && (
                                    <div className="fan-coin-section p-4 rounded-xl border border-gray-700">
                                        <div className="flex flex-col justify-between">
                                            <div className="flex flex-col">
                                                <label
                                                    htmlFor="useFanCoins"
                                                    className={`text-white flex items-center ${(!authUser || !fanCoins || fanCoins <= 0) ? 'text-gray-500' : ''}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id="useFanCoins"
                                                        checked={useFanCoinsChecked}
                                                        onChange={(e) => handleFanCoinCheckboxChange(e.target.checked)}
                                                        className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                    Use Fan Coins
                                                </label>
                                                <span className="ml-6  text-sm text-gray-400">
                                                    {!authUser
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
                                                        const maxApplicableCoins = Math.min(fanCoins, totalPrice);

                                                        // Validate input: cannot exceed available fan coins or game price
                                                        const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                                        // Always update both states together
                                                        setFanCoinsToUse(validatedCoins);
                                                        setFinalAmount(Math.max(0, totalPrice - validatedCoins));
                                                    }}
                                                    onBlur={(e) => {
                                                        // On blur, ensure the input field shows the validated value
                                                        const inputValue = parseFloat(e.target.value) || 0;
                                                        const maxApplicableCoins = Math.min(fanCoins, totalPrice);
                                                        const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                                        // Force update the input value to match the validated state
                                                        if (validatedCoins !== inputValue) {
                                                            e.target.value = validatedCoins;
                                                            setFanCoinsToUse(validatedCoins);
                                                            setFinalAmount(Math.max(0, totalPrice - validatedCoins));
                                                        }
                                                    }}
                                                    min="0"
                                                    max={Math.min(fanCoins, totalPrice)}
                                                    step="1"
                                                    className="w-full p-2 rounded-xl bg-gray-700/20 text-white border border-gray-600 focus:border-purple-400 focus:ring-purple-500"
                                                    placeholder={`Max: ${Math.min(fanCoins, totalPrice)}`}
                                                />
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Available: {fanCoins} Fan Coins | Max Applicable: {Math.min(fanCoins, totalPrice)}
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
                        )}

                        {!loading && (
                            <div className="flex justify-between text-lg font-bold">
                                <span>Subtotal</span>
                                <span>
                                    {useFanCoinsChecked && fanCoinsToUse > 0
                                        ? `$${finalAmount.toFixed(2)} (${fanCoinsToUse} Fan Coins Applied)`
                                        : `$${subtotal.toLocaleString()}`
                                    }
                                </span>
                            </div>
                        )}

                        {!loading && (
                            <div className="gap-4">
                                <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 my-2 rounded-xl active:scale-105 transition">
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="w-full  bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 font-semibold py-3 my-2 rounded-xl"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handleContinueShopping}
                                    className="w-full  bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 font-semibold py-3 my-2 rounded-xl"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* {showPaymentForm && clientSecret && currentOrderId && ( */}

                <Dialog
                    open={!!(showPaymentForm && currentOrderId)}
                    onClose={() => setShowPaymentForm(false)}
                    className="relative z-50"
                >
                    {/* Background overlay */}
                    <DialogBackdrop className="fixed inset-0 bg-black/75" />

                    {/* Modal wrapper */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-gray-900 sm:p-8 p-4 rounded-lg shadow-lg w-full max-w-md">
                            <DialogTitle className="text-2xl font-bold mb-4 text-white">
                                Complete Your Purchase
                            </DialogTitle>

                            <Elements stripe={stripePromise} >
                                <PaymentForm
                                    orderId={currentOrderId}
                                    amount={amountToPay}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    fromCartPage={true}
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
            </div>
        </>
    );
};

export default Cart;