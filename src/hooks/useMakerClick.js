import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useMapContext } from "../state/MapContext";
import { fetchPlaceDetails } from "./useGetPlace";

const useMarkerClick = () => {
  const navigate = useNavigate();
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");
  const queryClient = useQueryClient();

  const { setSelectedPlace, setCenter, setSearchQuery, setZoom } =
    useMapContext();

  const handleMarkerClick = async (placeId) => {
    try {
      navigate(`/place/${placeId}`);

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
      setCenter(selectedPlace.location);
      setSearchQuery(selectedPlace.name);

      setZoom(14);
      queryClient.setQueryData(["place", placeId], placeData);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
