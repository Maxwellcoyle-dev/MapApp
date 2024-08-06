import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// components
import ListHeaderSection from "../../components/ListPage/ListHeaderSection/ListHeaderSection";
import ListBodySection from "../../components/ListPage/ListBodySection/ListBodySection";

import styles from "./ListPage.module.css";

const List = () => {
  const [showFilterForm, setShowFilterForm] = useState(false);

  const location = useLocation();
  const { listId } = useParams();
  const { state } = location;

  return (
    <div className={styles.listPageContainer}>
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
