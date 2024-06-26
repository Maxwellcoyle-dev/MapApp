import React, { useState } from "react";

import MapView from "../../components/Map/MapView";
import SearchBar from "../../components/Search/SearchBar";

import styles from "./Main.module.css";

const Main = () => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  return (
    <div className={styles.mainContainer}>
      <SearchBar
        setMarkers={setMarkers}
        setCenter={setCenter}
        setSelectedMarker={setSelectedMarker}
      />
      <MapView
        markers={markers}
        setCenter={setCenter}
        center={center}
        setSelectedMarker={setSelectedMarker}
        selectedMarker={selectedMarker}
      />
    </div>
  );
};

export default Main;
