import { useSearchContext } from "../state/SearchContext";

const useMarkerClick = () => {
  const { setSelectedPlace } = useSearchContext();

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);

    try {
      setSelectedPlace(place);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
