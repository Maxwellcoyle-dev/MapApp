// Libraries
import React, { useEffect } from "react";
import { Spin } from "antd";

// Components
import ListCard from "../ListCard/ListCard";

// Styles
import styles from "./ListView.module.css";

const ListView = ({ placesResults, isPlacesResultsLoading }) => {
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
              <ListCard key={result.place_id} place={result} />
            )
        )}
    </div>
  );
};

export default ListView;
