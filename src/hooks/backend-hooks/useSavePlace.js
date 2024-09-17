import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePlace } from "../../api/placeApi";

import useGetOptimalPlaceData from "../useGetOptimalPlaceData";
import useAppUser from "./useAppUser";

const useSavePlace = (placeId) => {
  const { appUser } = useAppUser();

  const { optimalPlaceData } = useGetOptimalPlaceData(placeId);

  const queryClient = useQueryClient();

  const {
    mutateAsync: savePlaceAsync,
    isPending: savePlaceIsPending,
    isSuccess: savePlaceIsSuccess,
    isIdle: savePlaceIsIdle,
  } = useMutation({
    mutationFn: (listId) => {
      const place = optimalPlaceData;
      console.log("place: ", place);
      return savePlace({
        userId: appUser?.data.userId,
        listId,
        place,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-lists", appUser.data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "saved-place",
          optimalPlaceData.placeId,
          appUser.data.userId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-places", variables.listId],
      });
    },
  });

  return {
    savePlaceAsync,
    savePlaceIsPending,
    savePlaceIsSuccess,
    savePlaceIsIdle,
  };
};

export default useSavePlace;
