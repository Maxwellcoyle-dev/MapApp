// Libraries
import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";

// Components
import MapView from "../../components/MapComponent/Map/MapView";
import SearchBar from "../../components/Search/SearchBar";
import PlaceTypeSelector from "../../components/Search/PlaceTypeSelector/PlaceTypeSelector";
import MyLists from "../../components/MyLists/MyLists";
import MapToggle from "../../components/MapToggle/MapToggle";

// Hooks
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useAppUser from "../../hooks/backend-hooks/useAppUser";

// State
import { useAppContext } from "../../state/AppContext";
import { useMapContext } from "../../state/MapContext";

// Styles
import styles from "./Home.module.css";
import CreateListModal from "../../components/CreateListModal/CreateListModal";
import Search from "antd/es/input/Search";

const Home = () => {
  const { userLocation } = useAppContext();
  const { setCenter, showMap, currentMapPins } = useMapContext();

  const { appUser } = useAppUser();
  const { allListsData } = useListPlaces(appUser?.data.userId);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  return (
    <div className={styles.mainContainer}>
      <Outlet />
      {showMap && <SearchBar />}
      <MapView markerList={currentMapPins} />
      {!showMap && (
        <div className={styles.homePageContent}>
          <SearchBar />
          <MyLists allListsData={allListsData} />
        </div>
      )}
      <MapToggle />
      <CreateListModal />
    </div>
  );
};

export default Home;
