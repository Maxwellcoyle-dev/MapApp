// Libraries
import React, { useEffect } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

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

const MapView = ({ markerList, mapHeight }) => {
  const { selectedPlace } = useSearchContext();
  const { center, zoom, mapSize, mapLayout, isMapVisible } = useMapContext();

  useEffect(() => {
    console.log("selectedPlace", selectedPlace);
    console.log("markerList", markerList);
  }, [selectedPlace, markerList]);

  // Custom hook to handle marker click
  const handleMarkerClick = useMarkerClick();

  if (!isMapVisible) return null;

  return (
    <div
      className={`${styles.mapViewContainer} ${styles[mapLayout]} ${styles[mapSize]}`}
      style={mapHeight !== null && { height: `${mapHeight}px` }}
    >
      <Map
        mapId={"126ae8e8ffefefdf"}
        style={{
          width: "100vw",
          overflow: "hidden",
        }}
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
