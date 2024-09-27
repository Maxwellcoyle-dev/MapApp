import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Skeleton } from "antd";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Import FaHeart for filled heart
import {
  MdOutlineStar,
  MdOutlineStarHalf,
  MdOutlineStarBorder,
  MdClose,
} from "react-icons/md";

// Components
import SavePlaceModal from "../../../../modals/SavePlaceModal/SavePlaceModal";

// Hooks
import useGetPhotos from "../../../../hooks/google-api-hooks/useGetPhotos";

// State
import { useSearchContext } from "../../../../state/SearchContext";
import { useMapContext } from "../../../../state/MapContext";
import usePlaceIsSaved from "../../../../hooks/usePlaceIsSaved";

// Styles
import styles from "./PlaceDetailsCard.module.css";

const PlaceDetailsCard = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isSavePlaceModalVisible, setIsSavePlaceModalVisible] = useState(false);

  const { selectedPlace, setSelectedPlace, setQueryInput } = useSearchContext();
  const { setZoom } = useMapContext();

  const navigate = useNavigate();

  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(
    selectedPlace?.placeId
  );

  const { placesPhotos } = useGetPhotos([selectedPlace?.placeId]);

  useEffect(() => {
    if (selectedPlace?.photos) {
      const image = selectedPlace.photos[0].getUrl();
      setImageUrl(image);
    } else if (placesPhotos?.length > 0) {
      const image = placesPhotos[0]?.[0].getUrl();
      setImageUrl(image);
    } else {
      setImageUrl(null);
    }
  }, [selectedPlace, placesPhotos]);

  useEffect(() => {
    let open = selectedPlace?.opening_hours?.isOpen
      ? selectedPlace.opening_hours.isOpen()
      : null;
    setIsOpen(open);
  }, [selectedPlace]);

  const handleSavePlace = () => {
    setIsSavePlaceModalVisible(true);
  };

  const handleCloseSavePlaceModal = () => {
    setIsSavePlaceModalVisible(false);
  };

  if (!selectedPlace) {
    return (
      <div>
        <Skeleton.Image className={styles.cardImage} />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {!selectedPlace ? (
        <div>
          <Skeleton.Image className={styles.cardImage} />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={styles.imageContainer}>
            <div
              className={styles.imageDiv}
              onClick={() => navigate(`/place/${selectedPlace.placeId}`)}
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
              <div className={styles.iconContainer} onClick={handleSavePlace}>
                {isPlaceSavedLoading ? (
                  <Skeleton.Avatar size="large" active />
                ) : isPlaceSaved ? (
                  <FaHeart className={styles.overlayIcon} />
                ) : (
                  <FaRegHeart className={styles.overlayIcon} />
                )}
              </div>
              <div
                className={styles.iconContainer}
                onClick={() => {
                  setSelectedPlace(null);
                  setQueryInput("");
                  navigate("/");
                  setZoom(12);
                }}
              >
                <MdClose className={styles.overlayIcon} />
              </div>
            </div>
          </div>
          <div
            className={styles.contentContainer}
            onClick={() => navigate(`/place/${selectedPlace.placeId}`)}
          >
            <div className={styles.headerDiv}>
              <h3>{selectedPlace?.placeName}</h3>
              {isOpen !== null && (
                <p className={isOpen ? styles.open : styles.closed}>
                  {isOpen ? "Open" : "Closed"}
                </p>
              )}
            </div>
            <div className={styles.infoDiv}>
              <div className={styles.ratingDiv}>
                <p>{selectedPlace?.rating}</p>
                {[1, 2, 3, 4, 5].map((star) => {
                  if (selectedPlace?.rating >= star) {
                    return (
                      <MdOutlineStar key={star} className={styles.ratingStar} />
                    );
                  } else if (selectedPlace?.rating >= star - 0.5) {
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
                <p>({selectedPlace?.user_ratings_total} reviews)</p>
              </div>
            </div>
          </div>
        </>
      )}
      {isSavePlaceModalVisible && (
        <SavePlaceModal
          visible={isSavePlaceModalVisible}
          onClose={handleCloseSavePlaceModal}
          placeId={selectedPlace?.placeId} // Pass the appropriate placeId here
        />
      )}
    </div>
  );
};

export default PlaceDetailsCard;