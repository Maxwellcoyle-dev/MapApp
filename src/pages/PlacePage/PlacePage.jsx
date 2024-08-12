import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Image, Carousel, Spin, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
import PlacePageHeader from "../../components/PlacePage/PlacePageHeader";
import NoteEditorModal from "../../components/NoteEditorModal/NoteEditorModal";

// Hooks
import useCreateList from "../../hooks/backend-hooks/useCreateList";
import useUser from "../../hooks/backend-hooks/useUser";
import useGetOptimalPlaceData from "../../hooks/useGetOptimalPlaceData";
import usePlaceIsSaved from "../../hooks/usePlaceIsSaved";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useUserLists from "../../hooks/backend-hooks/useUserLists";

// state
import { useAppContext } from "../../state/AppContext";

// Styles
import styles from "./PlacePage.module.css";

const PlacePage = () => {
  const [note, setNote] = useState("");
  const [placeIds, setPlaceIds] = useState([]);
  const [photos, setPhotos] = useState([]);

  // array to hold the lists that contain the current place
  const [listsContainingPlace, setListsContainingPlace] = useState([]);

  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const {
    setShowCreateListModal,
    showSavePlaceModal,
    setShowSavePlaceModal,
    showDeletePlaceModal,
    setShowDeletePlaceModal,
    showEditListModal,
    setShowEditListModal,
  } = useAppContext();

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

  // check if there is a note, if so, update the note state
  useEffect(() => {
    console.log("optimalPlaceData: ", optimalPlaceData);
    if (optimalPlaceData?.placeNote) {
      setNote(optimalPlaceData.placeNote);
    }
  }, [optimalPlaceData]);

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
          <PlacePageHeader
            photos={photos}
            optimalPlaceData={optimalPlaceData}
            backNavigation={state?.from !== "addToList" ? -1 : "/"}
          />
          <div className={styles.buttonDiv}>
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
            <Button onClick={() => setShowEditListModal(true)}>Add Note</Button>
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

      <DeletePlaceModal
        visible={showDeletePlaceModal}
        onClose={() => setShowDeletePlaceModal(false)}
        listIds={listsContainingPlace}
        userId={authUser?.data.userId}
        placeName={optimalPlaceData.name}
        placeId={optimalPlaceData.placeId}
      />

      <SavePlaceModal
        visible={showSavePlaceModal}
        onClose={() => setShowSavePlaceModal(false)}
        placeId={placeId} // Pass the appropriate placeId here
        isPlaceSaved={isPlaceSaved}
      />
      <NoteEditorModal
        visible={showEditListModal}
        onClose={() => setShowEditListModal(false)}
        note={note}
        setNote={setNote}
        optimalPlaceData={optimalPlaceData}
      />
    </div>
  );
};

export default PlacePage;
