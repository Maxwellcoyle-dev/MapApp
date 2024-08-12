// Libraries
import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { MdOutlineAdd } from "react-icons/md";

// Hooks
import useCreateList from "../../../hooks/backend-hooks/useCreateList";
import useUserLists from "../../../hooks/backend-hooks/useUserLists";
import useUser from "../../../hooks/backend-hooks/useUser";

// components
import MyLists from "../../MyPlaces/MyLists/MyLists";
import CreateListModal from "../../CreateListModal/CreateListModal";

// state
import { useAppContext } from "../../../state/AppContext";

// styles
import styles from "./ListsView.module.css";
import { createList } from "../../../api/listApi";

// component for creating a new list
const ListsView = () => {
  const { authUser } = useUser();

  const { setShowCreateListModal } = useAppContext();

  const { listsData, listsError, isListsLoading } = useUserLists(
    authUser?.data.userId
  );

  const { createListAsync, createListIsPending, createListIsSuccess } =
    useCreateList();

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

  const handleSubmit = (values) => {
    createListAsync({
      name: values.name,
      description: values.description,
      isPublic: values.publicList,
    });
  };

  return (
    <div className={styles.listManager}>
      <div className={styles.headerDiv}>
        <h2>Manage Your Lists</h2>

        <Button
          className={styles.addNewListBtn}
          onClick={() => setShowCreateListModal(true)}
          type="primary"
        >
          Add New List <MdOutlineAdd />
        </Button>
      </div>

      <div className={styles.listDiv}>
        {isListsLoading && (
          <div className={styles.loadingDiv}>
            <Spin size="large" />
          </div>
        )}

        {listsData && <MyLists userLists={listsData.data} />}
      </div>
      <CreateListModal
        handleSubmit={handleSubmit}
        isPending={createListIsPending}
        isSuccess={createListIsSuccess}
      />
    </div>
  );
};

export default ListsView;
