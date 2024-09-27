import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// components
import ListHeaderSection from "./ListHeaderSection/ListHeaderSection";
import ListBodySection from "./ListBodySection/ListBodySection";

// state
import { useMapContext } from "../../state/MapContext";

import styles from "./ListPage.module.css";

const List = () => {
  const [showFilterForm, setShowFilterForm] = useState(false);

  const { showMap, setCurrentMapPins } = useMapContext();

  const location = useLocation();
  const { listId } = useParams();
  const { state } = location;

  return (
    <div
      className={
        !showMap ? styles.listPageContainer : styles.listPageContainerHide
      }
    >
      <ListHeaderSection
        listPageState={state}
        listId={listId}
        setShowFilterForm={setShowFilterForm}
        showFilterForm={showFilterForm}
      />
      <ListBodySection
        listId={listId}
        showFilterForm={showFilterForm}
        setShowFilterForm={setShowFilterForm}
      />
    </div>
  );
};

export default List;
