import React from "react";
import { Button, Form, Input } from "antd";

const ListEditForm = ({
  formRef,
  listData,
  styles,
  handleCancel,
  handleUpdateList,
  listName,
  description,
}) => {
  return (
    <div ref={formRef}>
      <Form
        initialValues={{
          listName: listData?.data.listName.S || "",
          description: listData.data.listDescription.S || "",
        }}
        onFinish={handleUpdateList}
      >
        <Form.Item
          name="listName"
          value={listName}
          rules={[{ required: true, message: "Please input the list name!" }]}
        >
          <Input placeholder="List Name" />
        </Form.Item>
        <Form.Item
          name="description"
          value={description}
          rules={[
            { required: false, message: "Please input the description!" },
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        <div className={styles.formButtons}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ListEditForm;
