import React, { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import MapView from "../../components/Map/MapView";
import ListView from "../../components/ListView/ListView";
import SearchBar from "../../components/Search/SearchBar";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";

import styles from "./Main.module.css";

import useGetUserLocation from "../../hooks/useGetUserLocation";
import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";
import useTextSearch from "../../hooks/useTextSearch";
import usePlacesTextSearch from "../../hooks/usePlacesTextSearch";
import AddToList from "../../components/AddToList/AddToList";

const Main = () => {
  const [view, setView] = useState("map");
  useGetUserLocation();
  const {
    placesResults,
    isPlacesResultsLoading,
    isPlacesResultsError,
    placesResultsError,
  } = usePlacesTextSearch("");

  useEffect(() => {
    console.log("Main - search results:", placesResults);
  }, [placesResults]);

  const { showAddToList } = useAppContext();

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView />
      {view === "list" && <ListView />}
      {showAddToList && <AddToList />}
      {view === "map" ? (
        <div className={styles.toggleButtonDiv} onClick={() => setView("list")}>
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      ) : (
        <div className={styles.toggleButtonDiv} onClick={() => setView("map")}>
          <MdOutlineMap className={styles.viewToggleIcon} />
        </div>
      )}
    </div>
  );
};

export default Main;
