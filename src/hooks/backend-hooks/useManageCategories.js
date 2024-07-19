import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../api/userApi";

const useManageCategories = () => {
  const queryClient = useQueryClient();

  const manageCategoriesMutation = useMutation({
    mutationFn: async ({ userId, categories }) => {
      console.log("userId", userId);
      console.log("categories", categories);
      const updatedUser = await updateUser(userId, { categories });
      return updatedUser;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
    onError: (error) => console.error(error),
  });

  return { manageCategoriesMutation };
};

export default useManageCategories;
