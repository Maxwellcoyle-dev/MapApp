import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

const ProtectedRoute = () => {
  const [authStatus, setAuthStatus] = useState("loading");

  useEffect(() => {
    const getAuthSession = async () => {
      try {
        await fetchAuthSession();
        setAuthStatus("authenticated");
      } catch (error) {
        setAuthStatus("unauthenticated");
      }
    };
    getAuthSession();
  }, []);

  if (authStatus === "loading") {
    return null; // or a loading spinner
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
