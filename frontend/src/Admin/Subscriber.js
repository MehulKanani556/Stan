import { Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllSubscribe } from '../Redux/Slice/subscribe.slice';

export default function Subscriber() {

    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const { Subscribe } = useSelector((state) => state.subscribe);

    // Search functionality
    const filteredData = Subscribe.filter(data => (
        data?.email?.toLowerCase().includes(searchValue.toLowerCase())
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

    useEffect(() => {
        dispatch(getAllSubscribe());
    }, [dispatch])

    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown">Subscriber</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 mt-2">
                <input
                    type="text"
                    placeholder="Search Subscriber..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="rounded w-full md:w-64 p-2 bg-white/10"
                />
            </div>

            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold border-slate-700/50 border-b">
                            <td className="py-2 px-5">No</td>
                            <td className="py-2 px-5">Email</td>
                            <td className="py-2 px-5">Subscribe Status</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((sub, index) => (
                            <tr key={index} className={`border-slate-700/50 border-b`}>
                                <td className="py-3 px-4 text-gray-300 text-sm">
                                    {index + 1}
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm">
                                    {sub?.email}
                                </td>
                                <td className="py-3 px-4 text-gray-300 text-sm">
                                    <button className="bg-blue-500 text-white rounded px-4 py-2">
                                        {sub?.subscribe.toString()}
                                    </button>
                                </td>
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