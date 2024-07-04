import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showAddToList, setShowAddToList] = useState(true);

  return (
    <AppContext.Provider
      value={{
        userLocation,
        setUserLocation,
        showAddToList,
        setShowAddToList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
