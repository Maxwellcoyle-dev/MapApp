// Libraries
import React, { useEffect, useState } from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";
import { Outlet } from "react-router-dom";

// Components
import MapView from "../../components/MapComponent/Map/MapView";
import MapListView from "../../components/MapComponent/MapListView/MapListView";
import SearchBar from "../../components/Search/SearchBar";

// Hooks
import useGetUserLocation from "../../hooks/useGetUserLocation";
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// Styles
import styles from "./Home.module.css";

const Home = () => {
  const [view, setView] = useState("map");

  useGetUserLocation();

  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  return (
    <div className={styles.mainContainer}>
      <Outlet />
      <SearchBar />
      <MapView placesResults={placesResults} setView={setView} />
      {view === "list" && (
        <MapListView
          placesResults={placesResults}
          isPlacesResultsLoading={isPlacesResultsLoading}
          setView={setView}
        />
      )}
      {view === "map" ? (
        <div className={styles.toggleButtonDiv} onClick={() => setView("list")}>
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      ) : (
        view === "list" && (
          <div
            className={styles.toggleButtonDiv}
            onClick={() => setView("map")}
          >
            <MdOutlineMap className={styles.viewToggleIcon} />
          </div>
        )
      )}
    </div>
  );
};

export default Home;
