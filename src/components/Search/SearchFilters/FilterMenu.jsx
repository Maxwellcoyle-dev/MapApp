import React from "react";
import { Radio, Switch } from "antd";

// State
import { useSearchContext } from "../../../state/SearchContext";

const searchTypeOptions = [
  { label: "Place", value: "places" },
  { label: "Type", value: "nearby" },
];

const searchLocationOptions = [
  { label: "Near Me", value: "nearMe" },
  { label: "Set Location", value: "setLocation" },
];

const FilterMenu = () => {
  const {
    setSearchLocation,
    searchLocation,
    searchType,
    setSearchType,
    nearby,
    setNearby,
  } = useSearchContext();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <Radio.Group
          options={searchTypeOptions}
          value={searchType}
          onClick={(e) => {
            console.log(e);
          }}
          onChange={(e) => {
            console.log(e.target.value);
            setSearchType(e.target.value);
          }}
          optionType="button"
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          border: "1px solid gray",
          padding: ".5rem",
          borderRadius: ".5rem",
        }}
      >
        <h4>Nearby</h4>
        <Switch
          checked={nearby}
          onChange={(checked) => {
            console.log(checked);
            setNearby(checked);
          }}
        />
      </div>
    </div>
  );
};

export default FilterMenu;
