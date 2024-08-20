// Libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Skeleton } from "antd";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  MdOutlineStar,
  MdOutlineStarHalf,
  MdOutlineStarBorder,
} from "react-icons/md";

// State
import { useSearchContext } from "../../../state/SearchContext";

// hooks
import usePlaceIsSaved from "../../../hooks/usePlaceIsSaved";

// Styles
import styles from "./MapListViewCard.module.css";

const MapListViewCard = ({ place, placeId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { setSelectedPlace } = useSearchContext();

  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);

  const navigate = useNavigate();

  useEffect(() => {
    if (place && place.photos && place.photos.length > 0) {
      const image = place.photos[0].getUrl();
      setImageUrl(image);
    } else {
      setImageUrl(null);
    }
  }, [place]);

  const handleSavePlace = () => {
    setSelectedPlace(place);
    navigate("/save-place");
  };

  if (!place) {
    return (
      <div>
        <Skeleton.Image className={styles.cardImage} />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div>
      {!place ? (
        <div>
          <Skeleton.Image className={styles.cardImage} />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <div
              className={styles.imageDiv}
              onClick={() => navigate(`/place/${placeId}`)}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  className={styles.cardImage}
                  preview={false}
                />
              ) : (
                <Skeleton.Image className={styles.cardImage} />
              )}
            </div>
            <div className={styles.iconOverlayContainer}>
              <div className={styles.iconContainer} onClick={handleSavePlace}>
                {isPlaceSaved ? (
                  <FaHeart className={styles.overlayIcon} />
                ) : (
                  <FaRegHeart className={styles.overlayIcon} />
                )}
              </div>
            </div>
          </div>
          <div
            className={styles.headerDiv}
            onClick={() => navigate(`/place/${placeId}`)}
          >
            <h3>{place?.placeName}</h3>
            {/* {place?.opening_hours !== null && (
              <p
                className={
                  place.opening_hours.open_now ? styles.open : styles.closed
                }
              >
                {place.opening_hours.open_now ? "Open" : "Closed"}
              </p>
            )} */}
          </div>
          <div
            className={styles.infoDiv}
            onClick={() => navigate(`/place/${placeId}`)}
          >
            <div className={styles.ratingDiv}>
              <p>{place?.rating}</p>
              {[1, 2, 3, 4, 5].map((star) => {
                if (place?.rating >= star) {
                  return (
                    <MdOutlineStar key={star} className={styles.ratingStar} />
                  );
                } else if (place?.rating >= star - 0.5) {
                  return (
                    <MdOutlineStarHalf
                      key={star}
                      className={styles.ratingStar}
                    />
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
              <p>({place?.user_ratings_total} reviews)</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapListViewCard;
