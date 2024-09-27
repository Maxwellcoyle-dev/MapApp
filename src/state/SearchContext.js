import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [queryInput, setQueryInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [placeType, setPlaceType] = useState("establishment");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [locationAutoCompleteResults, setLocationAutoCompleteResults] =
    useState([]);
  const [searchLocation, setSearchLocation] = useState({
    coords: null,
    locality: null,
  });
  const [locationQueryInput, setLocationQueryInput] = useState("");
  const [globalSearch, setGlobalSearch] = useState(true);
  const [searchRadius, setSearchRadius] = useState(2);
  const [nearby, setNearby] = useState(true);

  return (
    <SearchContext.Provider
      value={{
        queryInput,
        setQueryInput,
        searchQuery,
        setSearchQuery,
        placeType,
        setPlaceType,
        selectedPlace,
        setSelectedPlace,
        autoCompleteResults,
        setAutoCompleteResults,
        globalSearch,
        setGlobalSearch,
        searchRadius,
        setSearchRadius,
        nearby,
        setNearby,
        locationAutoCompleteResults,
        setLocationAutoCompleteResults,
        locationQueryInput,
        setLocationQueryInput,
        searchLocation,
        setSearchLocation,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
