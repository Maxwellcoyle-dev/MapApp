import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const AutocompleteInput = ({ onPlaceSelected }) => {
  const autocompleteRef = useRef();
  const inputRef = useRef();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary) return;

    const autocomplete = new placesLibrary.Autocomplete(inputRef.current);
    autocompleteRef.current = autocomplete;

    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelected({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    };

    const placeChangedListener = autocomplete.addListener(
      "place_changed",
      handlePlaceChanged
    );

    return () => {
      if (placeChangedListener) {
        placeChangedListener.remove();
      }
    };
  }, [placesLibrary, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter a location"
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 10,
        padding: "5px 10px",
        width: "300px",
      }}
    />
  );
};

const MapView = () => {
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(12);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          // Handle errors or use default location
        }
      );
    }
  }, []);

  useEffect(() => {
    console.log("center: ", center);
  }, [center, zoom]);

  const handlePlaceSelected = (location) => {
    setCenter(location);
    setZoom(14);
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
        <AutocompleteInput onPlaceSelected={handlePlaceSelected} />
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={center}
          center={center}
          zoom={zoom}
        >
          <Marker position={center} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapView;
