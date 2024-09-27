import React from "react";
import { Select } from "antd";

// Components
import PlaceTypeSelector from "./PlaceTypeSelector/PlaceTypeSelector";



const PlaceTypeSearch = () => {


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        width: "100%",
        padding: "0 1rem",
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
  );
};

export default PlaceTypeSearch;
