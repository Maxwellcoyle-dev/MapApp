// Libaries
import React, { useEffect } from "react";

// Components
import Input from "./Input/Input";
import AutoComplete from "./AutoComplete";
import PlaceTypeSelector from "./PlaceTypeSelector/PlaceTypeSelector";

// State
import { useSearchContext } from "../../state/SearchContext";

// Hooks
import useAutoCompleteSelect from "../../hooks/useAutoCompleteSelect";

// Styles
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const { autoCompleteResults } = useSearchContext();

  const handleAutoCompleteSelect = useAutoCompleteSelect();

  return (
    <div className={styles.searchBarContainer}>
      <Input />
      <AutoComplete
        autoCompleteResults={autoCompleteResults}
        handleAutoCompleteClick={handleAutoCompleteSelect}
      />
      <PlaceTypeSelector />
    </div>
  );
};

export default SearchBar;
