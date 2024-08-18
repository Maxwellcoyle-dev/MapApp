import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useMarkerClick = () => {
  const { setCenter, setZoom } = useMapContext();

  const { setSelectedPlace } = useSearchContext();

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);

    try {
      setZoom(14);
      setCenter(place.geometry.location);
      setSelectedPlace(place);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
