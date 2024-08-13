import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";

// Components
import DeletePlaceModal from "../../components/DeletePlaceModal/DeletePlaceModal";
import SavePlaceModal from "../../components/SavePlaceModal/SavePlaceModal";
import NoteEditorModal from "../../components/NoteEditorModal/NoteEditorModal";
import PlacePageHeader from "../../components/PlacePage/PlacePageHeader/PlacePageHeader";
import PlacePageDetails from "../../components/PlacePage/PlacePageDetails/PlacePageDetails";
import PlacePageActions from "../../components/PlacePage/PlacePageActions/PlacePageActions";

// Hooks
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";
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
  const [myRating, setMyRating] = useState(0);
  const [note, setNote] = useState("");
  const [placeIds, setPlaceIds] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [listsContainingPlace, setListsContainingPlace] = useState([]);

  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const {
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

  const { updatePlaceAsync, updatePlaceIsPending, updatePlaceIsSuccess } =
    useUpdatePlace();

  const isOpen = (periods) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = `${now.getHours().toString().padStart(2, "0")}${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const todayPeriod = periods.find(
      (period) => period.open.day === currentDay
    );

    if (todayPeriod) {
      const { open, close } = todayPeriod;
      return currentTime >= open.time && currentTime < close.time;
    }

    return false; // If no periods match, assume closed
  };

  // Get photos of the place - if the place is saved to dynamoDB, then call useGetPhotots with the placeIds array. If the place is not saved, then we can use the getUrl() from the place.photos array
  useEffect(() => {
    if (optimalPlaceData && !optimalPlaceData?.photos) {
      const placeIds = [
        optimalPlaceData?.placeId
          ? optimalPlaceData.placeId
          : optimalPlaceData.place_id,
      ];
      setPlaceIds(placeIds);
    }
    if (optimalPlaceData && optimalPlaceData?.photos) {
      const photoUrls = optimalPlaceData.photos.map((photo) => {
        return photo.getUrl();
      });

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
    console.log("optimalPlaceData", optimalPlaceData);
    if (optimalPlaceData?.placeNote) {
      setNote(optimalPlaceData.placeNote);
    }
    if (optimalPlaceData?.myRating) {
      setMyRating(optimalPlaceData.myRating);
    }
  }, [optimalPlaceData]);

  const handleRatingClick = (rating) => {
    console.log("rating", rating);
    setMyRating(rating);
    const newPlaceData = {
      ...optimalPlaceData,
      myRating: rating,
    };
    updatePlaceAsync({
      placeId: optimalPlaceData.placeId,
      userId: authUser.data.userId,
      placeData: newPlaceData,
    });
  };

  const handleTag = () => {
    if (!isPlaceSaved) {
      return; // Do nothing if the place is not saved
    }
    navigate(`/add-tag/${placeId}`);
  };

  const handleSave = async () => {
    try {
      await updatePlaceAsync({
        placeId: optimalPlaceData.placeId,
        userId: authUser.data.userId,
        placeData: {
          ...optimalPlaceData,
          isSaved: true,
        },
      });
      setShowSavePlaceModal(false);
    } catch (error) {
      console.error("Failed to save place:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Call your backend function to delete the place
      await updatePlaceAsync({
        placeId: optimalPlaceData.placeId,
        userId: authUser.data.userId,
        placeData: {
          ...optimalPlaceData,
          isSaved: false,
        },
      });
      setShowDeletePlaceModal(false);
      navigate("/"); // Redirect to home or another page after deletion
    } catch (error) {
      console.error("Failed to delete place:", error);
    }
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
          <PlacePageHeader
            photos={photos}
            optimalPlaceData={optimalPlaceData}
            backNavigation={state?.from !== "addToList" ? -1 : "/"}
            isPlaceSaved={isPlaceSaved}
            isOpen={isOpen(optimalPlaceData.openingHours?.periods)}
          />
          <PlacePageActions
            isSaved={isPlaceSaved}
            // isSavedLoading={isSavedLoading}
            onSave={handleSave}
            onTag={handleTag}
            onAddNote={() => setShowEditListModal(true)}
            tags={optimalPlaceData?.tags}
            note={note}
            myRating={myRating}
            handleRatingClick={handleRatingClick}
          />
          <PlacePageDetails
            totalUserRatings={optimalPlaceData?.totalUserRatings}
            rating={optimalPlaceData?.rating}
            address={optimalPlaceData.formattedAddress}
            phone={optimalPlaceData.formattedPhoneNumber}
            website={optimalPlaceData.website}
            tags={optimalPlaceData.tags}
            status={optimalPlaceData.businessStatus}
            onDirectionsClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${optimalPlaceData?.geometry?.location?.lat},${optimalPlaceData?.geometry?.location?.lng}`
              )
            }
          />
        </>
      )}

      <DeletePlaceModal
        visible={showDeletePlaceModal}
        onClose={() => setShowDeletePlaceModal(false)}
        listIds={listsContainingPlace}
        userId={authUser?.data.userId}
        placeName={optimalPlaceData?.placeName}
        placeId={optimalPlaceData?.placeId}
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
