// Libraries
import React, { useEffect, useState } from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";

// Components
import MapView from "../../components/Map/MapView";
import ListView from "../../components/ListView/ListView";
import SearchBar from "../../components/Search/SearchBar";
import AddToList from "../../components/AddToList/AddToList";

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

  useEffect(() => {
    setView("map");
  }, []);

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView placesResults={placesResults} setView={setView} />
      {view === "list" && (
        <ListView
          placesResults={placesResults}
          isPlacesResultsLoading={isPlacesResultsLoading}
          setView={setView}
        />
      )}
      {showAddToList && <AddToList />}
      {view === "map" && (
        <div className={styles.toggleButtonDiv} onClick={() => setView("list")}>
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      )}
      {view === "list" && (
        <div className={styles.toggleButtonDiv} onClick={() => setView("map")}>
          <MdOutlineMap className={styles.viewToggleIcon} />
        </div>
      )}
    </div>
  );
};

export default Main;
