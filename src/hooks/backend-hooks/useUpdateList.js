import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../../api/listApi";

const useUpdateList = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateListAsync,
    isPending: updateListIsPending,
    isSuccess: updateListIsSuccess,
    isIdle: updateListIsIdle,
  } = useMutation({
    mutationFn: async ({ listId, listData }) => {
      console.log("listId", listId);
      console.log("listData", listData);
      const updatedList = await updateList(listId, listData);
      return updatedList;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-list", variables.listId],
      });
    },
    onError: (error) => console.error(error),
  });

  return {
    updateListAsync,
    updateListIsPending,
    updateListIsSuccess,
    updateListIsIdle,
  };
};

export default useUpdateList;
