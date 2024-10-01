import React, { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MdOutlineLocationOn } from "react-icons/md";
import { Switch, Tag, notification } from "antd";

import LocationTag from "./LocationTag";

// notifications
import locationPermissionInstructions from "../../../../notifications/locationPermissionInstructions";

// hooks
import useGetLocalityCoords from "../../../../hooks/google-api-hooks/useGetLocalityCoords";
import useGetUserLocation from "../../../../hooks/useGetUserLocation";

// State
import { useSearchContext } from "../../../../state/SearchContext";
import { useAppContext } from "../../../../state/AppContext";

const LocationToggle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationShown, setNotificationShown] = useState(false);
  const isFirstRender = useRef(true);

  const {
    getUserLocation,
    loading: userLocationLoading,
    error: userLocationError,
  } = useGetUserLocation();

  // Search Context and App Context
  const {
    searchLocation,
    setSearchLocation,
    nearby,
    setNearby,
    locationQueryInput,
  } = useSearchContext();
  const { userLocation, deviceType } = useAppContext();

  // Google API Hook to get the locality of location coordinates
  const { getLocalityCoords } = useGetLocalityCoords();

  // access the map instance using the useMap hook - use this to set the center of the map
  const map = useMap();

  // set loading and error states based on userLocationLoading and userLocationError if neaby is true, else set them both to false
  useEffect(() => {
    console.log("userLocationError: ", userLocationError);
    if (nearby) {
      setLoading(userLocationLoading);
      setError(userLocationError);
    } else {
      setLoading(false);
      setError(null);
    }
  }, [nearby, userLocationLoading, userLocationError]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip the first render
    }
    // if nearby is true, check if user location is set and set the search location to the user location
    if (nearby) {
      console.log("userLocation: ", userLocation);
      if (userLocation?.coords) {
        setSearchLocation(userLocation);
        map?.setCenter(userLocation.coords);
      }
      if (!userLocation?.coords) {
        console.log("userLocation is not set");
        setSearchLocation({
          coords: null,
          locality: null,
        });
        if (
          userLocationError === "User denied Geolocation" &&
          !notificationShown
        ) {
          notification.warning({
            message: "Location Permission Needed",
            description: locationPermissionInstructions(deviceType),
            duration: 0, // Keeps the notification open until dismissed by the user
            style: {
              padding: "16px",
              backgroundColor: "#fffbe6", // Light yellow background for warnings
              borderRadius: "8px",
            },
          });
          setNotificationShown(true); // Set notification as shown
        }
      }
    }

    // if nearby is false, check if locationQueryInput is set and set the search location to the locationQueryInput
    if (!nearby) {
      console.log("locationQueryInput: ", locationQueryInput);

      if (locationQueryInput) {
        const coords = getLocalityCoords(locationQueryInput);
        console.log("coords: ", coords);
        setSearchLocation({
          coords: coords,
          locality: locationQueryInput,
        });
        map?.setCenter(coords);
      }
      if (!locationQueryInput) {
        console.log("locationQueryInput is not set");
        setSearchLocation({
          coords: null,
          locality: null,
        });
      }
    }
  }, [nearby, userLocation, userLocationError]);

  return (
    <div
      style={{
        width: "calc(100% - 2rem)",
        display: "flex",
        justifyContent: "space-between",
        padding: ".5rem",
        borderRadius: ".5rem",
        gap: ".25rem",
      }}
    >
      <LocationTag
        error={error}
        setError={setError}
        loading={loading}
        location={searchLocation?.locality}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        <h4>Nearby</h4>
        <Switch
          checked={nearby}
          onChange={async (checked) => {
            if (checked) {
              getUserLocation();
              setNotificationShown(false);
            }
            setNearby(checked);
          }}
        />
      </div>
    </div>
  );
};

export default LocationToggle;
