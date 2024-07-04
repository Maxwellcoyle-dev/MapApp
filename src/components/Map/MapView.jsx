import React, { useEffect, useState } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

import MapComponent from "./MapComponent";

import { useMapContext } from "../../state/MapContext";
import { useAppContext } from "../../state/AppContext";

import useMarkerClick from "../../hooks/useMakerClick";

import styles from "./MapView.module.css";
import PlaceDetailsCard from "../PlaceDetailsCard/PlaceDetailsCard";

const MapView = () => {
  const [placeId, setPlaceId] = useState(null);
  const [showPlaceDetailsCard, setShowPlaceDetailsCard] = useState(false);
  const handleMarkerClick = useMarkerClick();

  const { userLocation } = useAppContext();

  const {
    center,
    searchQuery,
    setAutoCompleteResults,
    setCenter,
    selectedPlace,
    searchResults,
    setSearchResults,
    setZoom,
    zoom,
  } = useMapContext();

  useEffect(() => {
    console.log("searchResults: ", selectedPlace);
  }, [searchResults]);

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  const mapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
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
              handleMarkerClick(marker);
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
        {selectedPlace.placeId && (
          <PlaceDetailsCard placeId={selectedPlace?.placeId} />
        )}
      </Map>
    </div>
  );
};

export default MapView;
