import React, { useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

import MapComponent from "./MapComponent";

import { useMapContext } from "../../state/MapContext";

import useGetPlace from "../../hooks/useGetPlace";
import useMarkerClick from "../../hooks/useMakerClick";

import styles from "./MapView.module.css";

const MapView = () => {
  const { placeData } = useGetPlace();
  const handleMarkerClick = useMarkerClick();

  useEffect(() => {
    if (placeData) {
      console.log("Place Data:", placeData);
    }
  }, [placeData]);

  const {
    center,
    searchQuery,
    setAutoCompleteResults,
    setCenter,
    selectedPlace,
    searchResults,
    setSearchResults,
    userLocation,
    setZoom,
    zoom,
  } = useMapContext();

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
    if (searchQuery === "") {
      setAutoCompleteResults([]);
      setZoom(12);
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (userLocation) {
      console.log("User Location:", userLocation);
      setCenter(userLocation);
    }
  }, [userLocation, setCenter]);

  return (
    <div className={styles.mapViewContainer}>
      <Map
        mapId={"126ae8e8ffefefdf"}
        style={{ width: "100vw", height: "calc(100vh - 5.5rem)" }}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        <MapComponent setCenter={setCenter} setZoom={setZoom} />

        {searchResults.map((marker, index) => (
          <AdvancedMarker
            key={index}
            position={{ lat: marker.location.lat, lng: marker.location.lng }}
            onClick={() => {
              handleMarkerClick(marker.placeId);
            }}
          >
            {marker.placeId === selectedPlace?.placeId ? (
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
      </Map>
    </div>
  );
};

export default MapView;
