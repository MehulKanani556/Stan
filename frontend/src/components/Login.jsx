import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaShieldAlt, FaLockOpen } from "react-icons/fa";
import PuzzleCaptcha from "./PuzzleCaptcha";

import loginBg from "../images/login-bg-video.mp4";
import { ReactComponent as YOYO_LOGO } from "../images/YOYO-LOGO.svg"
import {
  forgotPassword,
  googleLogin,
  login,
  preLogin,
  register,
  resetPassword,
  verifyOtp,
} from "../Redux/Slice/auth.slice";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slice/user.slice";
import { motion, AnimatePresence } from "framer-motion";
import { handleMyToggle } from "../Redux/Slice/game.slice";
import {  useGoogleLogin } from "@react-oauth/google";


function cn(...args) {
  return args.filter(Boolean).join(' ');
}


const InputWithIcon = ({ id, label, type, icon, isPassword, showPassword, onToggleShowPassword, ...props }) => {
  return (
    <div className="mb-4 sm:mb-6">

      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      <div className="relative">

        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <div className="text-white drop-shadow-sm">
            {icon}
          </div>
        </div>


        <Field
          id={id}
          name={props.name}
          type={isPassword && showPassword ? "text" : type}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 backdrop-blur-sm"
          placeholder={`Enter ${label.toLowerCase()}`}
          {...props}
        />


        {isPassword && (
          <button
            type="button"
            onClick={onToggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>

      <ErrorMessage name={props.name} component="div" className="text-red-400 text-sm mt-1" />
    </div>
  );
};


const Explosion = ({ ...props }) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-100 to-purple-200"
        />
      ))}
    </div>
  );
};

