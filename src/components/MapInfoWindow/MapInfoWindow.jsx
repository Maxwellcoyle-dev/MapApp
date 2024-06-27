import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdFormatListBulletedAdd,
  MdLabelOutline,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdDirections,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import styles from "./MapInfoWindow.module.css"; // Import the CSS module

const MapInfoWindow = ({ placeDetails, handleInfoWindowClose }) => {
  const [openPlace, setOpenPlace] = useState(false);

  const handlers = useSwipeable({
    onSwipedUp: () => setOpenPlace(true),
    onSwipedDown: () => setOpenPlace(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false, // you can set this to true if you want to support mouse swipes as well
  });

  useEffect(() => {
    console.log("placeDetails: ", placeDetails);
  }, [placeDetails]);

  return (
    <div
      className={`${styles.infoWindow} ${placeDetails ? styles.open : ""} ${
        openPlace ? styles.fullOpen : ""
      }`}
    >
      {placeDetails && (
        <>
          <div className={styles.controlDiv}>
            <div className={styles.swipeDiv}></div>
          </div>
          <div className={styles.optionsDiv}>
            <button className={styles.button}>
              <MdLabelOutline className={styles.icon} />
            </button>
            <button className={styles.button}>
              <MdFormatListBulletedAdd className={styles.icon} />
            </button>
            <button className={styles.button} onClick={handleInfoWindowClose}>
              <MdClose className={styles.icon} />
            </button>
          </div>
          <div className={styles.headerDiv}>
            <h2>{placeDetails.name}</h2>
            {placeDetails.types.includes("cafe") && (
              <MdOutlineLocalCafe className={styles.icon} />
            )}
            {placeDetails.types.includes("restaurant") && (
              <MdOutlineRestaurant className={styles.icon} />
            )}
            {placeDetails.types.includes("bar") && (
              <MdOutlineLocalBar className={styles.icon} />
            )}
          </div>
          {/* when user clicks the addressDic, open a new google maps page with the place for directions */}
          <div
            className={styles.addressDiv}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${placeDetails.lat},${placeDetails.lng}`
              );
            }}
          >
            <p>{placeDetails.address}</p>
            <MdDirections className={styles.directionsIcon} />
          </div>
          <div className={styles.ratingsDiv}>
            <p>{placeDetails.rating}</p>
            {[1, 2, 3, 4, 5].map((star) => {
              if (placeDetails.rating >= star) {
                return (
                  <MdOutlineStar key={star} className={styles.ratingStar} />
                );
              } else if (placeDetails.rating >= star - 0.5) {
                return (
                  <MdOutlineStarHalf key={star} className={styles.ratingStar} />
                );
              } else {
                return (
                  <MdOutlineStarBorder
                    key={star}
                    className={styles.ratingStar}
                  />
                );
              }
            })}
            <p>({placeDetails.totalUserRatings} reviews)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MapInfoWindow;
