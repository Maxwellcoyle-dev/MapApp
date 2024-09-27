import React, { useEffect, useState } from "react";
import {
  MdLocationOn,
  MdPhone,
  MdWeb,
  MdSchedule,
  MdRateReview,
} from "react-icons/md";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdLocationCity,
} from "react-icons/md";

import styles from "./PlacePageDetails.module.css";

const PlacePageDetails = ({
  address,
  phone,
  website,
  rating,
  userRatingsTotal,
  openingHours,
  vicinity,
  reviews,
  onDirectionsClick,
}) => {
  const [expandedReviews, setExpandedReviews] = useState(
    new Array(reviews?.length).fill(false)
  );

  useEffect(() => {
    console.log("reviews", reviews);
  }, [reviews]);

  const toggleReviewExpansion = (index) => {
    setExpandedReviews((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className={styles.detailsContainer}>
      {/* Google Info Header */}
      <div className={styles.googleInfoHeader}>
        <h2>Google Info</h2>
        {/* <MdRefresh className={styles.refreshIcon} onClick={onRefreshClick} /> */}
      </div>

      {/* Google Ratings */}
      <div className={styles.googleRatingsDiv}>
        <p className={styles.ratingText}>{rating.toFixed(1)}</p>
        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5]?.map((star) => {
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
        <p className={styles.totalReviews}>({userRatingsTotal} reviews)</p>
      </div>

      <div className={styles.detailItemContainer}>
        {/* Address */}
        <div className={styles.detailItem} onClick={onDirectionsClick}>
          <MdLocationOn className={styles.icon} />
          <p className={styles.text}>{address}</p>
        </div>

        {/* Phone */}
        <div className={styles.detailItem}>
          <MdPhone className={styles.icon} />
          <a href={`tel:${phone}`} className={styles.text}>
            {phone}
          </a>
        </div>

        {/* Website */}
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

        {/* Vicinity */}
        <div className={styles.detailItem}>
          <MdLocationCity className={styles.icon} />

          <p className={styles.text}>{vicinity.split(",").pop().trim()}</p>
        </div>
      </div>

      {/* Opening Hours */}
      <div className={styles.hoursContainer}>
        <MdSchedule className={styles.icon} />
        <div className={styles.hoursText}>
          {openingHours.weekday_text?.map((day, index) => (
            <div key={index} className={styles.dayContainer}>
              <span className={styles.day}>{day.split(": ")[0]}</span>
              <span className={styles.hours}>{day.split(": ")[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <MdRateReview className={styles.icon} />
          <h3>Reviews</h3>
        </div>
        <div className={styles.reviewsList}>
          {reviews?.map((review, index) => (
            <div key={index} className={styles.reviewItem}>
              <div className={styles.reviewContent}>
                <a
                  href={review.author_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.authorName}
                >
                  {review.author_name}
                </a>
                <div className={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    if (review.rating >= star) {
                      return (
                        <MdOutlineStar
                          key={star}
                          className={styles.ratingStar}
                        />
                      );
                    } else if (review.rating >= star - 0.5) {
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
                  <span className={styles.reviewTime}>
                    {review.relative_time_description}
                  </span>
                </div>
                <p className={styles.reviewText}>
                  {expandedReviews[index]
                    ? review.text
                    : `${review.text.split(" ").slice(0, 20).join(" ")}...`}
                </p>
                <button
                  className={styles.showMoreButton}
                  onClick={() => toggleReviewExpansion(index)}
                >
                  {expandedReviews[index] ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacePageDetails;
