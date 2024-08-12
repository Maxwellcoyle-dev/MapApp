// Libraries
import React, { useEffect } from "react";
import { Button, Spin } from "antd";
import { MdOutlineAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Hooks
import useCreateList from "../../hooks/backend-hooks/useCreateList";
import useUserLists from "../../hooks/backend-hooks/useUserLists";
import useUser from "../../hooks/backend-hooks/useUser";

// components
import MyLists from "../../components/MyLists/MyLists";
import CreateListModal from "../../components/CreateListModal/CreateListModal";

// state
import { useAppContext } from "../../state/AppContext";

// styles
import styles from "./MyListsPage.module.css";

// component for creating a new list
const MyListsPage = () => {
  const { authUser } = useUser();
  const navigate = useNavigate();
  const { setShowCreateListModal } = useAppContext();

  const { listsData, listsError, isListsLoading } = useUserLists(
    authUser?.data.userId
  );

  const { createListAsync, createListIsPending, createListIsSuccess } =
    useCreateList();

  const handleSubmit = (values) => {
    createListAsync({
      name: values.name,
      description: values.description,
      isPublic: values.publicList,
    });
  };

  return (
    <div className={styles.placesPage}>
      <div className={styles.headerDiv}>
        <h1>My Lists</h1>
        <div className={styles.buttonDiv}>
          <Button
            className={styles.addNewListBtn}
            onClick={() => setShowCreateListModal(true)}
            type="primary"
          >
            Add New List <MdOutlineAdd />
          </Button>
          <Button onClick={() => navigate("/manage-categories")} type="dashed">
            Manage Categories
          </Button>
        </div>
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

export default MyListsPage;
