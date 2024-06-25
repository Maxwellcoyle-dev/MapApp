import React, { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

// components
import Input from "./Input";
import AutoComplete from "./AutoComplete";

const SearchBar = ({ setMarkers }) => {
  const [query, setQuery] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);

  const [placesService, setPlacesService] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !map) return;

    setPlacesService(new placesLibrary.PlacesService(map));
    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

  useEffect(() => {
    if (!autocompleteService) return;

    console.log("autocompleteService: ", autocompleteService);
  }, [autocompleteService]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
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

  const handleInputSubmit = () => {
    placesService.textSearch(
      {
        query,
        location: map.getCenter(),
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log("Results: ", results);
          setMarkers(
            results.map((result) => ({
              placeId: result.place_id,
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
              name: result.name,
              isOpen: result.opening_hours?.isOpen(),
              rating: result.rating,
              totalUserRatings: result.user_ratings_total,
              address: result.formatted_address,
              priceLevel: result.price_level,
              types: result.types,
            }))
          );
          setAutoCompleteResults([]);
        } else {
          console.warn("Places service failed due to: ", status);
        }
      }
    );
  };

  return (
    <div
      style={{
        zIndex: 1,
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 0",
      }}
    >
      <Input
        query={query}
        handleInputChange={handleInputChange}
        handleInputSubmit={handleInputSubmit}
      />
      <AutoComplete autoCompleteResults={autoCompleteResults} />
    </div>
  );
};

export default SearchBar;
