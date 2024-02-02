import React from "react";

import MapView from "./components/MapView/MapView";
import PlacesComponent from "./components/PlacesComponent/PlacesComponent";

import { GoogleMapsAPIContext } from "./context/GoogleMapsAPIProvider";

const Main = () => {
  const { isApiLoaded } = useContext(GoogleMapsAPIContext);

  if (!isApiLoaded) {
    return <div>Loading Google Maps...</div>; // Loading state
  }

  return (
    <div>
      <PlacesComponent />
      <MapView />
    </div>
  );
};

export default Main;
