import React, { useState } from "react";
import { Button, Switch } from "antd";
import { FilterOutlined } from "@ant-design/icons";

import { useSearchContext } from "../../../state/SearchContext";

const FilterMenu = ({ showFilters, setShowFilters }) => {
  const [nearbySearch, setNearbySearch] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        icon={<FilterOutlined style={{ fontSize: "1.5rem" }} />}
        style={{ padding: ".5rem", width: "auto", height: "auto" }}
        onClick={() => setShowFilters(!showFilters)}
      />
      <div
        style={{
          padding: ".5rem",
          border: "1px solid lightgray",
          borderRadius: ".5rem",
        }}
      >
        <h4>Nearby</h4>
        <Switch
          label="Search Type"
          value={nearbySearch}
          onChange={(event) => setNearbySearch(!nearbySearch)}
        />
      </div>
    </div>
  );
};

export default FilterMenu;
