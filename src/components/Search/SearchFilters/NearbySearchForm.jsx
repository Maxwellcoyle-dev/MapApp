import React, { useState } from "react";
import { Input, Radio, Button, Select } from "antd";

const NearbySearchForm = () => {
  const [locationSearchType, setLocationSearchType] = useState("city");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(10);

  const [rankBy, setRankBy] = useState("POP");
  const [userLocation, setUserLocation] = useState("Edgewood, Pa");

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

  const rankByOptions = [
    { label: "Popularity", value: "POP" },
    { label: "Distance", value: "DIST" },
  ];

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        gap: ".25rem",
      }}
    >
      <div>
        <h4>Radius</h4>
        <Select
          options={radiusOptions}
          style={{ minWidth: "6rem" }}
          value={radius}
          optionType="default"
          onChange={(event) => {
            console.log(event);
            setRadius(event);
          }}
        />
      </div>
      <div>
        <h4>Rank By</h4>
        <Radio.Group
          options={rankByOptions}
          style={{ minWidth: "6rem" }}
          value={rankBy}
          optionType="button"
          onChange={(event) => {
            console.log(event);
            setRankBy(event);
          }}
        />
      </div>
    </div>
  );
};

export default NearbySearchForm;
