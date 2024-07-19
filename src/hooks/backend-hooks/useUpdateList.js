import { useMutation, queryClient } from "@tanstack/react-query";
import { updateList } from "../../api/lists";

// const listData = {
//     listId: "", required
//     name: "", optional
//     description: "", optional
//     public: "", optional
// }

export const useUpdateList = (listData) => {
  console.log("useUpdateList");

  console.log("listData", listData);

  const updateListMutation = useMutation(updateList, {
    onMutate: async (updatedList) => {
      console.log("onMutate");
      await queryClient.cancelQueries("lists");
      const previousList = queryClient.getQueryData("lists");
      queryClient.setQueryData("lists", (old) => {
        return old.map((list) => {
          if (list.id === updatedList.id) {
            return { ...list, ...updatedList };
          }
          return list;
        });
      });
      return { previousList };
    },
    onError: (err, updatedList, context) => {
      console.log("onError");
      queryClient.setQueryData("lists", context.previousList);
    },
    onSettled: () => {
      console.log("onSettled");
      queryClient.invalidateQueries("lists");
    },
  });
};
