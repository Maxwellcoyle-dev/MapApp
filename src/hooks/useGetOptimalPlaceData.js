import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

import useAppUser from "./backend-hooks/useAppUser";
import { fetchPlaceDetails } from "./google-api-hooks/useGetPlaceDetails";
import { getPlace } from "../api/placeApi";

const useGetOptimalPlaceData = (placeId) => {
  const { appUser } = useAppUser();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const fetchData = async () => {
    try {
      console.log("place is saved - fetching from db");
      const getPlaceDataReponse = await getPlace(placeId, appUser.data.userId);
      console.log("getPlaceDataReponse", getPlaceDataReponse);

      if (Object.keys(getPlaceDataReponse).length === 0) {
        console.log("place is not saved - fetching from Google");
        const googlePlaceData = await fetchPlaceDetails(
          placesLibrary,
          map,
          placeId
        );
        console.log("googlePlaceData response object", googlePlaceData);

        const location = {
          lat: googlePlaceData.geometry.location.lat(),
          lng: googlePlaceData.geometry.location.lng(),
        };
        const geometry = {
          location: location,
          viewport: googlePlaceData.geometry.viewport,
        };

        const newOptimalPlaceData = {
          placeId: googlePlaceData.place_id,
          placeName: googlePlaceData.name,
          formatted_address: googlePlaceData.formatted_address,
          geometry: geometry,
          photos: googlePlaceData.photos,
          rating: googlePlaceData.rating,
          user_ratings_total: googlePlaceData.user_ratings_total,
          opening_hours: googlePlaceData.opening_hours,
          website: googlePlaceData.website,
          placeUrl: googlePlaceData.url,
          vicinity: googlePlaceData.vicinity,
          formatted_phone_number: googlePlaceData.formatted_phone_number,
          business_status: googlePlaceData.business_status,
          placeIsSaved: false,
          reviews: googlePlaceData.reviews,
          types: googlePlaceData.types,
        };
        console.log(
          "newOptimalPlaceData from google place data",
          newOptimalPlaceData
        );

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
    queryKey: ["saved-place", placeId, appUser?.data.userId],
    queryFn: () => fetchData(),
    enabled: !!placeId && !!appUser,
  });

  return {
    optimalPlaceData,
    optimalPlaceDataLoading,
    optimalPlaceDataError,
  };
};

export default useGetOptimalPlaceData;
