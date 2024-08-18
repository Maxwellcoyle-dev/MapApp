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
              parseInt(list.createdAt.N)
            ).toLocaleDateString();

            return (
              <div
                className={styles.listDiv}
                key={list.listId.S}
                onClick={
                  list.places?.L.length > 0
                    ? () => navigate(`/list/${list.listId.S}`, { state: list })
                    : warning
                }
              >
                <h2>{list.listName.S}</h2>
                <p>
                  {list.description?.S && `Description: ${list.description.S}`}
                </p>
                <p>Created on: {createdAt}</p>
                <p>Number of Places: {list.places?.L.length || 0}</p>
              </div>
            );
          })}
        </div>
      </>
    )
  );
};

export default MyLists;
