import React, { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { MdOutlineCreateNewFolder } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/useUserLists";

// components
import UserLists from "../../components/UserLists/UserLists";

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

      <div>
        <h3>Create a list</h3>
        <MdOutlineCreateNewFolder size={30} />
      </div>

      {listsData && <UserLists userLists={listsData.data} />}
    </div>
  );
};

export default MyLists;
