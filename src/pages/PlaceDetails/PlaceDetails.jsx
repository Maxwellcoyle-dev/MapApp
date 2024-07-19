// Libraries
import React, { useEffect } from "react";
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
import { useParams } from "react-router-dom";

// Components
import PhotoDisplay from "../../components/PhotoDisplay/PhotoDisplay";

// Hooks
import useGetPlaceDetails from "../../hooks/google-api-hooks/useGetPlaceDetails";
import useClosePlaceDetails from "../../hooks/useClosePlaceDetails";

// Styles
import styles from "./PlaceDetails.module.css";

const PlaceDetails = () => {
  const { placeId } = useParams();

  const handleClosePlace = useClosePlaceDetails();

  const { placeData } = useGetPlaceDetails(placeId);

  useEffect(() => {
    console.log("placeData: ", placeData);
  }, [placeData]);

  return (
    <div className={styles.placeDetailsDiv}>
      {placeData && (
        <>
          <div className={styles.optionsDiv}>
            <div className={styles.optionsIconDiv}>
              <MdLabelOutline className={styles.icon} />
            </div>
            <div className={styles.optionsIconDiv}>
              <MdFormatListBulletedAdd className={styles.icon} />
            </div>
            <div className={styles.optionsIconDiv} onClick={handleClosePlace}>
              <MdClose className={styles.icon} />
            </div>
          </div>
          <PhotoDisplay placeData={placeData} />
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
            <p>{placeData.formatted_address}</p>
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
