import React from "react";

import MapView from "../components/MapView/MapView";
import SearchBar from "../components/Search/SearchBar";

const Main = () => {
  return (
    <div style={{ position: "relative" }}>
      <SearchBar />
      <MapView />
    </div>
  );
};

export default Main;
