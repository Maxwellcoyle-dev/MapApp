import { useCallback } from "react";
import { useAppContext } from "../state/AppContext";

const useGetUserLocation = () => {
  const { setUserLocation } = useAppContext();

  const getUserLocation = useCallback(() => {
    const handleSuccess = (position) => {
      const newCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(newCoords);
      localStorage.setItem("userLocation", JSON.stringify(newCoords));
    };

    const handleError = (error) => {
      console.warn("Error getting location:", error.message);
      const lastKnownLocation = localStorage.getItem("userLocation");
      if (lastKnownLocation) {
        setUserLocation(JSON.parse(lastKnownLocation));
      } else {
        // Default to a fallback location (e.g., New York City)
        setUserLocation({ lat: 40.712776, lng: -74.005974 });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      handleError({ message: "Geolocation not supported" });
    }
  }, [setUserLocation]);

  return getUserLocation;
};

export default useGetUserLocation;
