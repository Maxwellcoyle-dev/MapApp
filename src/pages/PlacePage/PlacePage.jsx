// Libraries
import React, { useEffect } from "react";
import {
  MdClose,
  MdOutlineNewLabel,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdDirections,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Image, Skeleton, Carousel } from "antd";
import { useParams, useNavigate } from "react-router-dom";

// Hooks
import useGetPlaceDetails from "../../hooks/google-api-hooks/useGetPlaceDetails";
import useClosePlaceDetails from "../../hooks/useClosePlaceDetails";
import usePlaceIsSaved from "../../hooks/usePlaceIsSaved";

// Styles
import styles from "./PlacePage.module.css";

const PlacePage = () => {
  const { placeId } = useParams();

  const handleClosePlace = useClosePlaceDetails();

  const { placeData } = useGetPlaceDetails(placeId);
  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("placeData: ", placeData);
  }, [placeData]);

  return (
    <div className={styles.placeDetailsDiv}>
      {placeData && (
        <>
          <div className={styles.carouselContainer}>
            <Carousel className={styles.carousel}>
              {placeData.photos?.map((photo, index) => (
                <div key={index} className={styles.photoDiv}>
                  <Image
                    className={styles.mainImage}
                    src={photo.getUrl()}
                    alt={placeData.name}
                  />
                </div>
              ))}
            </Carousel>
            <div className={styles.overlayIcons}>
              {isPlaceSavedLoading ? (
                <Skeleton.Avatar size="large" active />
              ) : isPlaceSaved ? (
                <div className={styles.iconDiv}>
                  <FaHeart className={styles.overlayIcon} />
                </div>
              ) : (
                <div className={styles.iconDiv}>
                  <FaRegHeart className={styles.overlayIcon} />
                </div>
              )}
              <div className={styles.iconDiv}>
                <MdOutlineNewLabel
                  className={styles.overlayIcon}
                  onClick={() => {
                    navigate(`/add-tag/${placeData.place_id}`);
                  }}
                />
              </div>
              <div className={styles.iconDiv}>
                <MdClose
                  className={styles.overlayIcon}
                  onClick={handleClosePlace}
                />
              </div>
            </div>
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

export default PlacePage;
