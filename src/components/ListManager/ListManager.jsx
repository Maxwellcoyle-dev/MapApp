// Libraries
import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Button } from "antd";
import { MdOutlineAdd } from "react-icons/md";

// hooks
import useUserLists from "../../hooks/backend-hooks/useUserLists";

// components
import UserLists from "../UserLists/UserLists";
import CreateListForm from "../CreateListForm/CreateListForm";

// styles
import styles from "./ListManager.module.css";

// component for creating a new list
const ListManager = () => {
  const [user, setUser] = useState(null);
  const [addNewList, setAddNewList] = useState(false);

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
    <div className={styles.listManager}>
      <div className={styles.headerDiv}>
        <h2>Manage Your Lists</h2>

        {!addNewList && (
          <Button
            className={styles.addNewListBtn}
            onClick={() => setAddNewList(!addNewList)}
            type="primary"
          >
            Add New List <MdOutlineAdd />
          </Button>
        )}
      </div>

      {addNewList && (
        <CreateListForm setAddNewList={setAddNewList} userId={user?.userId} />
      )}

      <div className={styles.listDiv}>
        {!addNewList && isListsLoading && <p>Loading...</p>}
        {!addNewList && listsError && <p>{listsError.message}</p>}
        {!addNewList && listsData && <UserLists userLists={listsData.data} />}
      </div>
    </div>
  );
};

export default ListManager;
