import React from "react";

// Components
import MapView from "../../components/MapComponent/Map/MapView";
import MapListView from "../../components/MapComponent/MapListView/MapListView";

// Hooks
import useGetUserLocation from "../../hooks/useGetUserLocation";
import usePlacesSearch from "../../hooks/google-api-hooks/usePlacesSearch";

const Map = () => {
  useGetUserLocation();

  const { placesResults, isPlacesResultsLoading } = usePlacesSearch();

  return (
    <div>
      <MapView placesResults={placesResults} />
    </div>
  );
};

export default Map;
