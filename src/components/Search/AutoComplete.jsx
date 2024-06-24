import React, { useEffect } from "react";

const AutoComplete = ({ autoCompleteResults }) => {
  if (autoCompleteResults === null) {
    return null;
  }

  return (
    autoCompleteResults?.length > 0 && (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          width: "90%",
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {autoCompleteResults.map((place) => {
          return (
            <div key={place.place_id} style={{}}>
              <p>
                <strong>{place.structured_formatting.main_text}</strong>
              </p>
              <p>{place.structured_formatting.secondary_text}</p>
            </div>
          );
        })}
      </div>
    )
  );
};

export default AutoComplete;
