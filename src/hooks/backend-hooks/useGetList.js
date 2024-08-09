import { useQuery } from "@tanstack/react-query";

import { getList } from "../../api/listApi";

const useGetList = (listId) => {
  const {
    data: listData,
    error: listError,
    isError: listDataIsError,
    isLoading: listDataIsLoading,
  } = useQuery({
    queryKey: ["get-list", listId],
    queryFn: () => getList(listId),
    retry: false,
    enabled: !!listId,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
  });

  return { listData, listDataIsError, listError, listDataIsLoading };
};

export default useGetList;
