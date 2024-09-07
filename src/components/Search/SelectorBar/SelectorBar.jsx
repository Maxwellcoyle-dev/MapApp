// Libraries
import React, { useEffect } from "react";

// Hooks
import useListPlaces from "../../../hooks/backend-hooks/useListPlaces";
import useAppUser from "../../../hooks/backend-hooks/useAppUser";

// State
import { useSearchContext } from "../../../state/SearchContext";

const SelectorBar = () => {
  const { placeType, setPlaceType } = useSearchContext();

  const { appUser } = useAppUser();

  const { allListsData } = useListPlaces(appUser?.data?.userId);

  useEffect(() => {
    console.log("place type selector mounted");
    console.log("allListsData", allListsData);
  }, [allListsData]);

  return (
    <div className={styles.placeTypeSelectorContainer}>
      <div className={styles.scrollContainer}>
        {types.map((type) => (
          <div
            key={type.value}
            className={
              placeType === type.value
                ? styles.typeContainerSelected
                : styles.typeContainer
            }
            onClick={() => setPlaceType(type.value)}
          >
            {type.icon}
            <span className={styles.text}>{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectorBar;
