import { useEffect, useState } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useMapContext } from "../state/MapContext";
import { useSearchContext } from "../state/SearchContext";

const useTextSearch = () => {
  const [placesService, setPlacesService] = useState(null);
  const { setSearchResults, setAutoCompleteResults, placeType } =
    useSearchContext();

  const map = useMap();
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (map && placesLibrary) {
      setPlacesService(new placesLibrary.PlacesService(map));
    }
  }, [map, placesLibrary]);

  const handleTextSearch = (query) => {
    if (!placesService) {
      return;
    }
    return new Promise((resolve, reject) => {
      placesService.textSearch(
        {
          query,
          locationBias: map?.getCenter(),
          includedType: placeType,
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            resolve(results);

            const mappedResults = results.map((result) => ({
              name: result.name,
              placeId: result.place_id,
              location: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
              },
            }));
            console.log(mappedResults);

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
