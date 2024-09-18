import { useEffect, useState } from "react";
import { useMapContext } from "../state/MapContext";

const useGetUserLocation = () => {
  const { setUserLocation } = useMapContext();
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const handlePositionUpdate = (position) => {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      localStorage.setItem("mapAppUserLocation", JSON.stringify(newLocation));
      setUserLocation(newLocation);
    };

    const handleError = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      // Try to use the last known location from local storage
      const lastKnownLocation = localStorage.getItem("mapAppUserLocation");
      if (lastKnownLocation) {
        setUserLocation(JSON.parse(lastKnownLocation));
      } else {
        // If no last known location, use a default location (e.g., New York City)
        setUserLocation({
          lat: 40.712776,
          lng: -74.005974,
        });
      }
    };

    // Try to get the last known location from local storage immediately
    const lastKnownLocation = localStorage.getItem("mapAppUserLocation");
    if (lastKnownLocation) {
      setUserLocation(JSON.parse(lastKnownLocation));
    }

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(handlePositionUpdate, handleError);
      setWatchId(id);
    } else {
      handleError({ code: 0, message: "Geolocation not supported" });
    }

    // Cleanup function to stop watching the position when the component unmounts
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [setUserLocation]);
};

export default useGetUserLocation;
