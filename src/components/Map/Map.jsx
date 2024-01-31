import React, { useRef, useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const Map = ({ center, zoom }) => {
  const ref = useRef();
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          fullscreenControl: false,
        })
      );
    });
  }, [zoom]);

  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center, map]);

  return <div ref={ref} style={{ width: "100%", height: "100vh" }} id="map" />;
};

export default Map;
