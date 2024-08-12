import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
} from "@ant-design/icons";

// State
import { useAppContext } from "../../../state/AppContext";

import styles from "./ListHeaderSection.module.css";

const ListHeader = ({
  listName,
  listDescription,
  handleDeleteList,
  refetchListPlaces,
}) => {
  const [backPath, setBackPath] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { setShowCreateListModal } = useAppContext();

  useEffect(() => {
    console.log(location?.state?.from);
    console.log(location);

    if (location?.state?.from === "addToList") {
      setBackPath("/");
    } else {
      setBackPath(-1);
    }
  }, [location]);

  const items = [
    {
      key: "1",
      label: (
        <span>
          <EditOutlined /> Edit
        </span>
      ),
      onClick: () => setShowCreateListModal(true),
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
        <Button
          icon={<ArrowLeftOutlined />}
          className={styles.backButton}
          onClick={() => navigate(backPath)}
        />
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
