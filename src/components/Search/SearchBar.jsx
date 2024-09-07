// Libaries
import React from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete/AutoComplete";
import SearchFilterContainer from "./SearchFilters/SearchFilterContainer";

// State
import { useMapContext } from "../../state/MapContext";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const { showMap } = useMapContext();

  return (
    <div
      className={
        showMap ? styles.searchBarContainer_Map : styles.searchBarContainer_List
      }
    >
      <Input />
      <SearchFilterContainer />
      <div className={styles.autocompleteWrapper}>
        <AutoComplete />
      </div>
    </div>
  );
};

export default SearchBar;
