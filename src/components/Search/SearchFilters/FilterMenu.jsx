import React, { useState } from "react";
import { Button, Radio, Switch } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

import PlaceTypeSelector from "../PlaceTypeSelector/PlaceTypeSelector";

import { useSearchContext } from "../../../state/SearchContext";

const searchTypeOptions = [
  { label: "Nearby", value: "nearby" },
  { label: "Location", value: "location" },
];

const FilterMenu = ({
  showFilters,
  setShowFilters,
  searchType,
  setSearchType,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          icon={<FilterOutlined style={{ fontSize: "1rem" }} />}
          style={{ padding: ".5rem", width: "auto", height: "auto" }}
          onClick={() => setShowFilters(!showFilters)}
        />

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
      <PlaceTypeSelector />
    </div>
  );
};

export default FilterMenu;
