// Libraries
import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

// Context
import { useMapContext } from "../../../state/MapContext";

const MapComponent = () => {
  const map = useMap();
  const { setCenter, setZoom, currentMapPins } = useMapContext();

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

  useEffect(() => {
    if (!map || !currentMapPins || currentMapPins.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    currentMapPins.forEach((pin) => {
      bounds.extend({
        lat: pin.geometry.location.lat,
        lng: pin.geometry.location.lng,
      });
    });

    map.fitBounds(bounds);
  }, [map, currentMapPins]);

  return null;
};

export default MapComponent;
