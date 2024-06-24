import React from "react";

const Input = ({ query, handleInputChange }) => {
  return (
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
  );
};

export default Input;
