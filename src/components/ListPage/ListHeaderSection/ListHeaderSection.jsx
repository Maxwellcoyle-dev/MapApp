import React, { useState, useRef, useEffect } from "react";

// Components
import ListHeader from "./ListHeader";
import ListEditForm from "./ListEditForm";

// Hoooks
import useUpdateList from "../../../hooks/backend-hooks/useUpdateList";
import useDeleteList from "../../../hooks/backend-hooks/useDeleteList";
import useUser from "../../../hooks/backend-hooks/useUser";
import useGetList from "../../../hooks/backend-hooks/useGetList";
import useListPlaces from "../../../hooks/backend-hooks/useListPlaces";

import styles from "./ListHeaderSection.module.css";

const ListHeaderSection = ({
  listPageState,
  listId,
  setShowFilterForm,
  showFilterForm,
}) => {
  const formRef = useRef(null);

  const [showEditForm, setShowEditForm] = useState(false);

  // Edit List form state
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");

  // get the user
  const { authUser } = useUser();

  const { listData } = useGetList(listId);

  // update list
  const { updateListMutation } = useUpdateList();
  // delete list
  const { deleteListMutation } = useDeleteList();

  const { refetchListPlaces } = useListPlaces(listId);

  useEffect(() => {
    setListName(listData?.data.listName.S);
    setDescription(listData?.data.listDescription?.S);
  }, [listData]);

  // close the edit list form when clicking outside of the form
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowEditForm(false);
      }
    };

    if (showEditForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditForm]);

  const handleUpdateList = (values) => {
    setDescription(values.description);
    setListName(values.listName);
    updateListMutation.mutate({
      listId: listPageState.listId.S,
      listData: {
        listName: values.listName,
        description: values.description,
        userId: listPageState.userId.S,
      },
    });
    setShowEditForm(false);
  };

  const handleDeleteList = () => {
    deleteListMutation.mutate({
      listId: listId,
      userId: authUser.data.userId,
    });
  };

  const handleCancel = () => {
    setShowEditForm(false);
  };

  return (
    <div>
      {listData &&
        (!showEditForm ? (
          <ListHeader
            listName={
              listPageState?.listName.S ? listPageState.listName.S : listName
            }
            listDescription={
              listPageState?.listDescription.S
                ? listPageState.listDescription.S
                : description
            }
            refetchListPlaces={refetchListPlaces}
            handleDeleteList={handleDeleteList}
            setShowEditForm={setShowEditForm}
            setShowFilterForm={setShowFilterForm}
            showFilterForm={showFilterForm}
          />
        ) : (
          <ListEditForm
            formRef={formRef}
            listData={listData}
            styles={styles}
            handleCancel={handleCancel}
            handleUpdateList={handleUpdateList}
            listName={listName}
            description={description}
          />
        ))}
    </div>
  );
};

export default ListHeaderSection;
