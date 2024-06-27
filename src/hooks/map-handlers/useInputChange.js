import { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

import { useMapContext } from "../../state/MapContext";

const useInputChange = () => {
  const { setAutoCompleteResults, setSearchQuery } = useMapContext();
  const [autocompleteService, setAutocompleteService] = useState(null);

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !map) return;

    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (autocompleteService && event.target.value) {
      autocompleteService.getPlacePredictions(
        {
          input: event.target.value,
          types: ["establishment"],
          locationBias: map.getCenter(),
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log("Predictions: ", predictions);
            setAutoCompleteResults(predictions);
          } else {
            console.warn("Autocomplete service failed due to: ", status);
          }
        }
      );
    }
  };

  return handleInputChange;
};

export default useInputChange;
