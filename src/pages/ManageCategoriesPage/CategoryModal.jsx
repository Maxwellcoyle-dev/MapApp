import React from "react";
import { Modal, Form, Input, Button } from "antd";

const CategoryModal = ({
  open,
  handleSubmit,
  handleCancel,
  newCategoryName,
  setNewCategoryName,
  newcategory = true,
}) => {
  return (
    <Modal
      title={newcategory ? "Add New Category" : "Edit Category"}
      open={open}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            disabled={newCategoryName === ""}
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
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
