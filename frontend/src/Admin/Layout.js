import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import {
  FaUser,
  FaQuestion,
  FaExchangeAlt,
  FaBlog,
} from "react-icons/fa";
import {  BiSolidCategory,  } from "react-icons/bi";

import {
  LuContact,
  LuEye,
  LuEyeClosed,
} from "react-icons/lu";
import { RiFileTextLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from "@mui/material";
import { useState, useEffect, useRef, useMemo } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Formik,  } from "formik";
import * as Yup from "yup";
import { changePassword, getUserById } from "../Redux/Slice/user.slice";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { logoutUser } from "../Redux/Slice/auth.slice";
import { decryptData } from "../Utils/encryption";
import { IoGameControllerOutline } from "react-icons/io5";
// import { logout } from '../reduxe/slice/auth.slice';
// import { setSearchValue } from '../reduxe/slice/search.slice';

const drawerWidth = 250;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("yoyouserId");
  const role =
    useSelector((state) => state.auth.user?.role) ||
    localStorage.getItem("role");
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Memoize the user data
  const memoizedUser = useMemo(() => user, [user]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleSubmenuToggle = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const handleLogout = async () => {
    try {
      if (userId) {
        const data = {
          userId: userId,
        };
        await dispatch(logoutUser(data));
      }
      navigate("/");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.log(error);
    }
  };

  const pages = [
    { title: "Dashboard", icon: <AiFillHome />, path: "/admin" },
    { title: "Category", icon: <BiSolidCategory />, path: "/admin/category" },
    { title: "Games", icon: <IoGameControllerOutline />, path: "/admin/games" },
    { title: "User", icon: <FaUser />, path: "/admin/user" },
    {
      title: "Terms and Conditions",
      icon: <RiFileTextLine />,
      path: "/admin/terms-conditions", // corrected path to lowercase
    },
    {
      title: "Privacy Policy",
      icon: <HiOutlineShieldCheck />,
      path: "/admin/privacy-policy", // corrected path to lowercase
    },
    { title: "FAQ", icon: <FaQuestion />, path: "/admin/faq" }, // corrected "Faq" to "FAQ"
    {
      title: "Orders",
      icon: <FaExchangeAlt />,
      path: "/admin/order",
    },
    { title: "Blog", icon: <FaBlog />, path: "/admin/blog" },
    {
      title: "Subscriber",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          width="1em"
          height="1em"
        >
          <g>
            <path d="M401.16 40.539H300.366c-5.523 0-10 4.478-10 10s4.477 10 10 10H401.16c24.273 0 47.083 9.446 64.229 26.602 17.16 17.16 26.611 39.97 26.611 64.228 0 50.089-40.75 90.84-90.84 90.84H283.052c-1.892-15.093-15.027-27.453-30.466-27.318-15.491.038-28.777 11.852-30.37 27.318H110.84c-24.267 0-47.077-9.45-64.229-26.611C29.451 198.438 20 175.627 20 151.369c0-50.084 40.75-90.83 90.84-90.83h100.877c5.523 0 10-4.478 10-10s-4.477-10-10-10H110.84C49.723 40.539 0 90.257 0 151.369c0 29.601 11.531 57.433 32.467 78.369 20.928 20.939 48.761 32.471 78.373 32.471h111.208l.007 58.765c-19.026 4.223-33.059 20.11-33.059 39.937v43.027c0 10.503 3.971 20.558 10.898 27.604l35.13 36.821c3.813 3.996 10.143 4.145 14.138.332 3.996-3.812 4.145-10.143.333-14.139l-35.187-36.88-.125-.128c-3.297-3.335-5.188-8.296-5.188-13.61V360.91c0-8.568 5.117-16.001 13.057-19.095v16.835c0 5.522 4.477 10 10 10s10-4.478 10-10l-.003-113.159c-.005-6.77 5.342-10.516 10.398-10.604 5.988-.138 10.839 5.315 10.839 11.134v71.584c0 5.522 4.477 10 10 10s10-4.478 10-10c0-6.301 4.523-10.598 10.778-10.611 5.764.058 10.454 4.942 10.454 10.889v9.669a10 10 0 0 0 9.528 9.989c5.349.231 9.924-3.731 10.428-9.046.655-6.92 4.134-10.765 11.083-11.556 5.666.234 10.204 4.906 10.204 10.612v16.279a10 10 0 0 0 9.528 9.989c5.361.232 9.924-3.731 10.428-9.046.725-7.654 3.645-10.729 11.093-11.556 5.659.225 10.193 4.899 10.193 10.612v33.164c0 18.621-4.38 37.273-12.671 53.949l-12.934 26.072c-2.454 4.948-.432 10.948 4.516 13.402a10.001 10.001 0 0 0 13.402-4.516l12.929-26.062c9.655-19.42 14.758-41.151 14.758-62.846V343.83c0-16.885-13.737-30.621-30.621-30.621-4.277 0-8.917 1.272-12.814 2.966-4.527-11.258-15.565-19.234-28.429-19.245-5.223 0-10.94 1.767-15.47 4.307-5.395-8.467-14.761-14.137-25.381-14.241-3.862-.053-7.557.553-11 1.749V262.21H401.16c61.117 0 110.84-49.723 110.84-110.84 0-29.601-11.531-57.433-32.467-78.369-20.922-20.934-48.755-32.462-78.373-32.462z" />
            <path d="M304.063 99.943H280.8c-5.523 0-10 4.478-10 10v80.085c0 5.474 4.593 10 10.044 10 .002 0 21.386-.096 27.281-.096 17.4 0 31.556-14.156 31.556-31.556 0-9.914-4.6-18.77-11.772-24.56a28.252 28.252 0 0 0 4.581-15.446c.001-15.674-12.752-28.427-28.427-28.427zm0 20c4.647 0 8.428 3.78 8.428 8.428s-3.781 8.428-8.428 8.428c-1.712 0-13.263.021-13.263.021v-16.877zm4.062 59.99c-3.189 0-10.898.028-17.325.054v-23.148c1.609-.006 17.325-.018 17.325-.018 6.372 0 11.556 5.185 11.556 11.557s-5.183 11.555-11.556 11.555zM116.76 180.028c-7.962 0-15.625-3.21-20.498-8.587-3.708-4.092-10.034-4.401-14.125-.694-4.092 3.709-4.403 10.033-.694 14.126 8.601 9.489 21.803 15.155 35.317 15.155 16.873 0 31.041-10.767 33.689-25.6 1.993-11.162-3.075-25.743-23.274-33.193-9.838-3.63-18.998-7.581-21.808-8.812-2.185-1.756-2.112-4.203-1.965-5.223.203-1.415 1.231-4.875 6.377-6.425 11.288-3.401 21.755 4.861 22.049 5.098 4.228 3.505 10.5 2.945 14.038-1.264 3.554-4.228 3.007-10.536-1.22-14.09-.756-.636-18.762-15.482-40.635-8.895-11.052 3.329-18.871 12.04-20.406 22.732-1.398 9.734 3.272 21.721 12.736 25.944.464.206 11.492 5.115 23.912 9.696 3.514 1.296 11.571 4.954 10.507 10.915-.799 4.483-6.255 9.117-14 9.117zM395.138 180.028c-7.962 0-15.625-3.21-20.498-8.587-3.708-4.092-10.033-4.401-14.125-.694-4.092 3.709-4.403 10.033-.694 14.126 8.601 9.489 21.803 15.155 35.317 15.155 16.873 0 31.041-10.767 33.689-25.6 1.993-11.162-3.075-25.743-23.274-33.193-9.838-3.63-18.998-7.581-21.808-8.812-2.185-1.756-2.111-4.203-1.965-5.223.203-1.415 1.231-4.875 6.377-6.425 11.293-3.401 21.756 4.86 22.05 5.098 4.228 3.505 10.5 2.945 14.038-1.264 3.554-4.228 3.007-10.536-1.22-14.09-.756-.635-18.763-15.483-40.636-8.895-11.052 3.329-18.871 12.04-20.406 22.733-1.44 10.032 2.909 19.684 11.349 25.188 2.611 1.462 11.106 5.081 25.3 10.452 3.514 1.296 11.571 4.954 10.506 10.914-.8 4.483-6.256 9.117-14 9.117zM181.109 99.943c-5.523 0-10 4.478-10 10v55.107c0 12.081 5.78 21.899 17.179 29.183 11.198 7.155 26.044 7.656 37.873 1.699 17.022-8.573 20.595-21.558 20.595-30.94v-55.049c0-5.522-4.477-10-10-10s-10 4.478-10 10v55.049c0 3.84-1.09 8.796-9.591 13.077-5.576 2.809-12.809 2.697-18.109-.689-6.596-4.214-7.947-7.977-7.947-12.329v-55.107c0-5.523-4.477-10.001-10-10.001zM247.69 56.089c2.988 4.566 9.354 5.751 13.86 2.76 4.552-3.021 5.767-9.327 2.76-13.859-3.012-4.541-9.338-5.773-13.86-2.761-4.536 3.02-5.778 9.331-2.76 13.86z" />
          </g>
        </svg>
      ),
      path: "/admin/subscriber",
    },
    { title: "Contact", icon: <LuContact />, path: "/admin/contact" },
  ];
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Mobile No. is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date()
      .required("D.O.B is required")
      .max(
        new Date().toISOString().split("T")[0],
        "D.O.B cannot be in the future"
      ),
  });

  const drawer = (
    // scrollbar-hide overflow-y-auto
    <div
      className="relative"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Show YOYO only on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
        <span className="text-3xl font-bold text-white">YOYO</span>
      </Box>
      <Divider />
      <List className="gap-1 flex flex-col grow">
        {pages.map((v) => (
          <div key={v.title}>
            <ListItem
              disablePadding
            //  sx={{ paddingLeft: '20px', paddingRight: '20px' }}
            >
              <ListItemButton
                onClick={() => {
                  if (v.subItems) {
                    handleSubmenuToggle(v.title);
                  } else {
                    navigate(v.path);
                    if (window && window.innerWidth < 900) {
                      setMobileOpen(false);
                    }
                  }
                }}
                className={`transition-[background-position] duration-400 ease-in-out ${location.pathname === v.path
                  ? "bg-gradient-primary bg-[length:200%_100%] bg-[position:left_center] hover:bg-[position:right_center] text-white"
                  : "hover:bg-gradient-primary hover:bg-[length:200%_100%] hover:bg-[position:right_center]"
                  }`}
                sx={{
                  gap: "4px",
                  color: location.pathname === v.path ? "white" : "gray",
                  transition: "background-position 0.4s ease-in-out",
                  "&:hover": {
                    color: "white",
                    "& .MuiSvgIcon-root": { color: "white" },
                    "& .icon": {
                      color: "white",
                      // background: "#d1634b",
                      "& .MuiSvgIcon-root": { color: "white" },
                      "& .icon": { color: "white" },
                    },
                  },
                }}
                onMouseEnter={(e) => {
                  if (location.pathname == v.path) {
                    e.currentTarget.style.backgroundPosition = "right center";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname == v.path) {
                    e.currentTarget.style.backgroundPosition = "left center";
                  }
                }}
              >
                <ListItemIcon
                  className="icon"
                  sx={{
                    color: "white",
                    fontSize: "15px",
                    minWidth: "25px",
                    padding: "10px",
                    position: "relative",
                    borderRadius: "4px",
                    // backgroundColor:
                    //   location.pathname == v.path ? "#4338ca" : "transparent",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: "4px",
                      padding: "1px",
                      background:
                        location.pathname !== v.title &&
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
                      WebkitMask:
                        location.pathname !== v.title &&
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite:
                        location.pathname !== v.title && "xor",
                      maskComposite: location.pathname !== v.title && "exclude",
                      opacity: location.pathname == v.path ? 1 : 0.3,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  {v.icon}
                </ListItemIcon>
                <ListItemText
                  primary={v.title}
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                />
                {v.dot && (
                  <span style={{ color: "red", marginLeft: "5px" }}>•</span>
                )}
                {v.subItems && openSubmenu === v.title ? (
                  <FaAngleUp />
                ) : (
                  v.dropdownIcon
                )}
              </ListItemButton>
            </ListItem>
            {v.subItems &&
              openSubmenu === v.title &&
              v.subItems.map((subItem) => (
                <ListItem
                  key={subItem.title}
                  disablePadding
                  sx={{ paddingLeft: "40px" }}
                >
                  <ListItemButton
                    sx={{
                      backgroundColor:
                        location.pathname == subItem.path
                          ? "#FFF9F6"
                          : "transparent",
                      color:
                        location.pathname == subItem.path ? "#523C34" : "white",
                      borderRadius: "10px",
                      fontSize: "10px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      marginTop: "7px",
                      "&:hover": {
                        backgroundColor: "#FFF9F6",
                        color: "#523C34",
                      },
                    }}
                    onClick={() => {
                      navigate(subItem.path);
                      if (window && window.innerWidth < 900) {
                        setMobileOpen(false);
                      }
                    }}
                  >
                    <span style={{ margin: "5px" }}>•</span>
                    <ListItemText
                      primary={subItem.title}
                      sx={{ fontSize: "14px", fontWeight: 400 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </div>
        ))}
      </List>
      <div
        // style={{ padding: '20px' }}
        className="w-full mb-5"
      >
        <button
          onClick={() => {
            setShowLogoutModal(true);
          }}
          className="w-full py-2 font-semibold text-white bg-gradient-primary bg-[length:200%_100%] bg-[position:left_center] hover:bg-[position:right_center] transition-[background-position] duration-600 ease-in-out border-none outline-none cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    typeof window !== "undefined" ? () => window.document.body : undefined;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (event) => {
    // dispatch(setSearchValue(event.target.value));
  };

  const handleListItemClick = (item, path) => {
    if (item?.subItems) {
      handleSubmenuToggle(item.title, path);
    } else {
      navigate(path);
      if (window && window.innerWidth < 900) {
        setMobileOpen(false);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", cursor: "auto" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: "100%", // Full width
          ml: 0, // Remove margin-left
          backgroundColor: "#0f0f0f",
          boxShadow: "0 0.5px 5px 0 rgba(255,255,255,0.05)",
          color: "#fffff",
          height: "70px",
          zIndex: 20
        }}
      >
        <Toolbar className="h-full">
          <div className="flex justify-between w-full items-center h-full">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box onClick={() => navigate('/admin')} sx={{ cursor: 'pointer', display: { xs: "none", md: "block" } }}>
              <span className="text-3xl font-bold text-white">YOYO</span>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* <SearchIcon sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'text.brown' }} />
              <input
                type="search"
                placeholder="Search..."
                onChange={handleSearchChange}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '8px',
                  paddingLeft: '40px',
                  width: '100%'
                }}
              /> */}
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="gap-4 me-4"
            >
              <div color="inherit" sx={{ ml: 2 }} className="relative">
                <div
                  className="flex gap-2 items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    {memoizedUser?.photo && memoizedUser?.photo !== "null" ? (
                      <img
                        src={memoizedUser.photo}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-base w-8 h-8 font-bold uppercase border-2 rounded-full flex justify-center items-center border-white/40"
                      >
                        {decryptData(memoizedUser?.userName)?.split(" ").map(name => name[0]?.toUpperCase())?.join("") || ""}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div
                      style={{ fontSize: "14px" }}
                      className="capitalize flex items-center gap-1 text-brown-50"
                    >
                      <span>{decryptData(user?.userName)}</span>
                      <span>
                        {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    </div>
                  </div>
                </div>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`dropdown-content bg-[#2e2e2e] ${dropdownOpen ? "fade-in scale-in" : "fade-out scale-out"
                      }`}
                    style={{
                      position: "absolute",
                      top: 38,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: "4px",
                      zIndex: 1000,
                      right: -10,
                    }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-[#0072ff] "
                      onClick={() => {
                        navigate("/admin/profile");
                        setDropdownOpen(false);
                      }}
                    >
                      Profile
                    </div>
                    <div
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-[#0072ff]"
                      onClick={() => { setOpenPassword(true); setDropdownOpen(false); }}
                    >
                      Change Password
                    </div>
                    <div
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-red-500"
                      onClick={() => {
                        setShowLogoutModal(true);
                        setDropdownOpen(false);
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
                {/* Change Password */}
                <Modal
                  open={openPassword}
                  onClose={() => setOpenPassword(false)}
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">
                    <div className="flex justify-between items-center border-b-[1px] border-white/10 pb-[12px] mb-[12px]">
                      <h1 className="text-lg font-semibold ">
                        Change Password
                      </h1>
                      <button
                        onClick={() => setOpenPassword(false)}
                        className="text-white hover:text-red-500 transition duration-200"
                      >
                        <AiOutlineClose className="text-xl" />
                      </button>
                    </div>
                    <Formik
                      initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                        showOldPassword: false,
                        showNewPassword: false,
                        showConfirmNewPassword: false,
                      }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.oldPassword) {
                          errors.oldPassword = "Required";
                        }
                        if (!values.newPassword) {
                          errors.newPassword = "Required";
                        } else if (values.newPassword.length < 6) {
                          errors.newPassword =
                            "Password must be at least 6 characters";
                        } else if (
                          values.newPassword !== values.confirmNewPassword
                        ) {
                          errors.confirmNewPassword =
                            "Password and Confirm Password not match";
                        }
                        return errors;
                      }}
                      onSubmit={(values) => {
                        const { oldPassword, newPassword } = values;
                        dispatch(
                          changePassword({
                            email: user.email,
                            oldPassword,
                            newPassword,
                          })
                        ).then((response) => {
                          if (response.payload.success) {
                            setOpenPassword(false);
                          }
                        });
                      }}
                    >
                      {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                      }) => (
                        <form
                          onSubmit={handleSubmit}
                          className="change-pass-form flex flex-col gap-4 p-[12px]"
                        >
                          {/* Current Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              Old password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showOldPassword ? "text" : "password"
                                }
                                placeholder="Old password"
                                name="oldPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.oldPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showOldPassword",
                                    !values.showOldPassword
                                  );
                                }}
                              >
                                {values.showOldPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.oldPassword && touched.oldPassword && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.oldPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showNewPassword ? "text" : "password"
                                }
                                placeholder="New Password"
                                name="newPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.newPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showNewPassword",
                                    !values.showNewPassword
                                  );
                                }}
                              >
                                {values.showNewPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.newPassword && touched.newPassword && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.newPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Confirm New Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              Confirm password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showConfirmNewPassword
                                    ? "text"
                                    : "password"
                                }
                                placeholder="Confirm password"
                                name="confirmNewPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.confirmNewPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showConfirmNewPassword",
                                    !values.showConfirmNewPassword
                                  );
                                }}
                              >
                                {values.showConfirmNewPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.confirmNewPassword &&
                                touched.confirmNewPassword && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors.confirmNewPassword}
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="flex justify-between mt-[10px] md:mt-[32px] gap-4">
                            <button
                              onClick={() => setOpenPassword(false)}
                              className="bg-white/10 text-[14px] hover:bg-white/20 text-white py-2 rounded-[4px] w-48"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="text-[14px] w-48 py-2 rounded-[4px] font-medium sm:py-3 text-white border-none cursor-pointer bg-gradient-primary bg-[length:200%_100%] bg-[position:left_center] hover:bg-[position:right_center] transition-[background-position] duration-400 ease-in-out"
                            >
                              Change Password
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Modal>
              </div>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, boxShadow: "0 0.5px 5px 0 rgba(255,255,255,0.05)" }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // borderRight: '1px solid #4b4b4b'
            },
          }}
          className="[&_.MuiDrawer-paper]:bg-primary-dark"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          className="[&_.MuiDrawer-paper]:bg-primary-dark/50"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // borderRight: '1px solid #4b4b4b'
              // background: 'primary.Dark',
              top: "70px", // Start below AppBar
              height: "calc(100% - 70px)", // Fill below AppBar
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="relative overflow-hidden"
        sx={{
          flexGrow: 1,
          minHeight: "calc(100vh - 70px)",
          color: "whitesmoke",
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "transparent",
          paddingTop: "70px",
        }}
      >
        {/* <Toolbar /> */}
        <div className={`relative z-10 h-full`}>

          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#0f0d12] to-[#141216]">
            {/* Decorative blobs */}
            <div className={`pointer-events-none absolute ${window?.innerWidth < 900 ? "-top-20 -left-24" : "top-10 left-24"}  w-[420px] h-[420px] rounded-full bg-purple-700/30 blur-3xl `} />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-indigo-700/30 blur-3xl" />
          </div>
          {children}
        </div>
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => {
          setShowLogoutModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-[#1e1e1e] rounded-[2px] p-[16px] sm:p-[24px] w-[90%] max-w-[400px] text-white shadow-lg">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 id="modal-modal-title" className="text-lg font-semibold">
              Log out
            </h2>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="text-white hover:text-red-500 transition duration-200"
            >
              <AiOutlineClose className="text-xl" />
            </button>
          </div>

          <p
            id="modal-modal-description"
            className="text-sm text-white/70 text-center my-6"
          >
            Are you sure you want to logout?
          </p>

          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-[4px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => {
                setShowLogoutModal(false);
                handleLogout();
              }}
              className="w-full text-white py-2 rounded-[4px] text-[14px] font-medium sm:py-3 border-none cursor-pointer bg-gradient-primary bg-[length:200%_100%] bg-[position:left_center] hover:bg-[position:right_center] transition-[background-position] duration-400 ease-in-out"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </Modal>
    </Box>
  );
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Layout;
