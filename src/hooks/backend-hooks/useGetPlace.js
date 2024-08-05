import { useQuery } from "@tanstack/react-query";
import { getPlace } from "../../api/placeApi";

const useGetPlace = (placeId, userId) => {
  console.log("placeId: ", placeId);
  console.log("userId: ", userId);
  const {
    data: placeData,
    isLoading: placeDataIsLoading,
    error: placeDataError,
  } = useQuery({
    queryKey: ["place", placeId, userId],
    queryFn: () => getPlace(placeId, userId),
    retry: false,
    enabled: !!placeId && !!userId,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  console.log("placeData: ", placeData);
  return { placeData, placeDataIsLoading, placeDataError };
};
export default useGetPlace;
