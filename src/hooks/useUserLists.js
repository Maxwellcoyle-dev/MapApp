import { useQuery } from "@tanstack/react-query";
import { scanLists } from "../api/listApi";

const useUserLists = (userId) => {
  const {
    data: listsData,
    error: listsError,
    isLoading: isListsLoading,
  } = useQuery({
    queryKey: ["lists", userId],
    queryFn: () => scanLists(userId),
    retry: false,
    enabled: !!userId,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return { listsData, listsError, isListsLoading };
};

export default useUserLists;
