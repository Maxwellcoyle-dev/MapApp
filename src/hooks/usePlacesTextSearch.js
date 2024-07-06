import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

import { useSearchContext } from "../state/SearchContext";

export const getPlaces = async (
  placesLibrary,
  map,
  query,
  placeType,
  setAutoCompleteResults
) => {
  const placesService = new placesLibrary.PlacesService(map);

  let queryText = query;

  if (queryText === "") {
    queryText = `${placeType} near me`;
  }

  return new Promise((resolve, reject) => {
    placesService.textSearch(
      {
        query: queryText,
        locationBias: map?.getCenter(),
        includedType: placeType,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          setAutoCompleteResults([]);
          resolve(results);
        } else {
          reject(status);
        }
      }
    );
  });
};

const usePlacesTextSearch = (query) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const { setAutoCompleteResults } = useSearchContext();

  const { placeType } = useSearchContext();

  const {
    data: placesResults,
    isLoading: isPlacesResultsLoading,
    isError: isPlacesResultsError,
    error: placesResultsError,
  } = useQuery({
    queryKey: ["usePlaceTextSearch", query, placeType],
    queryFn: () =>
      getPlaces(placesLibrary, map, query, placeType, setAutoCompleteResults),
    enabled: !!placeType,
    staleTime: 1000 * 60 * 10, // Cache the data for 10 minutes
    cacheTime: 1000 * 60 * 30, // Keep the data in cache for 30 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });

  return {
    placesResults,
    isPlacesResultsLoading,
    isPlacesResultsError,
    placesResultsError,
  };
};

export default usePlacesTextSearch;
