import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../api/userApi";
import { deleteUser as deleteUserAmplify } from "aws-amplify/auth";

const useDeleteUserAccount = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteUserAccountAsync,
    isPending: deleteUserAccountIsPending,
    isSuccess: deleteUserAccountIsSuccess,
  } = useMutation({
    mutationFn: async (userId) => {
      const deleteUserAccountResponse = await deleteUser(userId);
      console.log("deleteUserAccountResponse", deleteUserAccountResponse);
      const deleteUserAmplifyResponse = await deleteUserAmplify();
      console.log("deleteUserAmplifyResponse", deleteUserAmplifyResponse);
      return deleteUserAccountResponse;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-lists", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-list", variables.listId],
      });
    },
    onError: (error) => console.error(error),
  });

  return {
    deleteUserAccountAsync,
    deleteUserAccountIsPending,
    deleteUserAccountIsSuccess,
  };
};

export default useDeleteUserAccount;
