// Libaries
import React from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete/AutoComplete";
import SearchFilterContainer from "./SearchFilters/SearchFilterContainer";
import PlaceTypeSelector from "./PlaceTypeSelector/PlaceTypeSelector";

// State
import { useMapContext } from "../../state/MapContext";

// Styles
import styles from "./SearchBar.module.css";
import Filters from "./SearchFilters/Filters";

const SearchBar = () => {
  const { showMap } = useMapContext();

  return (
    <div
      className={
        showMap ? styles.searchBarContainer_Map : styles.searchBarContainer_List
      }
    >
      <Input />
      <div className={styles.autocompleteWrapper}>
        <AutoComplete />
      </div>
      <Filters />
    </div>
  );
};

export default SearchBar;
