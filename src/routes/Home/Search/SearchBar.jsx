// Libaries
import React, { useState } from "react";

// Components
import SearchNav from "./SearchNav/SearchNav";
import SearchTypeSwitch from "./SearchTypeSwitch";
import PlaceTypeSearch from "./PlaceTypeSearch";
import LocationSearchInput from "./LocationSearchInput/LocationSearchInput";
import GlobalSearchInput from "./GlobalSearchInput/GlobalSearchInput";
import LocationToggle from "./LocationToggle";
import AutoComplete from "./AutoComplete/AutoComplete";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(true);

  const { showMap } = useMapContext();
  const { globalSearch, nearby } = useSearchContext();

  return (
    <div
      className={
        showMap ? styles.searchBarContainer_Map : styles.searchBarContainer_List
      }
    >
      <SearchNav />
      <LocationToggle />
      {globalSearch && (
        <>
          <GlobalSearchInput />
          <div>
            <AutoComplete />
          </div>
        </>
      )}
      {!globalSearch && <PlaceTypeSearch />}
      <SearchTypeSwitch
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      {!nearby && <LocationSearchInput />}
    </div>
  );
};

export default SearchBar;
