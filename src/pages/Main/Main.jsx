import { Outlet } from "react-router-dom";

import MapView from "../../components/Map/MapView";
import SearchBar from "../../components/Search/SearchBar";

import styles from "./Main.module.css";

import useGetUserLocation from "../../hooks/useGetUserLocation";

const Main = () => {
  useGetUserLocation();

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView />
      <div className={styles.overlayContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
