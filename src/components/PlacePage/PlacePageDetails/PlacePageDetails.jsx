import React from "react";
import { MdLocationOn, MdPhone, MdWeb } from "react-icons/md";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";

import styles from "./PlacePageDetails.module.css";

const PlacePageDetails = ({
  address,
  phone,
  website,
  rating,
  totalUserRatings,
  onDirectionsClick,
}) => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.googleRatingsDiv}>
        <p className={styles.ratingText}>{rating.toFixed(1)}</p>
        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => {
            if (rating >= star) {
              return <MdOutlineStar key={star} className={styles.ratingStar} />;
            } else if (rating >= star - 0.5) {
              return (
                <MdOutlineStarHalf key={star} className={styles.ratingStar} />
              );
            } else {
              return (
                <MdOutlineStarBorder key={star} className={styles.ratingStar} />
              );
            }
          })}
        </div>
        <p className={styles.totalReviews}>({totalUserRatings} reviews)</p>
      </div>
      <div className={styles.detailItem} onClick={onDirectionsClick}>
        <MdLocationOn className={styles.icon} />
        <p className={styles.text}>{address}</p>
      </div>
      <div className={styles.detailItem}>
        <MdPhone className={styles.icon} />
        <a href={`tel:${phone}`} className={styles.text}>
          {phone}
        </a>
      </div>
      <div className={styles.detailItem}>
        <MdWeb className={styles.icon} />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.text}
        >
          Website
        </a>
      </div>
    </div>
  );
};

export default PlacePageDetails;
