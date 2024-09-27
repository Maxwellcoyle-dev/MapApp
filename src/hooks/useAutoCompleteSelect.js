import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useQueryClient } from "@tanstack/react-query";

// Hooks
import { fetchPlaceDetails } from "./google-api-hooks/useGetPlaceDetails";

// State
import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useAutoCompleteSelect = () => {
  const { setCenter, setZoom } = useMapContext();

  const { setQueryInput, setSelectedPlace, setAutoCompleteResults, placeType } =
    useSearchContext();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const queryClient = useQueryClient();

  const handleAutoCompleteSelect = async (placeId) => {
    try {
      const placeData = await fetchPlaceDetails(placesLibrary, map, placeId);

      console.log("placeData: ", placeData);

      const selectedPlace = {
        place_id: placeData.place_id,
        name: placeData.name,
        opening_hours: placeData.opening_hours,
        geometry: placeData.geometry,
        photos: placeData.photos,
        business_status: placeData.business_status,
        vicinity: placeData.vicinity,
        price_level: placeData.price_level,
        rating: placeData.rating,
        types: placeData.types,
        user_ratings_total: placeData.user_ratings_total,
      };

      const location = {
        lat: placeData.geometry.location.lat(),
        lng: placeData.geometry.location.lng(),
      };

      setSelectedPlace(selectedPlace);
      setCenter(location);
      setAutoCompleteResults([]);
      setQueryInput(selectedPlace.name);
      setZoom(14);
      queryClient.setQueryData(["place", placeId], placeData);
      queryClient.setQueryData(["places-search", placeType], [placeData]);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleAutoCompleteSelect;
};

export default useAutoCompleteSelect;
