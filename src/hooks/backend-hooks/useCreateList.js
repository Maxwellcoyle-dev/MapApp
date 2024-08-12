import { useMutation, useQueryClient } from "@tanstack/react-query";

import useUser from "./useUser";

import { createList } from "../../api/listApi";

// a hook that will take in list data and create a new list using useMutation - then trigger a new query to get the updated list data using hook useUserLists.js
// listData = { userId, listName, listDescription, public: boolean }

const useCreateList = () => {
  const { authUser } = useUser();
  const queryClient = useQueryClient();

  const {
    mutateAsync: createListAsync,
    isPending: createListIsPending,
    isSuccess: createListIsSuccess,
    isIdle: createListIsIdle,
  } = useMutation({
    mutationFn: (listData) => {
      console.log("listData", listData);
      return createList({
        userId: authUser.data.userId,
        listName: listData.name,
        listDescription: listData.description,
        public: listData.publicList,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: (data, variables) => {
      console.log("List created successfully!");
      console.log("data", data);
      queryClient.invalidateQueries({
        queryKey: ["user-lists", authUser.data.userId],
      });
    },
  });

  return {
    createListAsync,
    createListIsPending,
    createListIsSuccess,
    createListIsIdle,
  };
};

export default useCreateList;
