import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./MyLists.module.css";

const MyLists = (userLists) => {
  const navigate = useNavigate();

  return (
    userLists && (
      <div className={styles.listContainer}>
        {userLists.userLists.map((list) => {
          const createdAt = new Date(
            parseInt(list.createdAt.N)
          ).toLocaleDateString();

          return (
            <div
              className={styles.listDiv}
              key={list.listId.S}
              onClick={() =>
                navigate(`/list/${list.listId.S}`, { state: list })
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
    )
  );
};

export default MyLists;
