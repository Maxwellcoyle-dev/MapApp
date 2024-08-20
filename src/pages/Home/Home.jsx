// Libraries
import React, { useEffect, useState } from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";

// Components
import MapView from "../../components/MapComponent/Map/MapView";
import MapListView from "../../components/MapComponent/MapListView/MapListView";
import SearchBar from "../../components/Search/SearchBar";
import PlaceTypeSelector from "../../components/Search/PlaceTypeSelector/PlaceTypeSelector";
import MyLists from "../../components/MyLists/MyLists";

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

const Home = () => {
  const { userLocation } = useAppContext();
  const { setCenter, showMap, setShowMap } = useMapContext();

  const { appUser } = useAppUser();
  const { allListsData, allListsIsLoading } = useListPlaces(
    appUser?.data.userId
  );
  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  useEffect(() => {
    console.log("all lists data:", allListsData);
  }, [allListsData]);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  return (
    <div className={styles.mainContainer}>
      <SearchBar />
      <MapView markerList={placesResults} />
      {!showMap && (
        <div className={styles.homePageContent}>
          <PlaceTypeSelector />
          <MyLists allListsData={allListsData} />
          <MapListView
            placesResults={placesResults}
            isPlacesResultsLoading={isPlacesResultsLoading}
          />
        </div>
      )}
      {showMap ? (
        <div
          className={styles.toggleButtonDiv}
          onClick={() => setShowMap(false)}
        >
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      ) : (
        <div
          className={styles.toggleButtonDiv}
          onClick={() => setShowMap(true)}
        >
          <MdOutlineMap className={styles.viewToggleIcon} />
        </div>
      )}
      <CreateListModal />
    </div>
  );
};

export default Home;
