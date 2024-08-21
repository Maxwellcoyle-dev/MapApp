import { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useSearchContext } from "../../state/SearchContext";

const useGoogleAutocomplete = () => {
  const { setAutoCompleteResults, setQueryInput, setSearchQuery } =
    useSearchContext();
  const [autocompleteService, setAutocompleteService] = useState(null);
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  const handleGoogleAutoComplete = async (value) => {
    if (value === "") {
      return [];
    }

    if (autocompleteService) {
      const request = {
        input: value,
        types: ["establishment"],
        location: map.getCenter(),
        radius: 5000,
      };

      return new Promise((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          request,
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const resultsWithSource = predictions.map((place) => ({
                ...place,
                source: "google",
              }));
              resolve(resultsWithSource);
            } else {
              console.warn("Autocomplete service failed due to: ", status);
              resolve([]); // Return an empty array on failure to avoid breaking the loop
            }
          }
        );
      });
    } else {
      return []; // Return an empty array if autocompleteService is not ready
    }
  };

  return handleGoogleAutoComplete;
};

export default useGoogleAutocomplete;
