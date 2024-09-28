import React from "react";
import { useNavigate } from "react-router-dom";
import { Image, Carousel } from "antd";
import {
  LeftOutlined,
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
} from "@ant-design/icons";

// state
import { useAppContext } from "../../../state/AppContext";
import { useSearchContext } from "../../../state/SearchContext";
import styles from "./PlacePageHeader.module.css";

const PlacePageHeader = ({
  photos,
  optimalPlaceData,
  backNavigation,
  isOpen,
}) => {
  const { setSelectedPlace } = useSearchContext();
  const navigate = useNavigate();
  const { setShowSavePlaceModal, setShowDeletePlaceModal } = useAppContext();
  return (
    <div className={styles.headerContainer}>
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
              onClick={() => {
                setSelectedPlace(null);
                navigate(backNavigation);
              }}
            />
          </div>
          <div
            className={styles.iconDiv}
            onClick={() => setShowSavePlaceModal(true)}
          >
            {optimalPlaceData.placeIsSaved ? (
              <HeartFilled
                className={[styles.overlayIcon, styles.heartIcon].join(" ")}
              />
            ) : (
              <HeartOutlined
                className={[styles.overlayIcon, styles.heartIcon].join(" ")}
              />
            )}
          </div>
          <div
            className={styles.iconDiv}
            onClick={() => setShowDeletePlaceModal(true)}
          >
            <DeleteOutlined
              className={[styles.overlayIcon, styles.heartIcon].join(" ")}
            />
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>{optimalPlaceData?.placeName}</h1>
        <div className={styles.status}>
          {isOpen ? (
            <p className={styles.open}>Open</p>
          ) : (
            <p className={styles.closed}>Closed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacePageHeader;
