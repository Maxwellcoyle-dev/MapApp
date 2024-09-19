// Libraries
import React from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

// Components
import MapComponent from "./MapComponent";
import PlaceDetailsCard from "../../PlaceDetailsCard/PlaceDetailsCard";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";

// Hooks
import useMarkerClick from "../../../hooks/useMakerClick";
import useGetUserLocation from "../../../hooks/useGetUserLocation";

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

const MapView = ({ markerList }) => {
  const { selectedPlace } = useSearchContext();
  const { center, zoom, userLocation } = useMapContext();
  useGetUserLocation();

  console.log("userLocation", userLocation);

  const handleMarkerClick = useMarkerClick();

  return (
    <div className={styles.mapViewContainer} style={{ height: "100vh" }}>
      <Map
        mapId={"126ae8e8ffefefdf"}
        defaultCenter={center}
        zoom={zoom}
        options={mapOptions}
      >
        <MapComponent />
        {userLocation && (
          <AdvancedMarker
            position={{
              lat: userLocation.lat,
              lng: userLocation.lng,
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
