import React from "react";
import { Modal, Form, Input, Button } from "antd";

const NewTagModal = ({
  open,
  handleSubmit,
  handleCancel,
  newTagName,
  setNewTagName,
}) => {
  return (
    <Modal
      title="Add new tag"
      open={open}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            disabled={newTagName === ""}
            onClick={handleSubmit}
          >
            Add
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      }
      onCancel={handleCancel}
    >
      <Form onFinish={() => handleSubmit()}>
        <Form.Item>
          <Input
            placeholder="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTagModal;
