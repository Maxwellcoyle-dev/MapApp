import { useMapsLibrary } from "@vis.gl/react-google-maps";

const useGetCoordsLocality = () => {
  const geocodingLibrary = useMapsLibrary("geocoding");

  // make sure the map is rendered before trying to get coords

  const getCoordsLocality = async (input) => {
    console.log("Geocoding input: ", input);

    // Wait for the geocoding library to load
    if (!geocodingLibrary) {
      console.log("Waiting for geocoding library to load...");
      return null;
    }

    const geocoder = new geocodingLibrary.Geocoder();

    // Use the coords to get the locality
    const { results } = await geocoder.geocode({
      location: input, // Assuming input is { lat: number, lng: number }
    });

    const locality = results.reduce((acc, result) => {
      const localityComponent = result?.address_components.find((component) =>
        component.types.includes("locality")
      );
      return acc || (localityComponent ? localityComponent.long_name : null);
    }, null);

    console.log("Locality:", locality);
    return locality;
  };

  return { getCoordsLocality };
};

export default useGetCoordsLocality;
