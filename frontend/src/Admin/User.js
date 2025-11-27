import { Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { decryptData } from "../Utils/encryption";
export default function User() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.allusers);
    const isSmallScreen = useMediaQuery("(max-width:425px)");

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    // Search functionality
    const filteredData = users.filter(data =>
        decryptData(data?.userName)?.toLowerCase().includes(searchValue.toLowerCase()) ||
        decryptData(data?.fullName)?.toLowerCase().includes(searchValue.toLowerCase()) ||
        decryptData(data?.email)?.toLowerCase().includes(searchValue.toLowerCase()) ||
        new Date(data?.createdAt).toLocaleDateString().includes(searchValue)
    );

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
                    <h1 className="text-2xl font-bold text-brown mb-2">Users</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 w-full flex justify-content-between ">
                <div className="flex-1 mr-4">
                    <input
                        type="text"
                        placeholder="Search Users..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="rounded w-full md:w-64 p-2 bg-white/10"
                    />
                </div>
            </div>

            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold border-slate-700/50 border-b">
                            <td className="py-2 px-5 whitespace-nowrap">User Name</td>
                            <td className="py-2 px-5 whitespace-nowrap">Full Name</td>
                            <td className="py-2 px-5">Email</td>
                            <td className="py-2 px-5 whitespace-nowrap">Created At</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user, index) => (
                            <tr key={user._id} className="border-t border-gray-950">
                                <td className="py-2 px-5">
                                    {decryptData(user.userName)}
                                </td>

                                <td className="py-2 px-5 whitespace-nowrap">
                                    {decryptData(user.fullName)}
                                </td>

                                <td className="py-2 px-5 whitespace-nowrap">
                                    <span className="truncate block max-w-xs">
                                        {decryptData(user.email)}
                                    </span>
                                </td>

                                <td className="py-2 px-5">
                                    {new Date(user.createdAt).toLocaleDateString()}
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
                    className="flex justify-end m-4"
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
