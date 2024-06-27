import React, { useEffect, useState } from "react";
import {
  MdClose,
  MdFormatListBulletedAdd,
  MdLabelOutline,
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdDirections,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useParams, useNavigate } from "react-router-dom";

import useGetPlace from "../../hooks/useGetPlace";
import styles from "./PlaceDetails.module.css";

const PlaceDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { placeId } = useParams();

  const [{ y }, api] = useSpring(() => ({ y: window.innerHeight }));

  useEffect(() => {
    setIsOpen(true);
    api.start({ y: window.innerHeight / 2 });
  }, [placeId, api]);

  const bind = useDrag(
    ({ down, movement: [, my], direction: [, dy], velocity }) => {
      const trigger = velocity > 0.2;
      const dir = dy > 0 ? 1 : -1;
      if (!down && trigger && dir === -1) {
        api.start({ y: 0 });
      } else if (!down && trigger && dir === 1) {
        api.start({ y: window.innerHeight / 2 });
      } else {
        api.start({ y: down ? my : window.innerHeight / 2 });
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { top: -window.innerHeight + 100, bottom: 0 },
      rubberband: true,
    }
  );

  const { placeData, isPlaceDataLoading, isPlaceDataError, placeDataError } =
    useGetPlace(placeId);

  if (isPlaceDataLoading) {
    return <div>Loading...</div>;
  }

  if (isPlaceDataError) {
    return <div>Error: {placeDataError}</div>;
  }

  if (!placeData) {
    return <div>No place data found</div>;
  }

  return (
    <animated.div {...bind()} style={{ y }} className={styles.placeDetails}>
      {placeData && (
        <>
          <div className={styles.controlDiv}>
            <div className={styles.swipeDiv}></div>
          </div>
          <div className={styles.optionsDiv}>
            <button className={styles.button}>
              <MdLabelOutline className={styles.icon} />
            </button>
            <button className={styles.button}>
              <MdFormatListBulletedAdd className={styles.icon} />
            </button>
            <button className={styles.button}>
              <MdClose className={styles.icon} onClick={() => navigate(-1)} />
            </button>
          </div>
          <div className={styles.headerDiv}>
            <h2>{placeData.name}</h2>
            {placeData.types.includes("cafe") && (
              <MdOutlineLocalCafe className={styles.icon} />
            )}
            {placeData.types.includes("restaurant") && (
              <MdOutlineRestaurant className={styles.icon} />
            )}
            {placeData.types.includes("bar") && (
              <MdOutlineLocalBar className={styles.icon} />
            )}
          </div>
          <div
            className={styles.addressDiv}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${placeData.lat},${placeData.lng}`
              );
            }}
          >
            <p>{placeData.address}</p>
            <MdDirections className={styles.directionsIcon} />
          </div>
          <div className={styles.ratingsDiv}>
            <p>{placeData.rating}</p>
            {[1, 2, 3, 4, 5].map((star) => {
              if (placeData.rating >= star) {
                return (
                  <MdOutlineStar key={star} className={styles.ratingStar} />
                );
              } else if (placeData.rating >= star - 0.5) {
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
            <p>({placeData.totalUserRatings} reviews)</p>
          </div>
        </>
      )}
    </animated.div>
  );
};

export default PlaceDetails;
