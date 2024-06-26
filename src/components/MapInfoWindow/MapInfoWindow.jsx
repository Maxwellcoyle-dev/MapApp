import React, { useEffect } from "react";
import {
  MdClose,
  MdOutlineSearch,
  MdFormatListBulletedAdd,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdDirections,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";
import styles from "./MapInfoWindow.module.css"; // Import the CSS module

const MapInfoWindow = ({ placeDetails, handleInfoWindowClose }) => {
  useEffect(() => {
    console.log("placeDetails: ", placeDetails);
  }, [placeDetails]);

  return (
    <div className={`${styles.infoWindow} ${placeDetails ? styles.open : ""}`}>
      {placeDetails && (
        <>
          <div className={styles.optionsDiv}>
            <button className={styles.button}>
              <MdOutlineSearch />
            </button>
            <button className={styles.button}>
              <MdFormatListBulletedAdd />
            </button>
            <button className={styles.button} onClick={handleInfoWindowClose}>
              <MdClose />
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
