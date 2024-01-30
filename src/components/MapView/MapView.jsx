import React, { useState, useEffect } from "react";
import Map from "../Map/Map";

const MapView = () => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(12);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          // Handle errors or use default location
        }
      );
    } else {
      // Browser doesn't support Geolocation
      // Handle accordingly or use default location
    }
  }, []);

  return <Map center={center} zoom={zoom} />;
};

export default MapView;
