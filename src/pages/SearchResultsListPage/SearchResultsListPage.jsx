// Libraries
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Components
import MapListViewCard from "../../components/MapComponent/MapListViewCard/MapListViewCard";

// State
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";

// Hooks
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

// Styles
import styles from "./SearchResultsListPage.module.css";

const SearchResultsListPage = () => {
  const navigate = useNavigate();
  const { showMap, setCurrentMapPins } = useMapContext();
  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();
  const { setPlaceType } = useSearchContext();

  const handleBack = () => {
    setPlaceType(null);
    navigate(-1);
  };

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
              />
            )
        )}
    </div>
  );
};

export default SearchResultsListPage;
