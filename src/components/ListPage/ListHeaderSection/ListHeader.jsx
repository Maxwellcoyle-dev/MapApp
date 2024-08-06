import React from "react";
import { Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import styles from "./ListHeaderSection.module.css";

const ListHeader = ({
  listName,
  listDescription,
  handleDeleteList,
  setShowEditForm,
  refetchListPlaces,
  setShowFilterForm,
  showFilterForm,
}) => {
  return (
    <div className={styles.listHeaderDiv}>
      <div className={styles.topDiv}>
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
          <Button
            onClick={refetchListPlaces}
            icon={<ReloadOutlined />}
            className={styles.actionButton}
          ></Button>
        </div>
      </div>
      <div className={styles.filterButtonContainer}>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setShowFilterForm(!showFilterForm)}
        >
          {showFilterForm ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
    </div>
  );
};

export default ListHeader;
