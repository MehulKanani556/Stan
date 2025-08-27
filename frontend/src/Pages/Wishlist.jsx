import React, { useEffect } from "react";
import { FaWindows } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../Redux/Slice/wishlist.slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCart, removeFromCart } from "../Redux/Slice/cart.slice";

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchWishlist());
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist({ gameId: id }));
  };

  const handleAddToCart = (ele)=>{  
    
    dispatch(addToCart({ gameId: ele.game._id, platform: "windows", qty:1 }));    
  }
  const handleRemoveFromCart= (gameId) => {
    dispatch(removeFromCart({ gameId:gameId._id ,platform:"windows"}));
  };

  return (
    <div className="md:max-w-[85%] max-w-[95%] mx-auto text-white py-10">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">My Wishlist</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT SIDE - Wishlist Games */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.game?._id}
                className="bg-black/15 border border-white/10 p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col lg:flex-row gap-6"
              >
                {/* IMAGE */}
                <div className="w-full lg:w-40 h-48 lg:h-40 shrink-0">
                  <img
                    src={item.game?.cover_image?.url}
                    alt={item.game?.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs bg-[#2f2f34] px-3 py-1 rounded-full tracking-wide text-gray-300">
                        {item.game?.category.categoryName}
                      </span>

                      <button
                        onClick={() => handleRemove(item.game._id)}
                        className="text-red-400 hover:text-red-500 transition text-lg"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>

                    <h2 className="text-xl font-semibold mt-3">{item.game?.title}</h2>

                    {item.game?.platforms?.windows?.available && (
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                        <FaWindows className="text-gray-300" /> Playable on PC
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-5">
                      {/* PRICE */}
                      <p className="text-2xl font-bold text-white">
                        ${item.game?.platforms?.windows?.price?.toLocaleString() || 0}
                      </p>

                      {/* ADD TO CART */}
                      {(() => {
                        const isInCart = cartItems.some(cartItem => cartItem?.game?._id === item.game?._id);
                        return (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`px-5 py-2 rounded-lg text-sm shadow-md font-semibold transition
                              ${isInCart
                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:scale-105"
                              }`
                            }
                            disabled={isInCart}
                          >
                            {isInCart ? "Added in cart" : "Add to cart"}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-black/15 rounded-2xl">
            <p className="text-2xl font-semibold text-gray-300 mb-4">💜 Your wishlist is empty</p>
            <p className="text-gray-500 mb-6">Save games you love to find them easily later.</p>
            <button
              onClick={()=>navigate("/store")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold hover:scale-105 transition"
            >
              Browse Store
            </button>
          </div>
          )}
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="bg-black/15 border border-white/10 rounded-2xl p-8 flex flex-col gap-6 h-fit shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl">Total Items</h2>
            <span className="text-xl font-bold text-purple-400">{items.length}</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Keep track of the games you’re interested in.
          </p>

          <div className="flex flex-col gap-3">
            <button onClick={()=>navigate("/store")} className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-105 transition">
              Explore More Games
            </button>
            <button onClick={()=>navigate("/cart")} className="w-full bg-white/10 backdrop-blur-lg border border-white/20 text-purple-300 hover:text-white hover:bg-purple-600/30 transition font-semibold py-3 rounded-xl">
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
