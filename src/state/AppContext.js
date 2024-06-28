import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);

  return (
    <AppContext.Provider
      value={{
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
