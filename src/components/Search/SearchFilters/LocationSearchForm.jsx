import React, { useState } from "react";
import { Input, Radio, Button, Select } from "antd";

import { useMapContext } from "../../../state/MapContext";

const locationInputOptions = [
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Country", value: "country" },
  { label: "Zip", value: "zip" },
];

const radiusOptions = [
  { label: "5 miles", value: 5 },
  { label: "10 miles", value: 10 },
  { label: "25 miles", value: 25 },
  { label: "50 miles", value: 50 },
  { label: "100 miles", value: 100 },
  { label: "--", value: 0 },
];

const LocationSearchForm = ({
  radius,
  setRadius,
  locationSearchType,
  setLocationSearchType,
}) => {
  const [location, setLocation] = useState("");

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h4>Set Location</h4>
        <Radio.Group
          options={locationInputOptions}
          value={locationSearchType}
          optionType="button"
          onChange={(event) => setLocationSearchType(event.target.value)}
        />
        <Input placeholder={`Search for a ${locationSearchType}`} />
      </div>

      <div>
        <h4>Radius</h4>
        <Select
          options={radiusOptions}
          style={{ minWidth: "6rem" }}
          value={radius}
          optionType="default"
          onChange={(event) => setRadius(event)}
        />
      </div>
    </div>
  );
};

export default LocationSearchForm;
