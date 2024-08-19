import React from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./MyLists.module.css";

const MyLists = (userLists) => {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "This list is empty.",
    });
  };

  return (
    userLists && (
      <>
        {contextHolder}
        <div className={styles.listContainer}>
          {userLists.userLists.map((list) => {
            const createdAt = new Date(
              parseInt(list.createdAt)
            ).toLocaleDateString();

            return (
              <div
                className={styles.listDiv}
                key={list.listId}
                onClick={
                  list.places?.length > 0
                    ? () => navigate(`/list/${list.listId}`, { state: list })
                    : warning
                }
              >
                <h2>{list.listName}</h2>
                <p>{list.description && `Description: ${list.description}`}</p>
                <p>Created on: {createdAt}</p>
                <p>Number of Places: {list.places?.length || 0}</p>
              </div>
            );
          })}
        </div>
      </>
    )
  );
};

export default MyLists;
