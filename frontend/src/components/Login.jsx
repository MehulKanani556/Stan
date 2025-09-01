import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import loginBg from "../images/login-bg.jpg";
import loginBg from "../images/login-bg-video.mp4";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from "../Redux/Slice/auth.slice";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slice/user.slice";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to conditionally join Tailwind CSS classes
function cn(...args) {
  return args.filter(Boolean).join(' ');
}

// Reusable component for form inputs with a floating label and icon
const InputWithIcon = ({ id, label, type, icon, isPassword, showPassword, onToggleShowPassword, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || props.value;

  return (
      <div className="relative mb-6" >
        <div className="relative">
          {/* Floating label */}
          <label
            htmlFor={id}
            className={`absolute left-0 top-1/2 -translate-y-1/2 transform text-gray-400 pointer-events-none transition-all duration-300 ${isFloating ? '-top-5 text-xs text-gray-200 drop-shadow-md font-medium' : 'pl-10'}`}
          >
            {label}
          </label>
          {/* Input icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
          {/* Formik Field */}
          <Field
            id={id}
            name={props.name}
            type={isPassword && showPassword ? "text" : type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/10 bg-gray-800/40 text-gray-200 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300 shadow-inner"
            placeholder={label}
            {...props}
          />
          {/* Password toggle button */}
          {isPassword && (
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        <ErrorMessage name={props.name} component="div" className="text-red-400 text-sm mt-1" />
      </div>
  );
};

// New components for the background animation, integrated into this file
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
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
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
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
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
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
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

  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex items-center w-full justify-center overflow-hidden",
        "h-screen md:h-screen"
      )}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={loginBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
  
      {/* Foreground Content */}
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
  const [activeForm, setActiveForm] = useState("login"); // login | signup | forgot | otp | reset
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          const res = await dispatch(login(values));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.id) {
            console.log("Login successful:", res?.payload?.name);
            navigate("/");
            dispatch(setUser({ name: res?.payload?.name }));
            resetForm();
          } else {
            setStatus({ error: "Invalid credentials" });
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: () => (
        <>
          <InputWithIcon
            id="login-email"
            label="Email"
            type="email"
            name="email"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          />
          <InputWithIcon
            id="login-password"
            label="Password"
            type="password"
            name="password"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={togglePasswordVisibility}
          />
          <p
            className="cursor-pointer text-sm text-blue-300 mt-2 text-right hover:text-blue-200 transition-colors"
            onClick={() => setActiveForm("forgot")}
          >
            Forgot password?
          </p>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">Sign in</button>
          <p className="mt-2 text-center text-sm text-slate-300">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-blue-300 hover:text-blue-200"
              onClick={() => setActiveForm("signup")}
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
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          />
          <InputWithIcon
            id="signup-email"
            label="Email"
            type="email"
            name="email"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          />
          <InputWithIcon
            id="signup-password"
            label="Password"
            type="password"
            name="password"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
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
          <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">Sign up</button>
          <p className="cursor-pointer text-sm text-blue-300 mt-2 text-center hover:text-blue-200" onClick={() => setActiveForm("login")}>
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
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">Send OTP</button>
          <p className="cursor-pointer text-sm text-blue-300 mt-2 text-center hover:text-blue-200" onClick={() => setActiveForm("login")}>
            Back to Login
          </p>
        </>
      ),
    },
    otp: {
      title: "Verify OTP",
      initialValues: { otp: "" },
      validationSchema: Yup.object({
        otp: Yup.string().length(4, "Enter 4-digit OTP").required("Required"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          const res = await dispatch(verifyOtp({ email: resetEmail, otp: values.otp }));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.success) {
            setActiveForm("reset");
            resetForm();
          } else {
            setStatus({ error: "Invalid OTP" });
          }
        } finally {
          setSubmitting(false);
        }
      },
      render: () => (
        <>
          <p className="text-sm text-gray-300 text-center mb-4">
            A 4-digit code has been sent to **{resetEmail}**.
          </p>
          <InputWithIcon
            id="otp"
            label="Enter OTP"
            type="text"
            name="otp"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check text-gray-400"><path d="M20 13c0 5-2.5 7-10 7-1.4 0-2.4-.4-4.5-1.7" /><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">Verify OTP</button>
        </>
      ),
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
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
            isPassword
            showPassword={showPassword}
            onToggleShowPassword={togglePasswordVisibility}
          />
          <InputWithIcon
            id="reset-confirm-password"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-check text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><path d="m15 16 2 2 4-4" /></svg>}
            isPassword
            showPassword={showConfirmPassword}
            onToggleShowPassword={toggleConfirmPasswordVisibility}
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">Reset Password</button>
        </>
      ),
    },
  };

  const { title, initialValues, validationSchema, onSubmit, render } = formConfigs[activeForm];

  return (
    <BackgroundBeamsWithCollision className="z-10">
      <div className="relative bg-gray-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl w-full max-w-sm border-2 border-white/10 z-20 glass-form">
        <h1 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg">
          {title}
        </h1>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ status, isSubmitting }) => (
            <Form className="space-y-4">
              {render()}
              {status?.error && (
                <div className="text-red-400 text-center mt-4 p-2 rounded-xl bg-red-800/80 shadow-lg">{status.error}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Login;
