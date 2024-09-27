import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Form, Typography, List, Spin } from "antd";
import useRemoveListPlace from "../../hooks/backend-hooks/useRemoveListPlace";

const { Text } = Typography;

const DeletePlaceModal = ({
  visible,
  onClose,
  listIds,
  userId,
  placeName,
  placeId,
}) => {
  const { mutateAsync, isPending, isSuccess, isIdle } = useRemoveListPlace();

  const [selectedLists, setSelectedLists] = useState([]);
  const [removeFromAll, setRemoveFromAll] = useState(false);

  useEffect(() => {
    if (listIds.length === 1) {
      setSelectedLists([listIds[0].listId]);
    }
  }, [listIds]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleListSelection = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter((id) => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
  };

  const handleRemoveFromAll = () => {
    setRemoveFromAll(!removeFromAll);
    if (!removeFromAll) {
      setSelectedLists([]);
    }
  };

  const handleConfirm = async () => {
    const listIdsToDelete = removeFromAll
      ? listIds.map((list) => list.listId)
      : selectedLists;

    if (listIdsToDelete.length === 0) {
      console.error("No list IDs selected for deletion.");
      return;
    }

    await mutateAsync({
      listIds: listIdsToDelete,
      placeId,
      userId,
    });
  };

  return (
    <Modal
      title={`Delete ${placeName}`}
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          danger
          type="primary"
          onClick={handleConfirm}
          disabled={
            (listIds?.length > 1 &&
              selectedLists.length === 0 &&
              !removeFromAll) ||
            isPending
          }
          loading={isPending}
        >
          Confirm
        </Button>,
      ]}
    >
      <>
        {listIds?.length > 1 && (
          <Form layout="vertical">
            <Form.Item>
              <Checkbox checked={removeFromAll} onChange={handleRemoveFromAll}>
                Remove from all lists
              </Checkbox>
            </Form.Item>

            {!removeFromAll && (
              <Form.Item label="Select lists to remove from:">
                {listIds.map((list) => (
                  <Checkbox
                    key={list.listId}
                    checked={selectedLists.includes(list.listId)}
                    onChange={() => handleListSelection(list.listId)}
                    disabled={removeFromAll || isPending}
                  >
                    {list.listName}
                  </Checkbox>
                ))}
              </Form.Item>
            )}
          </Form>
        )}

        {listIds?.length === 1 && (
          <>
            <Text type="secondary">This place is saved in only one list:</Text>
            <List
              bordered
              dataSource={listIds}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.listName}</strong>
                </List.Item>
              )}
              style={{
                marginTop: "10px",
                borderRadius: "4px",
                backgroundColor: "#fafafa",
              }}
            />
          </>
        )}
      </>
    </Modal>
  );
};

export default DeletePlaceModal;
