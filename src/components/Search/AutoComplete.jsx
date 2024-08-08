import React from "react";

// Hooks
import useAutoCompleteSelect from "../../hooks/useAutoCompleteSelect";

// State
import { useSearchContext } from "../../state/SearchContext";

import styles from "./SearchBar.module.css";

const AutoComplete = () => {
  const { autoCompleteResults, setAutoCompleteResults, setSearchResults } =
    useSearchContext();

  const handleAutoCompleteSelect = useAutoCompleteSelect();

  const handleAutocompleteClick = (placeId) => {
    setAutoCompleteResults([]);
    setSearchResults([]);
    handleAutoCompleteSelect(placeId);
  };

  if (autoCompleteResults === null) {
    return null;
  }

  return (
    autoCompleteResults?.length > 0 && (
      <div className={styles.autocompleteContainer}>
        {autoCompleteResults.map((place) => {
          return (
            <div
              key={place.place_id}
              onClick={() => handleAutocompleteClick(place.place_id)}
            >
              <p>
                <strong>{place.structured_formatting.main_text}</strong>
              </p>
              <p>{place.structured_formatting.secondary_text}</p>
            </div>
          );
        })}
      </div>
    )
  );
};

export default AutoComplete;
