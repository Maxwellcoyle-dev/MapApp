import { useState, useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

import useUserLists from "./backend-hooks/useUserLists";

const usePlaceIsSaved = (placeId) => {
  const [userId, setUserId] = useState(null);
  const [isPlaceSaved, setIsPlaceSaved] = useState(false);
  const [isPlaceSavedLoading, setIsPlaceSavedLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserAttributes();
        setUserId(user.sub);
      } catch (error) {
        console.error("Error fetching user attributes", error);
      }
    };
    fetchUser();
  }, []);

  const { listsData, isListsLoading } = useUserLists(userId);

  useEffect(() => {
    if (!isListsLoading && listsData) {
      const isSaved = listsData?.data?.some((list) =>
        list?.places?.L?.some((place) => place.M.placeId.S === placeId)
      );
      setIsPlaceSaved(isSaved);
      setIsPlaceSavedLoading(false);
    }
  }, [listsData, isListsLoading, placeId]);

  return { isPlaceSaved, isPlaceSavedLoading };
};

export default usePlaceIsSaved;
