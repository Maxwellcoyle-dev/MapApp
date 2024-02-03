/* global google */

export const fetchPlaces = async (query, { bounds } = {}) => {
  if (!query) return [];

  console.log("fetchPlaces called with query:", query, "bounds:", bounds);

  // Convert bounds object to a LatLngBounds object
  const googleBounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(bounds.south, bounds.west),
    new window.google.maps.LatLng(bounds.north, bounds.east)
  );
  const centerOfBounds = googleBounds.getCenter();
  console.log("Google bounds:", googleBounds);

  const serviceOptions = {
    query,
    location: { lat: centerOfBounds.lat(), lng: centerOfBounds.lng() },
  };

  console.log("Service options:", serviceOptions);

  return new Promise((resolve, reject) => {
    const mapElement = document.createElement("div");
    const map = new window.google.maps.Map(mapElement);
    const service = new window.google.maps.places.PlacesService(map);

    service.textSearch(serviceOptions, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
};

// export const usePlacesSearch = (shouldFetch) => {
//   const { isApiLoaded, bounds, query } = useContext(GoogleMapsAPIContext);

//   const groupOptions = () =>
//     queryOptions({
//       queryKey: ["places", { query, bounds }],
//       queryFn: () => fetchPlaces(query, { bounds }),
//       enabled: enabled,
//     });

//   return useQuery(groupOptions());
// };
