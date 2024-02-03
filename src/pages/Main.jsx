import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import MapView from "../components/MapView/MapView";
import PlacesComponent from "../components/PlacesComponent/PlacesComponent";

import { fetchPlaces } from "../hooks/usePlacesSearch";

import { GoogleMapsAPIContext } from "../context/GoogleMapsAPIProvider";

const Main = () => {
  const { isApiLoaded, bounds, query } = useContext(GoogleMapsAPIContext);

  const enabled = query != "" && isApiLoaded && bounds != null;

  const {
    data: places,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["places", { query, bounds }],
    queryFn: () => fetchPlaces(query, { bounds }),
    enabled: enabled,
  });

  if (!isApiLoaded) {
    return <div>Loading Google Maps...</div>; // Loading state
  }

  return (
    <div style={{ height: "100%" }}>
      <PlacesComponent places={places} isLoading={isLoading} error={error} />
      <MapView places={places} isLoading={isLoading} />
    </div>
  );
};

export default Main;
