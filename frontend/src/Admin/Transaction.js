import { Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getRecentTransactions } from '../Redux/Slice/dashboard.slice';

export default function Transaction() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const transactions = useSelector((state) => state.dashboard.recentTransactions);

    useEffect(() => {
        dispatch(getRecentTransactions());
    }, [dispatch])

    function formatDuration(days) {
        if (days % 365 === 0) {
            return `${days / 365} year${days / 365 > 1 ? 's' : ''}`;
        } else if (days % 31 === 0) {
            return `${days / 31} month${days / 31 > 1 ? 's' : ''}`;
        } else if (days % 30 === 0) {
            return `${days / 30} month${days / 30 > 1 ? 's' : ''}`;
        } else if (days % 7 === 0) {
            return `${days / 7} week${days / 7 > 1 ? 's' : ''}`;
        } else {
            return `${days} day${days > 1 ? 's' : ''}`;
        }
    };

    const [expandedRows, setExpandedRows] = useState({});

    const handleToggleExpand = (transactionId) => {
        setExpandedRows((prev) => ({
            ...prev,
            [transactionId]: !prev[transactionId],
        }));
    };

    // Search functionality
    const filteredData = transactions.filter(data => (
        data?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.userEmail?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.items?.some(item => item.gameTitle?.toLowerCase().includes(searchValue.toLowerCase())) ||
        data?.status?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.totalAmount.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.items?.some(item => item.platform?.toLowerCase().includes(searchValue.toLowerCase())) ||
        data?.items?.some(item => item.price.toString().toLowerCase().includes(searchValue.toLowerCase()))
    ));

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">Orders</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 mt-2">
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="rounded w-full md:w-64 p-2 bg-white/10"
                />
            </div>

            <div className="overflow-auto shadow mt-5 rounded scrollbar-hide">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold border-slate-700/50 border-b">
                            <td className="py-2 px-5 whitespace-nowrap">Order ID</td>
                            <td className="py-2 px-5">Name</td>
                            <td className="py-2 px-5">Items</td>
                            <td className="py-2 px-5 whitespace-nowrap">Total Amount</td>
                            <td className="py-2 px-5">Status</td>
                            <td className="py-2 px-5">Duration</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((transaction, index) => (
                            <tr key={index} className={`border-slate-700/50 border-b`}>
                                <td className="py-3 px-4 text-gray-400 text-sm">#{transaction.orderId.slice(-8)}</td>
                                <td className="py-3 px-4">
                                    <div className="text-white font-medium text-sm">{transaction?.fullName}</div>
                                    <div className="text-gray-400 text-xs">{transaction?.userEmail}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-xs text-center">
                                    {transaction.items && transaction.items.length > 0 ? (
                                        <div>
                                            {(expandedRows[transaction.orderId] ? transaction.items : transaction.items.slice(0, 1)).map((item, idx) => (
                                                <div key={idx} className={`flex items-center justify-between gap-2 ${idx !== transaction.items.length - 1 ? 'mb-2' : 'mb-0'}`}>
                                                    <div className="flex gap-2">
                                                        {item.gameImage ? (
                                                            <img
                                                                src={item.gameImage}
                                                                alt={item.gameTitle}
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className='w-8 h-8 rounded-full bg-white/10 uppercase text-xs flex items-center justify-center'>
                                                                <span className="font-semibold">{item.gameTitle}</span>
                                                            </div>
                                                        )}
                                                        <div className="text-start">
                                                            <span className="font-semibold">{item.gameTitle}</span>
                                                            <div>
                                                                <span className="text-gray-400">({item.platform})</span>
                                                                <span className="ml-1 text-green-400">${item.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {transaction.items.length > 1 && (
                                                <div className="text-center mt-2">
                                                    <button
                                                        className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out text-xs font-medium"
                                                        onClick={() => handleToggleExpand(transaction.orderId)}
                                                    >
                                                        {expandedRows[transaction.orderId] ? '- Show Less' : '+ Show More'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm">
                                    ${transaction.totalAmount}
                                </td>
                                <td className='py-3 px-4 text-gray-300 text-sm'>
                                    <span className={`${transaction.status == 'paid' ? 'bg-green-600/20 text-green-400' : ''} text-xs px-2 py-1 rounded font-semibold`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm">{transaction.duration}</td>
                            </tr>
                        ))}

                        {currentItems.length == 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-400">No Data Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => handlePageChange(page)}
                    variant="outlined"
                    shape="rounded"
                    className="flex justify-end mt-4"
                    siblingCount={0}
                    boundaryCount={isSmallScreen ? 0 : 1}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "white",
                            borderColor: "rgba(255, 255, 255, 0.4)",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            color: "white",
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.06)"
                        },
                    }}
                />
            )}
        </div>
    )
}