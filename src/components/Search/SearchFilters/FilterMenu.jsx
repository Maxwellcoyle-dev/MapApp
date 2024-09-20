import React, { useEffect } from "react";
import { Switch } from "antd";
import { useMap } from "@vis.gl/react-google-maps";

// State
import { useSearchContext } from "../../../state/SearchContext";
import { useMapContext } from "../../../state/MapContext";

const FilterMenu = () => {
  const { userLocation, userLocality } = useMapContext();
  const map = useMap();
  const {
    setLocationQueryInput,
    setLocationAutoCompleteResults,
    setSearchLocation,
    searchLocation,
    globalSearch,
    setGlobalSearch,
    nearby,
    setNearby,
  } = useSearchContext();

  useEffect(() => {
    if (nearby) {
      setSearchLocation({
        coords: userLocation,
        locality: userLocality,
      });

      map?.setCenter(userLocation);
    } else {
      setLocationQueryInput("");
      setLocationAutoCompleteResults([]);
      setSearchLocation({
        coords: null,
        locality: null,
      });
    }
  }, [nearby]);

  useEffect(() => {
    console.log("Search location: ", searchLocation);
  }, [searchLocation]);

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

export default FilterMenu;
