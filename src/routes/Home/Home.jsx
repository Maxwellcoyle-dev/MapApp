// Libraries
import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";

// Components
import MapView from "./Map/MapView";
import SearchBar from "./Search/SearchBar";
import SavedLists from "./SavedLists/SavedLists";
import MapToggle from "./MapToggle/MapToggle";

// Hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useGetUserLocation from "../../hooks/useGetUserLocation";
// State
import { useMapContext } from "../../state/MapContext";
import { useSearchContext } from "../../state/SearchContext";
// Styles
import styles from "./Home.module.css";
import CreateListModal from "../../modals/CreateListModal/CreateListModal";

const Home = () => {
  const { setCenter, showMap, currentMapPins } = useMapContext();
  const { nearby, searchLocation } = useSearchContext();

  const { appUser } = useAppUser();
  const { allListsData } = useListPlaces(appUser?.data.userId);

  const getUserLocation = useGetUserLocation();

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    console.log("searchLocation", searchLocation);
    console.log("nearby", nearby);
    if (nearby && searchLocation.coords) {
      setCenter(searchLocation.coords);
    }
  }, [searchLocation, nearby]);

  return (
    <div className={styles.mainContainer}>
      <Outlet />
      {showMap && <SearchBar />}
      <MapView markerList={currentMapPins} />
      {!showMap && (
        <div className={styles.homePageContent}>
          <SearchBar />
          <SavedLists allListsData={allListsData} />
        </div>
      )}
      <MapToggle />
      <CreateListModal />
    </div>
  );
};

export default Home;
