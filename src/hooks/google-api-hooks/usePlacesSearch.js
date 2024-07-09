import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

import { useSearchContext } from "../../state/SearchContext";

import { textSearch } from "./place-search-functions/textSearch";
import { nearbySearch } from "./place-search-functions/nearbySearch";

const usePlacesSearch = () => {
  const [searchType, setSearchType] = useState("nearby");

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const { placeType, searchQuery } = useSearchContext();

  useEffect(() => {
    if (searchQuery) {
      setSearchType("text");
    } else {
      setSearchType("nearby");
    }
  }, [searchQuery]);

  const fetchPlaces = async () => {
    if (searchType === "nearby") {
      return nearbySearch(placesLibrary, map, placeType);
    } else {
      return textSearch(placesLibrary, map, searchQuery, placeType);
    }
  };

  const {
    data: placesResults,
    isLoading: isPlacesResultsLoading,
    isError: isPlacesResultsError,
    error: placesResultsError,
    refetch: refetchPlacesResults,
  } = useQuery({
    queryKey: ["usePlaceSearch", placeType, searchQuery],
    queryFn: fetchPlaces,
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
    refetchPlacesResults,
  };
};

export default usePlacesSearch;
