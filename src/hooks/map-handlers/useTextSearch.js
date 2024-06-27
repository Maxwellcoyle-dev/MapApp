import { useEffect, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useMapContext } from "../../state/MapContext";

const useTextSearch = () => {
  const [placesService, setPlacesService] = useState(null);
  const { setSearchResults, setAutoCompleteResults } = useMapContext();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (map && placesLibrary) {
      setPlacesService(new placesLibrary.PlacesService(map));
    }
  }, [map, placesLibrary]);

  const handleTextSearch = (query) => {
    return new Promise((resolve, reject) => {
      placesService.textSearch(
        {
          query,
          locationBias: map.getCenter(),
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
            const mappedResults = results.map((result) => ({
              name: result.name,
              placeId: result.place_id,
              location: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
              },
            }));

            setSearchResults(mappedResults);
            setAutoCompleteResults([]);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  return handleTextSearch;
};

export default useTextSearch;
