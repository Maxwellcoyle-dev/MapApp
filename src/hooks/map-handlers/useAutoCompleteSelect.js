import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPlaceDetails } from "../useGetPlace";
import { useMapContext } from "../../state/MapContext";

const useAutoCompleteSelect = () => {
  const {
    setSelectedPlace,
    setAutoCompleteResults,
    setSearchResults,
    setCenter,
    setSearchQuery,
    setZoom,
  } = useMapContext();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const queryClient = useQueryClient();

  const handleAutoCompleteSelect = async (placeId) => {
    try {
      const placeData = await fetchPlaceDetails(placesLibrary, map, placeId);

      const selectedPlace = {
        placeId: placeData.place_id,
        name: placeData.name,
        location: {
          lat: placeData.geometry.location.lat(),
          lng: placeData.geometry.location.lng(),
        },
      };

      setSelectedPlace(selectedPlace);
      setSearchResults([selectedPlace]);
      setCenter(selectedPlace.location);
      setAutoCompleteResults([]);
      setSearchQuery(selectedPlace.name);
      setZoom(14);
      queryClient.setQueryData(["place", placeId], placeData);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleAutoCompleteSelect;
};

export default useAutoCompleteSelect;
