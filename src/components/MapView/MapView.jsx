import React, { useState, useEffect } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

import SearchBar from "../Search/SearchBar";

const MapView = () => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(4);

  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
  };

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
    }
  }, []);

  const handlePlaceSelected = (location) => {
    setCenter(location);
    setZoom(14);
  };

  const MapComponent = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const centerChangedListener = map.addListener("center_changed", () => {
        setCenter({
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng(),
        });
      });

      const zoomChangedListener = map.addListener("zoom_changed", () => {
        setZoom(map.getZoom());
      });

      return () => {
        centerChangedListener.remove();
        zoomChangedListener.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        height: "100%",
        width: "100%",
      }}
    >
      <Map
        mapId={"126ae8e8ffefefdf"}
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        <MapComponent />
      </Map>
    </div>
  );
};

export default MapView;
