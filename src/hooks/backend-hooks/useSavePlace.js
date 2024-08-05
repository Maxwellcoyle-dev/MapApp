import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

import { savePlace } from "../../api/placeApi";

import { useSearchContext } from "../../state/SearchContext";
import { useAppContext } from "../../state/AppContext";

import useGetPlace from "../google-api-hooks/useGetPlaceDetails";

const useSavePlace = () => {
  const [user, setUser] = useState(null);
  const [savePlaceIsLoading, setSavePlaceIsLoading] = useState(false);

  const { selectedPlace } = useSearchContext();
  const { setShowAddToList } = useAppContext();

  const { placeData } = useGetPlace(selectedPlace?.place_id);

  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => console.error(error));
  }, []);

  const queryClient = useQueryClient();

  const savePlaceMutation = useMutation({
    mutationFn: (listId) => {
      console.log("Saving place...");
      console.log("listId: ", listId);
      setSavePlaceIsLoading(true);
      return savePlace({
        userId: user?.userId,
        listId,
        place: placeData,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: (data, variables) => {
      console.log("Place saved successfully!");
      console.log("data: ", data);
      console.log("variables: ", variables);
      queryClient.invalidateQueries({
        queryKey: ["list places"],
      });
      setShowAddToList(false);
      setSavePlaceIsLoading(false);
      navigate(`/list/${variables}`);
    },
    // only enable if placeData, user?.userId, and listId are truthy
    enabled: !!placeData && !!user?.userId && !!selectedPlace?.listId,
  });

  return { savePlaceMutation, savePlaceIsLoading };
};

export default useSavePlace;
