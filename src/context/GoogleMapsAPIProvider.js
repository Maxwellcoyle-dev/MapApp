// GoogleMapsAPIProvider.js
import React, { createContext, useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export const GoogleMapsAPIContext = createContext(null);

export const GoogleMapsAPIProvider = ({ children }) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      libraries: ["places"],
    });

    loader.load().then(() => {
      setIsApiLoaded(true);
    });
  }, []);

  const value = {
    isApiLoaded,
    setIsApiLoaded,
    bounds,
    setBounds, // Make sure to provide a way to update bounds
  };

  return (
    <GoogleMapsAPIContext.Provider value={value}>
      {children}
    </GoogleMapsAPIContext.Provider>
  );
};
