import React, { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import useUserLists from "../../hooks/useUserLists";

import styles from "./MyLists.module.css";

const MyLists = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
        console.log(user);
      })
      .catch((error) => console.error(error));
  }, []);

  const { listsData, listsError, isListsLoading } = useUserLists(user?.userId);

  useEffect(() => {
    if (isListsLoading) {
      console.log("Loading lists...");
    }
    if (listsError) {
      console.error(listsError);
    }
    if (listsData) {
      console.log(listsData);
    }
  }, [listsError, isListsLoading, listsData]);

  return (
    <div className={styles.myListsPage}>
      <h1>My Lists</h1>
      {isListsLoading && <p>Loading...</p>}
      {listsError && <p>{listsError.message}</p>}
      {listsData && (
        <div className={styles.listContainer}>
          {listsData.data.map((list) => {
            const createdAt = new Date(
              parseInt(list.createdAt.N)
            ).toLocaleDateString();

            return (
              <div key={list.listId.S}>
                <h2>{list.listName.S}</h2>
                <p>Description: {list.description?.S || "Add description"}</p>
                <p>Created on: {createdAt}</p>
                <p>Number of Places: {list.places?.length || 0}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLists;
