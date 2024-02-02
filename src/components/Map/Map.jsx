import React, { useRef, useEffect, useContext } from "react";

import { GoogleMapsAPIContext } from "../../context/GoogleMapsAPIProvider";

const Map = ({ center, zoom }) => {
  const ref = useRef();
  const { isApiLoaded, setBounds } = useContext(GoogleMapsAPIContext);

  // Inside your Map component
  useEffect(() => {
    if (isApiLoaded) {
      const map = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      // Update bounds in the context when the map is loaded or its bounds change
      google.maps.event.addListener(map, "bounds_changed", () => {
        const bounds = map.getBounds();
        setBounds({
          north: bounds.getNorthEast().lat(),
          east: bounds.getNorthEast().lng(),
          south: bounds.getSouthWest().lat(),
          west: bounds.getSouthWest().lng(),
        });
      });
    }
  }, [isApiLoaded, center, zoom, setBounds]);

  return <div ref={ref} style={{ width: "100%", height: "100vh" }} id="map" />;
};

export default Map;
