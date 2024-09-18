import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

const ProtectedRoute = ({ children }) => {
  const [authSession, setAuthSession] = useState(null);

  useEffect(() => {
    const getAuthSession = async () => {
      const authSession = await fetchAuthSession();
      console.log("authSession -- ", authSession);
      setAuthSession(authSession);
    };
    getAuthSession();
  }, []);

  if (!authSession) {
    return (
      <Navigate to="/login" state={{ from: children.props.location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
