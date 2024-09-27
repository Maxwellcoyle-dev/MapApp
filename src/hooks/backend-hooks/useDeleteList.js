import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteList } from "../../api/listApi";

const useDeleteList = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    mutateAsync: deleteListAsync,
    isPending: deleteListIsPending,
    isSuccess: deleteListIsSuccess,
  } = useMutation({
    mutationFn: async ({ listId, userId }) => {
      console.log("listId", listId);
      console.log("userId", userId);
      const deleteListResponse = await deleteList(listId, userId);
      return deleteListResponse;
    },
    onSuccess: (data, variables) => {
      console.log("data", data);
      console.log("variables", variables);
      queryClient.invalidateQueries({
        queryKey: ["listplaces", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-lists", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-list", variables.listId],
      });
      console.log("data", data);
      console.log("variables", variables);
      navigate(-1);
    },
    onError: (error) => console.error(error),
  });

  return { deleteListAsync, deleteListIsPending, deleteListIsSuccess };
};
export default useDeleteList;
