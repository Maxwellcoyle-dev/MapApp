import { useState, useEffect } from "react";

import useUserLists from "./backend-hooks/useUserLists";
import useAppUser from "./backend-hooks/useAppUser";

const usePlaceIsSaved = (placeId) => {
  const [isPlaceSaved, setIsPlaceSaved] = useState(false);
  const [isPlaceSavedLoading, setIsPlaceSavedLoading] = useState(true);

  const { appUser } = useAppUser();

  const { listsData, isListsLoading } = useUserLists(appUser?.data.userId);

  useEffect(() => {
    if (!isListsLoading && listsData) {
      const isSaved = listsData?.data?.some((list) =>
        list?.places?.L?.some((place) => place.M.placeId.S === placeId)
      );
      setIsPlaceSaved(isSaved);
      setIsPlaceSavedLoading(false);
    }
  }, [listsData, placeId]);

  return { isPlaceSaved, isPlaceSavedLoading };
};

export default usePlaceIsSaved;
