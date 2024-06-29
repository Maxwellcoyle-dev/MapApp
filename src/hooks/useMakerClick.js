import { useNavigate } from "react-router-dom";

import { useMapContext } from "../state/MapContext";

const useMarkerClick = () => {
  const navigate = useNavigate();

  const { setSelectedPlace, setCenter, setSearchQuery, setZoom } =
    useMapContext();

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);
    try {
      navigate(`/place/${place.placeId}`);
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
