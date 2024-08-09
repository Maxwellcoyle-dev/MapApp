// Libraries
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image, Spin } from "antd";
import { MdClose } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useSavePlace from "../../hooks/backend-hooks/useSavePlace";
import useUser from "../../hooks/backend-hooks/useUser";

// styles & assets
import styles from "./SavePlace.module.css";
import { fallbackImage } from "./fallbackImage";

const SavePlace = () => {
  const { authUser } = useUser();
  const navigate = useNavigate();

  const { placeId } = useParams();
  const { listsData, listsError, isListsLoading } = useUserLists(
    authUser?.data.userId
  );

  const { savePlaceMutation, savePlaceIsLoading } = useSavePlace(placeId);

  const handleSavePlace = (listId) => {
    savePlaceMutation.mutate(listId);
  };

  if (!listsData) {
    return (
      <div className={styles.loadingDiv}>
        <h3>Loading your lists</h3>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.addToListContainer}>
      <div className={styles.headerDiv}>
        <div className={styles.iconDiv} onClick={() => navigate(-1)}>
          <MdClose />
        </div>
        <h3>Add to list</h3>
      </div>
      <div>
        {isListsLoading || savePlaceIsLoading ? (
          <p>Loading...</p>
        ) : listsError ? (
          <p>{listsError.message}</p>
        ) : (
          <div className={styles.cardsContainer}>
            {listsData &&
              listsData?.data.map((list, index) => (
                <div
                  key={index}
                  className={styles.cardDiv}
                  onClick={() => handleSavePlace(list.listId.S)}
                >
                  <div className={styles.imageDiv}>
                    <Image
                      className={styles.image}
                      src={
                        list?.places?.L[0]?.M?.photo?.S
                          ? list?.places?.L[0].M?.photo?.S
                          : list.listPhoto?.S
                      }
                      fallback={fallbackImage}
                      preview={false}
                    />
                  </div>
                  <div className={styles.textDiv}>
                    <h4>{list.listName.S}</h4>
                    <p>{list.places?.L.length || 0} saved</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePlace;
