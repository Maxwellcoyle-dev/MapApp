import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePlace } from "../../api/listApi";

const useRemoveListPlace = () => {
  const queryClient = useQueryClient();

  const removeListPlaceMutation = useMutation({
    mutationFn: async ({ listId, placeId, userId }) => {
      console.log("listId", listId);
      console.log("placeId", placeId);
      console.log("userId", userId);
      const removePlaceResponse = await removePlace(listId, placeId, userId);
      return removePlaceResponse;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lists", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["list", variables.listId] });
      queryClient.invalidateQueries({
        queryKey: ["list places", variables.listId],
      });
    },
    onError: (error) => console.error(error),
  });

  return { removeListPlaceMutation };
};

export default useRemoveListPlace;
