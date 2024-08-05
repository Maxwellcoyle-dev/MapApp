import React from "react";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import styles from "./ListHeader.module.css";

const ListHeader = ({
  listName,
  listDescription,
  handleDeleteList,
  setShowEditForm,
}) => {
  return (
    <div className={styles.listHeaderDiv}>
      <div className={styles.contentDiv}>
        <h1 className={styles.listTitle}>{listName}</h1>
        <p className={styles.listDescription}>{listDescription}</p>
      </div>
      <div className={styles.actionsDiv}>
        <Button
          onClick={() => setShowEditForm(true)}
          icon={<EditOutlined />}
          className={styles.actionButton}
        />
        <Button
          icon={<DeleteOutlined />}
          onClick={handleDeleteList}
          className={styles.actionButton}
        />
      </div>
    </div>
  );
};

export default ListHeader;
