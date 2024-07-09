// Libraries
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import {
  MdClose,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import { Carousel, Card } from "antd";

// State
import { useAppContext } from "../../state/AppContext";

// Hooks
import useGetPlace from "../../hooks/google-api-hooks/useGetPlaceDetails";
import useClosePlaceDetails from "../../hooks/useClosePlaceDetails";

// Styles
import styles from "./PlaceDetailsCard.module.css";

const { Meta } = Card;

const PlaceDetailsCard = ({ placeId }) => {
  const [todaysHours, setTodaysHours] = useState(null);

  const { setShowAddToList } = useAppContext();

  const { placeData } = useGetPlace(placeId);

  useEffect(() => {
    console.log("placeData: ", placeData);

    if (!placeData?.current_opening_hours) return;

    const date = new Date();
    const day = date.getDay();
    const hours = placeData?.current_opening_hours?.periods?.find(
      (period) => period?.open?.day === day
    );
    console.log("hours: ", hours);

    const convertTo12HourFormat = (time) => {
      let hour = parseInt(time?.slice(0, 2));
      let minute = time?.slice(2);
      let period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; // Convert hour to 12-hour format
      return `${hour}:${minute} ${period}`;
    };
    const todaysHours = {
      open: convertTo12HourFormat(hours?.open?.time),
      close: convertTo12HourFormat(hours?.close?.time),
    };

    setTodaysHours(todaysHours);
  }, [placeData]);

  const handleClosePlace = useClosePlaceDetails();

  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <div className={styles.carouselContainer}>
          <Carousel>
            {placeData?.photos?.map((photo, index) => (
              <div key={index} className={styles.imageContainer}>
                <img
                  src={photo.getUrl()}
                  alt="example"
                  className={styles.cardImage}
                />
              </div>
            ))}
          </Carousel>

          <div className={styles.iconOverlayContainer}>
            <div
              className={styles.iconContainer}
              onClick={() => setShowAddToList(true)}
            >
              <FaRegHeart className={styles.overlayIcon} />
            </div>
            <div
              className={styles.iconContainer}
              onClick={() => handleClosePlace()}
            >
              <MdClose className={styles.overlayIcon} />
            </div>
          </div>
        </div>
      }
    >
      <div className={styles.headerDiv}>
        <h3>{placeData?.name}</h3>
        <p>{}</p>
        {placeData?.current_opening_hours.open_now ? (
          <p className={styles.open}>Open</p>
        ) : (
          <p className={styles.closed}>Closed</p>
        )}
      </div>
      <div className={styles.infoDiv}>
        <div className={styles.ratingDiv}>
          <p>{placeData?.rating}</p>
          {[1, 2, 3, 4, 5].map((star) => {
            if (placeData?.rating >= star) {
              return <MdOutlineStar key={star} className={styles.ratingStar} />;
            } else if (placeData?.rating >= star - 0.5) {
              return (
                <MdOutlineStarHalf key={star} className={styles.ratingStar} />
              );
            } else {
              return (
                <MdOutlineStarBorder key={star} className={styles.ratingStar} />
              );
            }
          })}
          <p>({placeData?.user_ratings_total} reviews)</p>
        </div>
        <div className={styles.hoursDiv}>
          <p>
            Today: {todaysHours?.open} - {todaysHours?.close}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PlaceDetailsCard;
