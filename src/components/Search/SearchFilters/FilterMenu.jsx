import React from "react";
import { Button, Radio } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const searchTypeOptions = [
  { label: "Places", value: "places" },
  { label: "Nearby", value: "nearby" },
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
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        width: "100%",
      }}
    >
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
  );
};

export default FilterMenu;
