// This function is used to get places based on the textQuery.

// Argument Schema
// const schema = {
//   placesLibrary: {}, // Google Maps Places Library - Required
//   map: {}, // Google Maps Map - Required
//   includedPrimaryTypes: [""], // Array of strings - if empty set string to "establishments"
//   rankPreference: "popularity / distance", // String - if empty set string to "popularity"
//   minPriceLevel: 0, // Number - if empty set to 0 - 0: Free, 1: Inexpensive, 2: Moderate, 3: Expensive, 4: Very Expensive
//   locationRestrictionFields: {
//     center: {}, // Google Maps LatLng - Required - if empty set to map.getCenter()
//     radius: 0, // Number - Required - if empty set to 5000
//   },
// };

export const textSearch = async (
  placesLibrary,
  map,
  searchQuery,
  placeType
) => {
  if (!map || !placesLibrary || !searchQuery) {
    console.log(
      "textSearch: Missing required arguments. Required arguments are placesLibrary, map, searchQuery."
    );
    return;
  }

  const placesService = new placesLibrary.PlacesService(map);

  console.log("textSearch: searchQuery -- ", searchQuery);

  return new Promise((resolve, reject) => {
    const center = map.getCenter();
    const request = {
      query: searchQuery,
      locationBias: center,
      type: placeType,
    };
    console.log("textSearch: request -- ", request);

    placesService.textSearch(request, (results, status) => {
      if (status === placesLibrary.PlacesServiceStatus.OK) {
        console.log("textSearch: results -- ", results);
        resolve(results);
      } else {
        console.error("textSearch: Error -- ", status);
        reject(new Error(`Places API returned status: ${status}`));
      }
    });
  });
};
