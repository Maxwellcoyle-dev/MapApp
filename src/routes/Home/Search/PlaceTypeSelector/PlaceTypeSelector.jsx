// Libraries
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoRestaurantOutline } from "react-icons/io5";
import {
  MdOutlineSportsBar,
  MdOutlineBrunchDining,
  MdOutlineBakeryDining,
  MdOutlineBreakfastDining,
  MdOutlineLocalCafe,
} from "react-icons/md";
import { BiCoffeeTogo } from "react-icons/bi";

// State
import { useSearchContext } from "../../../../state/SearchContext";

// Styles
import styles from "./PlaceTypeSelector.module.css";

const types = [
  {
    name: "Restaurants",
    value: "restaurant",
    icon: <IoRestaurantOutline className={styles.typeIcon} />,
  },
  {
    name: "Coffee",
    value: "coffee_shop",
    icon: <BiCoffeeTogo className={styles.typeIcon} />,
  },
  {
    name: "Bars",
    value: "bar",
    icon: <MdOutlineSportsBar className={styles.typeIcon} />,
  },
  {
    name: "Brunch",
    value: "brunch_restaurant",
    icon: <MdOutlineBrunchDining className={styles.typeIcon} />,
  },
  {
    name: "Bakeries",
    value: "bakery",
    icon: <MdOutlineBakeryDining className={styles.typeIcon} />,
  },
  {
    name: "Cafes",
    value: "cafe",
    icon: <MdOutlineLocalCafe className={styles.typeIcon} />,
  },
  {
    name: "Breakfast",
    value: "breakfast_restaurant",
    icon: <MdOutlineBreakfastDining className={styles.typeIcon} />,
  },
];

const PlaceTypeSelector = () => {
  const { placeType, setPlaceType } = useSearchContext();

  const navigate = useNavigate();

  return (
    <div className={styles.placeTypeSelectorContainer}>
      <h4>Type of Place</h4>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContainer}>
          {types.map((type) => (
            <div
              key={type.value}
              className={
                placeType === type.value
                  ? styles.typeContainerSelected
                  : styles.typeContainer
              }
              onClick={() => {
                setPlaceType(type.value);
                navigate(`/results-list`);
              }}
            >
              {type.icon}
              <span className={styles.text}>{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceTypeSelector;
