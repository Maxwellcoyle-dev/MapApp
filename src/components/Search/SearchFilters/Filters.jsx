import React, { useState } from "react";
import { Input, Radio, Button, Select } from "antd";

import { useMapContext } from "../../../state/MapContext";
import LocationSearchForm from "./LocationSearchForm";
import FilterMenu from "./FilterMenu";
import NearbySearchForm from "./NearbySearchForm";

const Filters = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(10);
  const [searchType, setSearchType] = useState("nearby");
  const [locationSearchType, setLocationSearchType] = useState("city");
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: ".5rem 1rem",
      }}
    >
      <FilterMenu
        searchType={searchType}
        setSearchType={setSearchType}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      {showFilters && (
        <>
          {searchType === "location" && (
            <LocationSearchForm
              radius={radius}
              setRadius={setRadius}
              searchType={searchType}
              setSearchType={setSearchType}
              locationSearchType={locationSearchType}
              setLocationSearchType={setLocationSearchType}
            />
          )}
          {searchType === "nearby" && (
            <NearbySearchForm
              radius={radius}
              setRadius={setRadius}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Filters;
