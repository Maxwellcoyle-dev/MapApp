import React, { useState, useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

import MapComponent from "./MapComponent";
import MapInfoWindow from "../MapInfoWindow/MapInfoWindow";

const MapView = ({
  markers,
  setCenter,
  center,
  selectedMarker,
  setSelectedMarker,
}) => {
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

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setCenter({ lat: marker.lat, lng: marker.lng });
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
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
        <MapComponent setCenter={setCenter} setZoom={setZoom} />

        {markers.map((marker, index) => (
          <AdvancedMarker
            key={index}
            position={marker}
            onClick={() => handleMarkerClick(marker)}
          >
            {marker.placeId === selectedMarker?.placeId ? (
              <Pin
                background={"blue"}
                glyphColor={"gray"}
                borderColor={"gray"}
              />
            ) : (
              <Pin background={""} glyphColor={""} borderColor={""} />
            )}
          </AdvancedMarker>
        ))}

        <MapInfoWindow
          placeDetails={selectedMarker}
          handleInfoWindowClose={handleInfoWindowClose}
        />
      </Map>
    </div>
  );
};

export default MapView;
