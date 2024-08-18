import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { savePlace } from "../../api/placeApi";

import { useAppContext } from "../../state/AppContext";

import useGetOptimalPlaceData from "../useGetOptimalPlaceData";
import useAppUser from "./useAppUser";

const useSavePlace = (placeId) => {
  if (!placeId) {
    throw new Error("placeId is required");
  }

  const { appUser } = useAppUser();

  const { setShowAddToList } = useAppContext();

  console.log("placeId: ", placeId);

  const { optimalPlaceData } = useGetOptimalPlaceData(placeId);

  const navigate = useNavigate();

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
          optimalPlaceData.place_id || optimalPlaceData.placeId,
          appUser.data.userId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-places", variables.listId],
      });
      setShowAddToList(false);
      navigate(
        `/place/${optimalPlaceData.place_id || optimalPlaceData.placeId}`,
        {
          state: { from: "addToList" },
        }
      );
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
