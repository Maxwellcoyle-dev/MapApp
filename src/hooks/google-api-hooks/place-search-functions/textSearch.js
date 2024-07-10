// This function is used to get places based on the textQuery.

// Argument Schema
const schema = {
  placesLibrary: {}, // Google Maps Places Library - Required
  map: {}, // Google Maps Map - Required
  includedPrimaryTypes: [""], // Array of strings - if empty set string to "establishments"
  rankPreference: "popularity / distance", // String - if empty set string to "popularity"
  minPriceLevel: 0, // Number - if empty set to 0 - 0: Free, 1: Inexpensive, 2: Moderate, 3: Expensive, 4: Very Expensive
  locationRestrictionFields: {
    center: {}, // Google Maps LatLng - Required - if empty set to map.getCenter()
    radius: 0, // Number - Required - if empty set to 5000
  },
};

export const textSearch = async (
  placesLibrary,
  map,
  searchQuery,
  placeType
) => {
  if (!map || !placesLibrary || !searchQuery || !placeType) {
    console.error(
      "textSearch: Missing required arguments. Required arguments are placesLibrary, map, searchQuery, and placeType."
    );
    return;
  }

  const placesService = new placesLibrary.PlacesService(map);

  return new Promise((resolve, reject) => {
    placesService.textSearch(
      {
        query: searchQuery || `${placeType} near me`,
        locationBias: map?.getCenter(),
        includedType: placeType,
        minPriceLevel: 2,
        maxPriceLevel: 3,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          resolve(results);
        } else {
          reject(status);
        }
      }
    );
  });
};
