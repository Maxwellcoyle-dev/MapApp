import React, { useEffect } from "react";
import { Input } from "antd";
import { MdClear } from "react-icons/md";
import { useMap } from "@vis.gl/react-google-maps";

// state
import { useSearchContext } from "../../../state/SearchContext";

// hooks
import useLocationAutocomplete from "../../../hooks/google-api-hooks/useLocationAutoComplete";
import useGetLocalityCoords from "../../../hooks/google-api-hooks/useGetLocalityCoords";

// styles
import styles from "./LocationInput.module.css";

const LocationInput = () => {
  const map = useMap();
  const {
    locationQueryInput,
    setLocationQueryInput,
    setSearchLocation,
    locationAutoCompleteResults,
    setLocationAutoCompleteResults,
  } = useSearchContext();

  const { searchLocations } = useLocationAutocomplete();

  const { getLocalityCoords } = useGetLocalityCoords();

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

  const handleSelectLocation = async (selectedResult) => {
    console.log(selectedResult);

    const getCoords = await getLocalityCoords(selectedResult.description);
    console.log("getCoords", getCoords);

    setSearchLocation({
      coords: getCoords,
      locality: selectedResult.description,
    });

    // set the center of the map to the selected location
    map.setCenter(getCoords);

    setLocationQueryInput(selectedResult.description);
    setLocationAutoCompleteResults([]);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '..' : text;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <Input
          className={styles.input}
          placeholder="Enter a city, state, country or zip code"
          onChange={handleInputChange}
          value={truncateText(locationQueryInput, 38)}
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
