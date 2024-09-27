import React, { useEffect, useState } from "react";
import { Modal, Spin, Button, Form, Typography } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import { MdClose } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useSavePlace from "../../hooks/backend-hooks/useSavePlace";
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useCreateList from "../../hooks/backend-hooks/useCreateList";

// state
import { useAppContext } from "../../state/AppContext";

// Components
import CreateListModal from "../../modals/CreateListModal/CreateListModal";

// styles & assets
import styles from "./SavePlaceModal.module.css";

const { Text } = Typography;

const SavePlaceModal = ({ visible, onClose, placeId }) => {
  const [selectedList, setSelectedList] = useState(null);

  const { appUser } = useAppUser();

  const { setShowCreateListModal, setShowSavePlaceModal } = useAppContext();

  const { listsData, listsError, isListsLoading } = useUserLists(
    appUser?.data?.userId
  );

  const { createListAsync, createListIsPending, createListIsSuccess } =
    useCreateList();

  const { savePlaceAsync, savePlaceIsPending, savePlaceIsSuccess } =
    useSavePlace(placeId);

  useEffect(() => {
    if (savePlaceIsSuccess) {
      setShowSavePlaceModal(false);
    }
  }, [savePlaceIsSuccess, setShowSavePlaceModal]);

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
      console.log("selectedList: ", selectedList);
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
                    selectedList === list.listId ? styles.selected : ""
                  }`}
                  onClick={() => handleListSelection(list.listId)}
                >
                  <div className={styles.textDiv}>
                    <h4>{list.listName}</h4>
                    <p>{list.places?.length || 0} saved</p>
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
