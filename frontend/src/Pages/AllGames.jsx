import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";

// Redux actions
import { getAllGames } from "../Redux/Slice/game.slice";
import { getAllCategories } from "../Redux/Slice/category.slice";
import { addToWishlist, removeFromWishlist } from "../Redux/Slice/wishlist.slice";
import { addToCart } from "../Redux/Slice/cart.slice";
import { allorders } from "../Redux/Slice/Payment.slice";

// Components
import StylishDiv from "../components/StylishDiv";
import LazyGameCard from "../lazyLoader/LazyGameCard";

// Assets
import game1 from "../images/game1.jpg";

// Constants
const GAMES_PER_PAGE = 12;
const DEBOUNCE_DELAY = 500;

const SORT_OPTIONS = [
    { value: "", label: "Default" },
    { value: "a-z", label: "A to Z" },
    { value: "z-a", label: "Z to A" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "size-low-high", label: "Size: Low to High" },
    { value: "size-high-low", label: "Size: High to Low" },
];

const PRICE_RANGES = [
    { value: "", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "under-500", label: "Under $500" },
    { value: "under-1000", label: "Under $1000" },
    { value: "under-2000", label: "Under $2000" },
    { value: "over-2000", label: "Over $2000" },
];

// Custom hook for debounced value
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom CSS for select dropdowns (moved to separate constant)
const SELECT_STYLES = `
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
    
    select option:hover, select option:focus {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8)) !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3) !important;
    }
    
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

// Utility functions (moved outside component to prevent re-creation)
const getGamePrice = (game) => {
    const priceCandidates = [
        game?.platforms?.windows?.price,
        game?.platforms?.ios?.price,
        game?.platforms?.android?.price,
    ];
    return priceCandidates.find((p) => typeof p === "number" && !Number.isNaN(p)) ?? 0;
};

const sortGames = (games, sortBy) => {
    return [...games].sort((a, b) => {
        switch (sortBy) {
            case "price-low-high":
                return getGamePrice(a) - getGamePrice(b);
            case "price-high-low":
                return getGamePrice(b) - getGamePrice(a);
            case "size-low-high": {
                const sizeA = parseFloat(a.size?.replace(/[^\d.]/g, '') || '0');
                const sizeB = parseFloat(b.size?.replace(/[^\d.]/g, '') || '0');
                return sizeA - sizeB;
            }
            case "size-high-low": {
                const sizeA = parseFloat(a.size?.replace(/[^\d.]/g, '') || '0');
                const sizeB = parseFloat(b.size?.replace(/[^\d.]/g, '') || '0');
                return sizeB - sizeA;
            }
            case "a-z":
                return (a.title || '').localeCompare(b.title || '');
            case "z-a":
                return (b.title || '').localeCompare(a.title || '');
            default:
                return 0;
        }
    });
};

const filterGamesByPrice = (games, priceRange) => {
    if (priceRange === "") return games;

    return games.filter((game) => {
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
};

// Game Card Component (extracted for better organization)
const GameCard = React.memo(({ game, orders, onWishlistToggle, onAddToCart, wishlistStatus, cartItems }) => {
    const navigate = useNavigate();
    const imageUrl = game?.cover_image?.url || game1;
    const priceValue = getGamePrice(game);

    // Check if the game has been purchased
    const isPurchased = useMemo(() =>
        orders.some(order =>
            order.items.some(item => item.game?._id === game?._id)
        ), [orders, game?._id]);

    const isInCart = useMemo(() =>
        cartItems.some(item => item.game?._id === game?._id),
        [cartItems, game?._id]);

    const isInWishlist = wishlistStatus[game?._id];

    const handleWishlistClick = useCallback((e) => {
        e.stopPropagation();
        onWishlistToggle(game, isInWishlist);
    }, [game, isInWishlist, onWishlistToggle]);

    const handleCartClick = useCallback((e) => {
        e.stopPropagation();
        if (!isPurchased && !isInCart) {
            onAddToCart(game);
        }
    }, [game, isPurchased, isInCart, onAddToCart]);

    const handleCardClick = useCallback(() => {
        navigate(`/single/${game?._id}`);
    }, [navigate, game?._id]);

    return (
        <div
            onClick={handleCardClick}
            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
        >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70">

                {/* Enhanced Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Image Container */}
                <div className="relative w-full h-36 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={game?.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

                        {/* Top Badge */}
                        <div className="absolute top-4 left-4">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                                <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                            </div>
                        </div>

                        {/* Wishlist Button */}
                        <button
                            className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${isInWishlist
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                                : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                                }`}
                            onClick={handleWishlistClick}
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            {isInWishlist ? (
                                <FaHeart size={16} className="text-white animate-pulse" />
                            ) : (
                                <FaRegHeart size={16} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                            )}
                        </button>

                        {/* Game Title */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="md:p-4">
                                <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                                    {game?.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 md:p-6 space-y-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Price */}
                        <div className="bg-slate-700/50 rounded-xl relative z-10 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                            <div className="flex flex-wrap items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
                                <span className="text-lg font-black text-white">
                                    ${priceValue.toLocaleString('en-US')}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">USD</span>
                            </div>
                            <div className="flex flex-wrap items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-xs md:text-sm text-green-400 font-semibold uppercase tracking-wider">Size</span>
                                <span className="text-md md:text-lg font-black text-white">
                                    {game?.platforms?.windows?.size || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleCartClick}
                        disabled={isInCart || isPurchased}
                        className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${isInCart || isPurchased
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                        aria-label={isInCart ? "Already in cart" : isPurchased ? "Already purchased" : "Add to cart"}
                    >
                        <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                            <div>
                                {isInCart || isPurchased ? (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full">
                                        <span className="text-white font-bold text-sm">✓</span>
                                    </div>
                                ) : (
                                    <FaShoppingCart size={18} className="text-white" />
                                )}
                            </div>
                            <span className="text-white font-bold text-sm tracking-wider uppercase">
                                {isInCart ? "Added to Cart" : (isPurchased ? "Purchased" : "Add to Cart")}
                            </span>
                        </div>

                        {/* Button Effects */}
                        {!isInCart && !isPurchased && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        )}
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="w-16 h-16 border-2 border-blue-400/30 rounded-lg transform rotate-45"></div>
                </div>

                <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="w-12 h-12 border-2 border-pink-400/30 rounded-full"></div>
                </div>
            </div>
        </div>
    );
});

