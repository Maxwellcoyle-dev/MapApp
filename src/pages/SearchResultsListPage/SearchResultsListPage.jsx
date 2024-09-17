// Libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Components
import MapListViewCard from "../../components/MapComponent/MapListViewCard/MapListViewCard";
import SavePlaceModal from "../../components/SavePlaceModal/SavePlaceModal";

// State
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";
import { useAppContext } from "../../state/AppContext";
import { useAuthContext } from "../../state/AuthContext";

// Hooks
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// Styles
import styles from "./SearchResultsListPage.module.css";

const SearchResultsListPage = () => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { showSavePlaceModal, setShowSavePlaceModal } = useAppContext();
  const { showMap, setCurrentMapPins } = useMapContext();
  const { searchQuery, setSearchQuery } = useSearchContext();

  const { placesResults, isPlacesResultsLoading, refetchPlacesResults } =
    usePlacesSearch(searchQuery);

  const { setPlaceType } = useSearchContext();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const handleBack = () => {
    setPlaceType(null);
    setSearchQuery("");
    navigate(-1);
  };

  if (!placesResults || placesResults?.length === 0) {
    refetchPlacesResults();
  }

  useEffect(() => {
    if (placesResults) {
      setCurrentMapPins(placesResults);
    }
  }, [placesResults]);

  return (
    <div className={!showMap ? styles.listViewDiv : styles.listViewDivHide}>
      <Button
        icon={<ArrowLeftOutlined />}
        className={styles.backButton}
        onClick={handleBack}
      />

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

export default SearchResultsListPage;
