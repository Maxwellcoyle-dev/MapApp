import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState(null);

  return (
    <MapContext.Provider
      value={{
        center,
        setCenter,
        zoom,
        setZoom,
        userLocation,
        setUserLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
