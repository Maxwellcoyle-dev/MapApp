import React, { useEffect, useState } from "react";
import { Modal, Image, Spin, Button, Form, Typography } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import { MdClose } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useSavePlace from "../../hooks/backend-hooks/useSavePlace";
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useCreateList from "../../hooks/backend-hooks/useCreateList";

// state
import { useAppContext } from "../../state/AppContext";

// Components
import CreateListModal from "../CreateListModal/CreateListModal";

// styles & assets
import styles from "./SavePlaceModal.module.css";
import { fallbackImage } from "./fallbackImage";

const { Text } = Typography;

const SavePlaceModal = ({ visible, onClose, placeId }) => {
  const [placeIds, setPlaceIds] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const { setShowCreateListModal, showSavePlaceModal, setShowSavePlaceModal } =
    useAppContext();

  const { appUser } = useAppUser();
  const { listsData, listsError, isListsLoading } = useUserLists(
    appUser?.data.userId
  );
  const { placesPhotos } = useGetPhotos(placeIds);

  const { createListAsync, createListIsPending, createListIsSuccess } =
    useCreateList();
  const { savePlaceAsync, savePlaceIsPending, savePlaceIsSuccess } =
    useSavePlace(placeId);

  useEffect(() => {
    console.log("listData", listsData);
  }, [listsData]);

  useEffect(() => {
    if (listsData) {
      const ids = listsData?.data
        .map((list) => list.places?.L?.[0]?.M?.placeId?.S)
        .filter(Boolean); // Filter out any undefined or null values
      setPlaceIds(ids);
    }
  }, [listsData]);

  useEffect(() => {
    if (savePlaceIsSuccess) {
      onClose();
    }
  }, [savePlaceIsSuccess, onClose]);

  const handleListSelection = (listId) => {
    setSelectedList(listId);
  };

  const handleSubmit = (values) => {
    createListAsync({
      name: values.name,
      description: values.description,
      publicList: values.publicList,
    });
  };

  const handleConfirm = async () => {
    if (selectedList) {
      await savePlaceAsync(selectedList);
    } else {
      console.error("No list ID selected for saving.");
    }
  };

  return (
    <Modal
      title={
        <div className={styles.headerDiv}>
          <h3>Add to List</h3>
          <Button
            onClick={() => setShowCreateListModal(true)}
            icon={<FolderAddOutlined />}
          >
            New List
          </Button>
        </div>
      }
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={isListsLoading || savePlaceIsPending}
        >
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={!selectedList || isListsLoading || savePlaceIsPending}
          loading={savePlaceIsPending}
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
      <CreateListModal
        handleSubmit={handleSubmit}
        isPending={createListIsPending}
        isSuccess={createListIsSuccess}
      />
    </Modal>
  );
};

export default SavePlaceModal;
