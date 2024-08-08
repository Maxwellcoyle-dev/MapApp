// Libaries
import React from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete";
import PlaceTypeSelector from "./PlaceTypeSelector/PlaceTypeSelector";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={styles.searchBarContainer}>
      <Input />
      <div className={styles.autocompleteWrapper}>
        <AutoComplete />
      </div>
      <PlaceTypeSelector />
    </div>
  );
};

export default SearchBar;
