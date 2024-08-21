// Libaries
import React from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete/AutoComplete";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={styles.searchBarContainer}>
      <Input />
      <div className={styles.autocompleteWrapper}>
        <AutoComplete />
      </div>
    </div>
  );
};

export default SearchBar;
