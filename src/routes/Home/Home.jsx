// Libraries
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Radio } from "antd";

// Components
import MapView from "./Map/MapView";
import Search from "./Search/Search";
import SavedLists from "./SavedLists/SavedLists";
import MapToggle from "./MapToggle/MapToggle";
import SearchResultsPage from "../SearchResultsPage/SearchResultsPage";

// Hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useGetUserLocation from "../../hooks/useGetUserLocation";
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";
// State
import { useMapContext } from "../../state/MapContext";
import { useSearchContext } from "../../state/SearchContext";
// Styles
import styles from "./Home.module.css";
import CreateListModal from "../../modals/CreateListModal/CreateListModal";

const Home = () => {
  const [homeContent, setHomeContent] = useState("home");
  const searchRef = useRef(null);

  const [homePageContentTopPadding, setHomePageContentTopPadding] = useState(
    searchRef?.current?.offsetHeight || 0
  );
  const { setCenter, showMap } = useMapContext();
  const { nearby, searchLocation, searchQuery, queryInput, selectedPlace } =
    useSearchContext();

  const { appUser } = useAppUser();
  const { allListsData } = useListPlaces(appUser?.data.userId);

  const { placesResults } = usePlacesSearch(searchQuery);

  const getUserLocation = useGetUserLocation();

  useEffect(() => {
    if (placesResults) {
      setHomeContent("results");
    } else {
      setHomeContent("home");
    }
  }, [placesResults]);

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
      <MapView topPadding={homePageContentTopPadding} />
      {!showMap && (
        <div
          className={styles.homePageContent}
          style={{ paddingTop: `${homePageContentTopPadding}px` }}
        >
          <div className={styles.radioDiv}>
            <Radio.Group
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              value={homeContent}
              onChange={(e) => setHomeContent(e.target.value)}
            >
              <Radio.Button value="home">Home</Radio.Button>
              <Radio.Button value="results" disabled={!placesResults}>
                Results
              </Radio.Button>
            </Radio.Group>
          </div>
          {homeContent === "home" && <SavedLists allListsData={allListsData} />}
          {homeContent === "results" && <SearchResultsPage />}
        </div>
      )}
      {!selectedPlace && <MapToggle />}
      <CreateListModal />
    </div>
  );
};

export default Home;
