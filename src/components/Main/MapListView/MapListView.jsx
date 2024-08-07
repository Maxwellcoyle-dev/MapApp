// Libraries
import React, { useEffect } from "react";
import { Spin } from "antd";

// Components
import MapListViewCard from "../MapListViewCard/MapListViewCard";

// Styles
import styles from "./MapListView.module.css";

const MapListView = ({ placesResults, isPlacesResultsLoading }) => {
  useEffect(() => {
    console.log("ListView - placesResults:", placesResults);
  }, [placesResults]);

  return (
    <div className={styles.listViewDiv}>
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
              <MapListViewCard key={result.place_id} place={result} />
            )
        )}
    </div>
  );
};

export default MapListView;
