import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const useMapContext = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState({
    placeId: "",
    name: "",
    location: { lat: 0, lng: 0 },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(12);
  const [userLocation, setUserLocation] = useState(null);

  return (
    <MapContext.Provider
      value={{
        selectedPlace,
        setSelectedPlace,
        searchQuery,
        setSearchQuery,
        autoCompleteResults,
        setAutoCompleteResults,
        searchResults,
        setSearchResults,
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
