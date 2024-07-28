// Libraries
import React, { useEffect } from "react";
import { Spin } from "antd";

// Components
import ListCard from "../../MapListViewCard/MapListViewCard";

// Styles
import styles from "./List.module.css";

const List = ({ placesResults, isPlacesResultsLoading }) => {
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
              <>
                <p>This List Component is displayed</p>
                <ListCard key={result.place_id} place={result} />
              </>
            )
        )}
    </div>
  );
};

export default List;
