// Libraries
import React, { useState } from "react";
import { Button, Form, Input, Radio } from "antd";

// Hooks
import useCreateList from "../../../hooks/backend-hooks/useCreateList";

// Styles
import styles from "./CreateListForm.module.css";

const CreateListForm = ({ setAddNewList }) => {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [publicList, setPublicList] = useState(true);

  const { createListMutation } = useCreateList();

  const handleSubmit = () => {
    createListMutation.mutate({
      listName,
      listDescription,
      publicList,
    });
    setAddNewList(false);
  };

  return (
    <Form className={styles.createListForm} onFinish={handleSubmit}>
      <Form.Item>
        <Input
          placeholder="List Name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Input.TextArea
          placeholder="List Description"
          value={listDescription}
          onChange={(e) => setListDescription(e.target.value)}
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
        <Button className={styles.button} type="primary" htmlType="submit">
          Create List
        </Button>
        <Button className={styles.button} onClick={() => setAddNewList(false)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateListForm;
