import { useQuery } from "@tanstack/react-query";
import { listPlaces } from "../../api/placeApi";

const useListPlaces = (userId) => {
  const {
    data: allListsData,
    isLoading: allListsIsLoading,
    isError: allListsIsError,
    error: allListsError,
  } = useQuery({
    queryKey: ["listPlaces", userId],
    queryFn: () => listPlaces(userId),
    enabled: !!userId,
    retry: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return { allListsData, allListsIsLoading, allListsIsError, allListsError };
};

export default useListPlaces;
