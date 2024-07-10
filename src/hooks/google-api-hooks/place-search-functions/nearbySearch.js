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
  map,
  placeType,
  rankPreference = "popularity"
) => {
  const placesService = new placesLibrary.PlacesService(map);
  console.log("placesService object -- ", placesService);

  console.log("nearby search - getPlaces function arguments -- ");
  console.log("included Primary Types -- ", placeType);
  console.log("rank Preference -- ", rankPreference);

  // if ranking by popularity then radius is required. If ranking by distance then radius is not required.

  const request = {
    location: map.getCenter(),
    radius: 5000,
    type: placeType,
    // rankBy: placesLibrary.RankBy.DISTANCE,
    priceLevel: placesLibrary.PriceLevel.VERY_EXPENSIVE,
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
