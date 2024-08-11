import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [showAddToList, setShowAddToList] = useState(false);
  const [showDeletePlaceModal, setShowDeletePlaceModal] = useState(false);
  const [showSavePlaceModal, setShowSavePlaceModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  return (
    <AppContext.Provider
      value={{
        userLocation,
        setUserLocation,
        showAddToList,
        setShowAddToList,
        showDeletePlaceModal,
        setShowDeletePlaceModal,
        showSavePlaceModal,
        setShowSavePlaceModal,
        showCreateListModal,
        setShowCreateListModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
