import { useNavigate } from "react-router-dom";

import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";
import { useEffect } from "react";

const useMarkerClick = () => {
  const { setCenter, setZoom } = useMapContext();

  const { setSelectedPlace } = useSearchContext();

  const getPhotoReferenceId = (photo) => {
    console.log("photo: ", photo);
    const url = photo.getUrl();
    console.log("url: ", url);
    const urlParams = new URLSearchParams(new URL(url).search);
    console.log("urlParams: ", urlParams);

    for (const [key, value] of urlParams.entries()) {
      console.log(`${key}: ${value}`);
    }

    const photoReference = urlParams.get("1s");
    console.log("photoReference: ", photoReference);
    // return photoReference;
  };

  const handleMarkerClick = async (place) => {
    console.log("place: ", place);

    try {
      setZoom(14);
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setSelectedPlace(place);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return handleMarkerClick;
};

export default useMarkerClick;
