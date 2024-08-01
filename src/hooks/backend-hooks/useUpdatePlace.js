import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlace } from "../../api/placeApi";

const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  const updatePlaceMutation = useMutation({
    mutationFn: async ({ placeId, userId, placeData }) => {
      console.log("placeId", placeId);
      console.log("userId", userId);
      console.log("placeData", placeData);
      const updatedPlace = await updatePlace(placeId, userId, placeData);
      return updatedPlace;
    },
    onSuccess: (data, variables) => {
      console.log("Updated place:", data);
      console.log("Variables:", variables);
      queryClient.invalidateQueries({
        queryKey: ["list places", variables.listId],
      });
    },
    onError: (error) => console.error(error),
  });

  return { updatePlaceMutation };
};

export default useUpdatePlace;
