import React from "react";
import { Input } from "antd";
import { MdClear } from "react-icons/md";

// state
import { useSearchContext } from "../../../state/SearchContext";

// hooks
import useLocationAutocomplete from "../../../hooks/google-api-hooks/useLocationAutoComplete";

// styles
import styles from "./LocationInput.module.css";

const LocationInput = () => {
  const {
    locationQueryInput,
    setLocationQueryInput,
    setSearchLocation,
    locationAutoCompleteResults,
    setLocationAutoCompleteResults,
  } = useSearchContext();

  const { searchLocations } = useLocationAutocomplete();

  const handleInputChange = (e) => {
    const input = e.target.value;
    searchLocations(input);
    setLocationQueryInput(input);
  };

  const handleClearInput = () => {
    setLocationQueryInput("");
    setLocationAutoCompleteResults([]);
    setSearchLocation("");
  };

  const handleSelectLocation = (selectedResult) => {
    console.log(selectedResult);
    setSearchLocation(selectedResult.description);
    setLocationQueryInput(selectedResult.description);
    setLocationAutoCompleteResults([]);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          placeholder="Enter a city, state, country or zip code"
          onChange={handleInputChange}
          value={locationQueryInput}
        />
        {locationQueryInput && (
          <div className={styles.buttonDiv}>
            <button className={styles.button} onClick={handleClearInput}>
              <MdClear
                style={{ fontSize: "1.5rem", color: "black", margin: "auto" }}
              />
            </button>
          </div>
        )}
      </div>
      {locationAutoCompleteResults.length > 0 && (
        <div className={styles.autocompleteResults}>
          {locationAutoCompleteResults.map((result) => (
            <div
              key={result.place_id}
              className={styles.autocompleteItem}
              onClick={() => handleSelectLocation(result)}
            >
              {result.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
