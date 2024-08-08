import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Carousel, Spin, Tooltip } from "antd";
import { FaRegHeart, FaHeart } from "react-icons/fa";
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

// Hooks
import useGetOptimalPlaceData from "../../hooks/useGetOptimalPlaceData";
import usePlaceIsSaved from "../../hooks/usePlaceIsSaved";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";

// Styles
import styles from "./PlacePage.module.css";

const PlacePage = () => {
  const [placeIds, setPlaceIds] = useState([]);
  const [photos, setPhotos] = useState([]);

  const { placeId } = useParams();
  const navigate = useNavigate();

  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);

  const { optimalPlaceData, optimalPlaceDataLoading, optimalPlaceDataError } =
    useGetOptimalPlaceData(placeId);

  const { placesPhotos } = useGetPhotos(placeIds);

  useEffect(() => {
    if (optimalPlaceData && !optimalPlaceData?.photos) {
      const placeIds = [
        optimalPlaceData?.placeId
          ? optimalPlaceData.placeId
          : optimalPlaceData.place_id,
      ];
      setPlaceIds(placeIds);
    }
    if (optimalPlaceData && optimalPlaceData?.photos) {
      const photoUrls = optimalPlaceData.photos.map((photo) => {
        return photo.getUrl();
      });
      setPhotos(photoUrls);
    }
  }, [optimalPlaceData]);

  useEffect(() => {
    if (placesPhotos) {
      // extract the photo url from the placesPhotos array getUrl ([0].photos[0].getUrl)
      const photoUrls = placesPhotos.map((place) => {
        return place.photos[0].getUrl();
      });

      setPhotos(photoUrls);
    }
  }, [placesPhotos]);

  if (optimalPlaceDataLoading) {
    return (
      <div className={styles.loadingDiv}>
        <p>Loading place details...</p>
        <Spin size="large" />
      </div>
    );
  }

  if (optimalPlaceDataError) {
    return (
      <div className={styles.placeDetailsDiv}>
        <p>Error loading place details: {optimalPlaceDataError}</p>
      </div>
    );
  }

  return (
    <div className={styles.placeDetailsDiv}>
      {optimalPlaceData && (
        <>
          <div className={styles.carouselContainer}>
            <Carousel className={styles.carousel}>
              {photos &&
                photos?.map((photo, index) => (
                  <div key={index} className={styles.photoDiv}>
                    <Image
                      className={styles.mainImage}
                      src={photo}
                      alt={optimalPlaceData?.name}
                    />
                  </div>
                ))}
            </Carousel>
            <div className={styles.overlayIcons}>
              {isPlaceSaved ? (
                <div className={styles.iconDiv}>
                  <FaHeart className={styles.overlayIcon} />
                </div>
              ) : (
                <div
                  className={styles.iconDiv}
                  onClick={() => navigate(`/save-place/${placeId}`)}
                >
                  <FaRegHeart className={styles.overlayIcon} />
                </div>
              )}
              <Tooltip
                title={
                  isPlaceSavedLoading || !isPlaceSaved
                    ? "Save the place before adding a tag"
                    : ""
                }
              >
                <div
                  className={styles.iconDiv}
                  onClick={
                    isPlaceSavedLoading || !isPlaceSaved
                      ? undefined
                      : () => navigate(`/add-tag/${placeId}`)
                  }
                >
                  <MdOutlineNewLabel
                    className={
                      isPlaceSavedLoading || !isPlaceSaved
                        ? styles.overlayIconDisabled
                        : styles.overlayIcon
                    }
                  />
                </div>
              </Tooltip>
              <div className={styles.iconDiv}>
                <MdClose
                  className={styles.overlayIcon}
                  onClick={() => navigate(-1)}
                />
              </div>
            </div>
          </div>
          <div className={styles.headerDiv}>
            <h2>{optimalPlaceData?.name}</h2>
            {optimalPlaceData?.types?.includes("cafe") && (
              <MdOutlineLocalCafe className={styles.icon} />
            )}
            {optimalPlaceData?.types?.includes("restaurant") && (
              <MdOutlineRestaurant className={styles.icon} />
            )}
            {optimalPlaceData?.types?.includes("bar") && (
              <MdOutlineLocalBar className={styles.icon} />
            )}
          </div>
          <div
            className={styles.addressDiv}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${optimalPlaceData?.lat},${optimalPlaceData?.lng}`
              );
            }}
          >
            <p>{optimalPlaceData?.formatted_address}</p>
            <MdDirections className={styles.directionsIcon} />
          </div>
          <div className={styles.ratingsDiv}>
            <p>{optimalPlaceData?.rating}</p>
            {[1, 2, 3, 4, 5].map((star) => {
              if (optimalPlaceData?.rating >= star) {
                return (
                  <MdOutlineStar key={star} className={styles.ratingStar} />
                );
              } else if (optimalPlaceData?.rating >= star - 0.5) {
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
            <p>({optimalPlaceData?.totalUserRatings} reviews)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PlacePage;
