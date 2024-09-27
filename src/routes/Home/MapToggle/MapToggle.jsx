import React from "react";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";

// State
import { useMapContext } from "../../../state/MapContext";

import styles from "./MapToggle.module.css";

const MapToggle = () => {
  const { showMap, setShowMap } = useMapContext();

  return showMap ? (
    <div className={styles.toggleButtonDiv} onClick={() => setShowMap(false)}>
      <MdFormatListBulleted className={styles.viewToggleIcon} />
    </div>
  ) : (
    <div className={styles.toggleButtonDiv} onClick={() => setShowMap(true)}>
      <MdOutlineMap className={styles.viewToggleIcon} />
    </div>
  );
};

export default MapToggle;
