import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlace } from "../../api/placeApi";

const useUpdatePlace = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updatePlaceAsync,
    isPending: updatePlaceIsPending,
    isSuccess: updatePlaceIsSuccess,
  } = useMutation({
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
        queryKey: ["list-places"],
      });
    },
    onError: (error) => console.error(error),
  });

  return { updatePlaceAsync, updatePlaceIsPending, updatePlaceIsSuccess };
};

export default useUpdatePlace;
