import React from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
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
  handleSearch,
}) => {
  const items = [
    {
      key: "1",
      label: (
        <span>
          <EditOutlined /> Edit
        </span>
      ),
      onClick: () => setShowEditForm(true),
    },
    {
      key: "2",
      label: (
        <span>
          <DeleteOutlined /> Delete
        </span>
      ),
      onClick: handleDeleteList,
    },
    {
      key: "3",
      label: (
        <span>
          <ReloadOutlined /> Refresh
        </span>
      ),
      onClick: refetchListPlaces,
    },
  ];

  return (
    <div className={styles.listHeaderDiv}>
      <div className={styles.topDiv}>
        <Button icon={<ArrowLeftOutlined />} className={styles.backButton} />
        <div className={styles.titleContainer}>
          <h1 className={styles.listTitle}>{listName}</h1>
          <p className={styles.listDescription}>{listDescription}</p>
        </div>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          className={styles.dropdown}
        >
          <Button>
            <MenuOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default ListHeader;
