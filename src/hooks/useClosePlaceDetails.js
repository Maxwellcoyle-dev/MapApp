import { useNavigate } from "react-router-dom";

import useGetUserLocation from "./useGetUserLocation";
import { useMapContext } from "../state/MapContext";

const useClosePlaceDetails = () => {
  const location = useGetUserLocation();
  const navigate = useNavigate();

  const { setSelectedPlace, setCenter, setSearchQuery, setZoom } =
    useMapContext();

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
