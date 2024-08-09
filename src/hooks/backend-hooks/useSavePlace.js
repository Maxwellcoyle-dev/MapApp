import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { savePlace } from "../../api/placeApi";

import { useAppContext } from "../../state/AppContext";

import useGetPlaceDetails from "../google-api-hooks/useGetPlaceDetails";
import useUser from "./useUser";

const useSavePlace = (placeId) => {
  if (!placeId) {
    throw new Error("placeId is required");
  }

  const { authUser } = useUser();
  const [savePlaceIsLoading, setSavePlaceIsLoading] = useState(false);

  const { setShowAddToList } = useAppContext();

  const { placeData } = useGetPlaceDetails(placeId);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const savePlaceMutation = useMutation({
    mutationFn: (listId) => {
      setSavePlaceIsLoading(true);
      return savePlace({
        userId: authUser?.data.userId,
        listId,
        place: placeData,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-lists", authUser.data.userId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "saved-place",
          placeData.place_id || placeData.placeId,
          authUser.data.userId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-places", variables.listId],
      });
      setShowAddToList(false);
      setSavePlaceIsLoading(false);
      navigate(`/place/${placeData.place_id || placeData.placeId}`, {
        state: { from: "addToList" },
      });
    },
  });

  return { savePlaceMutation, savePlaceIsLoading };
};

export default useSavePlace;
