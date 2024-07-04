import { Outlet } from "react-router-dom";

import MapView from "../../components/Map/MapView";
import SearchBar from "../../components/Search/SearchBar";

import styles from "./Main.module.css";

import useGetUserLocation from "../../hooks/useGetUserLocation";

import { useAppContext } from "../../state/AppContext";

import AddToList from "../../components/AddToList/AddToList";

const Main = () => {
  useGetUserLocation();

  const { showAddToList } = useAppContext();

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView />
      <div className={styles.overlayContainer}>
        <Outlet />
      </div>
      {showAddToList && <AddToList />}
    </div>
  );
};

export default Main;
