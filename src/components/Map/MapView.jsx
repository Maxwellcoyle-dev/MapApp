// Libraries
import React, { useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

// Components
import MapComponent from "./MapComponent";
import PlaceDetailsCard from "../PlaceDetailsCard/PlaceDetailsCard";

// State
import { useMapContext } from "../../state/MapContext";
import { useAppContext } from "../../state/AppContext";
import { useSearchContext } from "../../state/SearchContext";

// Hooks
import useMarkerClick from "../../hooks/useMakerClick";

// Styles
import styles from "./MapView.module.css";

const mapOptions = {
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  gestureHandling: "greedy",
};

const MapView = ({ placesResults, setView }) => {
  // Custom hook to handle marker click
  const handleMarkerClick = useMarkerClick();

  // Get user's location from AppContext
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
              setView("");
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
        {selectedPlace?.place_id && <PlaceDetailsCard />}
      </Map>
    </div>
  );
};

export default MapView;
