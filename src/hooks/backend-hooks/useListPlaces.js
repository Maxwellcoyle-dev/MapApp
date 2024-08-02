import { useQuery } from "@tanstack/react-query";
import { scanPlaces } from "../../api/placeApi";

const useListPlaces = (listId) => {
  const {
    data: listPlacesData,
    error: listPlacesDataError,
    isLoading: isListPlacesDataLoading,
    refetch: refetchListPlaces,
  } = useQuery({
    queryKey: ["list places", listId],
    queryFn: () => scanPlaces(listId),
    retry: false,
    enabled: !!listId,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return {
    listPlacesData,
    listPlacesDataError,
    isListPlacesDataLoading,
    refetchListPlaces,
  };
};

export default useListPlaces;
