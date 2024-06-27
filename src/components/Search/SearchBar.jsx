// Libaries
import React from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete";

// State
import { useMapContext } from "../../state/MapContext";

// Hooks
import useAutoCompleteSelect from "../../hooks/useAutoCompleteSelect";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const { autoCompleteResults } = useMapContext();

  const handleAutoCompleteSelect = useAutoCompleteSelect();

  const handlePlaceSelected = (place) => {};

  return (
    <div className={styles.searchBarContainer}>
      <Input />
      <AutoComplete
        autoCompleteResults={autoCompleteResults}
        handleAutoCompleteClick={handleAutoCompleteSelect}
      />
    </div>
  );
};

export default SearchBar;
