import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "antd";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";

import styles from "./List.module.css";

const List = () => {
  const { id } = useParams();
  const location = useLocation();

  const { state } = location;

  const { listPlacesData, listPlacesDataError, isListPlacesDataLoading } =
    useListPlaces(state.listId.S);

  useEffect(() => {
    if (state) {
      console.log("state -- ", state);
    }
  }, [state]);

  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);

  useEffect(() => {
    console.log("listPlacesData", listPlacesData);
  }, [listPlacesData]);

  return (
    <div className={styles.listPageContainer}>
      <h1>{state.listName.S}</h1>
      {state.description?.S ? (
        <p> "Add description"</p>
      ) : (
        <Button>Add description</Button>
      )}
    </div>
  );
};

export default List;
