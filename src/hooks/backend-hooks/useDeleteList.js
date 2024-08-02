import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteList } from "../../api/listApi";

const useDeleteList = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const deleteListMutation = useMutation({
    mutationFn: async ({ listId, userId }) => {
      console.log("listId", listId);
      console.log("userId", userId);
      const deleteListResponse = await deleteList(listId, userId);
      return deleteListResponse;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["list", variables.listId] });
      console.log("data", data);
      console.log("variables", variables);
      navigate("/my-places");
    },
    onError: (error) => console.error(error),
  });

  return { deleteListMutation };
};
export default useDeleteList;
