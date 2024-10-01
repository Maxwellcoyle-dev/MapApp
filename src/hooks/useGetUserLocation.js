import { useCallback, useState } from "react";
import { useAppContext } from "../state/AppContext";

// Hooks
import useGetCoordsLocality from "./google-api-hooks/useGetCoordsLocality";

const useGetUserLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setUserLocation } = useAppContext();

  const { getCoordsLocality } = useGetCoordsLocality();

  const getUserLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    const handleSuccess = async (position) => {
      const newCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const locality = await getCoordsLocality(newCoords);
      console.log("locality: ", locality);
      const truncatedLocality = locality?.slice(0, 15);
      console.log("truncatedLocality: ", truncatedLocality);
      setUserLocation({
        coords: newCoords,
        locality: truncatedLocality,
      });
      // same the location to local storage
      localStorage.setItem("userLocation", JSON.stringify(newCoords));
      setError(null);
      setLoading(false);
    };

    const handleError = (error) => {
      console.log("Error getting location:", error.message);
      setError(error.message);

      setUserLocation({
        coords: null,
        locality: null,
      });

      setLoading(false);
    };

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permission) => {
          console.log("Permission state: ", permission.state);
          if (permission.state === "denied") {
            handleError({ message: "Geolocation permission denied" });
          }
        });
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }
  }, [setUserLocation]);

  return { getUserLocation, loading, setLoading, error };
};

export default useGetUserLocation;
