import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  MdClose,
  MdOpenInFull,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";
import { Carousel, Card } from "antd";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../state/AppContext";

import useGetPlace from "../../hooks/google-api-hooks/useGetPlaceDetails";
import useClosePlaceDetails from "../../hooks/useClosePlaceDetails";

import styles from "./PlaceDetailsCard.module.css";

const { Meta } = Card;

const PlaceDetailsCard = ({ placeId }) => {
  const [todaysHours, setTodaysHours] = useState(null);

  const { setShowAddToList } = useAppContext();

  const { placeData, isPlaceDataLoading, isPlaceDataError, placeDataError } =
    useGetPlace(placeId);

  useEffect(() => {
    console.log("placeData: ", placeData);
    // get the hours for today.  placeData.current_opening_hours.periods  check what day it is then get the hours for that day

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

  return (
    <div className={styles.halfView}>
      <div className={styles.viewControlDiv}>
        <button className={styles.iconButton}>
          <MdOpenInFull className={styles.btnIcon} />
        </button>
        <button className={styles.iconButton} onClick={handleClosePlace}>
          <MdClose className={styles.btnIcon} />
        </button>
      </div>
      <div className={styles.hvHeaderDiv}>
        <h2 className={styles.name}>{placeData?.name}</h2>
        {Array(placeData?.priceLevel)
          .fill()
          .map((_, index) => (
            <span key={index} className={styles.hvHeaderIcons}>
              $
            </span>
          ))}
        {placeData?.types?.includes("cafe") && (
          <MdOutlineLocalCafe className={styles.hvHeaderIcons} />
        )}
        {placeData?.types?.includes("restaurant") && (
          <MdOutlineRestaurant className={styles.hvHeaderIcons} />
        )}
        {placeData?.types?.includes("bar") && (
          <MdOutlineLocalBar className={styles.hvHeaderIcons} />
        )}
        {/* check if the place is open */}
        {placeData?.opening_hours.isOpen ? (
          <p className={styles.hvOpen}>Open</p>
        ) : (
          <p className={styles.hvClosed}>Closed</p>
        )}
      </div>
      <div className={styles.hvInfoDiv}>
        {/* display rating, reviews, type, priceLevel, if they are open */}
        <div className={styles.hvRatingDiv}>
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
          <p>({placeData?.userRatingsTotal} reviews)</p>
        </div>
      </div>
      <div className={styles.optionsDiv}></div>

      {/* <PhotoGallery photos={placeData?.photos} /> */}
    </div>
  );
};

export default PlaceDetailsCard;
