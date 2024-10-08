import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { getCurrentUser } from "aws-amplify/auth";

// Modals
import DeletePlaceModal from "../../modals/DeleteListModal/DeleteListModal";
import SavePlaceModal from "../../modals/SavePlaceModal/SavePlaceModal";
import NoteEditorModal from "../../modals/NoteEditorModal/NoteEditorModal";

// Components
import PlacePageHeader from "./PlacePageHeader/PlacePageHeader";
import PlacePageDetails from "./PlacePageDetails/PlacePageDetails";
import PlacePageActions from "./PlacePageActions/PlacePageActions";

// Hooks
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useGetOptimalPlaceData from "../../hooks/useGetOptimalPlaceData";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useUserLists from "../../hooks/backend-hooks/useUserLists";

// state
import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";

// Styles
import styles from "./PlacePage.module.css";

const PlacePage = () => {
  const [userId, setUserId] = useState("");
  const [myRating, setMyRating] = useState(0);
  const [note, setNote] = useState("");
  const [placeIds, setPlaceIds] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [listsContainingPlace, setListsContainingPlace] = useState([]);

  const { setSelectedPlace } = useSearchContext();

  useEffect(() => {
    const getUser = async () => {
      return await getCurrentUser();
    };
    const user = getUser();
    console.log("user", user);
  }, []);

  // extract placeId from the URL
  const { placeId } = useParams();
  // get the place data from the Google Places API
  const { optimalPlaceData, optimalPlaceDataLoading, optimalPlaceDataError } =
    useGetOptimalPlaceData(placeId);

  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  // Get the state from the location object
  const location = useLocation();
  const { state } = location;
  useEffect(() => {
    console.log("optimalPlaceData", optimalPlaceData);
    console.log("state", state);
  }, [optimalPlaceData, state]);

  // Get Modal Triggers from AppContext
  const {
    showSavePlaceModal,
    setShowSavePlaceModal,
    showDeletePlaceModal,
    setShowDeletePlaceModal,
    showEditListModal,
    setShowEditListModal,
  } = useAppContext();

  // get User data from the useAppUser hook
  const { appUser } = useAppUser(userId);

  const { listsData } = useUserLists(appUser?.data.userId);
  // const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);

  const { placesPhotos } = useGetPhotos(placeIds);

  const { updatePlaceAsync } = useUpdatePlace();

  const isOpen = (periods) => {
    console.log("periods", periods);
    if (!periods) {
      return false;
    }
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
    console.log("optimalPlaceData", optimalPlaceData);
    if (optimalPlaceData && !optimalPlaceData?.photos) {
      const placeIds = [
        optimalPlaceData?.placeId
          ? optimalPlaceData.placeId
          : optimalPlaceData.place_id,
      ];
      setPlaceIds(placeIds);
    }

    if (optimalPlaceData && optimalPlaceData?.photos) {
      console.log("optimalPlaceData.photos", optimalPlaceData.photos);
      const photoUrls = optimalPlaceData?.photos?.map((photo) => {
        return photo?.getUrl();
      });

      setPhotos(photoUrls);
    }

    console.log("optimalPlaceData", optimalPlaceData);
    if (optimalPlaceData?.placeNote) {
      setNote(optimalPlaceData.placeNote);
    }
    if (optimalPlaceData?.myRating) {
      setMyRating(optimalPlaceData.myRating);
    }
  }, [optimalPlaceData]);

  // put urls into a uniform array for the carousel
  useEffect(() => {
    if (placesPhotos) {
      let urls = [];
      placesPhotos[0]?.map((pic) => {
        const newUrl = pic?.getUrl();
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
      userId: appUser.data.userId,
      placeData: newPlaceData,
    });
  };

  const handleSave = async () => {
    try {
      await updatePlaceAsync({
        placeId: optimalPlaceData.placeId,
        userId: appUser.data.userId,
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

  if (optimalPlaceDataError) {
    return (
      <div className={styles.placeDetailsDiv}>
        <p>Error loading place details: {optimalPlaceDataError}</p>
      </div>
    );
  }

  if (optimalPlaceDataLoading || !optimalPlaceData) {
    console.log("state", state);
    return (
      <div className={styles.loadingDiv}>
        <Spin size="large" />
      </div>
    );
  }

  if (!optimalPlaceData) {
    return (
      <div className={styles.placeDetailsDiv}>
        <p>No place data found.</p>
      </div>
    );
  }

  return (
    <div className={styles.placeDetailsDiv}>
      <div className={styles.scrollContainer}>
        <PlacePageHeader
          photos={photos}
          optimalPlaceData={optimalPlaceData}
          backNavigation={state?.from !== "addToList" ? -1 : "/"}
          isOpen={isOpen(optimalPlaceData?.opening_hours?.periods)}
        />
        <PlacePageActions
          placeId={placeId}
          // isSavedLoading={isSavedLoading}
          onSave={handleSave}
          onTag={() => navigate(`/add-tag/${placeId}`)}
          onAddNote={() => setShowEditListModal(true)}
          tags={optimalPlaceData?.tags}
          note={note}
          myRating={myRating}
          handleRatingClick={handleRatingClick}
        />
        <PlacePageDetails
          userRatingsTotal={optimalPlaceData?.total_user_ratings}
          rating={optimalPlaceData?.rating}
          address={optimalPlaceData.formatted_address}
          phone={optimalPlaceData.formatted_phone_number}
          website={optimalPlaceData.website}
          tags={optimalPlaceData.tags}
          status={optimalPlaceData.business_status}
          onDirectionsClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${optimalPlaceData?.geometry?.location?.lat},${optimalPlaceData?.geometry?.location?.lng}`
            )
          }
          openingHours={optimalPlaceData?.opening_hours}
          vicinity={optimalPlaceData?.vicinity}
          reviews={optimalPlaceData?.reviews}
        />
      </div>

      <DeletePlaceModal
        visible={showDeletePlaceModal}
        onClose={() => setShowDeletePlaceModal(false)}
        listIds={listsContainingPlace}
        userId={appUser?.data.userId}
        placeName={optimalPlaceData?.placeName}
        placeId={optimalPlaceData?.placeId}
      />

      <SavePlaceModal
        visible={showSavePlaceModal}
        onClose={() => setShowSavePlaceModal(false)}
        placeId={placeId} // Pass the appropriate placeId here
        userId={appUser?.data.userId}
      />
      <NoteEditorModal
        visible={showEditListModal}
        onClose={() => setShowEditListModal(false)}
        note={note}
        setNote={setNote}
        optimalPlaceData={optimalPlaceData}
        userId={appUser?.data.userId}
      />
    </div>
  );
};

export default PlacePage;
