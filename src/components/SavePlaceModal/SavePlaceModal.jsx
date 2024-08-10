import React, { useEffect, useState } from "react";
import { Modal, Image, Spin, Button, Form, Typography } from "antd";
import { MdClose } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useSavePlace from "../../hooks/backend-hooks/useSavePlace";
import useUser from "../../hooks/backend-hooks/useUser";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";

// styles & assets
import styles from "./SavePlaceModal.module.css";
import { fallbackImage } from "./fallbackImage";

const { Text } = Typography;

const SavePlaceModal = ({ visible, onClose, placeId }) => {
  const [placeIds, setPlaceIds] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const { authUser } = useUser();
  const { listsData, listsError, isListsLoading } = useUserLists(
    authUser?.data.userId
  );
  const { placesPhotos } = useGetPhotos(placeIds);
  const { mutateAsync, isPending, isSuccess, isIdle } = useSavePlace(placeId);

  useEffect(() => {
    if (listsData) {
      const ids = listsData?.data
        .map((list) => list.places?.L?.[0]?.M?.placeId?.S)
        .filter(Boolean); // Filter out any undefined or null values
      setPlaceIds(ids);
    }
  }, [listsData]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleListSelection = (listId) => {
    setSelectedList(listId);
  };

  const handleConfirm = async () => {
    if (selectedList) {
      await mutateAsync(selectedList);
    } else {
      console.error("No list ID selected for saving.");
    }
  };

  return (
    <Modal
      title="Add to List"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={isListsLoading || isPending}
        >
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={!selectedList || isListsLoading || isPending}
          loading={isPending}
        >
          Confirm
        </Button>,
      ]}
      closeIcon={<MdClose />}
      className={styles.modal}
    >
      <div className={styles.addToListContainer}>
        {isListsLoading ? (
          <Spin size="large" />
        ) : listsError ? (
          <p>{listsError.message}</p>
        ) : (
          <Form layout="vertical">
            {listsData?.data.length > 0 ? (
              listsData.data.map((list, index) => (
                <div
                  key={index}
                  className={`${styles.cardDiv} ${
                    selectedList === list.listId.S ? styles.selected : ""
                  }`}
                  onClick={() => handleListSelection(list.listId.S)}
                >
                  <div className={styles.imageDiv}>
                    <Image
                      className={styles.image}
                      src={placesPhotos && placesPhotos[index]?.[0].getUrl()}
                      fallback={fallbackImage}
                      preview={false}
                    />
                  </div>
                  <div className={styles.textDiv}>
                    <h4>{list.listName.S}</h4>
                    <p>{list.places?.L.length || 0} saved</p>
                  </div>
                </div>
              ))
            ) : (
              <Text type="secondary">
                No lists available to add this place to.
              </Text>
            )}
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default SavePlaceModal;
