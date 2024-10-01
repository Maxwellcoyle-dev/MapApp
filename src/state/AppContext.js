import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [showDeletePlaceModal, setShowDeletePlaceModal] = useState(false);
  const [showSavePlaceModal, setShowSavePlaceModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [deviceType, setDeviceType] = useState(null);

  return (
    <AppContext.Provider
      value={{
        showDeletePlaceModal,
        setShowDeletePlaceModal,
        showSavePlaceModal,
        setShowSavePlaceModal,
        showCreateListModal,
        setShowCreateListModal,
        showDeleteListModal,
        setShowDeleteListModal,
        showEditListModal,
        setShowEditListModal,
        userLocation,
        setUserLocation,
        deviceType,
        setDeviceType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
