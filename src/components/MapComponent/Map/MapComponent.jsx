// Libraries
import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

// Context
import { useMapContext } from "../../../state/MapContext";

const MapComponent = () => {
  const map = useMap();
  const { setCenter, setZoom } = useMapContext();

  useEffect(() => {
    console.log("MapComponent mounted");
    console.log(map);
  }, []);

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

  return null;
};

export default MapComponent;
