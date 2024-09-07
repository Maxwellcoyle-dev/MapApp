// Libraries
import React, { useEffect } from "react";
import { Spin } from "antd";

// Components
import MapListViewCard from "../MapListViewCard/MapListViewCard";

// Styles
import styles from "./MapListView.module.css";

const MapListView = ({ currentMapPins, isPlacesResultsLoading }) => {
  useEffect(() => {
    console.log("ListView - currentMapPins:", currentMapPins);
  }, [currentMapPins]);

  return (
    <div className={styles.listViewDiv}>
      {isPlacesResultsLoading && (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}

      {currentMapPins &&
        currentMapPins.map(
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

export default MapListView;
