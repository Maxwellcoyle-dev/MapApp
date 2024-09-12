// Libraries
import React, { useEffect } from "react";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineSearch, MdClear } from "react-icons/md";

// State
import { useSearchContext } from "../../../state/SearchContext";

// Hooks
import useAutoComplete from "../../../hooks/useAutoComplete.js";
import { useAppUser } from "../../../hooks/backend-hooks/useAppUser";

// styles
import styles from "./Input.module.css";

const Input = () => {
  const {
    setSearchQuery,
    queryInput,
    setAutoCompleteResults,
    autoCompleteResults,
  } = useSearchContext();

  const handleInputChange = useAutoComplete();

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
          placeholder="Enter a place name"
          value={queryInput}
          onChange={handleInputChange}
          className={styles.input}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        type="primary"
        icon={<SearchOutlined style={{ fontSize: "1.25rem" }} />}
        style={{ height: "100%", width: "2rem" }}
      />
    </div>
  );
};

export default Input;
