import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState(null);
  const [mapSize, setMapSize] = useState("full");
  const [mapLayout, setMapLayout] = useState("bottom");
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [showMap, setShowMap] = useState(false);

  return (
    <MapContext.Provider
      value={{
        center,
        setCenter,
        zoom,
        setZoom,
        userLocation,
        setUserLocation,
        mapSize,
        setMapSize,
        mapLayout,
        setMapLayout,
        isMapVisible,
        setIsMapVisible,
        showMap,
        setShowMap,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
