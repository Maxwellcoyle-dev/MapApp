import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

const useGetPlace = (placeId) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const fetchPlaceDetails = async ({ queryKey }) => {
    const [_, placeId] = queryKey;

    if (!placeId) throw new Error("No placeId provided");

    const placesService = new placesLibrary.PlacesService(map);

    return new Promise((resolve, reject) => {
      placesService.getDetails(
        {
          placeId: placeId,
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const {
    data: placeData,
    isLoading: isPlaceDataLoading,
    isError: isPlaceDataError,
    error: placeDataError,
  } = useQuery({
    queryKey: ["place", placeId],
    queryFn: fetchPlaceDetails,
    enabled: !!placeId,
    staleTime: 1000 * 60 * 10, // Cache the data for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep the data in cache for 30 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });

  return {
    placeData,
    isPlaceDataLoading,
    isPlaceDataError,
    placeDataError,
  };
};

export default useGetPlace;
