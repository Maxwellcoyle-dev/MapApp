// Libraries
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { MdClear } from "react-icons/md";

// State
import { useSearchContext } from "../../../../../state/SearchContext";

// Hooks
import useAutoComplete from "../../../../../hooks/useAutoComplete.js";
import usePlacesSearch from "../../../../../hooks/google-api-hooks/usePlacesSearch.js";

// styles
import styles from "./GlobalSearchInput.module.css";

const GlobalSearchInput = () => {
  const navigate = useNavigate();
  const {
    setSearchQuery,
    searchQuery,
    queryInput,
    setAutoCompleteResults,
    autoCompleteResults,
  } = useSearchContext();

  const { refetchPlacesResults } = usePlacesSearch(searchQuery);

  useEffect(() => {
    if (searchQuery) {
      refetchPlacesResults();
    }
  }, [searchQuery, refetchPlacesResults]);

  const handleInputChange = useAutoComplete();

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") {
      handleInputChange(event);
    }
    if (event.key === "Enter") {
      setSearchQuery(event.target.value);
      setAutoCompleteResults([]);
    }
  };

  // make sure to clear the autocomplete results when the input is empty
  useEffect(() => {
    if (queryInput === "" && autoCompleteResults.length > 0) {
      setAutoCompleteResults([]);
    }
  }, [queryInput, autoCompleteResults, setAutoCompleteResults]);

  const handleClearInput = () => {
    handleInputChange({ target: { value: "" } });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {queryInput && (
          <div className={styles.buttonDiv}>
            <button className={styles.button} onClick={handleClearInput}>
              <MdClear
                style={{ fontSize: "1.5rem", color: "black", margin: "auto" }}
              />
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Global Search"
          value={queryInput}
          onChange={handleInputChange}
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        onClick={() => {
          setSearchQuery(queryInput);
          setAutoCompleteResults([]);
          navigate(`/results-list`);
        }}
        className={styles.searchButton}
      >
        <SearchOutlined style={{ fontSize: "1.25rem", color: "white" }} />
      </button>
    </div>
  );
};

export default GlobalSearchInput;
