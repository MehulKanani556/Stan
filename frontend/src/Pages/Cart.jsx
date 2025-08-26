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
import { removeFromCartLocal, clearCartLocal } from "../Redux/Slice/cart.slice";

const Cart = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cart);

    // Add debugging to see what's happening with cart data
    useEffect(() => {
        console.log("Cart component mounted");
        console.log("Current cart state:", cartItems);
        console.log("Cart length:", cartItems.length);
    }, []);

    useEffect(() => {
        console.log("Cart items changed:", cartItems);
    }, [cartItems]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.oldPrice, 0);
    const totalDiscount = cartItems.reduce(
        (sum, item) => sum + (item.oldPrice - item.price),
        0
    );
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleRemove = (id) => {
        dispatch(removeFromCartLocal({ gameId: id }));
    };

    const handleClearCart = () => {
        dispatch(clearCartLocal());
    };

    const handleContinueShopping = () => {
        // You can add navigation logic here if needed
        console.log("Continue shopping clicked");
    };

    return (
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto text-white py-8">
            <h1 className="text-4xl font-extrabold mb-8">My Cart</h1>

            {/* wishlist empty */}
            {/* <div className="flex items-center justify-center min-h-[60vh] text-center">
                <div className=" rounded-2xl p-10 w-full max-w-2xl ">
                    <FaHeart className="mx-auto text-gray-400 text-6xl mb-6" />

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Your wishlist is empty
                    </h2>

                    <p className="text-gray-400 mb-6 font-semibold">
                        Start adding games to your wishlist to see them here.
                    </p>

                    <button className=" bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold px-6 py-3 my-2 rounded-md active:scale-105 transition w-fit">
                        Explore Games
                    </button>
                </div>
            </div> */}

            {/* cart empty */}
            {/* <div className="flex items-center justify-center min-h-[60vh] text-center">
                <div className=" rounded-2xl p-10 w-full max-w-2xl ">
                    <FaShoppingCart className="mx-auto text-gray-400 text-6xl mb-6" />

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Your cart is empty
                    </h2>

                    <p className="text-gray-400 mb-6 font-semibold">
                        Explore our collection and add some games to your cart.
                    </p>

                    <button className=" bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold px-6 py-3 my-2 rounded-md active:scale-105 transition w-fit">
                        Continue Shoping
                    </button>
                </div>
            </div> */}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-black/15 p-8 rounded-lg shadow-lg mb-3 flex flex-col lg:flex-row gap-6 hover:shadow-lg transition"
                            >
                                <div className="w-full lg:w-36 h-48 shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <span className="text-xs bg-[#525050] px-2 py-1 rounded tracking-wide">
                                            {item.type}
                                        </span>

                                        <h2 className="text-xl font-semibold mt-2">{item.title}</h2>

                                        <p className="text-[#f8d886] text-base mt-3 flex items-center gap-2"> <span className="text-lg"> <MdWorkspacePremium /> </span> {item.description}</p>

                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                                            <FaWindows /> Playable on PC
                                        </span>

                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[120px]">
                                    <div className="text-white text-xs px-3 py-1 rounded-full">
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="text-red-400 hover:text-red-500 transition text-xl mr-4"
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                        <button className="text-[#7c63b3] transition text-xl">
                                            <FaRegHeart />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="line-through text-gray-500 text-sm">
                                            ₹{item.oldPrice.toLocaleString()}*
                                        </p>
                                        <p className="text-xl font-bold text-white">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        ))
                    ) : (
                        <p className="text-gray-400">Your cart is empty.</p>
                    )}
                </div>

                <div className=" rounded-2xl p-8 flex flex-col gap-6 h-fit bg-black/15">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-xl">Order Summary</h2>
                        <span className="text-xs bg-[#2c2c2c] px-2 py-1 rounded-md text-gray-300">
                            Rewards: ₹0.00
                        </span>
                    </div>

                    <div className=" flex flex-col gap-3 border-b border-gray-700 pb-4 text-base">
                        <div className="flex justify-between">
                            <span>Price</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-gray-400">
                            <span>Taxes</span>
                            <span>Calculated at Checkout</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-lg font-bold">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="gap-4">
                        <button className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 my-2 rounded-xl active:scale-105 transition">
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
                </div>
            </div>
        </div>
    );
};

export default Cart;
