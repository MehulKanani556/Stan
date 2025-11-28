import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  // Adjust this selector to your auth slice
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("yoyoToken");
  const userId = localStorage.getItem("yoyouserId");

  if (!token && !userId) {
    return (
      <Navigate to="/login" replace />
    );
  }

  // If a requiredRole is specified and user doesn't match, redirect
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
