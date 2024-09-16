// Libaries
import React, { useState } from "react";

// Components
import SearchNav from "./SearchNav/SearchNav";
import FilterMenu from "./SearchFilters/FilterMenu";
import LocationSearchForm from "./SearchFilters/LocationSearchForm";
import NearbySearchForm from "./SearchFilters/NearbySearchForm";
import LocationInput from "./LocationInput/LocationInput";

// State
import { useMapContext } from "../../state/MapContext";
import { useSearchContext } from "../../state/SearchContext";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [locationSearchType, setLocationSearchType] = useState("city");

  const { showMap } = useMapContext();
  const { searchType, setSearchType, nearby } = useSearchContext();

  return (
    <div
      className={
        showMap ? styles.searchBarContainer_Map : styles.searchBarContainer_List
      }
    >
      <SearchNav />
      <FilterMenu
        searchType={searchType}
        setSearchType={setSearchType}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      {!nearby && <LocationInput />}
      {showFilters && (
        <>
          {searchType === "places" && (
            <LocationSearchForm
              locationSearchType={locationSearchType}
              setLocationSearchType={setLocationSearchType}
            />
          )}
          {searchType === "type" && <NearbySearchForm />}
        </>
      )}
    </div>
  );
};

export default SearchBar;
