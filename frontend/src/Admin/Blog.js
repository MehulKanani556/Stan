import { Box, Modal, Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { RiDeleteBin6Fill, RiEdit2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../Redux/Slice/blog.slice';
import { FaEye } from 'react-icons/fa';

export default function Blog() {
    const [blogData, setBlogData] = useState("");
    const [delOpen, setDelOpen] = useState(false);
    const [delAllOpen, setDelAllOpen] = useState(false);
    const dispatch = useDispatch();
    const [createopen, setCreateopen] = useState(false);
    const blog = useSelector(state => state.blog.blogs);
    const loading = useSelector(state => state.blog.loading);
    const isSmallScreen = useMediaQuery("(max-width:425px)");
    const fileInputRef = useRef(null);
    const [searchValue, setSearchValue] = useState('');
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const validationSchema = Yup.object({
        title: Yup.string().required("Blog name is required"),
        content: Yup.string().required("Blog content is required"),
        author: Yup.string().required("Blog author is required"),
        blog_images: Yup.array()
            .of(
                Yup.mixed().test(
                    "fileFormat",
                    "Unsupported Format",
                    (value) => {
                        if (!value) return true;
                        if (typeof value === "string") return true;
                        // Accept common image types
                        return [
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                            "image/jpg",
                            "image/bmp",
                            "image/svg+xml",
                            "image/tiff",
                            "image/x-icon",
                        ].includes(value.type);
                    }
                )
            )
            .min(1, "At least one blog image is required"),
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            blog_images: [],
            author: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            // console.log(values);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content);
            formData.append("author", values.author);

            if (values.blog_images) {
                if (Array.isArray(values.blog_images)) {
                    // console.log(values.blog_images);
                    values.blog_images.forEach((img) => {
                        if (img && typeof img !== "string") {
                            formData.append("blog_images", img);
                        } else {
                            formData.append("blog_images", img);
                        }
                    });
                } else {
                    formData.append("blog_images", [values.blog_images]);
                }
            }
            if (blogData) {
                // Update blog
                dispatch(updateBlog({ _id: blogData._id, formData }));
            } else {
                // Create blog
                dispatch(createBlog(formData));
            }
            handleCreateClose();
        },
    });

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);

    // Search functionality
    const filteredData = Array.isArray(blog)
        ? blog.filter(data =>
            data?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.content?.toLowerCase().includes(searchValue.toLowerCase()) ||
            data?.author?.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

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

    const handleOpen = (data) => {
        setCreateopen(true);
        setBlogData(data);
        if (data) {
            formik.setValues({
                title: data.title,
                content: data.content,
                author: data.author,
                blog_images: Array.isArray(data.blog_images)
                    ? data.blog_images.map((img) => (typeof img === "string" ? img : img.url))
                    : [],
            });
        }
    };

    const handleDeleteOpen = (data) => {
        setDelOpen(true);
        setBlogData(data);
    };

    const handleDeleteClose = () => {
        setDelOpen(false);
    };

    const handleDeleteBlog = () => {
        dispatch(deleteBlog({ _id: blogData._id }));
        setDelOpen(false);
    };

    const handleDeleteAll = () => {
        // Implement delete all functionality if needed
        console.log("Delete All Categories");
    };

    const handleCreateClose = () => {
        setCreateopen(false);
        setBlogData("");
        formik.resetForm();
        setIsImageChanged(false);
    };

    const handleview = (blog) => {
        setSelectedBlog(blog);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setSelectedBlog(null);
    };

    return (
        <div className="p-5 md:p-10">
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-brown mb-2">Blogs</h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 w-full flex justify-content-between ">
                <div className="flex-1 mr-4">
                    <input
                        type="text"
                        placeholder="Search Blogs..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="rounded w-full md:w-64 p-2 bg-white/10"
                    />
                </div>

                <div className="flex gap-4 ">
                    {/* <button
                className="bg-primary-light/15 w-32  px-4 py-2 rounded flex justify-center items-center gap-2"
                onClick={() => setDelAllOpen(true)}
              >
                <span>
                  <RiDeleteBin6Fill />
                </span>
                <span>Delete All</span>
              </button> */}
                    <button
                        className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
                        onClick={() => setCreateopen(true)}
                    >
                        + Add
                    </button>
                </div>
            </div>

            <div className="overflow-auto shadow mt-5 rounded">
                <table className="w-full bg-white/5 min-w-[700px]">
                    <thead>
                        <tr className="text-brown font-bold border-slate-700/50 border-b">
                            {/* <td className="py-2 px-5 w-1/6">ID</td> */}
                            <td className="py-2 px-5 w-1/5">Blog Name</td>
                            <td className="py-2 px-5 w-1/2">Content</td>
                            <td className="py-2 px-5 w-1/5">Author</td>
                            <td className="py-2 px-5 w-1/5">Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((blog, index) => (
                            <tr
                                key={index}
                                className="border-t border-gray-950 items-center"
                            >
                                <td className="py-2 px-5">
                                    {blog.title}
                                </td>
                                <td className="py-1 px-5 line-clamp-2">
                                    {blog.content}
                                </td>
                                <td className="py-2 px-5">
                                    {blog.author}
                                </td>
                                <td className="py-2 px-5 flex items-center gap-2">
                                    <button
                                        className="text-white/50 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-white"
                                        onClick={() => handleview(blog)}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        className="text-green-700 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-green-800"
                                        onClick={() => handleOpen(blog)}
                                    >
                                        <RiEdit2Fill />
                                    </button>
                                    <button
                                        className="text-red-500 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-red-600"
                                        onClick={() => handleDeleteOpen(blog)}
                                    >
                                        <RiDeleteBin6Fill />
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

            {/* Create & Update blog Modal */}
            <Modal
                open={createopen}
                className="bg-white/10 backdrop:blur-sm"
                onClose={handleCreateClose}
            >
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
                    <form onSubmit={formik.handleSubmit} className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">
                                {blogData ? "Edit" : "Add"} Blog
                            </p>
                        </div>

                        <div className="mt-6">
                            <label className=" font-bold">Blog Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter Blog Title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="rounded w-full p-2 mt-1 bg-white/5"
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-red-500 text-sm">
                                    {formik.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className=" font-bold">Blog Content</label>
                            <textarea
                                name="content"
                                placeholder="Enter Blog Content"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="3"
                                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
                            />
                            {formik.touched.content &&
                                formik.errors.content && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.content}
                                    </p>
                                )}
                        </div>

                        <div className="mt-6">
                            <label className=" font-bold">Author Name</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Enter Author Name"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="rounded w-full p-2 mt-1 bg-white/5"
                            />
                            {formik.touched.author && formik.errors.author && (
                                <p className="text-red-500 text-sm">
                                    {formik.errors.author}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="text-brown font-bold">Blog Images</label>
                            <div className="flex flex-wrap justify-between items-center border border-brown rounded w-full p-2 mt-1">
                                {formik.values.blog_images?.length > 0 ? (
                                    <>
                                        {formik.values.blog_images.map((image, index) => (
                                            <div key={index} className="flex max-w-[75%] items-center bg-[#72727226] px-2 mb-2">
                                                <img
                                                    src={
                                                        typeof image === "string"
                                                            ? image
                                                            : URL.createObjectURL(image)
                                                    }
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-7 h-7 rounded-full mr-2 object-cover"
                                                />
                                                <span className="w-full truncate">
                                                    {typeof image === "string"
                                                        ? image.split("/").pop()
                                                        : image.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        formik.setFieldValue("blog_images", formik.values.blog_images.filter((_, i) => i !== index));
                                                        setIsImageChanged(false);
                                                    }}
                                                    className="text-red-500 ml-1 text-[12px]"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                                        >
                                            Add More
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex-1 text-[16px] text-[#727272]">
                                            Choose Images
                                        </p>
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                                        >
                                            Browse
                                        </label>
                                    </>
                                )}
                                <input
                                    id="file-upload"
                                    name="blog_images"
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(event) => {
                                        const files = event.currentTarget.files;
                                        const filesArray = Array.from(files).map(file => file);
                                        formik.setFieldValue("blog_images", [...formik.values.blog_images, ...filesArray]);
                                        setIsImageChanged(!!files.length);
                                    }}
                                    multiple
                                    className="hidden"
                                />
                            </div>
                            {formik.touched.blog_images &&
                                formik.errors.blog_images && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.blog_images}
                                    </p>
                                )}
                        </div>

                        <div className="flex justify-center gap-8 mt-8">
                            <button
                                type="button"
                                onClick={handleCreateClose}
                                className="text-brown w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brown text-white w-36 border-brown border px-5 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : blogData ? "Update" : "Add"}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Delete blog Modal */}
            <Modal open={delOpen} onClose={handleDeleteClose}>
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">Delete blog</p>
                            <p className="text-brown-50 mt-2">
                                Are you sure you want to delete "{blogData?.title}"?
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-6 justify-center">
                            <button
                                onClick={handleDeleteClose}
                                className="text-brown w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBlog}
                                disabled={loading}
                                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* Delete All Categories Modal */}
            <Modal open={delAllOpen} onClose={() => setDelAllOpen(false)}>
                <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    <div className="p-5">
                        <div className="text-center">
                            <p className="text-brown font-bold text-xl">
                                Delete All Categories
                            </p>
                            <p className="text-brown-50 mt-2">
                                Are you sure you want to delete all categories? This action
                                cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-6 justify-center">
                            <button
                                onClick={() => setDelAllOpen(false)}
                                className="text-brown w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>

            {/* View Blog Modal */}
            <Modal open={viewOpen} onClose={handleViewClose}>
                <Box className="bg-primary-dark/90 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
                    {selectedBlog && (
                        <div className="p-5">
                            <div className="text-center">
                                <p className="text-brown font-bold text-xl mb-4">Blog Details</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Title:</h3>
                                <p>{selectedBlog.title}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Author:</h3>
                                <p>{selectedBlog.author}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-bold">Content:</h3>
                                <p className='h-[200px] overflow-auto'>{selectedBlog.content}</p>
                            </div>
                            {selectedBlog.blog_images && selectedBlog.blog_images.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="font-bold">Images:</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedBlog.blog_images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={typeof image === "string" ? image : image.url}
                                                alt={`Blog Image ${index + 1}`}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
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
