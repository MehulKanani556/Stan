import { Box, Modal, Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { decryptData } from "../Utils/encryption";
import { getAllcontactUs } from '../Redux/Slice/contactUs.slice';
import { FaEye } from 'react-icons/fa';

export default function Contact() {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const contact = useSelector((state) => state.contactUs.contactUs);
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(getAllcontactUs())
    }, [dispatch])

    // Search functionality
    const filteredData = contact.filter(data =>
        data?.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        data?.message?.toLowerCase().includes(searchValue.toLowerCase())
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

    const handleview = (user) => {
        setSelectedUser(user);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown mb-2">Contact Us</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 w-full flex justify-content-between ">
                <div className="flex-1 mr-4">
                    <input
                        type="text"
                        placeholder="Search contact..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="rounded w-full md:w-64 p-2 bg-white/10"
                    />
                </div>
            </div>

            <div className="overflow-auto shadow mt-5 rounded scrollbar-hide">
                <table className="w-full bg-white/5">
                    <thead>
                        <tr className="text-brown font-bold border-slate-700/50 border-b">
                            {/* <td className="py-2 px-5 w-1/6">ID</td> */}
                            <td className="py-2 px-5 whitespace-nowrap">First Name</td>
                            <td className="py-2 px-5 whitespace-nowrap">Last Name</td>
                            <td className="py-2 px-5">Email</td>
                            <td className="py-2 px-5">Message</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user, index) => (
                            <tr key={user._id} className="border-t border-gray-950">
                                <td className="py-2 px-5 whitespace-nowrap">
                                    <span className="truncate block max-w-xs">
                                        {user.firstName}
                                    </span>
                                </td>
                                <td className="py-2 px-5 whitespace-nowrap">
                                    <span className="truncate block max-w-xs">
                                        {user.lastName}
                                    </span>
                                </td>

                                <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {user.email}
                                    </span>
                                </td>

                                <td className="py-2 px-5">
                                    <span className="truncate block max-w-xs">
                                        {user.message}
                                    </span>
                                </td>
                                <td className="py-2 px-5 flex items-center gap-2">
                                    <button
                                        className="text-white/50 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-white"
                                        onClick={() => handleview(user)}
                                    >
                                        <FaEye />
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

            <Modal open={viewOpen} onClose={handleViewClose}>
                <Box className="bg-primary-dark/90 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-full">
                    {selectedUser && (
                        <div className="p-5">
                            <div className="text-center">
                                <p className="text-brown font-bold text-xl mb-4">Contact Us Details</p>
                            </div>
                            <div className="mb-4">
                                <span className="font-bold">First Name : </span>
                                <span>{selectedUser.firstName}</span>
                            </div>
                            <div className="mb-4">
                                <span className="font-bold">Last Name : </span>
                                <span>{selectedUser.lastName}</span>
                            </div>
                            <div className="mb-4">
                                <span className="font-bold">Email : </span>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Content : </h3>
                                <p>{selectedUser.message}</p>
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleViewClose}
                                    className="text-brown w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    )
}
