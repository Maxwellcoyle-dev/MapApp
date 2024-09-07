import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [queryInput, setQueryInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("nearby");

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
        searchResults,
        setSearchResults,
        searchType,
        setSearchType,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
