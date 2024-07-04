import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "aws-amplify/auth";

import { savePlace } from "../api/placeApi";

import { useMapContext } from "../state/MapContext";

import useGetPlace from "../hooks/useGetPlace";

const useSavePlace = () => {
  const [user, setUser] = useState(null);

  const { selectedPlace } = useMapContext();

  const { placeData } = useGetPlace(selectedPlace?.placeId);

  useEffect(() => {
    console.log("selectedPlace: ", selectedPlace);
    console.log("placeData: ", placeData);
  }, []);

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
      const processedPlaceData = {
        ...placeData,
        photos: placeData?.photos?.map((photo) => ({
          url: photo?.getUrl(),
        })),
      };
      return savePlace({
        userId: user?.userId,
        listId,
        place: processedPlaceData,
      });
    },
    onError: (error) => console.error(error),
    onSuccess: () => {
      console.log("Place saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["lists", user?.userId] });
    },
    // only enable if placeData, user?.userId, and listId are truthy
    enabled: !!placeData && !!user?.userId && !!selectedPlace?.listId,
  });

  return { savePlaceMutation };
};

export default useSavePlace;
