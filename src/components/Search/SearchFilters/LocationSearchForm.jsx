import React, { useState } from "react";
import { Input as AntInput, Radio, Select } from "antd";

// components
import Input from "../Input/Input";
import AutoComplete from "../AutoComplete/AutoComplete";

// Contexts
import { useSearchContext } from "../../../state/SearchContext";

const locationInputOptions = [
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Country", value: "country" },
  { label: "Zip", value: "zip" },
];

const LocationSearchForm = () => {
  const [location, setLocation] = useState("");

  const {
    locationSearchType,
    setLocationSearchType,
    searchRadius,
    setSearchRadius,
  } = useSearchContext();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "0 1rem",
      }}
    >
      <Input />
      <div>
        <AutoComplete />
      </div>
      {/* <div style={{ display: "flex", flexDirection: "column" }}>
        <h4>Set Location</h4>
        <Radio.Group
          options={locationInputOptions}
          value={locationSearchType}
          optionType="button"
          onChange={(event) => setLocationSearchType(event.target.value)}
        />
        <AntInput placeholder={`Search for a ${locationSearchType}`} />
      </div> */}
    </div>
  );
};

export default LocationSearchForm;
