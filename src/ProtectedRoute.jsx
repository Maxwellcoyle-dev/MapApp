import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./state/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext(); // Custom hook to check if user is authenticated

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: children.props.location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
