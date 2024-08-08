import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

const fetchPhotos = async (placesLibrary, map, placeIds) => {
  if (!placeIds.length) throw new Error("No placeIds provided");

  const placesService = new placesLibrary.PlacesService(map);

  return Promise.all(
    placeIds.map(
      (placeId) =>
        new Promise((resolve, reject) => {
          placesService.getDetails(
            {
              placeId,
              fields: ["photos"],
            },
            (place, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
              } else {
                reject(
                  new Error(`Failed to fetch details for ${placeId}: ${status}`)
                );
              }
            }
          );
        })
    )
  );
};

const useGetPhotos = (placeIds) => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const normalizedPlaceIds = Array.isArray(placeIds) ? placeIds : [placeIds];

  const {
    data: placesPhotos,
    isLoading: arePlacesPhotosLoading,
    isError: arePlacesPhotosErrors,
    error: placesPhotosError,
  } = useQuery({
    queryKey: ["places", normalizedPlaceIds],
    queryFn: () => fetchPhotos(placesLibrary, map, normalizedPlaceIds),
    enabled: !!normalizedPlaceIds.length,
    staleTime: 1000 * 60 * 10, // Cache the data for 10 minutes
    cacheTime: 1000 * 60 * 30, // Keep the data in cache for 30 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
  });

  return {
    placesPhotos,
    arePlacesPhotosLoading,
    arePlacesPhotosErrors,
    placesPhotosError,
  };
};

export default useGetPhotos;
