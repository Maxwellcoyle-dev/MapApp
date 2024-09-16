import { useCallback } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

// Context
import { useSearchContext } from "../../state/SearchContext";

const useLocationAutocomplete = () => {
  const { setLocationAutoCompleteResults } = useSearchContext();
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const searchLocations = useCallback(
    async (input) => {
      if (!placesLibrary || !map || !input) {
        setLocationAutoCompleteResults([]);
        return;
      }

      const autocompleteService = new placesLibrary.AutocompleteService();
      const request = {
        input,
        types: ["locality", "country", "postal_code"],
      };

      try {
        const predictions = await new Promise((resolve, reject) => {
          autocompleteService.getPlacePredictions(
            request,
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(predictions);
              } else {
                console.warn("Autocomplete service failed due to: ", status);
                reject(status);
              }
            }
          );
        });

        const resultsWithSource = predictions.map((place) => ({
          ...place,
          source: "google",
        }));

        setLocationAutoCompleteResults(resultsWithSource);
      } catch (error) {
        console.error("Error fetching autocomplete results:", error);
        setLocationAutoCompleteResults([]);
      }
    },
    [placesLibrary, map]
  );

  return { searchLocations };
};

export default useLocationAutocomplete;
