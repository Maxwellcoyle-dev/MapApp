import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Radio } from "antd";

// state
import { useAppContext } from "../../state/AppContext";

// Hooks
import useCreateList from "../../hooks/backend-hooks/useCreateList";

// styles
import styles from "./CreateListModal.module.css";

const CreateListModal = ({
  listName = "",
  listDescription = "",
  handleSubmit,
  newList = true,
  isPending,
  isSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publicList, setPublicList] = useState(true);

  const { showCreateListModal, setShowCreateListModal } = useAppContext();

  const handleFormSubmit = () => {
    handleSubmit({ name, description, publicList });

    setDescription("");
    setName("");
    setPublicList(true);
  };

  useEffect(() => {
    if (listName) {
      setName(listName);
    }
    if (listDescription) {
      setDescription(listDescription);
    }
  }, [listName, listDescription]);

  useEffect(() => {
    if (isSuccess) {
      setShowCreateListModal(false);
    }
  }, [isSuccess, setShowCreateListModal]);

  const onClose = () => {
    setShowCreateListModal(false);
  };

  return (
    <Modal
      title={newList ? "Create List" : "Edit List"}
      open={showCreateListModal}
      onCancel={onClose}
      closable={false}
      footer={null}
    >
      <Form className={styles.createListForm} onFinish={handleFormSubmit}>
        <Form.Item>
          <Input
            placeholder="List Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input.TextArea
            placeholder="List Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Radio.Group
            value={publicList}
            onChange={(e) => setPublicList(e.target.value)}
          >
            <Radio value={true}>Public</Radio>
            <Radio value={false}>Private</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className={styles.buttonContainer}>
          <Button
            className={styles.button}
            type="primary"
            htmlType="submit"
            disabled={isPending}
            loading={isPending}
          >
            {newList ? "Create List" : "Update List"}
          </Button>
          <Button
            disabled={isPending}
            className={styles.button}
            onClick={() => setShowCreateListModal(false)}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateListModal;
