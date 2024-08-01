import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      const attributes = await fetchUserAttributes();
      console.log("Attributes: ", attributes);
      setUser({ ...userData, ...attributes });
    } catch (error) {
      console.error("Failed to fetch user attributes", error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
