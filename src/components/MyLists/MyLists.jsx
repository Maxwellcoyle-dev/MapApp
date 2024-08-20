import React, { useEffect } from "react";
import { message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import styles from "./MyLists.module.css";
import CreateListModal from "../CreateListModal/CreateListModal";

import { useAppContext } from "../../state/AppContext";

const MyLists = ({ allListsData }) => {
  const { showCreateListModal, setShowCreateListModal } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("all lists data:", allListsData);
  }, [allListsData]);

  return (
    <>
      <div className={styles.myListsContainer}>
        <h2>My lists</h2>
        <div className={styles.listContainer}>
          <div
            className={styles.newListDiv}
            onClick={() => setShowCreateListModal(true)}
          >
            <PlusCircleOutlined className={styles.icon} />
            <h3>New List</h3>
          </div>
          {allListsData?.map((list) => {
            const createdAt = new Date(
              parseInt(list.createdAt)
            ).toLocaleDateString();

            return (
              <div
                className={styles.listDiv}
                key={list.listId}
                onClick={() =>
                  navigate(`/list/${list.listId}`, { state: list })
                }
              >
                <h3>{list.listName}</h3>
                <p># of places - {list.places?.length || 0}</p>
              </div>
            );
          })}
        </div>
        <CreateListModal />
      </div>
    </>
  );
};

export default MyLists;
