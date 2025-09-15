import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack, IoIosLogOut } from "react-icons/io";
import { MdEdit, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaUser, FaBirthdayCake, FaGamepad } from "react-icons/fa";
import { getUserById, editUserProfile, logoutUser, clearUser, getFanCoinDetails } from '../Redux/Slice/user.slice';
import { ChangePassSlice, DeleteUser, fetchProfile, SendDeleteOtp } from '../Redux/Slice/profile.slice';
import ProfileSkeleton from '../lazyLoader/ProfileSkeleton';
import TransactionHistorySkeleton from '../lazyLoader/TransactionHistorySkeleton';
import OrderListSkeleton from '../lazyLoader/OrderListSkeleton';
import { allorders, retryOrderPayment } from '../Redux/Slice/Payment.slice';
import stanUser from "../images/stan-user.jpg";
import { decryptData } from "../Utils/encryption";
import { Dialog, Transition } from '@headlessui/react'

import { Fragment } from "react";
import lazyCatImage from '../images/lazy-cat-1.png'
import { FaUserLarge } from 'react-icons/fa6';
import { GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'
import { IoLocation, IoClose, IoTrash, IoPencil, IoEye, IoEyeOff } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";
import manageAddress from "../images/manage_addres-1.png"
import StylishDiv from '../components/StylishDiv';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { handleMyToggle } from '../Redux/Slice/game.slice';

import { RiDeleteBin2Line } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { useFormik } from 'formik'
import * as Yup from "yup";


const stripePromise = loadStripe("pk_test_51R8wmeQ0DPGsMRTSHTci2XmwYmaDLRqeSSRS2hNUCU3xU7ikSAvXzSI555Rxpyf9SsTIgI83PXvaaQE3pJAlkMaM00g9BdsrOB");

// FANCoin Component
const FANCoin = () => {
    const [openId, setOpenId] = useState(null);
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.user.currentUser.fanCoinTransactions);
    console.log("transactionssssss", transactions);
    const userId = localStorage.getItem("userId")
    useEffect(() => {
        dispatch(getFanCoinDetails(userId));
    }, [dispatch]);


    const formatDateTime = (inputDate) => {
        if (!inputDate) return "";
        const dateObj = new Date(inputDate);
        if (isNaN(dateObj.getTime())) return String(inputDate);

        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = dateObj.toLocaleString("en-US", { month: "short" });
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        return `${day} ${month} - ${hours}:${minutes}`;
    };


    return (
        <div className="px-3 sm:px-4 py-4 sm:py-6">
            {transactions.length > 0 ?
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 3xl:items-start items-strech">

                    {transactions
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order
                        .map((transaction) => (
                            <StylishDiv key={transaction.id || transaction._id || `${transaction.date}-${transaction.amount}-${transaction.type}`} className="group rounded-3xl overflow-hidden h-full ">
                                {/* <div className=" opacity-80  h-full min-h-[180px]" /> */}
                                <div className=" rounded-3xl min-h-[120px]  h-full">
                                    <div className='flex flex-col h-full'>
                                        <div className="flex  justify-between mb-2  ">
                                            <div className=''>
                                                <h3 className="font-bold text-white text-base sm:text-lg pr-4">
                                                    {(() => {
                                                        const description = transaction?.description;
                                                        if (description && description.startsWith("Earned from game purchase of $")) {
                                                            const priceString = description.substring("Earned from game purchase of $".length);
                                                            const price = parseFloat(priceString);
                                                            if (!isNaN(price)) {
                                                                const formattedPrice = price.toFixed(2);
                                                                return `Earned from game purchase of $${formattedPrice}`;
                                                            }
                                                        }
                                                        return description;
                                                    })()}
                                                </h3>
                                                <p className="text-gray-300 text-xs sm:text-sm mt-1">{formatDateTime(transaction?.date)}</p>
                                            </div>
                                            <span className={`font-bold text-base sm:text-lg whitespace-nowrap ${transaction.type === 'EARN' ? 'text-green-400' : 'text-red-400'}`}>
                                                {transaction?.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </StylishDiv>
                        ))}
                </div>
                :
                <div className="flex flex-col items-center justify-center  relative">

                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
               from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
               animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
               from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
               animate-pulse"></div>


                    <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
               relative overflow-hidden shadow-lg shadow-purple-500/30">
                        <img
                            src={lazyCatImage}
                            alt="Lazy Cat"
                            className="w-full h-full object-cover"
                        />
                    </div>


                    <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                        No transactions yet !
                    </h2>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        Complete tasks or purchases to see them here ✨
                    </p>
                </div>
            }

        </div>
    )
}

// UPICard Component
const UPICard = () => {
    return (
        <div className="flex flex-col items-center justify-center  px-3 sm:px-4 py-4 sm:py-6 ">

            {/* <div className=" -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
              from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
              animate-pulse"></div>
            <div className=" -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
              from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
              animate-pulse"></div> */}


            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
              relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>


            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                No transactions yet !
            </h2>
            <p className="text-gray-400 text-sm text-center mt-2">
                Complete tasks or purchases to see them here ✨
            </p>
        </div>
    )
}

// PlayStore Component
const PlayStore = () => {
    return (
        <div className="flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6 ">
            {/* 
            <div className=" -top-20 -right-20 w-40 h-40 bg-gradient-to-br 
                  from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div>
            <div className=" -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br 
                  from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 
                  animate-pulse"></div> */}


            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 
                  relative overflow-hidden shadow-lg shadow-purple-500/30">
                <img
                    src={lazyCatImage}
                    alt="Lazy Cat"
                    className="w-full h-full object-cover"
                />
            </div>


            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                No transactions yet !
            </h2>
            <p className="text-gray-400 text-sm text-center mt-2">
                Complete tasks or purchases to see them here ✨
            </p>
        </div>
    )
}

const StyleDiv = ({ children }) => {
    return (
        <div

            className="relative group bg-gradient-to-br from-[#1a1a2e]/80 to-[#16213e]/80 backdrop-blur-xl rounded-2xl p-3  border border-purple-500/30 shadow-lg hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden ds_height_manage"
        >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
            {children}
        </div>
    )
}
export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const { orders, loading: ordersLoading } = useSelector((state) => state.payment);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [activeMenu, setActiveMenu] = useState('profile');
    const [isActive, setIsActive] = useState("fanCoin");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [amountToPay, setAmountToPay] = useState(0);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        newPass: false,
        confirm: false,
    });
    const [passwordError, setPasswordError] = useState("");
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [showDeleteOtpModal, setShowDeleteOtpModal] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState(false)
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);
    const [btnLoader, setBtnLoader] = useState(false)

    // console.log("aaaaaa", currentUser)

    // user profile handling ------------------------------------------------------------------------------------------
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        gender: "",
    });

    const [profilePicFile, setProfilePicFile] = useState(null);
    useEffect(() => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (userId) {
            dispatch(getUserById(userId));
            dispatch(fetchProfile(userId));
        }
    }, [dispatch, authUser]);

    // Fetch orders when Orders menu is selected
    useEffect(() => {
        if (activeMenu === 'Orders') {
            dispatch(allorders());
        }
    }, [activeMenu, dispatch]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: decryptData(currentUser.name),
                username: decryptData(currentUser.username),
                email: decryptData(currentUser.email),
                bio: decryptData(currentUser.bio),
                gender: decryptData(currentUser.gender),
            });
            setUser(currentUser);
        } else {
            setUser(null);
        }
    }, [currentUser]);

    // show skeleton briefly when opening Transaction section
    useEffect(() => {
        if (activeMenu === 'Transaction') {
            setTransactionLoading(true);
            const timeoutId = setTimeout(() => setTransactionLoading(false), 600);
            return () => clearTimeout(timeoutId);
        }
        return undefined;
    }, [activeMenu, isActive]);


    // Handle edit mode toggle
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handlePasswordInput = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        setPasswordError("");
    };

    const togglePasswordVisibility = (key) => {
        setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const resetPasswordModal = () => {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPassword({ current: false, newPass: false, confirm: false });
        setPasswordError("");
    };

    const closeChangePasswordModal = () => {
        resetPasswordModal();
        setActiveMenu("profile");
    };

    const resetDeleteModal = () => {
        setIsDeletingAccount(false);
    };

    const closeDeleteAccountModal = () => {
        resetDeleteModal();
        setShowDeleteOtpModal(false);
    };

    const handleDeleteAccountConfirm = async () => {
        const ok = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!ok) return;
        try {
            setIsDeletingAccount(true);
            // TODO: Replace with real delete-account API when available
            await dispatch(logoutUser());
            dispatch(clearUser());
            localStorage.removeItem("userName");
            navigate("/");
            dispatch(handleMyToggle(false));
        } catch (e) {
            // noop: a snackbar can be added here if needed
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleSendDeleteOtp = async () => {
        // if (!deleteEmail) return;
        // try {
        //     setIsSendingOtp(true);
        //     // TODO: call API to send OTP for account deletion
        //     setShowDeleteOtpModal(false);
        //     setDeleteEmail("");
        //     // After OTP flow, you could proceed with deletion
        // } finally {
        //     setIsSendingOtp(false);
        // }

        setShowDeleteOtpModal(false);
        setDeleteOtp(true)

    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData;
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        // TODO: Wire to backend when endpoint is available
        closeChangePasswordModal();
        // Optionally show a toast/snackbar
    };

    const changePassVal = {
        currentPass: "",
        newPass: "",
        confirmPass: ""
    }

    const changePassSchema = Yup.object({
        currentPass: Yup.string()
            .required("Current password is required"),
        newPass: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("New password is required"),
        confirmPass: Yup.string()
            .oneOf([Yup.ref("newPass"), null], "Passwords must match")
            .required("Confirm password is required"),
    });

    const changePassFormik = useFormik({
        initialValues: changePassVal,
        validationSchema: changePassSchema,
        onSubmit: (values, action) => {
            setBtnLoader(true)
            dispatch(ChangePassSlice(values)).then((value)=>{
              if(value?.meta?.requestStatus === "fulfilled"){
                  setBtnLoader(false)
                  setActiveMenu("profile");
                }
            }).catch((error)=>{                
                setBtnLoader(false)
            }).finally(() => {
                setBtnLoader(false);
            });
            action.resetForm()
        }
    })

    const deleteOtpFormik = useFormik({
        initialValues:{
            otp0:"",
            otp1:"",
            otp2:"",
            otp3:""
        },
        validationSchema: Yup.object({
            otp0: Yup.string()
              .matches(/^[0-9]$/, "Must be a digit")
              .required("Required"),
            otp1: Yup.string()
              .matches(/^[0-9]$/, "Must be a digit")
              .required("Required"),
            otp2: Yup.string()
              .matches(/^[0-9]$/, "Must be a digit")
              .required("Required"),
            otp3: Yup.string()
              .matches(/^[0-9]$/, "Must be a digit")
              .required("Required"),
        }),
        onSubmit:(values , action)=>{
            let allOtp = values.otp0 + values.otp1 + values.otp2 + values.otp3
            // console.log("HIHI", typeof(allOtp));
            setBtnLoader(true)
            dispatch(DeleteUser(allOtp)).then((value)=>{
              if(value?.meta?.requestStatus === "fulfilled"){
                  setBtnLoader(false);
                  setDeleteOtp(false)
                  setActiveMenu("profile");
                  dispatch(logoutUser());
                  dispatch(clearUser())
                  localStorage.removeItem("userName");
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  navigate("/")
                  dispatch(handleMyToggle(false)) 
              }
            }).catch((error)=>{                
                setBtnLoader(false)
            }).finally(() => {
                setBtnLoader(false);
            });
            action.resetForm()
           
        }
    })

    const handleChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
          deleteOtpFormik.setFieldValue(`otp${index}`, value);
          if (value && index < 3) {
            inputsRef.current[index + 1]?.focus();
          }
        }
      };
    
      const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !deleteOtpFormik.values[`otp${index}`] && index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      };
      
    const verifyEmail = {
        email: ""
    }

    const verifyEmailFormik = useFormik({
        initialValues:verifyEmail,
        validationSchema: Yup.object({
            email: Yup.string()
              .email("Enter a valid email address")
              .required("Email is required"),
        }),
        onSubmit:(values , action)=>{
            setBtnLoader(true)
           dispatch(SendDeleteOtp(values))
           .then((value)=>{
              if(value?.meta?.requestStatus === "fulfilled"){
                   setShowDeleteOtpModal(false);
                   setDeleteOtp(true)
                   setBtnLoader(false)
                   action.resetForm()
                }
           }).catch((error)=>{                
               setBtnLoader(false)
           }).finally(() => {
            setBtnLoader(false);
           });
           
        }
    })


    // handle  input change 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle  dile change 
    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setProfilePicFile(file);
    };

    // handle update profile
    const handleUpdateProfile = async () => {
        const userId = authUser?._id || localStorage.getItem("userId");
        if (!userId) return;

        const payload = { ...formData };
        // Do not allow updating email from the client
        delete payload.email;
        if (profilePicFile) {
            payload.profilePic = profilePicFile;
        }

        try {
            await dispatch(editUserProfile({ userId, userData: payload })).unwrap().then((response) => {
                console.log(response.success);
                if (response.success) {
                    const userId = authUser?._id || localStorage.getItem("userId");
                    if (userId) {
                        dispatch(getUserById(userId));
                    }
                }
            });
            setIsEditing(false);
        } catch (err) {
            // noop - error snackbar handled in thunk
        }
    };
    const handleLogoutClick = async () => {
        const id = authUser?._id || currentUser?._id || localStorage.getItem("userId");
        dispatch(logoutUser());
        dispatch(clearUser())
        localStorage.removeItem("userName");
        navigate("/")
        dispatch(handleMyToggle(false))

    };

    const handleOrderClick = (order) => {
        console.log('Order clicked:', order);
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handlePaymentClick = async (order) => {
        console.log('Payment clicked for order:', order._id);

        try {
            // Close the order details modal
            setShowOrderDetails(false);

            // Show loading state
            setIsPaymentLoading(true);

            // Call the retry payment API to get a new client secret
            const resultAction = await dispatch(retryOrderPayment(order._id));

            if (retryOrderPayment.fulfilled.match(resultAction)) {
                const { clientSecret: newClientSecret, order: updatedOrder } = resultAction.payload;

                // Set the payment form state
                setClientSecret(newClientSecret);
                setCurrentOrderId(updatedOrder._id);
                setAmountToPay(updatedOrder.amount);
                setShowPaymentForm(true);
            } else {
                // Handle error
                console.error('Failed to initiate payment:', resultAction.error);
                alert('Failed to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('An error occurred while initiating payment. Please try again.');
        } finally {
            setIsPaymentLoading(false);
        }
    };
    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        setClientSecret("");
        setCurrentOrderId(null);
        setAmountToPay(0);

        // Refresh the orders list to show updated status
        if (activeMenu === 'Orders') {
            dispatch(allorders());
        }
    };

    // Loading state using skeleton
    if (loading) {
        return <ProfileSkeleton />;
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#ab99e1] text-black px-4 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Local user state is managed via setUser when currentUser changes


    return (
        <div className="  text-white md:max-w-[85%] max-w-[95%] mx-auto">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-white/25 ">
                <div className="flex items-center justify-between px-4 py-3">
                    <NavLink to="/" className="flex items-center gap-2 text-white hover:text-[#ab99e1] transition-colors">
                        <IoIosArrowBack className="w-6 h-6" />
                        <span className="text-lg font-medium">Back</span>
                    </NavLink>

                </div>
            </div>

            {/* Profile Content */}
            <div className='flex flex-col md:flex-row items-stretch min-h-[500px]'>
                {/* side menu section */}
                <div className='h-full px-4 md:py-6 py-4'>
                    <div className='xl:w-[300px] md:w-[200px] w-full'>
                        <ul className='p-3 capitalize'>
                            <li className={` mt-2 transition-all  duration-300 ease-in-out cursor-pointer hover:scale-[105%]   backdrop-blur-xl  ${activeMenu === "profile" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('profile') }}>
                                {(() => {
                                    const Tag = activeMenu === "profile" ? StyleDiv : "div";
                                    const style = activeMenu === "profile" ? "w-full h-[48px]" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style} >
                                            <div className={"flex items-center "}>
                                                <FaUserLarge className="h-5 w-5 me-3" />
                                                <p>profile</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            {/* <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "address" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('address') }}>
                                {(() => {
                                    const Tag = activeMenu === "address" ? StylishDiv : "div";
                                    const style = activeMenu === "address" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <IoLocation className="h-5 w-5 me-3" />
                                                <p>address</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li> */}
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "Transaction" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('Transaction') }}>
                                {(() => {
                                    const Tag = activeMenu === "Transaction" ? StyleDiv : "div";
                                    const style = activeMenu === "Transaction" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <GiTakeMyMoney className="h-5 w-5 me-3" />
                                                <p>Transaction</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "Orders" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('Orders') }}>
                                {(() => {
                                    const Tag = activeMenu === "Orders" ? StyleDiv : "div";
                                    const style = activeMenu === "Orders" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <BsBoxSeam className="h-5 w-5 me-3" />
                                                <p>Orders</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "changePassword" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('changePassword') }}>
                                {(() => {
                                    const Tag = activeMenu === "changePassword" ? StyleDiv : "div";
                                    const style = activeMenu === "changePassword" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <RiLockPasswordLine className="h-5 w-5 me-3" />
                                                <p>Change Password</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "deleteAccount" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('deleteAccount') }}>
                                {(() => {
                                    const Tag = activeMenu === "deleteAccount" ? StyleDiv : "div";
                                    const style = activeMenu === "deleteAccount" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <RiDeleteBin2Line className="h-5 w-5 me-3" />
                                                <p>Delete Account</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                            <li className={` mt-2 transition-all duration-300 ease-in-out cursor-pointer hover:scale-[105%] backdrop-blur-xl  ${activeMenu === "logout" ? "md:w-[105%]   " : "w-[100%]   "}`} onClick={() => { setActiveMenu('logout') }}>
                                {(() => {
                                    const Tag = activeMenu === "logout" ? StyleDiv : "div";
                                    const style = activeMenu === "logout" ? "w-full" : "p-3  bg-[#31244e] rounded-md";
                                    return (
                                        <Tag className={style}>
                                            <div className="flex items-center">
                                                <IoIosLogOut className="h-5 w-5 me-3" />
                                                <p>logout</p>
                                            </div>
                                        </Tag>
                                    );
                                })()}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* content data */}

                {/* profile */}
                {activeMenu === "profile" && (
                    <div className={`px-4 md:py-6 pt-4 pb-0 w-full `}>
                        {/* Profile Header */}
                        <div className=" rounded-2xl p-4 md:p-6 mb-6 border border-white/25">
                            <div className='flex justify-end'>

                                {isEditing ? (
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="bg-[#ab99e1] text-black px-3 py-1 rounded-lg hover:bg-white transition-colors ms-auto"
                                    >
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEditToggle}
                                        className="text-[#ab99e1] hover:text-white transition-colors ms-auto"
                                    >
                                        <MdEdit className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 rounded-full border-4 border-[#ab99e1] overflow-hidden">
                                        <img
                                            src={profilePicFile ? URL.createObjectURL(profilePicFile) : (user?.profilePic || stanUser)}
                                            className="w-full h-full object-cover object-top"
                                            alt="User Profile"
                                        />
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-[#ab99e1] text-black p-2 rounded-full hover:bg-white transition-colors cursor-pointer">
                                            <MdEdit className="w-4 h-4" />
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {decryptData(user?.name) || "user name"}
                                </h2>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className=" rounded-2xl p-4 md:p-6 mb-6 border border-white/25">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FaUser className="text-[#ab99e1]" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                    <FaUser className="text-[#ab99e1] text-md flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="md:text-sm text-xs text-gray-400 ">Name</div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your name"
                                                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                                maxLength={16}
                                            />
                                        ) : (
                                            <div className="text-white md:text-sm text-xs">{decryptData(user?.name) || "User"}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center  gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                    <MdEmail className="text-[#ab99e1] text-md flex-shrink-0" />
                                    <div className="flex-1 ">
                                        <div className="md:text-sm text-xs text-gray-400">Email</div>
                                        {/* {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                            />
                                        ) : (
                                            <div className="text-white">{decryptData(user?.email) || "example@gmail.com"}</div>
                                        )} */}
                                        <div className="text-white md:text-sm text-xs">{decryptData(user?.email) || "example@gmail.com"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                    <div className="text-[#ab99e1] text-md flex-shrink-0">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="md:text-sm text-xs text-gray-400">Referral Code</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-white md:text-sm text-xs font-mono bg-[#ab99e1]/10 px-2 py-1 rounded border border-[#ab99e1]/20">
                                                {user?.referralCode || "N/A"}
                                            </div>
                                            {user?.referralCode && (
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(user.referralCode);
                                                        // You can add a toast notification here
                                                    }}
                                                    className="text-[#ab99e1] hover:text-white transition-colors p-1"
                                                    title="Copy referral code"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {/* transaction */}
                {activeMenu === "Transaction" && (
                    <div className='px-4 md:py-6 pt-4 pb-0  w-full'>
                        {transactionLoading ? (
                            <TransactionHistorySkeleton />
                        ) : (
                            <section className='w-full  border border-white/25 rounded-2xl  sm:p-6 p-1 text-white flex flex-col'>
                                <div className=''>
                                    {/* Header */}
                                    <div className='flex items-center justify-between px-2 sm:px-4 py-4  backdrop-blur-xl sticky top-0 z-20 border-b border-white/25'>
                                        <div className='flex items-center gap-2 sm:gap-3'>
                                            {/* <button
                                             className='text-white rounded-full p-2 hover:bg-white/10 transition-colors'
                                             onClick={handleBackClick}
                                             aria-label='Go back'
                                         >
                                             <IoArrowBack className='w-5 h-5 sm:w-6 sm:h-6' />
                                         </button> */}
                                            <h1 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide'>Transaction History</h1>
                                        </div>
                                        <div className='bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-md'>
                                            <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                                                <span className='text-xs'></span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                                                    <path d="M256 512C391.31 512 501 397.385 501 256C501 114.615 391.31 0 256 0C120.69 0 11 114.615 11 256C11 397.385 120.69 512 256 512Z" fill="#E88102" />
                                                    <path d="M256 485C389.929 485 498.5 376.429 498.5 242.5C498.5 108.571 389.929 0 256 0C122.071 0 13.5 108.571 13.5 242.5C13.5 376.429 122.071 485 256 485Z" fill="#FDD835" />
                                                    <path d="M352.8 20.1L33.6002 339.2C22.9002 314.7 16.2002 288.1 14.2002 260.2L273.7 0.599976C301.6 2.69998 328.2 9.39998 352.8 20.1ZM467.3 123.5L137 453.8C116.4 442.2 97.8002 427.7 81.5002 410.8L424.4 68C441.2 84.2 455.7 102.9 467.3 123.5ZM414.5 58.9L72.5002 400.9C67.2002 394.7 62.1002 388.2 57.4002 381.5L395.1 43.8C401.8 48.5 408.3 53.6 414.5 58.9ZM490.9 182L195.5 477.4C186.6 475.1 177.9 472.3 169.4 469.1L482.6 155.9C485.8 164.4 488.6 173.1 490.9 182Z" fill="white" fill-opacity="0.313726" />
                                                    <path d="M498.5 242.5C498.5 244.2 498.5 245.8 498.4 247.5C495.8 115.9 388.3 10 256 10C123.7 10 16.2 115.9 13.6 247.5C13.6 245.8 13.5 244.2 13.5 242.5C13.5 108.6 122.1 0 256 0C389.9 0 498.5 108.6 498.5 242.5Z" fill="white" fill-opacity="0.313726" />
                                                    <path d="M453 253C453 357.9 367.9 443 263 443C204.1 443 151.4 416.1 116.5 374C151.2 411.5 200.8 435 256 435C360.9 435 446 349.9 446 245C446 199 429.7 156.9 402.5 124C433.8 157.9 453 203.2 453 253Z" fill="white" fill-opacity="0.313726" />
                                                    <path d="M256 435C360.934 435 446 349.934 446 245C446 140.066 360.934 55 256 55C151.066 55 66 140.066 66 245C66 349.934 151.066 435 256 435Z" fill="#F39E09" />
                                                    <path d="M400 121C366.7 92.3 323.4 75 276 75C171.1 75 86 160.1 86 265C86 312.4 103.3 355.7 132 389C91.6 354.1 66 302.6 66 245C66 140.1 151.1 55 256 55C313.5 55 365.1 80.6 400 121Z" fill="#E88102" />
                                                    <path d="M207.752 375.5C200.919 375.5 195.252 374.333 190.752 372C186.252 369.833 183.169 366.667 181.502 362.5C186.335 360.833 190.502 358.75 194.002 356.25C197.335 353.75 200.335 350.167 203.002 345.5C205.502 340.833 207.835 334.417 210.002 326.25C212.335 318.083 214.752 307.583 217.252 294.75L233.752 208.5H277.752L260.502 297.75C256.835 316.25 252.835 331.167 248.502 342.5C244.169 354 238.752 362.333 232.252 367.5C225.752 372.833 217.585 375.5 207.752 375.5ZM215.502 211.75L217.752 200.5H235.252L238.752 186C241.252 176 245.419 168.25 251.252 162.75C257.085 157.25 264.085 153.417 272.252 151.25C280.419 149.083 289.085 148 298.252 148C302.919 148 307.669 148.333 312.502 149C317.502 149.5 322.085 150.5 326.252 152C330.419 153.5 333.752 155.667 336.252 158.5C338.919 161.167 340.252 164.583 340.252 168.75C340.252 174.583 337.835 178.917 333.002 181.75C328.335 184.583 323.085 186 317.252 186C314.919 186 312.502 185.833 310.002 185.5C307.669 185 305.502 184.167 303.502 183C304.669 181 305.502 178.667 306.002 176C306.669 173.167 307.002 170.667 307.002 168.5C307.002 165.667 306.419 163.417 305.252 161.75C304.085 159.917 302.002 159 299.002 159C294.169 159 290.419 161.333 287.752 166C285.252 170.667 283.419 176.5 282.252 183.5L279.252 200.5H301.752L300.252 211.75H215.502Z" fill="#DB6704" />
                                                    <path d="M207.752 360.5C200.919 360.5 195.252 359.333 190.752 357C186.252 354.833 183.169 351.667 181.502 347.5C186.335 345.833 190.502 343.75 194.002 341.25C197.335 338.75 200.335 335.167 203.002 330.5C205.502 325.833 207.835 319.417 210.002 311.25C212.335 303.083 214.752 292.583 217.252 279.75L233.752 193.5H277.752L260.502 282.75C256.835 301.25 252.835 316.167 248.502 327.5C244.169 339 238.752 347.333 232.252 352.5C225.752 357.833 217.585 360.5 207.752 360.5ZM215.502 196.75L217.752 185.5H235.252L238.752 171C241.252 161 245.419 153.25 251.252 147.75C257.085 142.25 264.085 138.417 272.252 136.25C280.419 134.083 289.085 133 298.252 133C302.919 133 307.669 133.333 312.502 134C317.502 134.5 322.085 135.5 326.252 137C330.419 138.5 333.752 140.667 336.252 143.5C338.919 146.167 340.252 149.583 340.252 153.75C340.252 159.583 337.835 163.917 333.002 166.75C328.335 169.583 323.085 171 317.252 171C314.919 171 312.502 170.833 310.002 170.5C307.669 170 305.502 169.167 303.502 168C304.669 166 305.502 163.667 306.002 161C306.669 158.167 307.002 155.667 307.002 153.5C307.002 150.667 306.419 148.417 305.252 146.75C304.085 144.917 302.002 144 299.002 144C294.169 144 290.419 146.333 287.752 151C285.252 155.667 283.419 161.5 282.252 168.5L279.252 185.5H301.752L300.252 196.75H215.502Z" fill="#FDD835" />
                                                    <path d="M414.5 140.1C291.5 183.3 192.7 278.2 144.3 398.7C140.1 395.6 136 392.4 132 388.9C103.3 355.6 86 312.3 86 265C86 160.1 171.1 75 276 75C323.4 75 366.7 92.3 399.9 121C405.2 127.1 410 133.5 414.5 140.1Z" fill="white" fill-opacity="0.145098" />
                                                </svg>
                                            </div>
                                            <span className='font-semibold'>{currentUser.fanCoins.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Tabs */}
                                    <div className='flex items-center justify-between text-center text-sm md:text-lg  backdrop-blur-xl sm:px-4 px-2'>
                                        <div onClick={() => setIsActive("fanCoin")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "fanCoin" ? 'text-white' : 'text-gray-300'}`}>
                                            FAN Coins
                                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "fanCoin" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                        </div>
                                        <div onClick={() => setIsActive("UPI")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "UPI" ? 'text-white' : 'text-gray-300'}`}>
                                            UPI/ Cards
                                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "UPI" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                        </div>
                                        <div onClick={() => setIsActive("playStore")} className={`w-1/3 pt-4 cursor-pointer ${isActive === "playStore" ? 'text-white' : 'text-gray-300'}`}>
                                            Play Store
                                            <div className={`w-full h-1 mt-2 transition-all ease-in duration-500 ${isActive === "playStore" ? 'bg-[#aa98fe]' : "bg-transparent"} `}></div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className='flex-1 '>
                                        {
                                            isActive === "fanCoin" ? <FANCoin /> : isActive === "UPI" ? <UPICard /> : <PlayStore />
                                        }
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* Orders */}
                {activeMenu === "Orders" && (
                    <div className='px-4 md:py-6 pt-4 pb-0  w-full'>
                        <section className='w-full border border-white/25 rounded-2xl sm:p-6 p-1 text-white flex flex-col'>
                            <div className=''>
                                {/* Header */}
                                <div className='flex items-center justify-between px-2 sm:px-4 py-4 backdrop-blur-xl sticky top-0 z-20 border-b border-white/25'>
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        <h1 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide'>My Orders</h1>
                                    </div>
                                    <div className='bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-md'>
                                        <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                                            <span className='text-xs'>🛍️</span>
                                        </div>
                                        <span className='font-semibold'>{orders?.length || 0}</span>
                                    </div>
                                </div>

                                {/* Orders List */}
                                <div className='flex-1 overflow-y-auto pr-2 px-3 sm:px-4 py-4 sm:py-6'>
                                    {ordersLoading ? (
                                        <OrderListSkeleton count={orders?.length} />
                                    ) : !orders || orders.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center px-4 relative">
                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                                            <div className="w-48 h-48 rounded-full flex items-center justify-center mb-8 relative overflow-hidden shadow-lg shadow-purple-500/30">
                                                <img
                                                    src={lazyCatImage}
                                                    alt="No Orders"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                                                No orders yet!
                                            </h2>
                                            <p className="text-gray-400 text-sm text-center mt-2">
                                                Place your first order to see it here
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {orders?.map((order, index) => (
                                                <StylishDiv
                                                    key={order._id || index}
                                                    className="group rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-white/10 hover:border-white/20 active:scale-[0.98]"
                                                    onClick={() => handleOrderClick(order)}
                                                >
                                                    <div className="">
                                                        {/* Order Header */}
                                                        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
                                                            <div className="flex items-center gap-2 flex-shrink min-w-0">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-[#621df2] to-[#b191ff] rounded-full flex items-center justify-center">
                                                                    <span className="text-white font-bold text-xs">#{order._id?.slice(-4) || 'N/A'}</span>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className="font-bold text-white text-sm sm:text-base truncate">
                                                                        Order #{order._id?.slice(-8) || 'N/A'}
                                                                    </h3>
                                                                    <p className="text-gray-300 text-[10px] sm:text-xs whitespace-nowrap">
                                                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })} at {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className=" ">
                                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'paid' ? 'text-green-400 bg-green-400/10 border border-green-400/20' :
                                                                    order.status === 'created' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' :
                                                                        'text-red-400 bg-red-400/10 border border-red-400/20'
                                                                    }`}>
                                                                    {order.status === 'paid' ? '✅ Paid' :
                                                                        order.status === 'created' ? '⏳ Pending' :
                                                                            '❌ Failed'}
                                                                </span>
                                                                <div className="mt-1">
                                                                    <span className="text-lg sm:text-xl font-bold text-white">${order.originalAmount}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Order Items Preview */}
                                                        {order.items && order.items.length > 0 && (
                                                            <div className="mb-3">
                                                                <h4 className="text-gray-300 text-xs font-medium mb-2">Items ({order.items.length})</h4>
                                                                <div className="space-y-1">
                                                                    {order.items.slice(0, 2).map((item, itemIndex) => (
                                                                        <div key={itemIndex} className="flex items-center justify-between p-2 bg-white/5 rounded-lg gap-2">
                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                                                    <span className="text-white text-xs font-bold">{itemIndex + 1}</span>
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                    <p className="text-white font-medium text-xs truncate max-w-[140px] sm:max-w-[220px]">
                                                                                        {item.name || `Game ${itemIndex + 1}`}
                                                                                    </p>
                                                                                    <p className="text-gray-400 text-[10px] sm:text-xs">
                                                                                        {item.platform}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <p className="text-white font-semibold text-xs sm:text-sm">${item.price}</p>
                                                                                {item.downloadToken && (
                                                                                    <p className="text-green-400 text-[10px] sm:text-xs">
                                                                                        {item.downloadTokenUsed ? 'Downloaded' : 'Available'}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {order.items.length > 2 && (
                                                                        <div className="text-center py-1">
                                                                            <span className="text-gray-400 text-xs">
                                                                                +{order.items.length - 2} more items
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Order Footer */}
                                                        <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-2">
                                                            <div className="flex items-center gap-2 text-xs order-2 sm:order-1">
                                                                <span className="text-gray-300">
                                                                    {order.stripePaymentIntentId ? 'Stripe' : 'N/A'}
                                                                </span>
                                                                <span className="text-gray-300">
                                                                    {order.currency || 'USD'}
                                                                </span>
                                                            </div>
                                                            <button
                                                                className="flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-purple-500/30 hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-purple-500/20 w-full sm:w-auto order-1 sm:order-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    console.log('View details clicked for order:', order._id);
                                                                    handleOrderClick(order);
                                                                }}
                                                            >
                                                                <span className="text-purple-300 text-xs font-medium hover:text-white transition-colors">View details</span>
                                                                <svg className="w-3 h-3 text-purple-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </StylishDiv>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                        {showPaymentForm && clientSecret && currentOrderId && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                                    <h3 className="text-2xl font-bold mb-4 text-white">Complete Your Purchase</h3>
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <PaymentForm
                                            clientSecret={clientSecret}
                                            orderId={currentOrderId}
                                            amount={amountToPay}
                                            onPaymentSuccess={handlePaymentSuccess}
                                            fromCartPage={false}
                                        />
                                    </Elements>
                                    <button
                                        onClick={() => setShowPaymentForm(false)}
                                        className="mt-4 text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Change Password Modal */}
                <Transition appear show={activeMenu === "changePassword"} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closeChangePasswordModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold flex items-center justify-between">
                                        <span>Change Password</span>
                                        <button onClick={closeChangePasswordModal} className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <IoClose className="w-5 h-5" />
                                        </button>
                                    </Dialog.Title>

                                    <form onSubmit={changePassFormik.handleSubmit} className="mt-5 space-y-4">
                                        {/* Current Password */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm text-gray-300">Current Password</label>
                                            <div className="flex items-center gap-2 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                                <input
                                                    type={showPassword.current ? "text" : "password"}
                                                    name="currentPass"
                                                    value={changePassFormik.values.currentPass}
                                                    onChange={changePassFormik.handleChange}
                                                    onBlur={changePassFormik.handleBlur}
                                                    placeholder="Enter current password"
                                                    className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                                />
                                                <button type="button" onClick={() => togglePasswordVisibility("current")} className="text-gray-300 hover:text-white">
                                                    {showPassword.current ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {changePassFormik.touched.currentPass && changePassFormik.errors.currentPass && (<p className="text-red-400 text-sm">{changePassFormik.errors.currentPass}</p>)}
                                        </div>

                                        {/* New Password */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm text-gray-300">New Password</label>
                                            <div className="flex items-center gap-2 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                                <input
                                                    type={showPassword.newPass ? "text" : "password"}
                                                    name="newPass"
                                                    value={changePassFormik.values.newPass}
                                                    onChange={changePassFormik.handleChange}
                                                    onBlur={changePassFormik.handleBlur}
                                                    placeholder="Enter new password"
                                                    className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                                />
                                                <button type="button" onClick={() => togglePasswordVisibility("newPass")} className="text-gray-300 hover:text-white">
                                                    {showPassword.newPass ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {changePassFormik.touched.newPass && changePassFormik.errors.newPass && (<p className="text-red-400 text-sm">{changePassFormik.errors.newPass}</p>)}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm text-gray-300">Confirm New Password</label>
                                            <div className="flex items-center gap-2 p-3 bg-[#211f2a20] border border-white/25 rounded-lg overflow-hidden">
                                                <input
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    name="confirmPass"
                                                    value={changePassFormik.values.confirmPass}
                                                    onChange={changePassFormik.handleChange}
                                                    onBlur={changePassFormik.handleBlur}
                                                    placeholder="Re-enter new password"
                                                    className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                                                />
                                                <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="text-gray-300 hover:text-white">
                                                    {showPassword.confirm ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {changePassFormik.touched.confirmPass && changePassFormik.errors.confirmPass && (<p className="text-red-400 text-sm">{changePassFormik.errors.confirmPass}</p>)}
                                        </div>

                                        {passwordError && (
                                            <div className="text-red-400 text-sm">{passwordError}</div>
                                        )}

                                        <div className="mt-4 flex justify-end gap-3">
                                            <button type='button' className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20" onClick={closeChangePasswordModal}>
                                                Cancel
                                            </button>
                                            <button type='submit' disabled={btnLoader} className="px-4 py-2 rounded bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] text-white disabled:opacity-60 disabled:cursor-not-allowed">
                                                {btnLoader ? (
                                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                  "Change Password"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                {/* logout modal */}
                <Transition appear show={activeMenu === "logout"} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setActiveMenu("profile")}>
                        {/* Backdrop */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>

                        {/* Modal */}
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold">
                                        logout Account
                                    </Dialog.Title>
                                    <p className="mt-2 text-sm text-gray-300">
                                        are you sure ?
                                    </p>

                                    <div className="mt-5 flex justify-end gap-3">
                                        <button
                                            className="px-4 py-2 rounded bg-gradient-to-r from-[#621df2] to-[#b191ff] 
                             hover:from-[#8354f8] hover:to-[#9f78ff]   text-white"
                                            onClick={handleLogoutClick}
                                        >
                                            Logout
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
                                            onClick={() => setActiveMenu("profile")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                {/* Order Details Modal */}
                <Transition appear show={showOrderDetails} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setShowOrderDetails(false)}>
                        {/* Backdrop */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>

                        {/* Modal */}
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-3xl rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl max-h-[90vh] overflow-y-auto">
                                    {selectedOrder && (
                                        <>
                                            <Dialog.Title className="text-xl font-semibold flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#621df2] to-[#b191ff] rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">#{selectedOrder._id?.slice(-4) || 'N/A'}</span>
                                                    </div>
                                                    <span>Order Details</span>
                                                </div>
                                                <button
                                                    onClick={() => setShowOrderDetails(false)}
                                                    className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                                                >
                                                    <IoClose className="w-6 h-6" />
                                                </button>
                                            </Dialog.Title>

                                            <div className="space-y-6">
                                                {/* Order Header */}
                                                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl px-6 py-4 border border-white/10">
                                                    <div className="flex flex-wrap justify-between items-start">
                                                        <div className='mt-2'>
                                                            <h3 className="font-bold text-xl mb-2">
                                                                Order #{selectedOrder._id?.slice(-8) || 'N/A'}
                                                            </h3>
                                                            <p className="text-gray-300 text-sm">
                                                                {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })} at {new Date(selectedOrder.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="sm:text-right mt-2">
                                                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${selectedOrder.status === 'paid' ? 'text-green-400 bg-green-400/10 border border-green-400/20' :
                                                                selectedOrder.status === 'created' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' :
                                                                    'text-red-400 bg-red-400/10 border border-red-400/20'
                                                                }`}>
                                                                {selectedOrder.status === 'paid' ? '✅ Paid' :
                                                                    selectedOrder.status === 'created' ? '⏳ Pending' :
                                                                        '❌ Failed'}
                                                            </span>
                                                            <div className="mt-2">
                                                                <span className="text-3xl font-bold text-white">${selectedOrder.originalAmount.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                {selectedOrder.items && selectedOrder.items.length > 0 && (
                                                    <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                            <span>🎮 Order Items</span>
                                                            <span className="text-gray-400 text-sm">({selectedOrder.items.length})</span>
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {selectedOrder.items.map((item, index) => (
                                                                <div key={index} className="bg-white/5 rounded-lg px-4 py-2 border border-white/10">
                                                                    <div className="flex flex-wrap items-center justify-between">
                                                                        <div className="flex flex-wrap items-center gap-4 mt-2 mb-2">
                                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                                                <span className="text-white font-bold text-sm">{index + 1}</span>
                                                                            </div>
                                                                            <div>
                                                                                <h5 className="font-semibold text-white text-lg">
                                                                                    {item.name || `Game ${index + 1}`}
                                                                                </h5>
                                                                                <p className="text-gray-300 text-sm">
                                                                                    Platform: {item.platform}
                                                                                </p>
                                                                                {item.downloadToken && (
                                                                                    <div className="mt-2">
                                                                                        <p className="text-green-400 text-xs">
                                                                                            Download Token: {item.downloadToken.slice(0, 12)}...
                                                                                        </p>
                                                                                        <p className={`text-xs ${item.downloadTokenUsed ? 'text-red-400' : 'text-green-400'}`}>
                                                                                            Status: {item.downloadTokenUsed ? 'Downloaded' : 'Available for download'}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right mt-2 mb-2">
                                                                            <p className="font-bold text-white text-xl">${item.price}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Order Summary */}
                                                <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                                                    <h4 className="font-semibold text-lg mb-4">📋 Order Summary</h4>
                                                    <div className="space-y-3">
                                                        {/* Display original amount as Subtotal */}
                                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                            <span className="text-gray-300">Subtotal:</span>
                                                            <span className="text-white font-semibold">${selectedOrder.originalAmount?.toFixed(2) || '0.00'}</span>
                                                        </div>

                                                        {/* Display Fan Coin Discount if available and greater than 0 */}
                                                        {selectedOrder.fanCoinDiscount > 0 && (
                                                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                                <span className="text-gray-300">Fan Coin Discount:</span>
                                                                <span className="text-green-400 font-semibold">-${selectedOrder.fanCoinDiscount?.toFixed(2) || '0.00'}</span>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                            <span className="text-gray-300">Currency:</span>
                                                            <span className="text-white">{selectedOrder.currency || 'USD'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                            <span className="text-gray-300">Payment Method:</span>
                                                            <span className="text-white">{selectedOrder.stripePaymentIntentId ? 'Stripe' : 'N/A'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                            <span className="text-gray-300">Payment Intent:</span>
                                                            <span className="text-white text-sm">
                                                                {selectedOrder.stripePaymentIntentId ?
                                                                    selectedOrder.stripePaymentIntentId.slice(0, 12) + '...' :
                                                                    'N/A'
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="pt-3 border-t-2 border-white/20">
                                                            <div className="flex justify-between items-center">
                                                                {/* Display final amount as Total */}
                                                                <span className="text-white font-bold text-lg">Total:</span>
                                                                <span className="text-white font-bold text-2xl">${selectedOrder.amount?.toFixed(2) || '0.00'}</span>
                                                            </div>
                                                        </div>
                                                        {console.log(selectedOrder)}
                                                    </div>
                                                </div>

                                                {/* Payment Button for Unpaid Orders */}
                                                {selectedOrder.status !== 'paid' && (
                                                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                                                        <div className="text-center">
                                                            <div className="mb-4">
                                                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                    <span className="text-white text-2xl">💳</span>
                                                                </div>
                                                                <h4 className="font-semibold text-lg text-white mb-2">Payment Required</h4>
                                                                <p className="text-gray-300 text-sm mb-4">
                                                                    This order is pending payment. Complete your payment to access your games.
                                                                </p>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                                                                    <span className="text-gray-300">Order Total:</span>
                                                                    <span className="text-white font-bold text-lg">${selectedOrder.amount}</span>
                                                                </div>

                                                                <button
                                                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white sm:px-6 px-2 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    onClick={() => handlePaymentClick(selectedOrder)}
                                                                    disabled={isPaymentLoading}
                                                                >
                                                                    {isPaymentLoading ? (
                                                                        <>
                                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                                            <span>Processing...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span>💳</span>
                                                                            <span>Pay Now - ${selectedOrder.amount}</span>
                                                                        </>
                                                                    )}
                                                                </button>

                                                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                                                    <span>🔒</span>
                                                                    <span>Secure payment powered by Stripe</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                {/* Delete Account Section with action button */}
                {activeMenu === "deleteAccount" && (
                    <div className='px-4 md:py-6 pt-4 pb-0 w-full'>
                        <section className='w-full border border-white/25 rounded-2xl sm:p-6 p-4 text-white flex flex-col'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-lg sm:text-base md:text-lg lg:text-xl font-bold leading-tight tracking-wide'>Delete Account</h1>
                            </div>
                            <div className='mt-4 rounded-2xl p-4 md:p-6 relative overflow-hidden'>
                                <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-fuchsia-600/20 rounded-full blur-3xl" />
                                <h3 className='text-lg md:text-xl font-semibold mb-4'>When you delete your gaming account</h3>
                                <ul className='space-y-3 text-gray-300 text-sm md:text-base list-disc list-inside'>
                                    <li>Your shopping cart, wishlist, and order history will be permanently deleted.</li>
                                    <li>You will no longer be able to re-download or update any previously purchased games.</li>
                                    <li>All your saved payment methods will be removed.</li>
                                    <li>You will no longer receive game deals, exclusive offers, or store updates.</li>
                                    <li>Your customer profile, reviews, and preferences will not be recoverable.</li>
                                </ul>
                                <div className='mt-6'>
                                    <button
                                        onClick={() => setShowDeleteOtpModal(true)}
                                        className='w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] font-semibold text-white shadow-lg'
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Delete Account - OTP Modal (simple) */}
                <Transition appear show={showDeleteOtpModal} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closeDeleteAccountModal}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                                <Dialog.Panel className="w-full max-w-md rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold flex items-center justify-between">
                                        <span>Delete Account</span>
                                        <button onClick={closeDeleteAccountModal} className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <IoClose className="w-5 h-5" />
                                        </button>
                                    </Dialog.Title>
                                     <form onSubmit={verifyEmailFormik.handleSubmit} className='mt-4 space-y-4'>
                                         <input
                                             type='email'
                                             name='email'
                                             value={verifyEmailFormik.values.email}
                                             onChange={verifyEmailFormik.handleChange}
                                             onBlur={verifyEmailFormik.handleBlur}
                                             placeholder='Email'
                                             className='w-full p-3 bg-[#211f2a20] border border-white/25 rounded-lg outline-none text-white placeholder-gray-500'
                                         />
                                         {verifyEmailFormik.touched.email && verifyEmailFormik.errors.email && (<p className="text-red-400 text-sm">{verifyEmailFormik.errors.email}</p>)}
                                         <div className='flex gap-3 justify-between'>
                                             <button type='button' className='px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 w-1/2' onClick={closeDeleteAccountModal} disabled={isSendingOtp}>Cancel</button>
                                             <button type="submit" disabled={btnLoader} className="px-4 py-2 flex items-center justify-center rounded bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] text-white w-1/2 disabled:opacity-60 disabled:cursor-not-allowed">
                                                {btnLoader ? (
                                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                  "Send Otp"
                                                )}
                                             </button>
                                         </div>
                                     </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                <Transition appear show={deleteOtp} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setDeleteOtp(false)}>
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                        </Transition.Child>
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                                <Dialog.Panel className="w-full max-w-md rounded-xl border border-white/25 backdrop-blur-xl p-6 text-white shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold flex items-center justify-between">
                                        <span>Verify Otp</span>
                                        <button onClick={closeDeleteAccountModal} className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <IoClose className="w-5 h-5" />
                                        </button>
                                    </Dialog.Title>
                                      <form onSubmit={deleteOtpFormik.handleSubmit} className='mt-4 space-y-4'>
                                        <div className="flex justify-between sm:px-9 sx:px-9 px-2 pt-3">
                                           {[0, 1, 2, 3].map((index) => (
                                             <div key={index} className="flex flex-col items-center">
                                               <input
                                                 type="text"
                                                 maxLength="1"
                                                 name={`otp${index}`}
                                                 value={deleteOtpFormik.values[`otp${index}`]}
                                                 onChange={(e) => handleChange(e.target.value, index)}
                                                 onKeyDown={(e) => handleKeyDown(e, index)}
                                                 ref={(el) => (inputsRef.current[index] = el)}
                                                 className="sm:w-[60px] sm:h-[60px] h-[50px] w-[50px] text-center p-3 bg-[#211f2a20] border border-white/25 rounded-lg outline-none text-white placeholder-gray-500"
                                               />
                                               {deleteOtpFormik.touched[`otp${index}`] && deleteOtpFormik.errors[`otp${index}`] && (
                                                 <span className="text-red-400 text-sm mt-1">
                                                   {deleteOtpFormik.errors[`otp${index}`]}
                                                 </span>
                                               )}
                                             </div>
                                           ))}
                                         </div>
                                          <div className='flex gap-3 justify-between pt-5'>
                                              <button type='button' className='px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 w-1/2' onClick={()=> setDeleteOtp(false)} disabled={isSendingOtp}>Cancel</button>
                                              <button type="submit" disabled={btnLoader} className="px-4 py-2 flex items-center justify-center rounded bg-gradient-to-r from-[#621df2] to-[#b191ff] hover:from-[#8354f8] hover:to-[#9f78ff] text-white w-1/2 disabled:opacity-60 disabled:cursor-not-allowed">
                                                {btnLoader ? (
                                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                  "Send Otp"
                                                )}
                                             </button>
                                          </div>
                                       </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

            </div>

        </div>
    );
}