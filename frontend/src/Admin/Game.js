import {
  Box,
  Modal,
  Pagination,
  useMediaQuery,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  createGame,
  updateGame,
  deleteGame,
  getAllActiveGamesWithPagination,
} from "../Redux/Slice/game.slice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getAllCategories } from "../Redux/Slice/category.slice";
import { FaApple, FaChevronLeft, FaChevronRight, FaWindows } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";

export default function Game() {
  const dispatch = useDispatch();
  //   const games = useSelector(state => state.game.games);
  // const loading = useSelector(state => state.game.loading);

  const [gameData, setGameData] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);
  const fileInputRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width:425px)");
  const categories = useSelector((state) => state.category.categories);
  const loading = useSelector((state) => state.game.loading);
  const [instructionInput, setInstructionInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryQ, setSelectedCategoryQ] = useState("all");
  const gamesPerPage = 10;

  const {
    paginatedGames,
    totalGames,
    totalPages,
    loadingStates,
    error: gamesError,
  } = useSelector((state) => state.game);

  useEffect(() => {
    // Debounce searchTerm
    const handler = setTimeout(() => {
      dispatch(
        getAllActiveGamesWithPagination({
          page: currentPage,
          limit: gamesPerPage,
          category: selectedCategoryQ,
          search: searchValue?.trim()?.toLowerCase(),
        })
      );
    }, 500); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [currentPage, selectedCategoryQ, searchValue, dispatch]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, []);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Game title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    cover_image: Yup.mixed()
      .required("Cover image is required")
      .test("fileFormat", "Unsupported Format", (value) => {
        if (!value) return false; // required handles missing
        if (typeof value === "string") return true;
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
      }),
    video: Yup.mixed()
      .required("Video is required")
      .test("fileFormat", "Unsupported Format", (value) => {
        if (!value) return false; // required handles missing
        if (typeof value === "string") return true;
        return [
          "video/mp4",
          "video/webm",
          "video/ogg",
          "video/quicktime",
          "video/x-msvideo",
          "video/x-matroska",
          "video/mpeg",
          "video/x-flv",
          "video/3gpp",
          "video/3gpp2",
          "video/x-ms-wmv",
          "video/x-ms-asf",
        ].includes(value.type);
      })
      .test(
        "minDuration",
        "Video must be at least 2 minutes long",
        async (value) => {
          if (!value) return true;
          if (typeof value === "string") return true; // Already uploaded video

          return new Promise((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
              URL.revokeObjectURL(video.src);
              resolve(video.duration <= 120); // 120 seconds = 2 minutes
            };

            video.onerror = () => {
              URL.revokeObjectURL(video.src);
              resolve(false); // If there's an error loading metadata, consider it invalid
            };

            video.src = URL.createObjectURL(value);
          });
        }
      ),
    instructions: Yup.array()
      .ensure()
      .compact((v) => !v || !v.trim())
      .of(
        Yup.string().trim().min(2, "Each feature must be at least 2 characters")
      )
      .min(1, "Add at least Two key feature"),

    isActive: Yup.boolean(),

    tags: Yup.array()
      .of(Yup.string().trim().min(1, "Tag cannot be empty"))
      .min(1, "At least one tag is required"),

    images: Yup.array()
      .of(
        Yup.mixed().test("fileFormat", "Unsupported Format", (value) => {
          if (!value) return false;
          if (typeof value === "string") return true;
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
        })
      )
      .min(1, "At least one image is required"),

    windows_file: Yup.mixed()
      .nullable()
      .test(
        "windows-file-required",
        "Windows file is required when Windows platform is available",
        function (value) {
          const { platforms } = this.parent;
          const windows = platforms?.windows;
          if (!windows?.available) return true;

          const hasExisting = !!(
            windows?.download_link && String(windows.download_link).trim()
          );
          const hasFile = !!value && value !== "";

          return hasExisting || hasFile;
        }
      ),
    ios_file: Yup.mixed()
      .nullable()
      .test(
        "ios-file-required",
        "iOS file is required when iOS platform is available",
        function (value) {
          const { platforms } = this.parent || {};
          const ios = platforms?.ios;
          if (!ios?.available) return true;
          const hasExisting = !!(
            ios?.download_link && String(ios.download_link).trim()
          );
          const hasFile = !!value && value !== "";
          if (hasExisting || hasFile) {
            return true;
          }
          // Mark the field as touched so error will show
          if (
            this.options &&
            this.options.context &&
            this.options.context.setFieldTouched
          ) {
            this.options.context.setFieldTouched("ios_file", true, false);
          }
          return this.createError({
            path: "ios_file",
            message: "iOS file is required when iOS platform is available",
          });
        }
      ),
    android_file: Yup.mixed()
      .nullable()
      .test(
        "android-file-required",
        "Android file is required when Android platform is available",
        function (value) {
          const android = this.parent?.platforms?.android;
          if (!android?.available) return true;
          const hasExisting = !!(
            android?.download_link && String(android.download_link).trim()
          );
          const hasFile = !!value && value !== "";
          return hasExisting || hasFile;
        }
      ),

    platforms: Yup.object()
      .test(
        'at-least-one-platform',
        'At least one platform must be selected',
        function (value) {
          const isWindowsAvailable = value?.windows?.available;
          const isIosAvailable = value?.ios?.available;
          const isAndroidAvailable = value?.android?.available;

          return isWindowsAvailable || isIosAvailable || isAndroidAvailable;
        }
      ).shape({
        windows: Yup.object().shape({
          available: Yup.boolean(),
          price: Yup.string().when('available', {
            is: true,
            then: (schema) => schema.required("Price is required when Windows is available"),
            otherwise: (schema) => schema.notRequired()
          }),
          download_link: Yup.string(),
          system_requirements: Yup.object().when('available', {
            is: true,
            then: (schema) => schema.shape({
              os: Yup.string().required("OS is required when Windows is available"),
              processor: Yup.string().required("Processor is required when Windows is available"),
              memory: Yup.string().required("Memory is required when Windows is available"),
              graphics: Yup.string().required("Graphics is required when Windows is available"),
              storage: Yup.string().required("Storage is required when Windows is available"),
            }),
            otherwise: (schema) => schema.shape({
              os: Yup.string().notRequired(),
              processor: Yup.string().notRequired(),
              memory: Yup.string().notRequired(),
              graphics: Yup.string().notRequired(),
              storage: Yup.string().notRequired(),
            })
          }),
        }),

        ios: Yup.object().shape({
          available: Yup.boolean(),
          price: Yup.string().when('available', {
            is: true,
            then: (schema) => schema.required("Price is required when iOS is available"),
            otherwise: (schema) => schema.notRequired()
          }),
          download_link: Yup.string(),
          system_requirements: Yup.object().when('available', {
            is: true,
            then: (schema) => schema.shape({
              ios_version: Yup.string().required("iOS version is required when iOS is available"),
            }),
            otherwise: (schema) => schema.shape({
              ios_version: Yup.string().notRequired(),
            })
          }),
        }),

        android: Yup.object().shape({
          available: Yup.boolean(),
          price: Yup.string().when('available', {
            is: true,
            then: (schema) => schema.required("Price is required when Android is available"),
            otherwise: (schema) => schema.notRequired()
          }),
          download_link: Yup.string(),
          system_requirements: Yup.object().when('available', {
            is: true,
            then: (schema) => schema.shape({
              android_version: Yup.string().required("Android version is required when Android is available"),
            }),
            otherwise: (schema) => schema.shape({
              android_version: Yup.string().notRequired(),
            })
          }),
        }),
      }),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
      cover_image: null,
      video: null,
      instructions: [],
      isActive: true,
      tags: [],
      images: [],
      platforms: {
        windows: {
          available: false,
          price: "",
          download_link: "",
          system_requirements: {
            os: "",
            processor: "",
            memory: "",
            graphics: "",
            storage: "",
          },
        },
        ios: {
          available: false,
          price: "",
          download_link: "",
          system_requirements: {
            ios_version: "",
          },
        },
        android: {
          available: false,
          price: "",
          download_link: "",
          system_requirements: {
            android_version: "",
          },
        },
      },
      windows_file: null,
      ios_file: null,
      android_file: null,
    },

    validationSchema,
    onSubmit: async (values) => {
      // console.log(values);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append(
        "instructions",
        JSON.stringify(values.instructions) || ""
      );
      formData.append("isActive", values.isActive ? "true" : "false");
      formData.append("tags", JSON.stringify(values.tags));
      if (values.cover_image && typeof values.cover_image !== "string") {
        formData.append("cover_image", values.cover_image);
      }
      if (values.video && typeof values.video !== "string") {
        formData.append("video", values.video);
      }

      if (values.windows_file && typeof values.windows_file !== "string") {
        formData.append("windows_file", values.windows_file);
      }
      if (values.ios_file && typeof values.ios_file !== "string") {
        formData.append("ios_file", values.ios_file);
      }
      if (values.android_file && typeof values.ios_file !== "string") {
        formData.append("android_file", values.android_file);
      }
      if (values.images && Array.isArray(values.images)) {
        values.images.forEach((img) => {
          // if (img && typeof img !== "string") {
            formData.append("images", img);
          // }
        });
      }
      formData.append("platforms", JSON.stringify(values.platforms));

      if (gameData) {
        await dispatch(updateGame({ _id: gameData._id, formData }));
      } else {
        await dispatch(createGame(formData));
      }

      handleCreateClose();
      formik.resetForm();
      setIsImageChanged(false);
    },
  });

  // Key Features handlers
  const addInstruction = () => {
    const value = instructionInput.trim();
    if (!value) return;
    const updated = [...formik.values.instructions, value];
    formik.setFieldValue("instructions", updated);
    formik.setFieldTouched("instructions", true, true);
    setInstructionInput("");
  };

  const removeInstruction = (index) => {
    const updated = [...formik.values.instructions];
    updated.splice(index, 1);
    formik.setFieldValue("instructions", updated);
    formik.setFieldTouched("instructions", true, true);
  };

  // Search and pagination
  const filteredData = Array.isArray(paginatedGames)
    ? paginatedGames.filter((data) => {
      const search = searchValue?.trim()?.toLowerCase();
      // Title match
      const titleMatch = data?.title?.toLowerCase().includes(search);
      // Category match (if category is an object with categoryName)
      const categoryMatch =
        typeof data?.category === "object"
          ? data?.category?.categoryName?.toLowerCase().includes(search)
          : false;
      // Tags match (if tags is an array)
      const tagsMatch = Array.isArray(data?.tags)
        ? data.tags.some((tag) => tag?.toLowerCase().includes(search))
        : false;
      return titleMatch || categoryMatch || tagsMatch;
    })
    : [];

  // Handlers
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleOpen = (data) => {
    setCreateOpen(true);
    setGameData(data);
    if (data) {
      formik.setValues({
        title: data.title,
        description: data.description,
        category: data.category?._id || "",
        cover_image: data.cover_image?.url || null,
        video: data.video?.url || null,
        instructions: data.instructions || [],
        isActive: data.isActive || true,
        tags: data.tags || [],
        images: Array.isArray(data.images)
          ? data.images.map((img) => (typeof img === "string" ? img : img.url))
          : [],
        windows_file: data.platforms?.windows?.download_link,
        ios_file: data.platforms?.ios?.download_link,
        android_file: data.platforms?.android?.download_link,
        platforms: {
          windows: {
            available: data.platforms?.windows?.available || false,
            price: data.platforms?.windows?.price || "",
            size: data.platforms?.windows?.size || "",
            download_link: data.platforms?.windows?.download_link || "",

            system_requirements: {
              os: data.platforms?.windows?.system_requirements?.os || "",
              processor:
                data.platforms?.windows?.system_requirements?.processor || "",
              memory:
                data.platforms?.windows?.system_requirements?.memory || "",
              graphics:
                data.platforms?.windows?.system_requirements?.graphics || "",
              storage:
                data.platforms?.windows?.system_requirements?.storage || "",
            },
          },
          ios: {
            available: data.platforms?.ios?.available || false,
            price: data.platforms?.ios?.price || "",
            size: data.platforms?.ios?.size || "",
            download_link: data.platforms?.ios?.download_link || "",

            system_requirements: {
              ios_version:
                data.platforms?.ios?.system_requirements?.ios_version || "",
            },
          },
          android: {
            available: data.platforms?.android?.available || false,
            price: data.platforms?.android?.price || "",
            size: data.platforms?.android?.size || "",
            download_link: data.platforms?.android?.download_link || "",

            system_requirements: {
              android_version:
                data.platforms?.android?.system_requirements?.android_version ||
                "",
            },
          },
        },
      });
    }
  };
  const handleCreateClose = () => {
    setCreateOpen(false);
    setGameData("");
    formik.resetForm();
    setIsImageChanged(false);
  };
  const handleDeleteOpen = (data) => {
    setDelOpen(true);
    setGameData(data);
  };
  const handleDeleteClose = () => {
    setDelOpen(false);
    setGameData("");
  };
  const handleDeleteGame = () => {
    dispatch(deleteGame({ _id: gameData._id }));
    setDelOpen(false);
    setGameData("");
  };

  return (
    <div className=" p-5 md:p-10">
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl font-bold text-brown mb-2">Games</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 w-full flex justify-content-between ">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search Games..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="rounded w-full md:w-64 p-2 bg-white/10"
          />
        </div>
        <div className="flex gap-4 ">
          <button
            className="bg-primary-light/15 w-20 sm:w-20 md600:w-32 text-white px-4 py-2 rounded "
            onClick={() => setCreateOpen(true)}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="overflow-auto shadow mt-5 rounded scrollbar-thin   scrollbar-track-transparent scrollbar-thumb-blue-500">
        <table className="w-full bg-white/5 min-w-[900px]">
          <thead>
            <tr className="text-brown font-bold border-slate-700/50 border-b">
              <td className="py-2 px-5 w-1/12">Cover</td>
              <td className="py-2 px-5 w-1/6">Title</td>
              <td className="py-2 px-5 w-1/6">Category</td>
              <td className="py-2 px-5 w-1/6">Tags</td>
              <td className="py-2 px-5 w-1/6">Platforms</td>
              <td className="py-2 px-5 w-1/12 text-center">Active</td>
              <td className="py-2 px-5 w-1/6 text-center whitespace-nowrap">
                Created At
              </td>
              <td className="py-2 px-5 w-1/6 text-end">Action</td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((game) => (
              <tr key={game._id} className="border-t border-gray-950">
                <td className="py-2 px-5">
                  <img
                    src={game.cover_image?.url}
                    alt={game.title}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-2 px-5 whitespace-nowrap">{game.title.replace(/"/g, '')}</td>
                <td className="py-2 px-5 whitespace-nowrap">{game.category?.categoryName.replace(/"/g, '')}</td>
                <td className="py-2 px-5 whitespace-nowrap">
                  {Array.isArray(game.tags) && game.tags.length > 0
                    ? game.tags.slice(0, 3).map(tag => tag.replace(/"/g, '')).join(", ")
                    : "-"}
                </td>
                {/* <td className="py-2 px-5 whitespace-nowrap">
                  {["windows", "ios", "android"]
                    .filter((p) => game.platforms?.[p]?.available)
                    .map((p) => (
                      <span
                        key={p}
                        className="inline-block bg-brown text-white rounded px-2 py-1 text-xs mr-1"
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </span>
                    ))}
                </td> */}
                {["android", "ios", "windows"]
                  .filter((p) => game.platforms?.[p]?.available)
                  .map((p) => {
                    const icons = {
                      ios: (
                        <FaApple title="iOS" className="inline-block mr-1" />
                      ),
                      android: (
                        <DiAndroid
                          title="Android"
                          className="inline-block mr-1"
                        />
                      ),
                      windows: (
                        <FaWindows
                          title="Windows"
                          className="inline-block mr-1"
                        />
                      ),
                    };
                    const color = {
                      ios: "text-white",
                      android: "text-green-500",
                      windows: "text-blue-500",
                    }[p];
                    return (
                      <span
                        key={p}
                        className={`inline-block bg-brown text-center rounded text-base ${color}`}
                      >
                        {icons[p]}
                      </span>
                    );
                  })}
                <td className="py-2 px-5 text-center">
                  <span
                    className={
                      game.isActive
                        ? "text-green-500 font-bold"
                        : "text-red-500 font-bold"
                    }
                  >
                    {game.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-2 px-5 text-center">
                  {new Date(game.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-5 flex justify-end gap-2">
                  <button
                    className="text-green-700 text-xl p-1 border border-brown-50 transition-colors rounded hover:text-green-800"
                    onClick={() => handleOpen(game)}
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="text-red-500 text-xl p-1 border border-brown-50  transition-colors rounded hover:text-red-600"
                    onClick={() => handleDeleteOpen(game)}
                  >
                    <RiDeleteBin6Fill />
                  </button>
                </td>
              </tr>
            ))}

            {filteredData.length == 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

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
            "& .MuiPaginationItem-root": { color: "white" },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "white",
            },
            "& .MuiPaginationItem-root:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
            },
          }}
        />
      )}

      {/* Create & Update Game Modal */}
      <Modal
        open={createOpen}
        className="bg-white/10 backdrop:blur-sm"
        onClose={handleCreateClose}
      >
        <Box className="bg-primary-dark text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded max-w-[700px] w-[100%] max-h-[90vh] overflow-y-auto scrollbar-hide">
          <form onSubmit={formik.handleSubmit} className="p-5 space-y-6">
            <div className="text-center mb-4">
              <p className="text-brown font-bold text-2xl">
                {gameData ? "Edit" : "Add"} Game
              </p>
            </div>
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="font-bold">Game Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Game Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-sm">{formik.errors.title}</p>
                )}
              </div>
              <div>
                <label className="font-bold" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white/5 rounded w-full p-2 mt-1"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.category}
                  </p>
                )}
              </div>
              <div>
                <label className="font-bold">Tags</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="Add tags with Comma separated "
                  value={formik.values.tags.join(",")}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "tags",
                      e.target.value.split(",").map((t) => t.trim())
                    )
                  }
                  className="rounded w-full p-2 mt-1 bg-white/5"
                />
                {formik.touched.tags && formik.errors.tags && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.tags}
                  </div>
                )}
              </div>
            </div>
            {/* Description & Instructions */}
            <div>
              <label className="font-bold">Description</label>
              <textarea
                name="description"
                placeholder="Enter Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="2"
                className="bg-white/5 rounded w-full p-2 mt-1 resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </div>
            <div>
              <label className="font-bold">Key Features</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a feature and press Enter or click Add"
                  value={instructionInput}
                  onChange={(e) => setInstructionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInstruction();
                    }
                  }}
                  className="bg-white/5 rounded w-full p-2"
                />
                <button
                  type="button"
                  onClick={addInstruction}
                  className="bg-brown text-white px-4 rounded whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              {formik.touched.instructions && formik.errors.instructions && (
                <p className="text-red-500 text-sm mt-2">
                  {Array.isArray(formik.errors.instructions)
                    ? formik.errors.instructions.find(Boolean)
                    : formik.errors.instructions}
                </p>
              )}
              {formik.values.instructions.length > 0 && (
                <ul className="list-decimal mt-3 space-y-1">
                  {formik.values.instructions.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-white/5 rounded px-2 py-1"
                    >
                      <span className="truncate">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className="text-red-500 text-xs ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-brown font-bold">Cover Image</label>
                <div className="flex items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.cover_image ? (
                    <>
                      <img
                        src={
                          typeof formik.values.cover_image === "string"
                            ? formik.values.cover_image
                            : URL.createObjectURL(formik.values.cover_image)
                        }
                        alt="Preview"
                        className="w-10 h-10 rounded-full mr-2 object-cover"
                      />
                      <span className="w-full truncate">
                        {typeof formik.values.cover_image === "string"
                          ? formik.values.cover_image.split("/").pop()
                          : formik.values.cover_image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("cover_image", null);
                          setIsImageChanged(false);
                        }}
                        className="text-red-500 ml-1 text-[12px]"
                      >
                        X
                      </button>
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px] ml-2"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Image
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
                    name="cover_image"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("cover_image", file);
                      setIsImageChanged(!!file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.cover_image && formik.errors.cover_image && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.cover_image}
                  </p>
                )}
              </div>

              {/* Video */}
              <div>
                <label className="font-bold">Video</label>
                <div className="flex justify-between items-center border border-brown rounded w-full p-2 mt-1">
                  {formik.values.video ? (
                    <>
                      <div className="flex items-center bg-[#72727226] px-2 py-1">
                        <span className="flex-1 max-w-8 md:max-w-48 truncate">
                          {typeof formik.values.video === "string"
                            ? formik.values.video.split("/").pop()
                            : formik.values.video.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("video", null);
                          }}
                          className="text-red-500 ml-1 text-[12px]"
                        >
                          X
                        </button>
                      </div>
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px]"
                      >
                        Change
                      </label>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-[16px] text-[#727272]">
                        Choose Video
                      </p>
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                      >
                        Browse
                      </label>
                    </>
                  )}
                  <input
                    id="video-upload"
                    name="video"
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      formik.setFieldValue("video", file);
                    }}
                    className="hidden"
                  />
                </div>
                {formik.touched.video && formik.errors.video && (
                  <p className="text-red-500 text-sm">{formik.errors.video}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-brown font-bold">Gallery Images</label>
              <div className="flex items-center border border-brown rounded w-full p-2 mt-1">
                {formik.values.images &&
                  Array.isArray(formik.values.images) &&
                  formik.values.images.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {formik.values.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={
                              typeof img === "string"
                                ? img
                                : URL.createObjectURL(img)
                            }
                            alt={`img-${idx}`}
                            className="w-7 h-7 object-cover rounded"
                          />
                          <button
                            type="button"
                            className="absolute -top-0 -right-0 bg-transparent text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                            onClick={() => {
                              const newImages = [...formik.values.images];
                              newImages.splice(idx, 1);
                              formik.setFieldValue("images", newImages);
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="gallery-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-[5px] px-3 text-[13px] ml-2"
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
                      htmlFor="gallery-upload"
                      className="cursor-pointer text-center bg-brown text-white rounded p-1 px-2 text-[13px]"
                    >
                      Browse
                    </label>
                  </>
                )}
                <input
                  id="gallery-upload"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files);
                    // If already have images, append new ones
                    if (
                      formik.values.images &&
                      Array.isArray(formik.values.images)
                    ) {
                      formik.setFieldValue("images", [
                        ...formik.values.images,
                        ...files,
                      ]);
                    } else {
                      formik.setFieldValue("images", files);
                    }
                  }}
                  className="hidden"
                />
              </div>
              {formik.touched.images && formik.errors.images && (
                <p className="text-red-500 text-sm">{formik.errors.images}</p>
              )}
            </div>
            {/* Active Toggle */}
            <div>
              <label className="font-bold">Active</label>
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={(e) =>
                  formik.setFieldValue("isActive", e.target.checked)
                }
                className="ml-2"
              />
            </div>

            {/* Platforms Section */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2 text-brown">Platforms</h3>
              {formik.touched.platforms && formik.errors.platforms &&
                typeof formik.errors.platforms === 'string' && (
                  <p className="text-red-500 text-sm mb-4">
                    {formik.errors.platforms}
                  </p>
                )}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/* Windows */}
                <div className="border border-brown rounded p-3">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.windows.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          windows: {
                            ...formik.values.platforms.windows,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2 "
                    />
                    Windows
                  </label>
                  <div>
                    {formik.values.platforms.windows.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.windows.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.price &&
                          formik.errors.platforms?.windows?.price && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.platforms.windows.price}
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="OS Version (e.g. Windows 7)"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .os
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  os: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.system_requirements
                          ?.os &&
                          formik.errors.platforms?.windows?.system_requirements
                            ?.os && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.windows
                                  ?.system_requirements?.os
                              }
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="Processor"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .processor
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  processor: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.system_requirements
                          ?.processor &&
                          formik.errors.platforms?.windows?.system_requirements
                            ?.processor && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.windows
                                  ?.system_requirements?.processor
                              }
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="Memory (e.g. 2 GB)"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .memory
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  memory: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.system_requirements
                          ?.memory &&
                          formik.errors.platforms?.windows?.system_requirements
                            ?.memory && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.windows
                                  ?.system_requirements?.memory
                              }
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="Graphics"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .graphics
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  graphics: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.system_requirements
                          ?.graphics &&
                          formik.errors.platforms?.windows?.system_requirements
                            ?.graphics && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.windows
                                  ?.system_requirements?.graphics
                              }
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="Storage (e.g. 100 MB/GB)"
                          value={
                            formik.values.platforms.windows.system_requirements
                              .storage
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              windows: {
                                ...formik.values.platforms.windows,
                                system_requirements: {
                                  ...formik.values.platforms.windows
                                    .system_requirements,
                                  storage: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.windows?.system_requirements
                          ?.storage &&
                          formik.errors.platforms?.windows?.system_requirements
                            ?.storage && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.windows
                                  ?.system_requirements?.storage
                              }
                            </p>
                          )}
                        <input
                          type="file"
                          accept=".exe,.zip,.rar"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "windows_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.values.platforms.windows.download_link && (
                          <p className="text-xs text-[#d1d1d1]">
                            Current file:{" "}
                            {formik.values.platforms.windows.download_link
                              .split("?")[0]
                              .split("/")
                              .pop()}
                          </p>
                        )}
                        {formik.touched.windows_file &&
                          formik.errors.windows_file && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.windows_file}
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                {/* iOS */}
                <div className="border border-brown rounded p-3 ">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.ios.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          ios: {
                            ...formik.values.platforms.ios,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2"
                    />
                    iOS
                  </label>
                  <div>
                    {formik.values.platforms.ios.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.ios.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.ios?.price &&
                          formik.errors.platforms?.ios?.price && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.ios
                                  ?.price
                              }
                            </p>
                          )}
                        <input
                          type="text"
                          placeholder="iOS Version"
                          value={
                            formik.values.platforms.ios.system_requirements
                              .ios_version
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              ios: {
                                ...formik.values.platforms.ios,
                                system_requirements: {
                                  ...formik.values.platforms.ios
                                    .system_requirements,
                                  ios_version: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.ios?.system_requirements
                          ?.ios_version &&
                          formik.errors.platforms?.ios?.system_requirements
                            ?.ios_version && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.ios
                                  ?.system_requirements?.ios_version
                              }
                            </p>
                          )}
                        <input
                          type="file"
                          accept=".ipa"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "ios_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.values.platforms.ios.download_link && (
                          <p className="text-xs text-[#d1d1d1]">
                            Current file:{" "}
                            {formik.values.platforms.ios.download_link
                              .split("?")[0]
                              .split("/")
                              .pop()}
                          </p>
                        )}
                        {formik.touched.ios_file && formik.errors.ios_file && (
                          <p className="text-red-500 text-sm">
                            {formik.errors.ios_file}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Android */}
                <div className="border border-brown rounded p-3">
                  <label className="font-bold">
                    <input
                      type="checkbox"
                      checked={formik.values.platforms.android.available}
                      onChange={(e) =>
                        formik.setFieldValue("platforms", {
                          ...formik.values.platforms,
                          android: {
                            ...formik.values.platforms.android,
                            available: e.target.checked,
                          },
                        })
                      }
                      className="m-2"
                    />
                    Android
                  </label>
                  <div>
                    {formik.values.platforms.android.available && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="number"
                          placeholder="Price"
                          value={formik.values.platforms.android.price}
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                price: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.android?.price &&
                          formik.errors.platforms?.android?.price && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.android
                                  ?.price
                              }
                            </p>
                          )}

                        <input
                          type="text"
                          placeholder="Android Version"
                          value={
                            formik.values.platforms.android.system_requirements
                              .android_version
                          }
                          onChange={(e) =>
                            formik.setFieldValue("platforms", {
                              ...formik.values.platforms,
                              android: {
                                ...formik.values.platforms.android,
                                system_requirements: {
                                  ...formik.values.platforms.android
                                    .system_requirements,
                                  android_version: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.touched.platforms?.android?.system_requirements
                          ?.android_version &&
                          formik.errors.platforms?.android?.system_requirements
                            ?.android_version && (
                            <p className="text-red-500 text-sm">
                              {
                                formik.errors.platforms?.android
                                  ?.system_requirements?.android_version
                              }
                            </p>
                          )}
                        <input
                          type="file"
                          accept=".apk"
                          onChange={(e) =>
                            formik.setFieldValue(
                              "android_file",
                              e.currentTarget.files[0]
                            )
                          }
                          className="w-full p-2 rounded bg-white/5"
                        />
                        {formik.values.platforms.android.download_link && (
                          <p className="text-xs text-[#d1d1d1]">
                            Current file:{" "}
                            {formik.values.platforms.android.download_link
                              .split("?")[0]
                              .split("/")
                              .pop()}
                          </p>
                        )}
                        {formik.touched.android_file &&
                          formik.errors.android_file && (
                            <p className="text-red-500 text-sm">
                              {formik.errors.android_file}
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Submit/Cancel */}
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
                Are you sure you want to delete "{gameData?.title}"?
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
