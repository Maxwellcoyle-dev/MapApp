// Libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Skeleton } from "antd";
import { FaRegHeart } from "react-icons/fa";
import {
  MdOutlineStar,
  MdOutlineStarHalf,
  MdOutlineStarBorder,
  MdClose,
} from "react-icons/md";

// State
import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";

// Styles
import styles from "./PlaceDetailsCard.module.css";

const PlaceDetailsCard = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const { setShowAddToList } = useAppContext();
  const { selectedPlace, setSelectedPlace } = useSearchContext();
  const { setZoom, setCenter } = useMapContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedPlace &&
      selectedPlace.photos &&
      selectedPlace.photos.length > 0
    ) {
      const image = selectedPlace.photos[0].getUrl();
      setImageUrl(image);
    } else {
      setImageUrl(null);
    }
  }, [selectedPlace]);

  useEffect(() => {
    let open = selectedPlace?.opening_hours?.isOpen
      ? selectedPlace.opening_hours.isOpen()
      : null;
    setIsOpen(open);
  }, [selectedPlace]);

  const handleSavePlace = () => {
    navigate("/save-place");
  };

  if (!selectedPlace) {
    return (
      <div>
        <Skeleton.Image className={styles.cardImage} />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {!selectedPlace ? (
        <div>
          <Skeleton.Image className={styles.cardImage} />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <div
              className={styles.imageDiv}
              onClick={() => navigate(`/place/${selectedPlace.place_id}`)}
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
                <FaRegHeart className={styles.overlayIcon} />
              </div>
              <div
                className={styles.iconContainer}
                onClick={() => {
                  setSelectedPlace(null);
                  navigate("/");
                  setZoom(12);
                }}
              >
                <MdClose className={styles.overlayIcon} />
              </div>
            </div>
          </div>
          <div
            className={styles.contentContainer}
            onClick={() => navigate(`/place/${selectedPlace.place_id}`)}
          >
            <div className={styles.headerDiv}>
              <h3>{selectedPlace?.name}</h3>
              {isOpen !== null && (
                <p className={isOpen ? styles.open : styles.closed}>
                  {isOpen ? "Open" : "Closed"}
                </p>
              )}
            </div>
            <div className={styles.infoDiv}>
              <div className={styles.ratingDiv}>
                <p>{selectedPlace?.rating}</p>
                {[1, 2, 3, 4, 5].map((star) => {
                  if (selectedPlace?.rating >= star) {
                    return (
                      <MdOutlineStar key={star} className={styles.ratingStar} />
                    );
                  } else if (selectedPlace?.rating >= star - 0.5) {
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
                <p>({selectedPlace?.user_ratings_total} reviews)</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceDetailsCard;