const CollisionMechanism = ({ parentRef, containerRef, beamOptions = {} }) => {
  const beamRef = useRef(null);
  const [collision, setCollision] = useState({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-100 via-purple-200 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const BackgroundBeamsWithCollision = ({ children, className }) => {
  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const generateBeams = () => {
    const beamCount = Math.min(12, Math.floor(screenWidth / 100));
    const beams = [];

    for (let i = 0; i < beamCount; i++) {
      const position = (i / Math.max(1, beamCount - 1)) * (screenWidth - 100) + 50;
      const variation = (Math.random() - 0.5) * 30;
      const finalPosition = Math.max(50, Math.min(screenWidth - 50, position + variation));

      beams.push({
        initialX: finalPosition,
        translateX: finalPosition,
        duration: Math.random() * 4 + 6,
        repeatDelay: Math.random() * 3 + 4,
        delay: Math.random() * 2,
        className: `h-${Math.floor(Math.random() * 8) + 8}`,
      });
    }
    return beams;
  };

  const beams = generateBeams();

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex items-center w-full justify-center overflow-hidden",
        "min-h-screen py-4 sm:py-0"
      )}
    >
      {/* Starry sky background */}
      <div className="absolute inset-0 stars-background">
        {[...Array(500)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`
            }}
          />
        ))}
      </div>

      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={loginBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}

      <div
        ref={containerRef}
        className="absolute bottom-0 w-full inset-x-0 pointer-events-none z-30"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

const Login = () => {
  const dispatch = useDispatch();
  const [activeForm, setActiveForm] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginVerified, setLoginVerified] = useState(false);
  const [pendingUserName, setPendingUserName] = useState("");
  const [pendingCreds, setPendingCreds] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCaptchaSuccess = async () => {
    setIsCaptchaSolved(true);
    setCaptchaError("");
    if (loginVerified) {
      try {
        if (!pendingCreds) return;
        const res = await dispatch(login(pendingCreds));
        if (res.meta.requestStatus === "fulfilled" && res.payload?.id) {
          navigate("/");
          dispatch(handleMyToggle(true));
          if (pendingUserName) {
            dispatch(setUser({ name: pendingUserName }));
          }
        } else {
          setCaptchaError("Session expired. Please try again.");
          setShowCaptcha(false);
          setLoginVerified(false);
        }
      } catch (e) {
        setCaptchaError("Login failed. Please try again.");
        setShowCaptcha(false);
        setLoginVerified(false);
      }
    }
  };

  const handleCaptchaFailure = () => {
    setIsCaptchaSolved(false);
    setCaptchaError("Please complete the captcha to continue");
  };

  const resetCaptcha = () => {
    setIsCaptchaSolved(false);
    setCaptchaError("");
    setShowCaptcha(false);
    setLoginVerified(false);
  };

  const formConfigs = {
    login: {
      title: "Sign In",
      initialValues: { email: "", password: "" },
      validationSchema: Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Min 6 characters").required("Required"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          // Step 1: Pre-verify credentials only (no tokens/session yet)
          const res = await dispatch(preLogin(values));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.id) {
            // Show captcha now; do not navigate yet
            setShowCaptcha(true);
            setLoginVerified(true);
            setIsCaptchaSolved(false);
            setPendingUserName(res?.payload?.name || "");
            setPendingCreds(values);
            setStatus({ error: "Please complete the captcha verification" });
            return;
          } else {
            setStatus({ error: "Invalid credentials" });
            setIsCaptchaSolved(false);
            setShowCaptcha(false);
            setLoginVerified(false);
            setPendingCreds(null);
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: (formik) => (
        <>
          <InputWithIcon
            id="login-email"
            label="Email"
            type="email"
            name="email"
            icon={<FaEnvelope size={20} />}
          />
          <InputWithIcon
            id="login-password"
            label="Password"
            type="password"
            name="password"
            icon={<FaLock size={20} />}
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={togglePasswordVisibility}
          />
          <p
            className="cursor-pointer text-sm text-blue-300 mt-2 text-right hover:text-blue-200 transition-colors"
            onClick={() => {
              setActiveForm("forgot");
              resetCaptcha();
            }}
          >
            Forgot password?
          </p>
          
          {/* Show captcha only AFTER successful password verification */}
          {showCaptcha && (
            <div className="mt-4">
              <PuzzleCaptcha
                sliderBarTitle="Slide to verify"
                cardTitle="Complete the puzzle to continue"
                initialColor="#3B82F6"
                successColor="#22C55E"
                imageWidth={340}
                imageHeight={170}
                pieceWidth={56}
                pieceHeight={56}
                tolerance={12}
                showResetBtn={true}
                onSuccess={handleCaptchaSuccess}
                onFailure={handleCaptchaFailure}
              />
              {captchaError && (
                <div className="text-red-400 text-sm mt-2 text-center">
                  {captchaError}
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={showCaptcha && !isCaptchaSolved}
            className={`group relative inline-flex w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 hover:scale-105 ${
              showCaptcha && !isCaptchaSolved ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)]" />
            <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700">
              <span className="mr-2">Sign in</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <p className="mt-2 text-center text-sm text-slate-300">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-blue-300 hover:text-blue-200"
              onClick={() => {
                setActiveForm("signup");
                resetCaptcha();
              }}
            >
              Sign up
            </span>
          </p>
        </>
      ),
    },
    signup: {
      title: "Sign Up",
      initialValues: { name: "", email: "", password: "", agreeToTerms: false },
      validationSchema: Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Min 6 characters").required("Required"),
        agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the Terms of Service"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          const res = await dispatch(register(values));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.success) {
            navigate("/");
            dispatch(handleMyToggle(true))
            resetForm();
          } else {
            setStatus({ error: "Signup failed. Try again." });
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: () => (
        <>
          <InputWithIcon
            id="signup-name"
            label="Full Name"
            type="text"
            name="name"
            icon={<FaUser size={20} />}
          />
          <InputWithIcon
            id="signup-email"
            label="Email"
            type="email"
            name="email"
            icon={<FaEnvelope size={20} />}
          />
          <InputWithIcon
            id="signup-password"
            label="Password"
            type="password"
            name="password"
            icon={<FaLock size={20} />}
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={togglePasswordVisibility}
          />
          <div className="flex items-start space-x-2 mt-4">
            <Field name="agreeToTerms" type="checkbox" className="w-4 h-4 text-green-600 bg-gray-100 rounded border-gray-300 focus:ring-green-500" />
            <label className="text-sm text-gray-300">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
              >
                Terms of Service
              </a>
            </label>
          </div>
          <ErrorMessage name="agreeToTerms" component="div" className="text-red-400 text-sm mt-1" />
          <button 
            type="submit" 
            className={`group relative inline-flex w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 hover:scale-105 ${
              ''
            }`}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)]" />
            <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl px-6 py-2.5  text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700">
              <span className="mr-2">Sign up</span>
              <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
          </button>
          <p className="cursor-pointer text-sm text-blue-300 mt-2 text-center hover:text-blue-200" onClick={() => {
            setActiveForm("login");
            resetCaptcha();
          }}>
            Already have an account? Login
          </p>
        </>
      ),
    },
    forgot: {
      title: "Forgot Password",
      initialValues: { email: "" },
      validationSchema: Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          const res = await dispatch(forgotPassword(values));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.success) {
            setResetEmail(values.email);
            setActiveForm("otp");
            resetForm();
          } else {
            setStatus({ error: res.payload?.message || "Failed to send OTP" });
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: () => (
        <>
          <p className="text-sm text-gray-300 text-center mb-4">
            Enter your email and we'll send a verification code.
          </p>
          <InputWithIcon
            id="forgot-email"
            label="Email"
            type="email"
            name="email"
            icon={<FaEnvelope size={20} />}
          />
          <button type="submit" className="group relative inline-flex  w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 hover:scale-105">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)]" />
            <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl px-6 py-2.5  text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700">
              <span className="mr-2">Send OTP</span>
              <svg className="w-4 h-4 transform group-hover:animate-bounce transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          </button>
          <p className="cursor-pointer text-sm text-blue-300 mt-2 text-center hover:text-blue-200" onClick={() => {
            setActiveForm("login");
            resetCaptcha();
          }}>
            Back to Login
          </p>
        </>
      ),
    },
    otp: {
      title: "Verify OTP",
      render: () => {
        const OtpInput = () => {
          const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
          const [error, setError] = useState("");
          const [isLoading, setIsLoading] = useState(false);
          const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

          const handleOtpChange = (index, value) => {
            const newOtpInputs = [...otpInputs];
            newOtpInputs[index] = value.replace(/\D/g, ""); // only digits
            setOtpInputs(newOtpInputs);
            setError("");

            if (value && index < 3) {
              otpRefs[index + 1].current.focus();
            }
          };

          const handleOtpKeyDown = (index, e) => {
            if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
              otpRefs[index - 1].current.focus();
            }
          };

          const handlePaste = (e) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData("text").slice(0, 4);
            const digits = pastedText.split("").map((c) => (/\d/.test(c) ? c : ""));
            const newOtp = [...otpInputs];
            digits.forEach((d, i) => {
              if (i < 4) newOtp[i] = d;
            });
            setOtpInputs(newOtp);

            const lastIndex = digits.length - 1;
            if (lastIndex >= 0 && lastIndex < 4) {
              otpRefs[lastIndex].current.focus();
            }
          };

          const verifyOtpHandler = async () => {
            const otp = otpInputs.join("");
            if (otp.length !== 4) {
              setError("Please enter a 4-digit OTP");
              return;
            }

            setIsLoading(true);
            setError("");

            try {
              const res = await dispatch(verifyOtp({ email: resetEmail, otp })).unwrap();

              if (res?.success) {
                setActiveForm("reset");
              } else {
                setError(res?.message || "Invalid OTP. Please try again.");
              }
            } catch (err) {
              setError(err?.message || "Something went wrong. Try again.");
              console.error("OTP Verification Error:", err);
            } finally {
              setIsLoading(false);
            }
          };

          return (
            <>
              <div className="flex justify-center space-x-2 mb-4">
                {otpInputs.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onPaste={index === 0 ? handlePaste : undefined}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-white bg-white/10 border border-white/30 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 
                               transition-all duration-300"
                  />
                ))}
              </div>

              {error && (
                <div className="text-red-400 text-center mb-4 p-2 rounded-xl bg-red-800/80 shadow-lg">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={verifyOtpHandler}
                disabled={isLoading}
                className="group relative inline-flex w-full overflow-hidden rounded-xl p-[1px] 
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                           focus:ring-offset-slate-50 transition-all duration-300 hover:scale-105 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
                               bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)]" />
                <span className="relative inline-flex h-full w-full items-center justify-center rounded-xl 
                                 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-300">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 
                             0 5.373 0 12h4zm2 5.291A7.962 
                             7.962 0 014 12H0c0 3.042 1.135 
                             5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <span className="mr-2">Verify OTP</span>
                      <svg
                        className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 
                             9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </>
          );
        };

        return (
          <>
            <p className="text-sm text-gray-300 text-center mb-4">
              A 4-digit code has been sent to <b>{resetEmail}</b>.
            </p>
            <OtpInput />
          </>
        );
      },
    },

    reset: {
      title: "Set New Password",
      initialValues: { password: "", confirmPassword: "" },
      validationSchema: Yup.object({
        password: Yup.string().min(6, "Min 6 characters").required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Required"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          const res = await dispatch(
            resetPassword({ email: resetEmail, newPassword: values.password })
          );
          if (res.meta.requestStatus === "fulfilled" && res.payload?.success) {
            setActiveForm("login");
            resetForm();
          } else {
            setStatus({ error: "Reset password failed. Try again." });
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: () => (
        <>
          <InputWithIcon
            id="reset-password"
            label="New Password"
            type="password"
            name="password"
            icon={<FaLock size={20} />}
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={togglePasswordVisibility}
          />
          <InputWithIcon
            id="reset-confirm-password"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            icon={<FaLockOpen size={20} />}
            isPassword
            showPassword={showConfirmPassword}
            onToggleShowPassword={toggleConfirmPasswordVisibility}
          />
          <button type="submit" className="group relative inline-flex  w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 hover:scale-105">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#8B5CF6_25%,#EC4899_50%,#8B5CF6_75%,#3B82F6_100%)]" />
            <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl px-6 py-2.5  text-sm font-semibold text-white backdrop-blur-3xl transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700">
              <span className="mr-2">Reset Password</span>
              <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>

          </button>
        </>
      ),
    },
  };

  const { title, initialValues, validationSchema, onSubmit, render } = formConfigs[activeForm];


  // google login
  const googleLoginn = useGoogleLogin({
    onSuccess: async (credentialResponse)=>{
      console.log(credentialResponse);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
          headers:{
            Authorization:`Bearer ${credentialResponse.access_token}`
          }
        });
        const data = await res.json();
        console.log(data);
        const {name, email, sub, picture } = data;
        dispatch(googleLogin({name, email, uid: sub, picture})).then((res)=>{
          console.log("aa",res);
          if(res.meta.requestStatus === 'fulfilled'){
            navigate('/');
          }
        });
      } catch (error) {
        console.error('Google Login Fetch Error:', error);
      }
    },
    onError: (error)=>{
      console.error('Google Login Failed', error);
    },
    flow: 'implicit', // Use implicit flow to handle popup blocking
  })

  return (
    <BackgroundBeamsWithCollision className="z-10 relative">
      <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 rounded-3xl w-[90%] max-w-lg mx-auto z-20 shadow shadow-white/50">
        <div className="absolute top-0 left-0 h-full w-full backdrop-blur-sm p-4 sm:p-6 md:p-8 lg:p-10 rounded-3xl max-w-lg mx-auto z-0 shadow shadow-white/50"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 p-2 bg-black border rounded-full">

              <YOYO_LOGO className="svg-current-color h-full w-full text-white" style={{ fill: 'currentColor', stroke: 'currentColor' }} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-white drop-shadow-lg">
            {title}
          </h1>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className="space-y-3 sm:space-y-4">
                {render(formik)}
                {formik.status?.error && (
                  <div className="text-red-400 text-center mt-4 p-2 rounded-xl bg-red-800/80 shadow-lg">{formik.status.error}</div>
                )}
              </Form>
            )}
          </Formik>


          {activeForm === "login" || activeForm === "signup" ?
            <div className="mt-4 sm:mt-6">
              <button onClick={() => googleLoginn()} className="btn bg-gradient-to-r from-gray-50 to-white text-black border-[#e5e5e5] w-full py-2.5 sm:py-3 rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                <span>{title} with Google</span>
              </button>
             
            </div>
            :
            ""
          }
        </div>
      </div>

    </BackgroundBeamsWithCollision>
  );
};

export default Login;
