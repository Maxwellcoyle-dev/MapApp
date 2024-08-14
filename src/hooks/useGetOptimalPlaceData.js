import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

import useUser from "./backend-hooks/useUser";
import { fetchPlaceDetails } from "./google-api-hooks/useGetPlaceDetails";
import { getPlace } from "../api/placeApi";

const useGetOptimalPlaceData = (placeId) => {
  const { authUser } = useUser();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const fetchData = async () => {
    try {
      console.log("place is saved - fetching from db");
      const getPlaceDataReponse = await getPlace(placeId, authUser.data.userId);
      console.log("getPlaceDataReponse", getPlaceDataReponse);

      if (Object.keys(getPlaceDataReponse).length === 0) {
        console.log("place is not saved - fetching from Google");
        const googlePlaceData = await fetchPlaceDetails(
          placesLibrary,
          map,
          placeId
        );
        console.log("googlePlaceData", googlePlaceData);

        const newOptimalPlaceData = {
          placeId: googlePlaceData.place_id,
          placeName: googlePlaceData.name,
          formattedAddress: googlePlaceData.formatted_address,
          geometry: googlePlaceData.geometry,
          photos: googlePlaceData.photos,
          rating: googlePlaceData.rating,
          userRatingsTotal: googlePlaceData.user_ratings_total,
          openingHours: googlePlaceData.opening_hours,
          website: googlePlaceData.website,
          placeUrl: googlePlaceData.url,
          vicinity: googlePlaceData.vicinity,
          formattedPhoneNumber: googlePlaceData.formatted_phone_number,
          businessStatus: googlePlaceData.business_status,
          placeIsSaved: false,
          reviews: googlePlaceData.reviews,
        };
        console.log("newOptimalPlaceData", newOptimalPlaceData);

        return newOptimalPlaceData;
      } else {
        return getPlaceDataReponse;
      }
    } catch (error) {
      console.error("Failed to get place data:", error);
    }
  };

  const {
    data: optimalPlaceData,
    isLoading: optimalPlaceDataLoading,
    error: optimalPlaceDataError,
  } = useQuery({
    queryKey: ["saved-place", placeId, authUser?.data.userId],
    queryFn: () => fetchData(),
    enabled: !!placeId && !!authUser,
  });

  return {
    optimalPlaceData,
    optimalPlaceDataLoading,
    optimalPlaceDataError,
  };
};

export default useGetOptimalPlaceData;
