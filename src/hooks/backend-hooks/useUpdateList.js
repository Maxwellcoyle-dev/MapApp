import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateList } from "../../api/listApi";

const useUpdateList = () => {
  const queryClient = useQueryClient();

  const updateListMutation = useMutation({
    mutationFn: async ({ listId, listData }) => {
      console.log("listId", listId);
      console.log("listData", listData);
      const updatedList = await updateList(listId, listData);
      return updatedList;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["list", variables.listId] });
    },
    onError: (error) => console.error(error),
  });

  return { updateListMutation };
};

export default useUpdateList;
