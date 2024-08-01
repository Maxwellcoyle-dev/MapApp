// Libraries
import React, { useEffect, useState } from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";
import { Outlet } from "react-router-dom";

// Components
import MapView from "../../components/Main/Map/MapView";
import MapListView from "../../components/Main/MapListView/MapListView";
import SearchBar from "../../components/Search/SearchBar";

// State
import { useAppContext } from "../../state/AppContext";

// Hooks
import useGetUserLocation from "../../hooks/useGetUserLocation";
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// Styles
import styles from "./Main.module.css";

const Main = () => {
  const [view, setView] = useState("map");

  useGetUserLocation();

  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  const { showAddToList } = useAppContext();

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

export default Main;
