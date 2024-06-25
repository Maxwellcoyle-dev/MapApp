import React, { useState } from "react";

import MapView from "../components/MapView/MapView";
import SearchBar from "../components/Search/SearchBar";

const Main = () => {
  const [markers, setMarkers] = useState([]);
  return (
    <div style={{ position: "relative" }}>
      <SearchBar setMarkers={setMarkers} />
      <MapView markers={markers} />
    </div>
  );
};

export default Main;
