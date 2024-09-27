import React from "react";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import styles from "./PlacePageRating.module.css";

const PlacePageRating = ({ rating, totalUserRatings }) => {
  return (
    <div className={styles.ratingContainer}>
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
    </div>
  );
};

export default PlacePageRating;
