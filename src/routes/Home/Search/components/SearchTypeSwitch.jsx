import React from "react";
import { Switch } from "antd";

// State
import { useSearchContext } from "../../../../state/SearchContext";

const SearchTypeSwitch = () => {
  const {
    globalSearch,
    setGlobalSearch,
    setQueryInput,
    setSearchQuery,
    setPlaceType,
  } = useSearchContext();

  // const handleGlobalSearch = () => {
  //   setPlaceType("");
  //   setSearchQuery("");
  //   setQueryInput("");
  // };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: ".25rem 1rem",
        maxWidth: "13rem",
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
      }}
    >
      <h4>Global Search</h4>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          width: "100%",
        }}
      >
        {globalSearch ? (
          <h4 style={{ fontWeight: 300, fontSize: "0.9em" }}>On</h4>
        ) : (
          <h4 style={{ fontWeight: 300, fontSize: "0.9em" }}>Off</h4>
        )}
        <Switch
          checked={globalSearch}
          onChange={(checked) => {
            setGlobalSearch(checked);
            // handleGlobalSearch();
          }}
        />
      </div>
    </div>
  );
};

export default SearchTypeSwitch;
