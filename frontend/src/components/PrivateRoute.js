import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap a route with an allowed roles list, e.g.:
// <PrivateRoute roles={["ADMIN"]}><AdminProducts /></PrivateRoute>
export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