GameCard.displayName = 'GameCard';

// Filter Header Component
const FilterHeader = React.memo(({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    categories,
    onResetFilters
}) => {
    const hasActiveFilters = searchQuery || selectedCategory || sortBy || priceRange;

    return (
        <div className="backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/25 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start lg:items-center justify-between gap-6">

                {/* Search Input */}
                <div className="flex-1 max-w-md">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Search Games</label>
                    <div className="relative">
                        <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="search"
                            placeholder="Search by title, description, or tags..."
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/25 rounded-xl text-white placeholder-gray-400 focus:outline-none outline-none focus:ring-1 focus:ring-white/25 transition-all duration-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex  items-end gap-4">

                    {/* Category Filter */}
                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-white/25 rounded-xl text-white focus:outline-none outline-none focus:ring-1 focus:ring-white/25 transition-all duration-300"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="min-w-[150px]">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-white/25 rounded-xl text-white focus:outline-none outline-none focus:ring-1 focus:ring-white/25 transition-all duration-300"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <div className="flex items-end">
                            <button
                                onClick={onResetFilters}
                                className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-400 rounded-xl hover:from-red-500/30 hover:to-red-600/30 hover:border-red-500/50 transition-all duration-300 font-medium"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

FilterHeader.displayName = 'FilterHeader';

// Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageButtons = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            const isActive = currentPage === i;
            const isFirstPage = i === 1;
            const isLastPage = i === totalPages;
            const isAdjacent = Math.abs(currentPage - i) === 1;
            const isCurrentPage = i === currentPage;

            if (isFirstPage || isLastPage || isCurrentPage || isAdjacent) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`inline-flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-xl border text-sm sm:text-base font-semibold transition-all ${isActive
                                ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/30"
                                : "bg-slate-900/60 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
                            }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === 2 && currentPage > 4) ||
                (i === totalPages - 1 && currentPage < totalPages - 3)
            ) {
                pages.push(
                    <span key={i} className="px-2 text-gray-400 font-medium">
                        ...
                    </span>
                );
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-gray-800/60 backdrop-blur-md rounded-xl p-2 sm:p-3 border border-gray-700/50 overflow-x-auto sm:overflow-x-visible max-w-full">
                <div className="flex items-center gap-2">
                    <button
                        className={`inline-flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-xl border text-sm sm:text-base font-medium transition-all ${currentPage === 1
                                ? "bg-slate-800/40 text-slate-500 border-slate-700 cursor-not-allowed"
                                : "bg-slate-900/60 text-white border-slate-700 hover:bg-purple-600 hover:border-purple-500/80 hover:shadow-md"
                            }`}
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <MdArrowBackIos />
                    </button>

                    <div className="flex items-center gap-1 flex-nowrap">
                        {renderPageButtons()}
                    </div>

                    <button
                        className={`inline-flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-xl border text-sm sm:text-base font-medium transition-all ${currentPage === totalPages
                                ? "bg-slate-800/40 text-slate-500 border-slate-700 cursor-not-allowed"
                                : "bg-slate-900/60 text-white border-slate-700 hover:bg-purple-600 hover:border-purple-500/80 hover:shadow-md"
                            }`}
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        </div>
    );
});

Pagination.displayName = 'Pagination';

// Main AllGames Component
export default function AllGames() {
    // Redux selectors
    const games = useSelector((state) => state.game.games);
    const categories = useSelector((state) => state.category.categories);
    const wishlistStatus = useSelector((state) => state.wishlist.wishlistStatus) || {};
    const cartItems = useSelector((state) => state.cart.cart) || [];
    const orders = useSelector((state) => state.payment.orders);
    const pagination = useSelector((state) => state.game.pagination);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);

    const isLoggedIn = Boolean(authUser?._id || currentUser?._id || localStorage.getItem("userId"));
    // Local state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounced search query
    const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

    // Memoized values
    const totalPages = pagination?.totalPages || 1;
    const totalGames = pagination?.totalItems || 0;

    // Callback handlers
    const handleWishlistToggle = useCallback((game, isInWishlist) => {
        if (isInWishlist) {
            dispatch(removeFromWishlist({ gameId: game._id }));
        } else {
            dispatch(addToWishlist({ gameId: game._id }));
        }
    }, [dispatch]);

    const handleAddToCart = useCallback((game) => {
        dispatch(addToCart({ gameId: game._id, platform: "windows", qty: 1 }));
    }, [dispatch]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const resetFilters = useCallback(() => {
        setSearchQuery("");
        setSelectedCategory("");
        setSortBy("");
        setPriceRange("");
        setCurrentPage(1);
    }, []);

    // Filter and sort games client-side for better UX
    const processedGames = useMemo(() => {
        let filtered = games?.filter((game) => {
            // Search filter
            const matchesSearch = debouncedSearchQuery === "" ||
                game.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                game.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                game.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

            return matchesSearch;
        }) || [];

        // Sort games
        if (sortBy) {
            filtered = sortGames(filtered, sortBy);
        }

        // Price range filter
        if (priceRange) {
            filtered = filterGamesByPrice(filtered, priceRange);
        }

        return filtered;
    }, [games, debouncedSearchQuery, sortBy, priceRange]);

    // Effects
    useEffect(() => {
        dispatch(allorders());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: currentPage,
            limit: GAMES_PER_PAGE,
            category: selectedCategory,
            search: debouncedSearchQuery
        };

        dispatch(getAllGames(params));
    }, [dispatch, currentPage, selectedCategory, debouncedSearchQuery]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedCategory, sortBy, priceRange]);

    // Wishlist and Cart Handlers for the second GameCard component
    const handleRemoveFromWishlist = useCallback((gameId) => {
        dispatch(removeFromWishlist({ gameId }));
    }, [dispatch]);

    const handleAddWishlist = useCallback((game) => {
        dispatch(addToWishlist({ gameId: game._id }));
    }, [dispatch]);

    // Determine if there are games to display
    const hasGames = games && games.length > 0;

    // Game Card Component
    const GameCard = ({ game, orders, isLoggedIn }) => {
        const imageUrl = game?.cover_image?.url || game1;
        const priceValue = getGamePrice(game);

        // Check if the game has been purchased
        const isPurchased = orders.some(order =>
            order.items.some(item => item.game?._id === game?._id)
        );

        return (
            <div
                onClick={() => navigate(`/single/${game?._id}`)}
                className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] cursor-pointer mx-auto"
            >
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-slate-600/70">

                    {/* Enhanced Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Image Container with Enhanced Effects */}
                    <div className="relative w-full h-36 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden all-games-image rounded-2xl">
                        <img
                            src={imageUrl}
                            alt={game?.title}
                            className="w-full h-full object-cover rounded-2xl"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent">

                            {/* Top Badge */}
                            <div className="absolute top-4 left-4">
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full backdrop-blur-sm border border-blue-400/30 shadow-lg">
                                    <span className="text-xs font-bold text-white tracking-wider">NEW</span>
                                </div>
                            </div>

                            {/* Wishlist Button */}
                            <button
                                className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-md border ${wishlistStatus[game?._id]
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-400/50 shadow-lg shadow-red-500/30'
                                    : 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 hover:border-red-400/50'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isLoggedIn ?
                                    wishlistStatus[game?._id]
                                        ? handleRemoveFromWishlist(game._id)
                                        : handleAddWishlist(game)
                                    :
                                    navigate('/login')
                                    
                                }}
                            >
                                {wishlistStatus[game?._id] ? (
                                    <FaHeart size={16} className="text-white animate-pulse" />
                                ) : (
                                    <FaRegHeart size={16} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                                )}
                            </button>

                            {/* Game Title */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="md:p-4">
                                    <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                                        {game?.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4  md:p-6 space-y-4 bg-gradient-to-br from-slate-800/95 to-slate-900/95">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Price */}
                            <div className="bg-slate-700/50 rounded-xl relative z-10 px-3 py-2.5  md:px-6 md:py-3.5">
                                <div className="flex flex-wrap items-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Price</span>
                                    <span className="text-lg font-black text-white">
                                        ${game?.platforms?.windows?.price?.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">USD</span>
                                </div>
                                <div className="flex flex-wrap items-center space-x-2 ">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs md:text-sm text-green-400 font-semibold uppercase tracking-wider">Size</span>
                                    <span className="text-md md:text-lg font-black text-white">
                                        {game?.platforms?.windows?.size || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                isLoggedIn ?
                                    !isPurchased && handleAddToCart(game)
                                    :
                                    navigate('/login')
                            }}
                            disabled={cartItems.some(item => item.game?._id === game?._id) || isPurchased}
                            className={`w-full relative overflow-hidden rounded-xl transition-all duration-500 transform ${cartItems.some(item => item.game?._id === game?._id) || isPurchased
                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-not-allowed shadow-lg shadow-emerald-500/30'
                                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-3.5">
                                {isLoggedIn ? <>
                                    <div>
                                        {cartItems.some(item => item.game?._id === game?._id) || isPurchased ? (
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full">
                                                <span className="text-white font-bold text-sm">✓</span>
                                            </div>
                                        ) : (
                                            <FaShoppingCart size={18} className="text-white" />
                                        )}
                                    </div>
                                    <span className="text-white font-bold text-sm tracking-wider uppercase">
                                        {cartItems.some(item => item.game?._id === game?._id)
                                            ? "Added to Cart"
                                            : (isPurchased ? "Purchased" : "Add to Cart")}
                                    </span>
                                </> : <span className="text-white font-bold text-sm tracking-wider uppercase">
                                    Login to add
                                </span>}

                            </div>

                            {/* Button Effects */}
                            {!cartItems.some(item => item.game?._id === game?._id) && !isPurchased && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-2 left-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <div className="w-16 h-16 border-2 border-blue-400/30 rounded-lg transform rotate-45"></div>
                    </div>

                    <div className="absolute bottom-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        <div className="w-12 h-12 border-2 border-pink-400/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-[95%] md:max-w-[85%] pb-10">
            <style>{SELECT_STYLES}</style>

            {/* Header */}
            <div className="text-center py-12 sm:py-16">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                    All Games
                </h1>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
                    Discover and explore our extensive collection of games
                </p>
            </div>

            {/* Filter Section */}
            <FilterHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                categories={categories}
                onResetFilters={resetFilters}
            />

            {/* Main Content */}
            {hasGames ? (
                <>
                    <div className="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mb-12 all-games-grid">
                        {games.map((game, index) => (
                            <LazyGameCard key={game.id || index}>
                                <GameCard game={game} orders={orders} isLoggedIn={isLoggedIn} />
                            </LazyGameCard>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
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
                            {selectedCategory || debouncedSearchQuery || sortBy || priceRange
                                ? 'No games found'
                                : 'No games available'
                            }
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base mb-4">
                            {selectedCategory || debouncedSearchQuery || sortBy || priceRange
                                ? 'Try adjusting your filters to see more results'
                                : 'Check back later for new releases and updates'
                            }
                        </p>
                        {(selectedCategory || debouncedSearchQuery || sortBy || priceRange) && (
                            <button
                                onClick={resetFilters}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results Summary */}
            {hasGames && (
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Showing {processedGames.length} of {totalGames} games
                        {selectedCategory && (
                            <span> in {categories.find(c => c._id === selectedCategory)?.categoryName}</span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}