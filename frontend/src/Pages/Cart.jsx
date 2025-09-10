import React, { useEffect, useState } from "react";
import { FaWindows } from "react-icons/fa";
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

const stripePromise = loadStripe("pk_test_51R8wko2LIh9VELYJ9wrmC0oOqOvNAIUY3LVUhay96NYQjyOa7oK7MfdKYlzErmsJ6Gnn6o2zgPBxy1DrBxvfFQ4500cYJMw3sB");

const Cart = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cart);
    const loading = useSelector((state) => state.cart.loading);
    const navigate = useNavigate();
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [amountToPay, setAmountToPay] = useState(0);

    useEffect(() => {
        dispatch(fetchCart());
    }, [])

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalDiscount = cartItems.reduce(
        (sum, item) => sum + (item.oldPrice - item.price),
        0
    );
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleRemove = (item) => {
        // alert(id)
        console.log("aaa", item);

        dispatch(removeFromCart({ gameId: item.game._id, platform: "windows" }));
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
        const amount = items.reduce((sum, it) => sum + it.price, 0);

        // 1. Create order (calls backend)
        const resultAction = await dispatch(createOrder({ items, amount }));
        if (createOrder.fulfilled.match(resultAction)) {
            alert("{As")
            const { order } = resultAction.payload;
            // setClientSecret(newClientSecret);
            setCurrentOrderId(order._id);
            setAmountToPay(order.amount);
            setShowPaymentForm(true);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        setClientSecret("");
        setCurrentOrderId(null);
        setAmountToPay(0);
    };

    return (
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto text-white py-8">
            <h1 className="text-4xl font-extrabold mb-8">My Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {loading ? (
                        <>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <CartSkeletonCard key={index} />
                            ))}
                        </>
                    ) : cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div
                                key={item.game._id}
                                onClick={() => navigate(`/single/${item.game._id}`)}
                                className="bg-black/15 border border-white/10 p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col lg:flex-row gap-6"
                            >
                                <div className="w-full lg:w-40 h-48 lg:h-40 shrink-0">
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

                                        <h2 className="text-xl font-semibold mt-2">{item.game.title}</h2>

                                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                                            <FaWindows /> Playable on PC
                                        </span>

                                    </div>

                                    <div className=" items-center mt-4">
                                        <p className="text-xl font-bold text-white">
                                            ${item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[120px]">
                                    <div className="text-white text-xs px-3 py-1 rounded-full">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemove(item);
                                            }}
                                            className="text-red-400 hover:text-red-500 transition text-xl mr-4"
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                        {/* <button className="text-[#7c63b3] transition text-xl">
                                            <FaRegHeart />
                                        </button> */}
                                    </div>
                                </div>
                            </div>

                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 bg-black/15 rounded-2xl">
                            <p className="text-2xl font-semibold text-gray-300 mb-4">🛒 Your cart is empty</p>
                            <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
                            <button
                                onClick={handleContinueShopping}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold hover:scale-105 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-black/15 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 h-fit shadow-lg sticky top-20">
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
                            <span className="text-xs bg-[#2c2c2c] px-2 py-1 rounded-md text-gray-300 w-[40%]">
                                Rewards: $0.00
                            </span>
                            <div className="flex justify-between">
                                <span>Price</span>
                                <span>${totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-gray-400">
                                <span>Taxes</span>
                                <span>Calculated at Checkout</span>
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <div className="flex justify-between text-lg font-bold">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
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

                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                //   clientSecret={clientSecret}
                                orderId={currentOrderId}
                                amount={amountToPay}
                                onPaymentSuccess={handlePaymentSuccess}
                                fromCartPage={true}
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

        </div>
    );
};

export default Cart;
