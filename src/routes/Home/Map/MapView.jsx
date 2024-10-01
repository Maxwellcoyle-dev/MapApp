// Libraries
import React, { useEffect } from "react";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";

// Components
import MapComponent from "./MapComponent";
import PlaceDetailsCard from "./PlaceDetailsCard/PlaceDetailsCard";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";
import { useAppContext } from "../../../state/AppContext";

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

const MapView = ({ topPadding }) => {
  const { selectedPlace } = useSearchContext();
  const { center, zoom, currentMapPins } = useMapContext();
  const { userLocation } = useAppContext();

  const handleMarkerClick = useMarkerClick();

  return (
    <div className={styles.mapViewWrapper}>
      <div
        className={styles.mapViewContainer}
        style={{ height: `calc(100vh - ${topPadding}px)` }}
      >
        <Map
          mapId={"126ae8e8ffefefdf"}
          defaultCenter={center}
          zoom={zoom}
          options={mapOptions}
        >
          <MapComponent />
          {userLocation?.coords && (
            <AdvancedMarker
              position={{
                lat: userLocation.coords?.lat,
                lng: userLocation.coords?.lng,
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  border: "2px solid white",
                }}
              />
            </AdvancedMarker>
          )}
          {currentMapPins?.length !== 0 &&
            currentMapPins?.map((marker) => {
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
    </div>
  );
};

export default MapView;
