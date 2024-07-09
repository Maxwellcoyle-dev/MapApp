import React, { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";

// components
import MapView from "../../components/Map/MapView";
import ListView from "../../components/ListView/ListView";
import SearchBar from "../../components/Search/SearchBar";

import styles from "./Main.module.css";

import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";

import useGetUserLocation from "../../hooks/useGetUserLocation";
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";
import AddToList from "../../components/AddToList/AddToList";

const Main = () => {
  const [view, setView] = useState("map");
  const map = useMap();

  useGetUserLocation();

  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  const { showAddToList } = useAppContext();

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView placesResults={placesResults} />
      {view === "list" && (
        <ListView
          placesResults={placesResults}
          isPlacesResultsLoading={isPlacesResultsLoading}
        />
      )}
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
