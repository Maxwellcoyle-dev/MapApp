import React, { useState } from "react";
import { Input as AntInput, Radio, Select } from "antd";

// components
import AutoComplete from "../AutoComplete/AutoComplete";

// Contexts
import { useSearchContext } from "../../../state/SearchContext";

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
    ></div>
  );
};

export default LocationSearchForm;
