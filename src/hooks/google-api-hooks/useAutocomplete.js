import { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useSearchContext } from "../../state/SearchContext";

const useAutocomplete = () => {
  const { setAutoCompleteResults, setQueryInput, setSearchQuery } =
    useSearchContext();
  const [autocompleteService, setAutocompleteService] = useState(null);

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !map) return;

    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQueryInput(inputValue);

    if (inputValue === "") {
      setAutoCompleteResults([]);
      setSearchQuery("");
      return;
    }

    if (autocompleteService) {
      const request = {
        input: inputValue,
        types: ["establishment"],
        location: map.getCenter(),
        radius: 5000, // setting a radius in meters (optional)
      };

      console.log("making the request");
      autocompleteService.getPlacePredictions(
        request,
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

export default useAutocomplete;
