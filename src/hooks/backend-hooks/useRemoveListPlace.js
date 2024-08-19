import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removePlace } from "../../api/listApi";

const useRemoveListPlace = () => {
  const queryClient = useQueryClient();

  const removeListPlaceMutation = useMutation({
    mutationFn: async ({ listIds, placeId, userId, placeData }) => {
      console.log("listIds", listIds);
      console.log("placeId", placeId);
      console.log("userId", userId);
      const removePlaceResponse = await removePlace(listIds, placeId, userId);
      return removePlaceResponse;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["user-lists", variables.userId]);
      queryClient.invalidateQueries("list-places");
      const qData = queryClient.getQueryData(["list-places"]);
      console.log("qData", qData);
      queryClient.setQueryData(
        ["saved-place", variables.placeId, variables.userId],
        (oldData) => {
          return {
            ...oldData,
            placeIsSaved: false,
          };
        }
      );
    },
    onError: (error) => console.error(error),
  });

  return removeListPlaceMutation;
};

export default useRemoveListPlace;
