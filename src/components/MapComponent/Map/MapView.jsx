// Libraries
import React, { useEffect, useState } from "react";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";

// Components
import MapComponent from "./MapComponent";
import PlaceDetailsCard from "../../PlaceDetailsCard/PlaceDetailsCard";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";

// Hooks
import useMarkerClick from "../../../hooks/useMakerClick";

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

const MapView = ({ markerList, showMap = true, page = "home" }) => {
  const { selectedPlace } = useSearchContext();
  const { center, zoom, isMapVisible } = useMapContext();

  const handleMarkerClick = useMarkerClick();

  useEffect(() => {
    console.log("MapView mounted");
    console.log("center", center);
    console.log("zoom", zoom);
  }, [center, zoom]);

  return (
    <div
      className={
        (page === "home" && styles.mapViewContainer) ||
        (page === "list" && styles.mapViewContainerList)
      }
      style={showMap ? { height: "100vh" } : { height: 0 }}
    >
      <Map
        mapId={"126ae8e8ffefefdf"}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        <MapComponent />
        {markerList?.length !== 0 &&
          markerList?.map((marker) => {
            const placeId = marker.placeId;
            return (
              <AdvancedMarker
                key={placeId}
                position={
                  placeId && {
                    lng: marker?.geometry?.location?.lng,
                    lat: marker?.geometry?.location?.lat,
                  }
                }
                onClick={() => {
                  handleMarkerClick(marker);
                }}
              >
                {placeId === selectedPlace?.placeId ? (
                  <Pin
                    background={"blue"}
                    glyphColor={"gray"}
                    borderColor={"gray"}
                  />
                ) : (
                  <Pin background={""} glyphColor={""} borderColor={""} />
                )}
              </AdvancedMarker>
            );
          })}

        {selectedPlace?.placeId && <PlaceDetailsCard />}
      </Map>
    </div>
  );
};

export default MapView;
