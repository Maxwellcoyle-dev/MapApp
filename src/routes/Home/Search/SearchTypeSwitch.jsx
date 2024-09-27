import React from "react";
import { Switch } from "antd";

// State
import { useSearchContext } from "../../../state/SearchContext";

const SearchTypeSwitch = () => {
  const { globalSearch, setGlobalSearch } = useSearchContext();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <p style={{ fontSize: "0.9em", color: "#666", margin: 0 }}>
          {globalSearch
            ? "Optionally turn off Gloabl Search to search by type."
            : "Turn on Global Search"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <h4>Global Search</h4>
          <Switch
            checked={globalSearch}
            onChange={(checked) => setGlobalSearch(checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTypeSwitch;
