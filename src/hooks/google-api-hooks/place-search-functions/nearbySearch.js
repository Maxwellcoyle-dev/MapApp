// This function is used to get nearby places based on the user's location.

// Argument Schema
const schema = {
  placesLibrary: {}, // Google Maps Places Library - Required
  map: {}, // Google Maps Map - Required
  includedPrimaryTypes: [""], // Array of strings - if empty set string to "establishments"
  rankPreference: "popularity / distance", // String - if empty set string to "popularity"
  locationRestrictionFields: {
    center: {}, // Google Maps LatLng - Required - if empty set to map.getCenter()
    radius: 0, // Number - Required - if empty set to 5000
  },
};

export const nearbySearch = async (
  placesLibrary,
  SearchNearbyRankPreference,
  map,
  searchQuery,
  searchType,
  searchRadius,
  rankBy,
  placeType
) => {
  const placesService = new placesLibrary.PlacesService(map);

  console.log("placesService object -- ", placesService);

  console.log("nearby search - getPlaces function arguments -- ");
  console.log("searchQuery -- ", searchQuery);
  console.log("searchType -- ", searchType);
  console.log("searchRadius -- ", searchRadius * 1609.34);
  console.log("rankBy -- ", rankBy);
  console.log("placeType -- ", placeType);
  console.log("SearchNearbyRankPreference -- ", SearchNearbyRankPreference);

  // if ranking by popularity then radius is required. If ranking by distance then radius is not required.

  const request = {
    query: searchQuery,
    location: map.getCenter(),
    radius: searchRadius * 1609.34,
    keyword: placeType || "establishments",
    rankPreference: SearchNearbyRankPreference.rankBy,
  };
  console.log("nearby search - getPlaces function request -- ", request);

  return new Promise((resolve, reject) => {
    placesService.nearbySearch(request, (results, status) => {
      if (status === placesLibrary.PlacesServiceStatus.OK) {
        console.log("nearby search - getPlaces function results -- ", results);
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
};
