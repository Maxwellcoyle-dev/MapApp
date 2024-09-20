// Libaries
import React, { useState } from "react";

// Components
import SearchNav from "./SearchNav/SearchNav";
import FilterMenu from "./SearchFilters/FilterMenu";
import NearbySearchForm from "./SearchFilters/NearbySearchForm";
import LocationInput from "./LocationInput/LocationInput";
import Input from "./Input/Input";
import LocationToggle from "./LocationToggle";
import AutoComplete from "./AutoComplete/AutoComplete";

// State
import { useMapContext } from "../../state/MapContext";
import { useSearchContext } from "../../state/SearchContext";

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
          <Input />
          <div>
            <AutoComplete />
          </div>
        </>
      )}
      <FilterMenu showFilters={showFilters} setShowFilters={setShowFilters} />
      {!nearby && <LocationInput />}
      {!globalSearch && <NearbySearchForm />}
    </div>
  );
};

export default SearchBar;
