import React, { createContext, useState, useEffect } from "react";

export const PlacesSearchContext = createContext(null);

export const PlacesSearchContextProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const handleBoundsChange = (newBounds) => {
      setBounds(newBounds);
    };

    window.addEventListener("boundsChanged", handleBoundsChange);

    return () => {
      window.removeEventListener("boundsChanged", handleBoundsChange);
    };
  }, []);

  const value = {
    query,
    setQuery,
    bounds,
    setBounds,
  };

  return (
    <PlacesSearchContext.Provider value={value}>
      {children}
    </PlacesSearchContext.Provider>
  );
};
