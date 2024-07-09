import React, { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { MdClose } from "react-icons/md";
import { Image } from "antd";

import { useAppContext } from "../../state/AppContext";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useSavePlace from "../../hooks/backend-hooks/useSavePlace";

// styles & assets
import styles from "./AddToList.module.css";
import { fallbackImage } from "./fallbackImage";

const AddToList = () => {
  const [user, setUser] = useState(null);
  const { setShowAddToList } = useAppContext();

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => console.error(error));
  }, []);

  const { savePlaceMutation } = useSavePlace();

  const handleSavePlace = (listId) => {
    savePlaceMutation.mutate(listId);
  };

  const { listsData, listsError, isListsLoading } = useUserLists(user?.userId);

  useEffect(() => {
    listsData && console.log(listsData);
  }, [listsData]);

  return (
    <div className={styles.addToListContainer}>
      <div className={styles.headerDiv}>
        <div className={styles.iconDiv} onClick={() => setShowAddToList(false)}>
          <MdClose />
        </div>
        <h3>Add to list</h3>
      </div>
      <div>
        {isListsLoading ? (
          <p>Loading...</p>
        ) : listsError ? (
          <p>{listsError.message}</p>
        ) : (
          <div className={styles.cardsContainer}>
            {listsData?.data.map((list, index) => (
              <div
                key={index}
                className={styles.cardDiv}
                onClick={() => handleSavePlace(list.listId.S)}
              >
                <div className={styles.imageDiv}>
                  <Image
                    className={styles.image}
                    src={
                      list?.places?.L[0].M.photo.S
                        ? list.places.L[0].M.photo.S
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

export default AddToList;
