import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../images/login-bg.jpg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyOtp,
} from "../Redux/Slice/auth.slice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [activeForm, setActiveForm] = useState("login"); // login | signup | forgot | otp | reset
  const [resetEmail, setResetEmail] = useState(""); // ✅ store email across steps
  const navigate = useNavigate();

  // All form configs in one place
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
            navigate("/");
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
          <Field name="email" type="email" placeholder="Email" className="input input-bordered w-full" />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <Field name="password" type="password" placeholder="Password" className="input input-bordered w-full" />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <p
            className="cursor-pointer text-sm text-blue-300 mt-2 text-right"
            onClick={() => setActiveForm("forgot")}
          >
            Forgot password?
          </p>
          <button type="submit" className="btn w-full bg-[#110B24] text-white">Sign in</button>

          <p className="mt-2 text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
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
      initialValues: { name: "", email: "", password: "" },
      validationSchema: Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Min 6 characters").required("Required"),
      }),
      onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
        try {
          const res = await dispatch(register(values));
          if (res.meta.requestStatus === "fulfilled" && res.payload?.id) {
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
          <Field name="name" placeholder="Full Name" className="input input-bordered w-full" />
          <ErrorMessage name="name" component="div" className="text-red-500" />

          <Field name="email" placeholder="Email" className="input input-bordered w-full" />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <Field name="password" type="password" placeholder="Password" className="input input-bordered w-full" />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <button type="submit" className="btn w-full bg-[#110B24] text-white">Sign up</button>
          <p
            className="cursor-pointer text-sm text-blue-300 mt-2 text-center"
            onClick={() => setActiveForm("login")}
          >
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
            setResetEmail(values.email); // ✅ store email for later steps
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
          <Field name="email" placeholder="Enter your email" className="input input-bordered w-full" />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <button type="submit" className="btn w-full bg-[#110B24] text-white">Send OTP</button>
          <p
            className="cursor-pointer text-sm text-blue-300 mt-2 text-center"
            onClick={() => setActiveForm("login")}
          >
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
          const res = await dispatch(verifyOtp({ email: resetEmail, otp: values.otp })); // ✅ send email + otp
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
          <Field name="otp" placeholder="Enter OTP" className="input input-bordered w-full" />
          <ErrorMessage name="otp" component="div" className="text-red-500" />

          <button type="submit" className="btn w-full bg-[#110B24] text-white">Verify OTP</button>
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
            resetPassword({ email: resetEmail, newPassword: values.password }) // ✅ send email + new password
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
          <Field name="password" type="password" placeholder="New Password" className="input input-bordered w-full" />
          <ErrorMessage name="password" component="div" className="text-red-500" />

          <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="input input-bordered w-full" />
          <ErrorMessage name="confirmPassword" component="div" className="text-red-500" />

          <button type="submit" className="btn w-full bg-[#110B24] text-white">Reset Password</button>
        </>
      ),
    },
  };

  const { title, initialValues, validationSchema, onSubmit, render } = formConfigs[activeForm];

  return (
    <section className="relative min-h-screen bg-[#0b1020]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020]/80 via-[#2a0a4a]/60 to-[#3b0764]/70" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-md bg-white/20 p-8 shadow-2xl backdrop-blur-lg border border-white/30">
            <h1 className="mb-6 text-center text-3xl font-bold text-white">{title}</h1>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ status }) => (
                <Form className="space-y-4">
                  {render()}
                  {status?.error && (
                    <div className="text-red-500 text-center">{status.error}</div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
