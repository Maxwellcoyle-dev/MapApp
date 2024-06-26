// Libaries
import React, { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

// components
import Input from "./Input";
import AutoComplete from "./AutoComplete";

// Hooks
import useGetPlace from "../../hooks/useGetPlace";

const SearchBar = ({ setMarkers, setCenter, setSelectedMarker }) => {
  const [query, setQuery] = useState("");
  const [autoCompleteResults, setAutoCompleteResults] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);

  const { placeData, isPlaceDataLoading, isPlaceDataError, placeDataError } =
    useGetPlace(selectedPlaceId);

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  // Set the placesService and autocompleteService when the map and placesLibrary are ready
  useEffect(() => {
    if (!placesLibrary || !map) return;

    setPlacesService(new placesLibrary.PlacesService(map));
    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary, map]);

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

  const handleAutoCompleteClick = (placeId) => {
    console.log("Selected Place ID: ", placeId);
    setSelectedPlaceId(placeId);
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

  useEffect(() => {
    if (placeData) {
      console.log("Place Data: ", placeData);
      handlePlaceSelected(placeData);
    }
  }, [placeData]);

  const handlePlaceSelected = (place) => {
    setCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setMarkers([
      {
        placeId: place.place_id,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name,
        isOpen: place.opening_hours?.isOpen(),
        rating: place.rating,
        totalUserRatings: place.user_ratings_total,
        address: place.formatted_address,
        priceLevel: place.price_level,
        types: place.types,
      },
    ]);
    setSelectedMarker({
      placeId: place.place_id,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      name: place.name,
      isOpen: place.opening_hours?.isOpen(),
      rating: place.rating,
      totalUserRatings: place.user_ratings_total,
      address: place.formatted_address,
      priceLevel: place.price_level,
      types: place.types,
    });
    setAutoCompleteResults([]);
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
      <AutoComplete
        autoCompleteResults={autoCompleteResults}
        handleAutoCompleteClick={handleAutoCompleteClick}
      />
      {isPlaceDataLoading && <div>Loading...</div>}
      {isPlaceDataError && <div>Error: {placeDataError.message}</div>}
    </div>
  );
};

export default SearchBar;
