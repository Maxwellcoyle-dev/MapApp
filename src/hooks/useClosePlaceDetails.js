import { useNavigate } from "react-router-dom";

import useGetUserLocation from "./useGetUserLocation";
import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useClosePlaceDetails = () => {
  const location = useGetUserLocation();
  const navigate = useNavigate();

  const { setCenter, setZoom } = useMapContext();
  const { setSelectedPlace, setSearchQuery } = useSearchContext();

  const handleClosePlace = () => {
    setSelectedPlace({
      placeId: "",
      name: "",
      location: { lat: 0, lng: 0 },
    });
    navigate("/");
  };

  return handleClosePlace;
};
export default useClosePlaceDetails;
