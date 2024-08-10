import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

const fetchPhotos = async (placesLibrary, map, normalizedPlaceIds) => {
  if (!normalizedPlaceIds.length) throw new Error("No placeIds provided");

  console.log("Fetching photos for placeIds:", normalizedPlaceIds);
  const placesService = new placesLibrary.PlacesService(map);
  console.log("placesService initialized:", !!placesService);

  if (!placesService) throw new Error("Failed to create PlacesService");

  return Promise.all(
    normalizedPlaceIds.map(
      (placeId) =>
        new Promise((resolve, reject) => {
          placesService.getDetails(
            {
              placeId,
              fields: ["photos"],
            },
            (place, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                if (place && place.photos && place.photos.length > 0) {
                  console.log(`Fetched photos for ${placeId}:`, place.photos);
                  resolve(place.photos);
                } else {
                  console.warn(`No photos available for ${placeId}`);
                  resolve(null); // Resolve with null if no photos available
                }
              } else {
                console.error(
                  `Failed to fetch details for ${placeId}: ${status}`
                );
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

  console.log("normalizedPlaceIds:", normalizedPlaceIds);

  const {
    data: placesPhotos,
    isLoading: arePlacesPhotosLoading,
    isError: arePlacesPhotosErrors,
    error: placesPhotosError,
  } = useQuery({
    queryKey: ["place-photos", normalizedPlaceIds],
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
