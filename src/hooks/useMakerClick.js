import { useNavigate } from "react-router-dom";

import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useMarkerClick = () => {
  const navigate = useNavigate();

  const { setCenter, setZoom } = useMapContext();

  const { setSelectedPlace, setSearchQuery } = useSearchContext();

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);
    try {
      setCenter(place.location);

      const selectedPlace = {
        placeId: place.placeId,
        name: place.name,
        location: {
          lat: place.location.lat,
          lng: place.location.lng,
        },
      };
      setSelectedPlace(selectedPlace);
      setSearchQuery(selectedPlace.name);
      setZoom(14);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
