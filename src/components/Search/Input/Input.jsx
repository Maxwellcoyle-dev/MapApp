import React from "react";
import { MdOutlineSearch, MdClear } from "react-icons/md";
import { useSearchContext } from "../../../state/SearchContext";
import useAutocomplete from "../../../hooks/google-api-hooks/useAutocomplete";
import usePlacesSearch from "../../../hooks/google-api-hooks/usePlacesSearch";
import styles from "./Input.module.css";

const Input = () => {
  const { searchQuery, setSearchQuery, queryInput, setQueryInput } =
    useSearchContext();

  const handleInputChange = useAutocomplete();

  const { placesResults, isPlacesResultsLoading, refetchPlacesResults } =
    usePlacesSearch();

  const handleKeyDown = (event) => {
    // if its not enter, but a letter then update the query input
    if (event.key !== "Enter") {
      handleInputChange(event);
    }
    if (event.key === "Enter") {
      setSearchQuery(event.target.value);
    }
  };

  return (
    <div className={styles.inputContainer}>
      {searchQuery && (
        <div className={styles.buttonDiv}>
          <button
            className={styles.button}
            onClick={(event) => setSearchQuery(event.target.value)}
          >
            <MdOutlineSearch
              style={{
                fontSize: "1.5rem",
                color: "black",
                margin: "auto",
              }}
            />
          </button>
          <button
            className={styles.button}
            onClick={() => handleInputChange({ target: { value: "" } })}
          >
            <MdClear
              style={{
                fontSize: "1.5rem",
                color: "black",
                margin: "auto",
              }}
            />
          </button>
        </div>
      )}
      <input
        type="text"
        placeholder="Enter a location"
        value={queryInput}
        onChange={handleInputChange}
        className={styles.input}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Input;
