import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { getAllGames } from "../Redux/Slice/game.slice";
import { getAllCategories } from "../Redux/Slice/category.slice";
import { addToWishlist, removeFromWishlist } from "../Redux/Slice/wishlist.slice";
import { addToCart } from "../Redux/Slice/cart.slice";
import game1 from "../images/game1.jpg";
import StylishDiv from "../components/StylishDiv";
import { IoMdSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

// Custom CSS for select dropdowns
const selectStyles = `
    select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") !important;
        background-position: right 12px center !important;
        background-repeat: no-repeat !important;
        background-size: 16px !important;
        padding-right: 40px !important;
    }
    
    select option {
        background-color: rgba(17, 24, 39, 0.95) !important;
        color: #e5e7eb !important;
        padding: 12px 16px !important;
        border: none !important;
        font-size: 14px !important;
        font-weight: 500 !important;
    }
    
    select option:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8)) !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3) !important;
    }
    
    // select option:checked {
    //     background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.9)) !important;
    //     color: #ffffff !important;
    //     font-weight: 700 !important;
    //     box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    //     border-left: 4px solid #ffffff !important;
    // }
    
    select option:focus {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(168, 85, 247, 0.7)) !important;
        color: #ffffff !important;
        font-weight: 600 !important;
    }
    
    /* Custom scrollbar for dropdown */
    select::-webkit-scrollbar {
        width: 8px !important;
    }
    
    select::-webkit-scrollbar-track {
        background: rgba(17, 24, 39, 0.3) !important;
        border-radius: 4px !important;
    }
    
    select::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.5) !important;
        border-radius: 4px !important;
    }
    
    select::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.7) !important;
    }
`;

export default function AllGames() {
    const games = useSelector((state) => state.game.games);
    const categories = useSelector((state) => state.category.categories);
    const wishlistStatus = useSelector((state) => state.wishlist.wishlistStatus) || {};
    const cartItems = useSelector((state) => state.cart.cart) || [];
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const gamesPerPage = 12;

    useEffect(() => {
        dispatch(getAllGames());
        dispatch(getAllCategories());
    }, [dispatch]);


    console.log("Hello", games);



    const getGamePrice = (game) => {
        const priceCandidateList = [
            game?.platforms?.windows?.price,
            game?.platforms?.ios?.price,
            game?.platforms?.android?.price,
        ];
        return priceCandidateList.find((p) => typeof p === "number" && !Number.isNaN(p)) ?? 0;
    };

    const filteredGames = games?.filter((game) => {
        // Search filter
        const matchesSearch = searchQuery === "" ||
            game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === "" ||
            game.category?._id === selectedCategory ||
            game.category?.categoryName === selectedCategory;

        return matchesSearch && matchesCategory;
    }) || [];

    // Sort logic
    const sortedGames = [...filteredGames].sort((a, b) => {
        switch (sortBy) {
            case "price-low-high":
                const priceA = getGamePrice(a);
                const priceB = getGamePrice(b);
                return priceA - priceB;
            case "price-high-low":
                const priceA2 = getGamePrice(a);
                const priceB2 = getGamePrice(b);
                return priceB2 - priceA2;
            case "size-low-high":
                const sizeA = parseFloat(a.size?.replace(/[^\d.]/g, '') || '0');
                const sizeB = parseFloat(b.size?.replace(/[^\d.]/g, '') || '0');
                return sizeA - sizeB;
            case "size-high-low":
                const sizeA2 = parseFloat(a.size?.replace(/[^\d.]/g, '') || '0');
                const sizeB2 = parseFloat(b.size?.replace(/[^\d.]/g, '') || '0');
                return sizeB2 - sizeA2;
            case "a-z":
                return (a.title || '').localeCompare(b.title || '');
            case "z-a":
                return (b.title || '').localeCompare(a.title || '');
            default:
                return 0;
        }
    });

    // Price range filter
    const priceFilteredGames = sortedGames.filter((game) => {
        if (priceRange === "") return true;

        const gamePrice = getGamePrice(game);
        switch (priceRange) {
            case "free":
                return gamePrice === 0;
            case "under-500":
                return gamePrice > 0 && gamePrice <= 500;
            case "under-1000":
                return gamePrice > 0 && gamePrice <= 1000;
            case "under-2000":
                return gamePrice > 0 && gamePrice <= 2000;
            case "over-2000":
                return gamePrice > 2000;
            default:
                return true;
        }
    });



    // Reset filters
    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSortBy("");
        setPriceRange("");
        setCurrentPage(1);
    };

    // Pagination logic with filtered results
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = priceFilteredGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(priceFilteredGames.length / gamesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAddWishlist = (ele) => {
        // alert("a")
        dispatch(addToWishlist({ gameId: ele._id }));
    }

    const handleRemoveFromWishlist = (gameId) => {
        dispatch(removeFromWishlist({ gameId }));
    };
    // Track cart changes for notifications


    const handleAddToCart = (ele) => {
        dispatch(addToCart({ gameId: ele._id, platform: "windows", qty: 1 }));
    }

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortBy, priceRange]);

    // Game Card Component
    const GameCard = ({ game }) => {
        const imageUrl = game?.cover_image?.url || game1;
        const priceValue = getGamePrice(game);

        return (
            <StylishDiv >
                <div className="relative w-full  aspect-[5/5] overflow-hidden " onClick={() => navigate(`/single/${game?._id}`)}>
                    <img
                        src={imageUrl}
                        alt={game?.title || "Game"}
                        className="w-full h-full object-cover transition-all duration-300 ease-in-out  "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90">
                        <button
                            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 hover:scale-110"
                            onClick={(e) => {
                                e.stopPropagation();
                                wishlistStatus[game?._id]
                                    ? handleRemoveFromWishlist(game._id)
                                    : handleAddWishlist(game);
                            }}
                        >
                            {wishlistStatus[game?._id] ? (
                                <FaHeart size={16} className="text-white" />
                            ) : (
                                <FaRegHeart size={16} className="text-white" />
                            )}
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 ">
                        <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg line-clamp-2 transition-colors">
                            {game?.title}
                        </h3>
                    </div>
                </div>

                <div className=" pt-3  backdrop-blur-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-white font-bold text-lg sm:text-xl">
                            ₹{Number(priceValue).toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(game);
                            }}
                            disabled={cartItems.some(item => item.game?._id === game?._id)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-300 text-white font-semibold
                                ${cartItems.some(item => item.game?._id === game?._id)
                                    ? 'bg-green-600 cursor-not-allowed opacity-80'
                                    : 'bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:scale-110 hover:from-[#7a42ff] hover:to-[#c4aaff]'}`}
                        >
                            <FaShoppingCart size={16} />
                            {cartItems.some(item => item.game?._id === game?._id)
                                ? "Added to Cart"
                                : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </StylishDiv>
        );
    };

    return (
        <div className="mx-auto max-w-[95%] md:max-w-[85%] pb-10">

            <style>{selectStyles}</style>


            <div className="text-center py-12 sm:py-16">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                    All Games
                </h1>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                    Discover and explore our extensive collection of games
                </p>
            </div>


            <div className=" backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/25 shadow-2xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">

                    <div className="flex-1 max-w-md">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Search Games</label>
                        <div className="relative">
                            <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="search"
                                placeholder="Search by title, description, or tags..."
                                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/25 rounded-xl text-white placeholder-gray-400 focus:outline-none outline-none focus:ring-1 focus:ring-white/25  transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="flex flex-wrap items-end gap-4">

                        <div className="min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                size={1}
                                className="w-full px-4 py-3 bg-black/20 border border-white/25 rounded-xl v-scrollbar-hide  text-white focus:outline-none outline-none focus:ring-1 focus:ring-white/25   transition-all duration-300"
                            >
                                <option value="">All Categories</option>
                                {categories?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* <div className="min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/25 rounded-xl v-scrollbar-hide  text-white focus:outline-none outline-none focus:ring-1 focus:ring-white/25   transition-all duration-300"
                            >
                                <option value="">Default</option>
                                <option value="a-z">A to Z</option>
                                <option value="z-a">Z to A</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="size-low-high">Size: Low to High</option>
                                <option value="size-high-low">Size: High to Low</option>
                            </select>
                        </div> */}


                        {/* <div className="min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                            <select 
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/25 rounded-xl v-scrollbar-hide  text-white focus:outline-none outline-none focus:ring-1 focus:ring-white/25   transition-all duration-300"
                            >
                                <option value="">All Prices</option>
                                <option value="free">Free</option>
                                <option value="under-500">Under ₹500</option>
                                <option value="under-1000">Under ₹1000</option>
                                <option value="under-2000">Under ₹2000</option>
                                <option value="over-2000 ">Over ₹2000</option>
                            </select>
                        </div> */}


                        {/* {(searchQuery || selectedCategory || sortBy || priceRange) && (
                            <div className="flex items-end">
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-400 rounded-xl hover:from-red-500/30 hover:to-red-600/30 hover:border-red-500/50 transition-all duration-300 font-medium"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>


                {/* {(searchQuery || selectedCategory || sortBy || priceRange) && (
                    <div className="mt-6 pt-6 border-t border-gray-700/50">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-300">Active Filters:</span>
                            
                            {searchQuery && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm">
                                    Search: "{searchQuery}"
                                    <button 
                                        onClick={() => setSearchQuery("")}
                                        className="ml-1 hover:text-purple-200 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            
                            {selectedCategory && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm">
                                    Category: {categories.find(c => c._id === selectedCategory)?.categoryName}
                                    <button 
                                        onClick={() => setSelectedCategory("")}
                                        className="ml-1 hover:text-blue-200 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            
                            {sortBy && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg text-sm">
                                    Sort: {sortBy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    <button 
                                        onClick={() => setSortBy("")}
                                        className="ml-1 hover:text-green-200 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            
                            {priceRange && (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 border border-orange-500/30 text-orange-300 rounded-lg text-sm">
                                    Price: {priceRange.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    <button 
                                        onClick={() => setPriceRange("")}
                                        className="ml-1 hover:text-orange-200 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )} */}
            </div>


            {filteredGames.length > 0 && (
                <div className="text-center mb-6">
                    <p className="text-gray-300 text-sm bg-gray-800/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                        Showing <span className="text-purple-400 font-semibold">{currentGames.length}</span> of <span className="text-purple-400 font-semibold">{filteredGames.length}</span> games
                        {searchQuery && ` matching "${searchQuery}"`}
                        {selectedCategory && ` in ${categories.find(c => c._id === selectedCategory)?.categoryName || 'selected category'}`}
                    </p>
                </div>
            )}

            {priceFilteredGames && priceFilteredGames.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                        {currentGames.map((game, index) => (
                            <GameCard key={game.id || index} game={game} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-gray-700/50 
                                       overflow-x-auto sm:overflow-x-visible max-w-full">
                                <div className="flex items-center gap-2">
                                    <button
                                        className={`px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${currentPage === 1
                                            ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 text-white hover:bg-purple-500 hover:shadow-md"
                                            }`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Prev
                                    </button>

                                    {/* Pages with scroll */}
                                    <div className="flex items-center gap-1 flex-nowrap">
                                        {Array.from({ length: totalPages }, (_, index) => {
                                            const pageNum = index + 1;
                                            const isActive = currentPage === pageNum;
                                            const isNear = Math.abs(currentPage - pageNum) <= 2;

                                            if (pageNum === 1 || pageNum === totalPages || isNear) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium ${isActive
                                                            ? "bg-purple-600 text-white shadow-md"
                                                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                pageNum === currentPage - 3 ||
                                                pageNum === currentPage + 3
                                            ) {
                                                return (
                                                    <span
                                                        key={pageNum}
                                                        className="px-2 text-gray-400 font-medium"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        className={`px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${currentPage === totalPages
                                            ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 text-white hover:bg-purple-500 hover:shadow-md"
                                            }`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                    )}
                </>
            ) : (
                // Empty State
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                            {searchQuery || selectedCategory || sortBy || priceRange ? 'No games found' : 'No games available'}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base">
                            {searchQuery || selectedCategory || sortBy || priceRange
                                ? 'Try adjusting your search criteria or filters'
                                : 'Check back later for new releases and updates'
                            }
                        </p>
                        {(searchQuery || selectedCategory || sortBy || priceRange) && (
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
