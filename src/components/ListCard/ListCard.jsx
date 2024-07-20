// Libraries
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Skeleton } from "antd";
import { FaRegHeart } from "react-icons/fa";
import {
  MdOutlineStar,
  MdOutlineStarHalf,
  MdOutlineStarBorder,
} from "react-icons/md";

// State
import { useAppContext } from "../../state/AppContext";

// Styles
import styles from "./ListCard.module.css";

const ListCard = ({ place }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { setShowAddToList } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (place && place.photos && place.photos.length > 0) {
      const image = place.photos[0].getUrl();
      setImageUrl(image);
    } else {
      setImageUrl(null);
    }
  }, [place]);

  useEffect(() => {
    let open = place?.opening_hours?.isOpen
      ? place.opening_hours.isOpen()
      : null;
    setIsOpen(open);
  }, [place]);

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
              onClick={() => navigate(`/place/${place.place_id}`)}
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
              <div
                className={styles.iconContainer}
                onClick={() => setShowAddToList(true)}
              >
                <FaRegHeart className={styles.overlayIcon} />
              </div>
            </div>
          </div>
          <div
            className={styles.headerDiv}
            onClick={() => navigate(`/place/${place.place_id}`)}
          >
            <h3>{place?.name}</h3>
            {isOpen !== null && (
              <p className={isOpen ? styles.open : styles.closed}>
                {isOpen ? "Open" : "Closed"}
              </p>
            )}
          </div>
          <div
            className={styles.infoDiv}
            onClick={() => navigate(`/place/${place.place_id}`)}
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

export default ListCard;
