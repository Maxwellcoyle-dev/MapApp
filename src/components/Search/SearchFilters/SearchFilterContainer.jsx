import React, { useEffect, useState } from "react";

// components
import Filters from "./Filters";

// state
import { useMapContext } from "../../../state/MapContext";

import FilterMenu from "./FilterMenu";

const SearchFilterContainer = () => {
  const [showFilters, setShowFilters] = useState(true);

  const { showMap } = useMapContext();

  useEffect(() => {
    if (showMap) {
      setShowFilters(false);
    }
  }, [showMap]);

  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: ".5rem 0",
      }}
    >
      <FilterMenu setShowFilters={setShowFilters} showFilters={showFilters} />
      {showFilters && <Filters />}
    </div>
  );
};

export default SearchFilterContainer;
