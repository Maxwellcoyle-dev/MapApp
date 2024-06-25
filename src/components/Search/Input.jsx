import React from "react";
import { MdOutlineSearch } from "react-icons/md";

const Input = ({ query, handleInputChange, handleInputSubmit }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
      }}
    >
      <button
        style={{
          width: "2rem",
          height: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          right: "10%",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => handleInputSubmit()}
      >
        <MdOutlineSearch
          style={{
            fontSize: "1.5rem",
            color: "black",
            margin: "auto",
          }}
        />
      </button>
      <input
        type="text"
        placeholder="Enter a location"
        value={query}
        onChange={handleInputChange}
        style={{
          width: "90%",
          padding: "0.5rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "0.25rem",
        }}
      />
    </div>
  );
};

export default Input;
