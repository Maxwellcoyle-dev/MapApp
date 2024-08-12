import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Image, Carousel, Spin, Tooltip, Button } from "antd";
import {
  LeftOutlined,
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdDirections,
  MdOutlineLocalCafe,
  MdOutlineLocalBar,
  MdOutlineRestaurant,
} from "react-icons/md";

// Components
import DeletePlaceModal from "../../components/DeletePlaceModal/DeletePlaceModal";
import SavePlaceModal from "../../components/SavePlaceModal/SavePlaceModal";

// Hooks
import useCreateList from "../../hooks/backend-hooks/useCreateList";
import useUser from "../../hooks/backend-hooks/useUser";
import useGetOptimalPlaceData from "../../hooks/useGetOptimalPlaceData";
import usePlaceIsSaved from "../../hooks/usePlaceIsSaved";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useUserLists from "../../hooks/backend-hooks/useUserLists";

// Styles
import styles from "./PlacePage.module.css";

const PlacePage = () => {
  const [placeIds, setPlaceIds] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSavePlaceModalVisible, setIsSavePlaceModalVisible] = useState(false);

  // array to hold the lists that contain the current place
  const [listsContainingPlace, setListsContainingPlace] = useState([]);

  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { authUser } = useUser();
  const { listsData } = useUserLists(authUser?.data.userId);
  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);
  const { optimalPlaceData, optimalPlaceDataLoading, optimalPlaceDataError } =
    useGetOptimalPlaceData(placeId);
  const { placesPhotos } = useGetPhotos(placeIds);
  const { createListMutation } = useCreateList();

  // Get photos of the place - if the place is saved to dynamoDB, then call useGetPhotots with the placeIds array. If the place is not saved, then we can use the getUrl() from the place.photos array
  useEffect(() => {
    if (optimalPlaceData && !optimalPlaceData?.photos) {
      console.log("optimalPlaceData: ", optimalPlaceData);

      const placeIds = [
        optimalPlaceData?.placeId
          ? optimalPlaceData.placeId
          : optimalPlaceData.place_id,
      ];
      console.log("placeIds: ", placeIds);
      setPlaceIds(placeIds);
    }
    if (optimalPlaceData && optimalPlaceData?.photos) {
      const photoUrls = optimalPlaceData.photos.map((photo) => {
        return photo.getUrl();
      });
      console.log("photoUrls: ", photoUrls);
      setPhotos(photoUrls);
    }
  }, [optimalPlaceData]);

  // put urls into a uniform array for the carousel
  useEffect(() => {
    if (placesPhotos) {
      let urls = [];
      placesPhotos[0].map((pic) => {
        const newUrl = pic.getUrl();
        urls.push(newUrl);
      });
      setPhotos(urls);
    }
  }, [placesPhotos]);

  //
  useEffect(() => {
    if (listsData?.data) {
      // create a list of lists that contain the placeId. if the place id exists in the list. then add the listId to the listIds array
      let lists = [];
      listsData.data.forEach((list) => {
        list.places?.L?.forEach((placeItem) => {
          if (placeItem.M.placeId.S === placeId) {
            lists.push({ listId: list.listId.S, listName: list.listName.S });
          }
        });
      });
      setListsContainingPlace(lists);
    }
  }, [listsData]);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseSavePlaceModal = () => {
    setIsSavePlaceModalVisible(false);
  };

  if (optimalPlaceDataLoading) {
    return (
      <div className={styles.loadingDiv}>
        <p>Loading place details...</p>
        <Spin size="large" />
      </div>
    );
  }

  if (optimalPlaceDataError) {
    return (
      <div className={styles.placeDetailsDiv}>
        <p>Error loading place details: {optimalPlaceDataError}</p>
      </div>
    );
  }

  return (
    <div className={styles.placeDetailsDiv}>
      {optimalPlaceData && (
        <>
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
                  onClick={() =>
                    navigate(state?.from !== "addToList" ? -1 : "/")
                  }
                />
              </div>
              <div
                className={styles.iconDiv}
                onClick={() => setIsSavePlaceModalVisible(true)}
              >
                {isPlaceSaved ? (
                  <HeartFilled
                    className={[styles.overlayIcon, styles.heartIcon]}
                  />
                ) : (
                  <HeartOutlined
                    className={[styles.overlayIcon, styles.heartIcon]}
                  />
                )}
              </div>
              <div className={styles.iconDiv} onClick={showDeleteModal}>
                <DeleteOutlined
                  className={[styles.overlayIcon, styles.heartIcon]}
                />
              </div>
            </div>
          </div>
          <div className={styles.tagContainer}>
            <div>
              <Tooltip
                title={
                  isPlaceSavedLoading || !isPlaceSaved
                    ? "Save the place before adding a tag"
                    : "Click here to add a tag"
                }
              >
                <Button
                  type="dashed"
                  className={styles.tagButton}
                  disabled={isPlaceSavedLoading || !isPlaceSaved}
                  onClick={
                    isPlaceSavedLoading || !isPlaceSaved
                      ? undefined
                      : () => navigate(`/add-tag/${placeId}`)
                  }
                >
                  <PlusOutlined /> <p>Add Tags</p>
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className={styles.headerDiv}>
            <h2>{optimalPlaceData?.name}</h2>
            {optimalPlaceData?.types?.includes("cafe") && (
              <MdOutlineLocalCafe className={styles.icon} />
            )}
            {optimalPlaceData?.types?.includes("restaurant") && (
              <MdOutlineRestaurant className={styles.icon} />
            )}
            {optimalPlaceData?.types?.includes("bar") && (
              <MdOutlineLocalBar className={styles.icon} />
            )}
          </div>
          <div
            className={styles.addressDiv}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${optimalPlaceData?.lat},${optimalPlaceData?.lng}`
              );
            }}
          >
            <p>{optimalPlaceData?.formatted_address}</p>
            <MdDirections className={styles.directionsIcon} />
          </div>
          <div className={styles.ratingsDiv}>
            <p>{optimalPlaceData?.rating}</p>
            {[1, 2, 3, 4, 5].map((star) => {
              if (optimalPlaceData?.rating >= star) {
                return (
                  <MdOutlineStar key={star} className={styles.ratingStar} />
                );
              } else if (optimalPlaceData?.rating >= star - 0.5) {
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
            <p>({optimalPlaceData?.totalUserRatings} reviews)</p>
          </div>
        </>
      )}

      {isModalVisible && (
        <DeletePlaceModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          listIds={listsContainingPlace}
          userId={authUser?.data.userId}
          placeName={optimalPlaceData.name}
          placeId={optimalPlaceData.placeId}
        />
      )}
      {isSavePlaceModalVisible && (
        <SavePlaceModal
          visible={isSavePlaceModalVisible}
          onClose={handleCloseSavePlaceModal}
          placeId={placeId} // Pass the appropriate placeId here
        />
      )}
    </div>
  );
};

export default PlacePage;
