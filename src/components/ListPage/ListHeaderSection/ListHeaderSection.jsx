import React, { useState, useRef, useEffect } from "react";

// Components
import ListHeader from "./ListHeader";
import CreateListModal from "../../CreateListModal/CreateListModal";
import DeleteListModal from "../../DeleteListModal/DeleteListModal";

// Hooks
import useUpdateList from "../../../hooks/backend-hooks/useUpdateList";

import useAppUser from "../../../hooks/backend-hooks/useAppUser";
import useGetList from "../../../hooks/backend-hooks/useGetList";
import useGetListPlaces from "../../../hooks/backend-hooks/useGetListPlaces";

const ListHeaderSection = ({ listPageState, listId }) => {
  const formRef = useRef(null);

  // Edit List form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // get the user
  const { appUser } = useAppUser();

  const { listData } = useGetList(listId);
  // update list
  const { updateListAsync, updateListIsPending, updateListIsSuccess } =
    useUpdateList();

  const { refetchListPlaces } = useGetListPlaces(listId);

  useEffect(() => {
    console.log("listData", listData);
    setName(listData?.data?.listName);
    setDescription(listData?.data?.listDescription);
  }, [listData]);

  const handleUpdateList = (values) => {
    setDescription(values.description);
    setName(values.name);
    updateListAsync({
      listId: listPageState.listId,
      listData: {
        name: values.name,
        description: values.description,
        isPublic: false,
        userId: listPageState.userId,
      },
    });
  };

  return (
    <div>
      <ListHeader
        listName={name ? name : listPageState?.listName}
        listDescription={
          description ? description : listPageState?.listDescription
        }
        refetchListPlaces={refetchListPlaces}
      />
      <CreateListModal
        formRef={formRef}
        listName={name}
        listDescription={description}
        handleSubmit={handleUpdateList}
        newList={false}
        isPending={updateListIsPending}
        isSuccess={updateListIsSuccess}
      />
      <DeleteListModal listId={listId} userId={appUser?.data.userId} />
    </div>
  );
};

export default ListHeaderSection;
