import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";

import { createList } from "../../api/listApi";

// a hook that will take in list data and create a new list using useMutation - then trigger a new query to get the updated list data using hook useUserLists.js
// listData = { userId, listName, listDescription, public: boolean }

const useCreateList = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => console.error(error));
  }, []);

  const queryClient = useQueryClient();

  const createListMutation = useMutation({
    mutationFn: (listData) =>
      createList({
        userId: user?.userId,
        listName: listData.listName,
        listDescription: listData.listDescription,
        public: listData.publicList,
      }),
    onError: (error) => console.error(error),
    onSuccess: () => {
      console.log("List created successfully!");
      queryClient.invalidateQueries({ queryKey: ["lists", user?.userId] });
    },
  });

  return { createListMutation };
};

export default useCreateList;
