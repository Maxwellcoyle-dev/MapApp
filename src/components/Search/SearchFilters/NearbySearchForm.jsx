import React from "react";
import { Radio, Select } from "antd";

// Components
import PlaceTypeSelector from "../PlaceTypeSelector/PlaceTypeSelector";

// Context
import { useSearchContext } from "../../../state/SearchContext";

const NearbySearchForm = () => {
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
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: ".25rem",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          width: "100%",
        }}
      >
        <PlaceTypeSelector />

        <h4>Radius</h4>
        <Select
          options={radiusOptions}
          style={{ minWidth: "6rem" }}
          value={searchRadius}
          optionType="default"
          onChange={(event) => {
            console.log(event);
            setSearchRadius(event);
          }}
        />
      </div>
    </div>
  );
};

export default NearbySearchForm;
