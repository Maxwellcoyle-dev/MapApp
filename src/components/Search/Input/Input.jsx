// Libraries
import React, { useEffect } from "react";
import { MdOutlineSearch, MdClear } from "react-icons/md";

// State
import { useSearchContext } from "../../../state/SearchContext";

// Hooks
import useAutocomplete from "../../../hooks/google-api-hooks/useAutocomplete";

// styles
import styles from "./Input.module.css";

const Input = () => {
  const {
    setSearchQuery,
    queryInput,
    setAutoCompleteResults,
    autoCompleteResults,
  } = useSearchContext();
  const handleInputChange = useAutocomplete();

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      handleInputChange(event);
    }
    if (event.key === "Enter") {
      setSearchQuery(event.target.value);
    }
  };

  // make sure to clear the autocomplete results when the input is empty
  useEffect(() => {
    if (queryInput === "" && autoCompleteResults.length > 0) {
      setAutoCompleteResults([]);
    }
  }, [queryInput, autoCompleteResults]);

  const handleClearInput = () => {
    handleInputChange({ target: { value: "" } });
  };

  return (
    <div className={styles.inputContainer}>
      {queryInput && (
        <div className={styles.buttonDiv}>
          <button
            className={styles.button}
            onClick={() => setSearchQuery(queryInput)}
          >
            <MdOutlineSearch
              style={{ fontSize: "1.5rem", color: "black", margin: "auto" }}
            />
          </button>
          <button className={styles.button} onClick={handleClearInput}>
            <MdClear
              style={{ fontSize: "1.5rem", color: "black", margin: "auto" }}
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
