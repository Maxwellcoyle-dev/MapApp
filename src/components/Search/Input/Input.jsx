import React from "react";
import { MdOutlineSearch, MdClear } from "react-icons/md";
import { useMapContext } from "../../../state/MapContext";
import useInputChange from "../../../hooks/map-handlers/useInputChange";
import useTextSearch from "../../../hooks/map-handlers/useTextSearch";
import styles from "./Input.module.css";

const Input = () => {
  const { searchQuery } = useMapContext();

  const handleInputChange = useInputChange();
  const handleTextSearch = useTextSearch();

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
      />
    </div>
  );
};

export default Input;
