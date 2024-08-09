import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePlace } from "../../api/listApi";

const useRemoveListPlace = () => {
  const queryClient = useQueryClient();

  const removeListPlaceMutation = useMutation({
    mutationFn: async ({ listIds, placeId, userId }) => {
      console.log("listIds", listIds);
      console.log("placeId", placeId);
      console.log("userId", userId);
      const removePlaceResponse = await removePlace(listIds, placeId, userId);
      return removePlaceResponse;
    },
    onSuccess: (data, variables) => {
      // Invalidate queries for each listId in the array
      variables.listIds.forEach((listId) => {
        queryClient.invalidateQueries(["get-list", listId]);
        queryClient.invalidateQueries(["list-places", listId]);
      });
      // Optionally, invalidate the user's lists and saved places queries
      queryClient.invalidateQueries(["user-lists", variables.userId]);
      queryClient.invalidateQueries(["place-saved", variables.placeId]); // Assuming you have a query to check if a place is saved
    },
    onError: (error) => console.error(error),
  });

  return removeListPlaceMutation;
};

export default useRemoveListPlace;
