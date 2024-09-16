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
  searchRadius,
  placeType
) => {
  const placesService = new placesLibrary.PlacesService(map);

  console.log("placesService object -- ", placesService);
  console.log("nearby search - getPlaces function arguments -- ");
  console.log("searchRadius -- ", searchRadius * 1609.34);
  console.log("placeType -- ", placeType);
  console.log("SearchNearbyRankPreference -- ", SearchNearbyRankPreference);

  const radius = searchRadius * 1609.34;

  // if ranking by popularity then radius is required. If ranking by distance then radius is not required.

  const request = {
    location: map.getCenter(),
    radius,
    keyword: placeType || "establishments",
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
