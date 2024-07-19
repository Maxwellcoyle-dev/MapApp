import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Image } from "antd";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";

import styles from "./List.module.css";

const List = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const { listPlacesData, isListPlacesDataLoading } = useListPlaces(
    state.listId.S
  );

  useEffect(() => {
    console.log("state -- ", state);
  }, []);

  useEffect(() => {
    if (listPlacesData) {
      console.log("listPlacesData", listPlacesData);
    }
  }, [listPlacesData]);

  return (
    <div className={styles.listPageContainer}>
      <h1>{state.listName.S}</h1>
      {state.description?.S ? (
        <p> "Add description"</p>
      ) : (
        <Button>Add description</Button>
      )}
      {isListPlacesDataLoading && <p>Loading...</p>}
      {listPlacesData && listPlacesData.length > 0 && (
        <div className={styles.listItemContainer}>
          {listPlacesData.map((place) => (
            <div
              key={place.placeId.S}
              className={styles.listItem}
              onClick={() => navigate(`/place/${place.placeId.S}`)}
            >
              <Image
                className={styles.image}
                key={place.photos.SS[0]}
                src={place.photos.SS[0]}
                alt={`${place?.name.S} photo`}
              />

              <h2>{place.name.S}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
