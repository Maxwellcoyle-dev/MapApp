import { useEffect } from "react";
import { useMapContext } from "../state/MapContext";

const useGetUserLocation = () => {
  const { setUserLocation } = useMapContext();

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // add the users location to local storage
            localStorage.setItem(
              "mapAppUserLocation",
              JSON.stringify({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
            );
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            // Use a default location (e.g., New York City) in case of error
            setUserLocation({
              lat: 40.712776,
              lng: -74.005974,
            });
          }
        );
      } else {
        // Geolocation not supported, use default location
        setUserLocation({
          lat: 40.712776,
          lng: -74.005974,
        });
      }
    };

    getUserLocation();
  }, [setUserLocation]);
};

export default useGetUserLocation;
