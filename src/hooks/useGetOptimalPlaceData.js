import { useEffect, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useQueryClient } from "@tanstack/react-query";
import usePlaceIsSaved from "./usePlaceIsSaved";
import useUser from "./backend-hooks/useUser";
import { fetchPlaceDetails } from "./google-api-hooks/useGetPlaceDetails";
import { getPlace } from "../api/placeApi";

const useGetOptimalPlaceData = (placeId) => {
  const [optimalPlaceData, setOptimalPlaceData] = useState(null);
  const [optimalPlaceDataLoading, setOptimalPlaceDataLoading] = useState(true);
  const [optimalPlaceDataError, setOptimalPlaceDataError] = useState(null);
  const { authUser } = useUser();
  const { isPlaceSaved, isPlaceSavedLoading } = usePlaceIsSaved(placeId);

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!placeId) {
      setOptimalPlaceDataError("No placeId provided");
      setOptimalPlaceDataLoading(false);
      return;
    }

    if (isPlaceSavedLoading || !authUser) {
      return;
    }

    const fetchData = async () => {
      try {
        if (isPlaceSaved) {
          console.log("place is saved - fetching from db");
          const placeData = await getPlace(placeId, authUser.data.userId);
          queryClient.setQueryData(
            ["saved-place", placeId, authUser.data.userId],
            placeData
          );
          setOptimalPlaceData(placeData);
        } else {
          console.log("place is not saved - fetching from Google");
          const placeData = await fetchPlaceDetails(
            placesLibrary,
            map,
            placeId
          );
          // queryClient.setQueryData(["place", placeId], placeData);

          console.log("placeData", placeData);

          const newOptimalPlaceData = {
            placeId: placeData.place_id,
            placeName: placeData.name,
            formattedAddress: placeData.formatted_address,
            geometry: placeData.geometry,
            photos: placeData.photos,
            rating: placeData.rating,
            userRatingsTotal: placeData.user_ratings_total,
            openingHours: placeData.opening_hours,
            website: placeData.website,
            placeUrl: placeData.url,
            vicinity: placeData.vicinity,
            formattedPhoneNumber: placeData.formatted_phone_number,
            businessStatus: placeData.business_status,
            isSaved: false,
            reviews: placeData.reviews,
          };

          setOptimalPlaceData(newOptimalPlaceData);
        }
      } catch (error) {
        setOptimalPlaceDataError(error.message);
      } finally {
        setOptimalPlaceDataLoading(false);
      }
    };

    fetchData();
  }, [
    placeId,
    isPlaceSaved,
    isPlaceSavedLoading,
    authUser,
    placesLibrary,
    map,
    queryClient,
  ]);

  return {
    optimalPlaceData,
    optimalPlaceDataLoading,
    optimalPlaceDataError,
  };
};

export default useGetOptimalPlaceData;
