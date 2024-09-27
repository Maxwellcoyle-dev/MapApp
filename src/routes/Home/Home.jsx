// Libraries
import React, { useEffect, useRef, useState, useCallback } from "react";

import { Outlet } from "react-router-dom";

// Components
import MapView from "./Map/MapView";
import Search from "./Search/Search";
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
  const searchRef = useRef(null);

  const [homePageContentTopPadding, setHomePageContentTopPadding] = useState(
    searchRef?.current?.offsetHeight || 0
  );
  const { setCenter, showMap } = useMapContext();
  const { nearby, searchLocation } = useSearchContext();

  const { appUser } = useAppUser();
  const { allListsData } = useListPlaces(appUser?.data.userId);

  const getUserLocation = useGetUserLocation();

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (nearby && searchLocation.coords) {
      setCenter(searchLocation.coords);
    }
  }, [searchLocation, nearby, setCenter]);

  const updatePadding = useCallback(() => {
    if (searchRef.current) {
      const height = searchRef.current.offsetHeight;
      setHomePageContentTopPadding(height);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <Outlet />
      <Search searchRef={searchRef} onToggle={updatePadding} />
      <MapView />
      {!showMap && (
        <div
          className={styles.homePageContent}
          style={{ paddingTop: `${homePageContentTopPadding}px` }}
        >
          <SavedLists allListsData={allListsData} />
        </div>
      )}
      <MapToggle />
      <CreateListModal />
    </div>
  );
};

export default Home;
