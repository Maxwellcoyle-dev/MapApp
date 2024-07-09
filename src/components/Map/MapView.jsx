import React, { useEffect, useState } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

import MapComponent from "./MapComponent";
import PlaceDetailsCard from "../PlaceDetailsCard/PlaceDetailsCard";

import { useMapContext } from "../../state/MapContext";
import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";

import useMarkerClick from "../../hooks/useMakerClick";

import styles from "./MapView.module.css";

const MapView = ({ placesResults }) => {
  const [placeId, setPlaceId] = useState(null);
  const [showPlaceDetailsCard, setShowPlaceDetailsCard] = useState(false);
  const handleMarkerClick = useMarkerClick();

  const { userLocation } = useAppContext();

  const { center, setCenter, setZoom, zoom } = useMapContext();

  const { searchQuery, setAutoCompleteResults, selectedPlace } =
    useSearchContext();

  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  useEffect(() => {
    console.log("placesResults: ", placesResults);
  }, [placesResults]);

  useEffect(() => {
    console.log("selectedPlace: ", selectedPlace);
  }, [selectedPlace]);

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
    }
  }, [searchQuery]);

  return (
    <div className={styles.mapViewContainer}>
      <Map
        mapId={"126ae8e8ffefefdf"}
        style={{
          width: "100vw",
          height: "calc(100vh - 10rem)",
          overflow: "hidden",
        }}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        <MapComponent setCenter={setCenter} setZoom={setZoom} />
        {placesResults?.map((marker) => (
          <AdvancedMarker
            key={marker.place_id}
            position={{
              lat: marker?.geometry.location.lat(),
              lng: marker?.geometry.location.lng(),
            }}
            onClick={() => {
              handleMarkerClick(marker);
            }}
          >
            {marker.place_id === selectedPlace?.place_id ? (
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
        {selectedPlace?.place_id && (
          <PlaceDetailsCard placeId={selectedPlace?.place_id} />
        )}
      </Map>
    </div>
  );
};

export default MapView;
