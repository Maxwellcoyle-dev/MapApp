import React from "react";

import styles from "./UserLists.module.css";

const UserLists = (userLists) => {
  return (
    userLists && (
      <div className={styles.listContainer}>
        {userLists.userLists.map((list) => {
          const createdAt = new Date(
            parseInt(list.createdAt.N)
          ).toLocaleDateString();

          return (
            <div className={styles.listDiv} key={list.listId.S}>
              <h2>{list.listName.S}</h2>
              <p>Description: {list.description?.S || "Add description"}</p>
              <p>Created on: {createdAt}</p>
              <p>Number of Places: {list.places?.length || 0}</p>
            </div>
          );
        })}
      </div>
    )
  );
};

export default UserLists;
