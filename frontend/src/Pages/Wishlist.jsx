import React, { useState } from "react";
import { FaWindows } from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import game1 from "../images/game1.jpg";
import game2 from "../images/game2.jpg";
import game3 from "../images/game3.jpg";

const Wishlist = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "GTA V",
            image: game1,
            type: "Base Game",
            reward: "Earn a boosted 20% back in Rewards, offer ends Aug 31.",
            refundable: true,
            discount: 20,
            oldPrice: 2999.0,
            price: 2399.20,
            saleEnds: "Sale ends 9/4/2025 at 10:30 PM",
        },
        {
            id: 2,
            title: "Battlefield™ 2042",
            image: game2,
            type: "Base Game",
            reward: "Earn a boosted 20% back in Rewards, offer ends Aug 31.",
            refundable: true,
            discount: 95,
            oldPrice: 2999.0,
            price: 149.95,
            saleEnds: "Sale ends 9/2/2025 at 10:30 PM",
        },
        {
            id: 3,
            title: "Minecraft",
            image: game3,
            type: "Base Game",
            reward: "Earn a boosted 20% back in Rewards, offer ends Aug 31.",
            refundable: true,
            discount: 50,
            oldPrice: 2599.0,
            price: 1299.05,
            saleEnds: "Sale ends 9/8/2025 at 10:30 PM",
        },
    ]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.oldPrice, 0);
    const totalDiscount = cartItems.reduce(
        (sum, item) => sum + (item.oldPrice - item.price),
        0
    );
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    return (
        <div className=" md:max-w-[85%] max-w-[95%] mx-auto text-white py-8">
            <h1 className="text-4xl font-extrabold mb-8">My Wishlist</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-black/15 p-4 md:p-8 rounded-lg shadow-lg mb-3 flex flex-col lg:flex-row gap-6 hover:shadow-lg transition"
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

                                        <p className="text-[#f8d886] text-base mt-3 flex items-center gap-2"> <span className="text-lg"> <MdWorkspacePremium /> </span> {item.reward}</p>

                                        {item.refundable && (
                                            <p className="text-gray-400 text-sm mt-1">
                                                Self-Refundable
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                                            <FaWindows /> Playable on PC
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[120px]">
                                    {/* <div className="bg-[#621df2] text-white text-xs px-3 py-1 rounded-full">
                                        -{item.discount}%
                                    </div> */}
                                    <div className="flex gap-4 text-sm  py-2">

                                        <button className="text-[#7c63b3] transition text-xl">
                                            <FaShoppingCart />
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="text-red-400 hover:text-red-500 transition text-xl"
                                        >
                                            <RiDeleteBin6Line />
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
                        <h2 className="font-bold text-xl">Total Items</h2>
                        <span className="text-xl font-bold">
                            3
                        </span>
                    </div>

                    <div className="flex justify-between text-base font-semibold text-gray-300">
                        <p>Keep Trake of Games Your're Intrested In</p>
                    </div>

                    <div className="gap-4">
                        <button className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 my-2 rounded-xl active:scale-105 transition">
                            Explore More Games
                        </button>
                        <button className="w-full  bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 hover:text-white hover:bg-purple-500/30 transition-all duration-300 font-semibold py-3 my-2 rounded-xl">
                            View Cart
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Wishlist
