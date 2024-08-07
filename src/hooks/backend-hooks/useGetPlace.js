import { useQuery } from "@tanstack/react-query";
import { getPlace } from "../../api/placeApi";

const useGetPlace = (placeId, userId) => {
  console.log("placeId: ", placeId);
  console.log("userId: ", userId);
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

  console.log("saved place  data: ", savedPlaceData);
  return { savedPlaceData, savedPlaceDataIsLoading, savedPlaceDataError };
};
export default useGetPlace;
