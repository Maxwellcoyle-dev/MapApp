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
  searchType,
  searchRadius,
  rankBy,
  placeType
) => {
  if (!map || !placesLibrary || !searchQuery) {
    console.error(
      "textSearch: Missing required arguments. Required arguments are placesLibrary, map, searchQuery."
    );
    return;
  }

  const placesService = new placesLibrary.PlacesService(map);

  console.log("textSearch: searchQuery -- ", searchQuery);
  console.log("textSearch: searchType -- ", searchType);
  console.log("textSearch: searchRadius -- ", searchRadius * 1609.34);
  console.log("textSearch: rankBy -- ", rankBy);
  console.log("textSearch: placeType -- ", placeType);

  return new Promise((resolve, reject) => {
    placesService.textSearch(
      {
        query: searchQuery,
        location: map?.getCenter(),
        radius: searchRadius * 1609.34,
        rankPreference: rankBy,
        keyword: placeType || "establishments",
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
