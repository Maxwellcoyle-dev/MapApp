/* global google */

import { useContext } from "react";
import { useQuery, queryOptions } from "@tanstack/react-query";

import { GoogleMapsAPIContext } from "../context/GoogleMapsAPIProvider";

const fetchPlaces = async (query, { searchInBounds, bounds } = {}) => {
  if (!query) return [];

  console.log(
    "fetchPlaces called with query:",
    query,
    "searchInBounds:",
    searchInBounds,
    "bounds:",
    bounds
  );

  const serviceOptions = { query };
  if (searchInBounds && bounds) {
    // Convert bounds object to a LatLngBounds object
    const googleBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(bounds.south, bounds.west),
      new window.google.maps.LatLng(bounds.north, bounds.east)
    );
    serviceOptions.bounds = googleBounds;
    console.log("Using bounds for search:", googleBounds);
  }
  console.log("Service options:", serviceOptions);

  return new Promise((resolve, reject) => {
    const mapElement = document.createElement("div");
    const map = new window.google.maps.Map(mapElement);
    const service = new window.google.maps.places.PlacesService(map);

    service.textSearch(serviceOptions, (results, status) => {
      console.log("Search status:", status, "Results:", results);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject("Places API Error: " + status);
      }
    });
  });
};

export const usePlacesSearch = (query, searchInBounds) => {
  const { isApiLoaded, bounds } = useContext(GoogleMapsAPIContext); // Destructure bounds

  console.log(
    "usePlacesSearch called with query:",
    query,
    "searchInBounds:",
    searchInBounds,
    "isApiLoaded:",
    isApiLoaded,
    "bounds:",
    bounds
  );

  const groupOptions = () =>
    queryOptions({
      queryKey: ["places", query, searchInBounds, bounds], // Include bounds in the query key to refetch when bounds change
      queryFn: () => fetchPlaces(query, { searchInBounds, bounds }), // Pass bounds to your fetch function
      enabled: !!query && isApiLoaded && bounds != null, // Ensure bounds are available
    });

  return useQuery(groupOptions());
};
