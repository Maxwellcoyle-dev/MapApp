import React, { useState, useRef, useEffect } from "react";

// Components
import ListHeader from "./ListHeader";
import CreateListModal from "../../CreateListModal/CreateListModal";
import DeleteListModal from "../../DeleteListModal/DeleteListModal";

// Hooks
import useUpdateList from "../../../hooks/backend-hooks/useUpdateList";

import useUser from "../../../hooks/backend-hooks/useUser";
import useGetList from "../../../hooks/backend-hooks/useGetList";
import useListPlaces from "../../../hooks/backend-hooks/useListPlaces";

const ListHeaderSection = ({ listPageState, listId }) => {
  const formRef = useRef(null);

  // Edit List form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // get the user
  const { authUser } = useUser();

  const { listData } = useGetList(listId);
  // update list
  const { updateListAsync, updateListIsPending, updateListIsSuccess } =
    useUpdateList();

  const { refetchListPlaces } = useListPlaces(listId);

  useEffect(() => {
    setName(listData?.data?.listName?.S);
    setDescription(listData?.data?.listDescription?.S);
  }, [listData]);

  const handleUpdateList = (values) => {
    setDescription(values.description);
    setName(values.name);
    updateListAsync({
      listId: listPageState.listId.S,
      listData: {
        name: values.name,
        description: values.description,
        isPublic: false,
        userId: listPageState.userId.S,
      },
    });
  };

  return (
    <div>
      <ListHeader
        listName={name ? name : listPageState?.listName.S}
        listDescription={
          description ? description : listPageState?.listDescription?.S
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
      <DeleteListModal listId={listId} userId={authUser?.data.userId} />
    </div>
  );
};

export default ListHeaderSection;
