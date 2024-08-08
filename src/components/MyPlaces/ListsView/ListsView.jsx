// Libraries
import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { MdOutlineAdd } from "react-icons/md";

// hooks
import useUserLists from "../../../hooks/backend-hooks/useUserLists";
import useUser from "../../../hooks/backend-hooks/useUser";

// components
import MyLists from "../../MyPlaces/MyLists/MyLists";
import CreateListForm from "../CreateListForm/CreateListForm";

// styles
import styles from "./ListsView.module.css";

// component for creating a new list
const ListsView = () => {
  const [user, setUser] = useState(null);
  const [addNewList, setAddNewList] = useState(false);

  const { authUser } = useUser();

  const { listsData, listsError, isListsLoading } = useUserLists(
    authUser?.data.userId
  );

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
        {isListsLoading && (
          <div className={styles.loadingDiv}>
            <Spin size="large" />
          </div>
        )}

        {listsData && <MyLists userLists={listsData.data} />}
      </div>
    </div>
  );
};

export default ListsView;
