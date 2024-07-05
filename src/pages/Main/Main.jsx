import { useEffect, useState } from "react";
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

import AddToList from "../../components/AddToList/AddToList";

const Main = () => {
  const [view, setView] = useState("map");
  useGetUserLocation();
  const handleTextSearch = useTextSearch();
  const map = useMap();

  const { placeType, selectedPlace } = useSearchContext();
  const { showAddToList } = useAppContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    handleTextSearch(`${placeType} near me`);
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    handleTextSearch(`${placeType} near me`);
  }, [placeType]);

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      {view === "map" && <MapView />}
      {view === "list" && <ListView />}
      {showAddToList && <AddToList />}
      {!selectedPlace && view === "map" && (
        <div className={styles.toggleButtonDiv} onClick={() => setView("list")}>
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      )}
      {!selectedPlace && view === "list" && (
        <div className={styles.toggleButtonDiv} onClick={() => setView("map")}>
          <MdOutlineMap className={styles.viewToggleIcon} />
        </div>
      )}
    </div>
  );
};

export default Main;
