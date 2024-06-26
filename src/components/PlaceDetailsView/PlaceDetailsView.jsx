import React, { useEffect } from "react";
import { MdLocationOn, MdPhone, MdStar, MdWeb } from "react-icons/md";
import useGetPlace from "../../hooks/useGetPlace";
import styles from "./PlaceDetailsView.module.css";

const PlaceDetailsView = ({ placeId = "ChIJa8m_owvxNIgRjqA4JlAe_Yg" }) => {
  const { placeData, isPlaceDataLoading, isPlaceDataError, placeDataError } =
    useGetPlace(placeId);

  useEffect(() => {
    console.log("placeData: ", placeData);
  }, [placeData]);

  return (
    <div className={styles.container}>
      {isPlaceDataLoading && <p className={styles.message}>Loading...</p>}
      {isPlaceDataError && (
        <p className={styles.message}>Error: {placeDataError.message}</p>
      )}
      {placeData && (
        <div className={styles.details}>
          <div className={styles.imageWrapper}>
            <img
              className={styles.image}
              src={placeData.photos[0]?.getUrl()}
              alt={placeData.name}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{placeData.name}</h1>
            <div className={styles.info}>
              <MdLocationOn />
              <span className={styles.text}>{placeData.formatted_address}</span>
            </div>
            <div className={styles.info}>
              <MdPhone />
              <span className={styles.text}>
                {placeData.formatted_phone_number}
              </span>
            </div>
            <div className={styles.info}>
              <MdStar />
              <span className={styles.text}>
                {placeData.rating} ({placeData.user_ratings_total} reviews)
              </span>
            </div>
            <div className={styles.info}>
              <MdWeb />
              <span className={styles.text}>
                <a
                  className={styles.link}
                  href={placeData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetailsView;
