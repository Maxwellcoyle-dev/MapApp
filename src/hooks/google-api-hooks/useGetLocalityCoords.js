import { useMapsLibrary } from "@vis.gl/react-google-maps";

const useGetLocalityCoords = () => {
  const geocodingLibrary = useMapsLibrary("geocoding");

  const getLocalityCoords = async (locality) => {
    console.log("Geocoding locality: ", locality);
    const geocoder = new geocodingLibrary.Geocoder();

    // Use the locality to get the coordinates
    const { results } = await geocoder.geocode({
      address: locality,
    });

    if (results.length > 0) {
      const { lat, lng } = results[0]?.geometry?.location;
      console.log("Coordinates:", { lat: lat(), lng: lng() });
      return { lat: lat(), lng: lng() };
    }

    console.log("No coordinates found for the locality");
    return null;
  };

  return { getLocalityCoords };
};

export default useGetLocalityCoords;
