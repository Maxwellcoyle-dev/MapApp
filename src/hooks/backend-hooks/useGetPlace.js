import { useQuery } from "@tanstack/react-query";
import { getPlace } from "../../api/placeApi";

const useGetPlace = (placeId, userId) => {
  const {
    data: savedPlaceData,
    isLoading: savedPlaceDataIsLoading,
    error: savedPlaceDataError,
  } = useQuery({
    queryKey: ["saved-place", placeId, userId],
    queryFn: () => getPlace(placeId, userId),
    retry: false,
    enabled: !!placeId && !!userId,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return { savedPlaceData, savedPlaceDataIsLoading, savedPlaceDataError };
};
export default useGetPlace;
