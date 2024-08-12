import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Image, Carousel } from "antd";
import {
  LeftOutlined,
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
} from "@ant-design/icons";

// state
import { useAppContext } from "../../state/AppContext";

import styles from "./PlacePageComponentStyles.module.css";

const PlacePageHeader = ({
  photos,
  optimalPlaceData,
  backNavigation,
  isPlaceSaved,
}) => {
  const navigate = useNavigate();

  const { setShowSavePlaceModal, setShowDeletePlaceModal } = useAppContext();

  return (
    <div className={styles.carouselContainer}>
      <Carousel className={styles.carousel}>
        {photos &&
          photos?.map((picUrl, index) => (
            <div key={index} className={styles.photoDiv}>
              <Image
                className={styles.mainImage}
                src={picUrl}
                alt={optimalPlaceData?.name}
              />
            </div>
          ))}
      </Carousel>
      <div className={styles.overlayIcons}>
        <div className={styles.iconDiv}>
          <LeftOutlined
            className={styles.overlayIcon}
            onClick={() => navigate(backNavigation)}
          />
        </div>
        <div
          className={styles.iconDiv}
          onClick={() => setShowSavePlaceModal(true)}
        >
          {isPlaceSaved ? (
            <HeartFilled className={[styles.overlayIcon, styles.heartIcon]} />
          ) : (
            <HeartOutlined className={[styles.overlayIcon, styles.heartIcon]} />
          )}
        </div>
        <div
          className={styles.iconDiv}
          onClick={() => setShowDeletePlaceModal(true)}
        >
          <DeleteOutlined className={[styles.overlayIcon, styles.heartIcon]} />
        </div>
      </div>
    </div>
  );
};

export default PlacePageHeader;
