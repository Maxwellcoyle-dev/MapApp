// Libraries
import React, { useEffect, useState } from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";
import { Outlet } from "react-router-dom";

// Components
import MapView from "../../components/MapComponent/Map/MapView";
import MapListView from "../../components/MapComponent/MapListView/MapListView";
import SearchBar from "../../components/Search/SearchBar";

import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// State
import { useAppContext } from "../../state/AppContext";
import { useMapContext } from "../../state/MapContext";

// Styles
import styles from "./Home.module.css";

const Home = () => {
  const { userLocation } = useAppContext();
  const { setCenter, mapView, setMapView } = useMapContext();

  useEffect(() => {
    console.log("home page mounted");
  }, []);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  return (
    <div className={styles.mainContainer}>
      <Outlet />
      <SearchBar />
      <MapView markerList={placesResults} />
      {mapView === "list" && (
        <MapListView
          placesResults={placesResults}
          isPlacesResultsLoading={isPlacesResultsLoading}
        />
      )}
      {mapView === "map" ? (
        <div
          className={styles.toggleButtonDiv}
          onClick={() => setMapView("list")}
        >
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      ) : (
        mapView === "list" && (
          <div
            className={styles.toggleButtonDiv}
            onClick={() => setMapView("map")}
          >
            <MdOutlineMap className={styles.viewToggleIcon} />
          </div>
        )
      )}
    </div>
  );
};

export default Home;
