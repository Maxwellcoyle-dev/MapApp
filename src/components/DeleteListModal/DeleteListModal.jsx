import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";

// state
import { useAppContext } from "../../state/AppContext";

// Hooks
import useDeleteList from "../../hooks/backend-hooks/useDeleteList";

const DeleteListModal = ({ listId, userId }) => {
  const { deleteListAsync, deleteListIsPending, deleteListIsSuccess } =
    useDeleteList();

  const { showDeleteListModal, setShowDeleteListModal } = useAppContext();

  const handleDeleteList = () => {
    deleteListAsync({
      listId,
      userId,
    });
  };

  useEffect(() => {
    if (deleteListIsSuccess) {
      setShowDeleteListModal(false);
    }
  }, [deleteListIsSuccess, setShowDeleteListModal]);

  const onClose = () => {
    setShowDeleteListModal(false);
  };

  return (
    <Modal
      title="Delete List"
      open={showDeleteListModal}
      onCancel={onClose}
      closable={false}
      footer={[
        <Button
          key="delete"
          type="primary"
          danger
          onClick={handleDeleteList}
          loading={deleteListIsPending}
        >
          Delete
        </Button>,
        <Button key="cancel" onClick={onClose} disabled={deleteListIsPending}>
          Cancel
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this list?</p>
    </Modal>
  );
};

export default DeleteListModal;
