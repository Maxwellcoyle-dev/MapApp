// Libraries
import React, { useEffect, useState } from "react";
import { Spin } from "antd";

// Modals
import SavePlaceModal from "../../modals/SavePlaceModal/SavePlaceModal";

// Components
import MapListViewCard from "../Home/Map/MapListViewCard/MapListViewCard";

// State
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";
import { useAppContext } from "../../state/AppContext";
import { useAuthContext } from "../../state/AuthContext";

// Hooks
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// Styles
import styles from "./SearchResultsPage.module.css";

const SearchResultsPage = () => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const { user } = useAuthContext();
  const { showSavePlaceModal, setShowSavePlaceModal } = useAppContext();
  const { showMap, setCurrentMapPins } = useMapContext();
  const { searchQuery } = useSearchContext();

  const { placesResults, isPlacesResultsLoading, refetchPlacesResults } =
    usePlacesSearch(searchQuery);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  if (!placesResults || placesResults?.length === 0) {
    refetchPlacesResults();
  }

  useEffect(() => {
    if (placesResults) {
      setCurrentMapPins(placesResults);
    }
  }, [placesResults, setCurrentMapPins]);

  return (
    <div className={!showMap ? styles.listViewDiv : styles.listViewDivHide}>
      {isPlacesResultsLoading && (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
      {placesResults &&
        placesResults.map(
          (result) =>
            result.photos &&
            result.photos.length > 0 && (
              <MapListViewCard
                key={result.placeId}
                placeId={result.placeId}
                place={result}
                setSelectedPlaceId={setSelectedPlaceId}
                setShowSavePlaceModal={setShowSavePlaceModal}
              />
            )
        )}
      <SavePlaceModal
        visible={showSavePlaceModal}
        onClose={() => setShowSavePlaceModal(false)}
        placeId={selectedPlaceId} // Pass the appropriate placeId here
        userId={user?.sub}
      />
    </div>
  );
};

export default SearchResultsPage;
