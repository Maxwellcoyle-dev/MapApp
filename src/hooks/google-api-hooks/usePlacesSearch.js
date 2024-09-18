import { useQuery } from "@tanstack/react-query";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

// Contexts
import { useSearchContext } from "../../state/SearchContext";
import { useMapContext } from "../../state/MapContext";

// Place search functions
import { textSearch } from "./place-search-functions/textSearch";
import { nearbySearch } from "./place-search-functions/nearbySearch";

const usePlacesSearch = () => {
  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  const { searchType, searchRadius, placeType, searchLocation, searchQuery } =
    useSearchContext();
  const { userLocation } = useMapContext();

  const fetchPlaces = async () => {
    console.log("Search query: ", searchQuery);
    console.log("Search type: ", searchType);
    console.log("Search radius: ", searchRadius);
    console.log("Place type: ", placeType);
    console.log("User location: ", userLocation);
    console.log("searchLocation: ", searchLocation);
    console.log("Fetching text search places");

    try {
      let results;
      let center;

      console.log("User location: ", userLocation);
      center = userLocation;

      if (searchType === "places") {
        console.log("Searching for places");
        results = await textSearch(
          placesLibrary,
          map,
          searchQuery,
          placeType,
          searchLocation
        );
      } else if (searchType === "type") {
        center = userLocation;
        console.log("Center: ", center);

        results = await nearbySearch(
          placesLibrary,
          map,
          searchRadius,
          placeType || "establishment",
          searchLocation
        );
      }

      const formattedData = results.map((place) => {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        const geometry = {
          location: location,
          viewport: place.geometry.viewport,
        };
        return {
          placeId: place.place_id,
          placeName: place.name,
          ...(place.formatted_address && {
            formatted_address: place.formatted_address,
          }),
          geometry: geometry,
          photos: place.photos,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          opening_hours: place.opening_hours,
          ...(place.website && { website: place.website }),
          ...(place.url && { placeUrl: place.url }),
          vicinity: place.vicinity,
          ...(place.formatted_phone_number && {
            formatted_phone_number: place.formatted_phone_number,
          }),
          business_status: place.business_status,
          placeIsSaved: false,
          ...(place.reviews && { reviews: place.reviews }),
          types: place.types,
          price_level: place.price_level,
        };
      });
      return formattedData;
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  const {
    data: placesResults,
    isLoading: isPlacesResultsLoading,
    isError: isPlacesResultsError,
    error: placesResultsError,
    refetch: refetchPlacesResults,
  } = useQuery({
    queryKey: [
      "places-search",
      placeType || "establishment",
      searchQuery || "establishments",
      searchLocation,
      searchRadius,
    ],
    queryFn: fetchPlaces,
    enabled: !!map && !!placesLibrary,
    staleTime: 1000 * 60 * 10, // Cache the data for 10 minutes
    cacheTime: 1000 * 60 * 30, // Keep the data in cache for 30 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
    retry: false,
  });

  return {
    placesResults,
    isPlacesResultsLoading,
    isPlacesResultsError,
    placesResultsError,
    refetchPlacesResults,
  };
};

export default usePlacesSearch;
