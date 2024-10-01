import React from "react";
import { Select } from "antd";

// Context
import { useSearchContext } from "../../../../state/SearchContext";

const RadiusSelect = () => {
  const { searchRadius, setSearchRadius } = useSearchContext();

  const radiusOptions = [
    { label: "2 miles", value: 2 },
    { label: "5 miles", value: 5 },
    { label: "10 miles", value: 10 },
    { label: "25 miles", value: 25 },
    { label: "50 miles", value: 50 },
    { label: "100 miles", value: 100 },
    { label: "250 miles", value: 250 },
    { label: "500 miles", value: 500 },
    { label: "--", value: 0 },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.25rem",
        maxWidth: "13rem",
      }}
    >
      <h4>Radius</h4>
      <Select
        options={radiusOptions}
        style={{ minWidth: "6rem" }}
        value={searchRadius}
        onChange={(event) => {
          console.log(event);
          setSearchRadius(event);
        }}
      />
    </div>
  );
};

export default RadiusSelect;
