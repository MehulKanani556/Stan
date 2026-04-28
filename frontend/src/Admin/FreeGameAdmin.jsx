import { Box, Modal, Pagination, useMediaQuery } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  getFreeGames,
  createFreeGame,
  updateFreeGame,
  deleteFreeGame
} from "../Redux/Slice/freeGame.slice";
import { getAllCategories } from "../Redux/Slice/category.slice";

export default function FreeGameAdmin() {
  const [gameData, setGameData] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const dispatch = useDispatch();
  const [createopen, setCreateopen] = useState(false);
  const games = useSelector(state => state.freeGame.games);
  const categories = useSelector(state => state.category.categories);
  const loading = useSelector(state => state.freeGame.loading);
  const isSmallScreen = useMediaQuery("(max-width:425px)");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Game name is required"),
    slug: Yup.string().required("Slug is required"),
    iframeSrc: Yup.string().url("Invalid URL").required("iframe source is required"),
    category: Yup.string().required("Category is required"),
    image: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large, must be 2MB or less",
        function (value) {
          if (!value) return true;
          if (typeof value === "string") return true; 
          return value.size <= 2 * 1024 * 1024;
        }
      )
      .test("fileFormat", "Unsupported Format", function (value) {
        if (!value) return true;
        if (typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      iframeSrc: "",
      category: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("slug", values.slug);
        formData.append("iframeSrc", values.iframeSrc);
        formData.append("category", values.category);

        if (values.image && typeof values.image !== "string") {
          formData.append("image", values.image);
        }

        if (gameData) {
          // Update game
          const result = await dispatch(updateFreeGame({ id: gameData._id, gameData: formData }));
          if (updateFreeGame.fulfilled.match(result)) {
            handleCreateClose();
          }
        } else {
          // Create game
          if (!values.image) {
            setFieldError("image", "Game image is required for new games");
            return;
          }
          const result = await dispatch(createFreeGame(formData));
          if (createFreeGame.fulfilled.match(result)) {
            handleCreateClose();
          }
        }
      } catch (error) {
        console.error("Error submitting game:", error);
      }
    },
  });

  useEffect(() => {
    dispatch(getFreeGames());
    dispatch(getAllCategories());
  }, [dispatch]);

  // Search functionality
  const filteredData = Array.isArray(games)
    ? games.filter(data =>
      data?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      data?.category?.toLowerCase().includes(searchValue.toLowerCase())
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
    setGameData(data);
    if (data) {
      formik.setValues({
        name: data.name,
        slug: data.slug,
        iframeSrc: data.iframeSrc,
        category: data.category,
        image: data.image || null,
      });
    }
  };

  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setGameData(data);
  };

  const handleDeleteClose = () => {
    setDelOpen(false);
  };

  const handleDeleteGame = async () => {
    try {
      const result = await dispatch(deleteFreeGame(gameData._id));
      if (deleteFreeGame.fulfilled.match(result)) {
        setDelOpen(false);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleCreateClose = () => {
    setCreateopen(false);
    setGameData("");
    formik.resetForm();
  };

  return (
    <div className="p-5 md:p-10">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown mb-2">Free Games</h1>
        </div>
      </div>

      <div className="mb-4 w-full flex justify-between ">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded w-full md:w-64 p-2 bg-white/10"
          />
        </div>

        <div className="flex gap-4 ">
          <button
            className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
            onClick={() => setCreateopen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto shadow mt-5 rounded">
        <table className="w-full bg-white/5 min-w-[800px]">
          <thead>
            <tr className="text-brown font-bold border-slate-700/50 border-b">
              <td className="py-2 px-5 w-1/4">Name</td>
              <td className="py-2 px-5 w-1/4">Slug</td>
              <td className="py-2 px-5 w-1/4">Category</td>
              <td className="py-2 px-5 w-1/4 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((game) => (
              <tr
                key={game._id}
                className="border-t border-gray-950"
              >
                <td className="py-2 px-5 flex items-center">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-10 h-10 rounded-full mr-2 object-cover whitespace-nowrap"
                  />
                  {game.name}
                </td>
                <td className="py-2 px-5">{game.slug}</td>
                <td className="py-2 px-5">
                  {categories.find(c => c._id === game.category)?.categoryName || game.category}
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <div>
                    <button
                      className="text-green-700 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-green-800"
                      onClick={() => handleOpen(game)}
                    >
                      <RiEdit2Fill />
                    </button>
                  </div>
                  <div>
                    <button
                      className="text-red-500 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-red-600"
                      onClick={() => handleDeleteOpen(game)}
                    >
                      <RiDeleteBin6Fill />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">No Data Found</td>
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
          sx={{
            "& .MuiPaginationItem-root": { color: "white" },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "white",
            },
          }}
        />
      )}

      {/* Create & Update Game Modal */}
      <Modal
        open={createopen}
        className="bg-white/10 backdrop:blur-sm"
        onClose={handleCreateClose}
      >
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[500px] w-[100%] max-h-[90vh] overflow-y-auto">
          <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">
                {gameData ? "Edit" : "Add"} Free Game
              </p>
            </div>

            <div className="mt-6">
              <label className=" font-bold">Game Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Game Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded w-full p-2 mt-1 bg-white/5"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="mt-4">
              <label className=" font-bold">Slug</label>
              <input
                type="text"
                name="slug"
                placeholder="Enter Slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded w-full p-2 mt-1 bg-white/5"
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-red-500 text-sm">{formik.errors.slug}</p>
              )}
            </div>

            <div className="mt-4 relative" ref={dropdownRef}>
              <label className=" font-bold">Category</label>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded w-full p-2 mt-1 bg-white/5 flex justify-between items-center cursor-pointer border border-white/10 hover:border-white/20 transition-all"
              >
                <span className={formik.values.category ? "text-white" : "text-gray-400"}>
                  {categories.find(c => c._id === formik.values.category)?.categoryName || "Select Category"}
                </span>
                {isDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors text-white"
                      onClick={() => {
                        formik.setFieldValue("category", cat._id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {cat.categoryName}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">No categories found</div>
                  )}
                </div>
              )}
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
              )}
            </div>

            <div className="mt-4">
              <label className=" font-bold">iframe source URL</label>
              <input
                type="text"
                name="iframeSrc"
                placeholder="Enter iframe source URL"
                value={formik.values.iframeSrc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded w-full p-2 mt-1 bg-white/5"
              />
              {formik.touched.iframeSrc && formik.errors.iframeSrc && (
                <p className="text-red-500 text-sm">{formik.errors.iframeSrc}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="text-brown font-bold">Game Image</label>
              <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                {formik.values.image ? (
                  <>
                    <div className="flex max-w-[75%] items-center bg-[#72727226] px-2">
                      <img
                        src={
                          typeof formik.values.image === "string"
                            ? formik.values.image
                            : URL.createObjectURL(formik.values.image)
                        }
                        alt="Preview"
                        className="w-7 h-7 rounded-full mr-2 object-cover"
                      />
                      <span className="w-full truncate">
                        {typeof formik.values.image === "string"
                          ? formik.values.image.split("/").pop()
                          : formik.values.image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => formik.setFieldValue("image", null)}
                        className="text-red-500 ml-1 text-[12px]"
                      >
                        X
                      </button>
                    </div>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                    >
                      Change
                    </label>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-[16px] text-[#727272]">Choose Image</p>
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
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className="hidden"
                />
              </div>
              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-sm">{formik.errors.image}</p>
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
                {loading ? "Processing..." : gameData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Delete Game Modal */}
      <Modal open={delOpen} onClose={handleDeleteClose}>
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded">
          <div className="p-5">
            <div className="text-center">
              <p className="text-brown font-bold text-xl">Delete Game</p>
              <p className="text-brown-50 mt-2">
                Are you sure you want to delete "{gameData?.name}"?
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
                onClick={handleDeleteGame}
                disabled={loading}
                className="bg-brown text-white w-32 border-brown border px-4 py-2 rounded hover:bg-brown-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
