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
import { useParams, useNavigate } from "react-router-dom";

import useGetPlace from "../../hooks/useGetPlace";
import styles from "./PlaceDetails.module.css";

const PlaceDetails = () => {
  const [openPlace, setOpenPlace] = useState(false);
  const navigate = useNavigate();
  const { placeId } = useParams();

  useEffect(() => {
    console.log("placeId: ", placeId);
  }, [placeId]);

  const { placeData, isPlaceDataLoading, isPlaceDataError, placeDataError } =
    useGetPlace(placeId);

  useEffect(() => {
    console.log("placeData: ", placeData);
  }, [placeData]);

  const handleClosePlace = () => {};

  if (isPlaceDataLoading) {
    return <div>Loading...</div>;
  }

  if (isPlaceDataError) {
    return <div>Error: {placeDataError}</div>;
  }

  if (!placeData) {
    return <div>No place data found</div>;
  }

  return (
    <div className={`${styles.infoWindow} ${openPlace ? styles.fullOpen : ""}`}>
      {placeData && (
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
            <button className={styles.button} onClick={handleClosePlace}>
              <MdClose className={styles.icon} />
            </button>
          </div>
          <div className={styles.headerDiv}>
            <h2>{placeData.name}</h2>
            {placeData.types.includes("cafe") && (
              <MdOutlineLocalCafe className={styles.icon} />
            )}
            {placeData.types.includes("restaurant") && (
              <MdOutlineRestaurant className={styles.icon} />
            )}
            {placeData.types.includes("bar") && (
              <MdOutlineLocalBar className={styles.icon} />
            )}
          </div>
          {/* when user clicks the addressDic, open a new google maps page with the place for directions */}
          <div
            className={styles.addressDiv}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${placeData.lat},${placeData.lng}`
              );
            }}
          >
            <p>{placeData.address}</p>
            <MdDirections className={styles.directionsIcon} />
          </div>
          <div className={styles.ratingsDiv}>
            <p>{placeData.rating}</p>
            {[1, 2, 3, 4, 5].map((star) => {
              if (placeData.rating >= star) {
                return (
                  <MdOutlineStar key={star} className={styles.ratingStar} />
                );
              } else if (placeData.rating >= star - 0.5) {
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
            <p>({placeData.totalUserRatings} reviews)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceDetails;
