import React from "react";
import { MdOutlineSearch, MdClear } from "react-icons/md";
import { useMapContext } from "../../../state/MapContext";
import useInputChange from "../../../hooks/useInputChange";
import useTextSearch from "../../../hooks/useTextSearch";
import styles from "./Input.module.css";

const Input = () => {
  const { searchQuery } = useMapContext();

  const handleInputChange = useInputChange();
  const handleTextSearch = useTextSearch();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleTextSearch(searchQuery);
    }
  };

  return (
    <div className={styles.inputContainer}>
      {searchQuery && (
        <div className={styles.buttonDiv}>
          <button
            className={styles.button}
            onClick={(event) => handleTextSearch(searchQuery)}
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
        value={searchQuery}
        onChange={handleInputChange}
        className={styles.input}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Input;
