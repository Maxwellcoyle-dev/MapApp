import { useNavigate } from "react-router-dom";

import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useMarkerClick = () => {
  const { setCenter, setZoom } = useMapContext();

  const { setSelectedPlace, setSearchQuery } = useSearchContext();

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);
    try {
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setSelectedPlace(place);
      setSearchQuery(place.name);
      setZoom(14);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
