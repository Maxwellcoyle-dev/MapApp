import React, { useState } from "react";
import { IoRestaurantOutline } from "react-icons/io5";
import {
  MdOutlineSportsBar,
  MdOutlineBrunchDining,
  MdOutlineBakeryDining,
  MdOutlineBreakfastDining,
  MdOutlineLocalCafe,
  MdOutlineSearch,
} from "react-icons/md";
import { BiCoffeeTogo } from "react-icons/bi";

import styles from "./PlaceTypeSelector.module.css";

import { useSearchContext } from "../../../state/SearchContext";

const types = [
  {
    name: "All",
    value: "establishment",
    icon: <MdOutlineSearch className={styles.typeIcon} />,
  },
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

export default PlaceTypeSelector;
