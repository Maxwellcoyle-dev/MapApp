import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Input, Image, Spin } from "antd";
import {
  DeleteOutlined,
  PlusSquareOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useUpdateList from "../../hooks/backend-hooks/useUpdateList";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useGetList from "../../hooks/backend-hooks/useGetList";
import useRemoveListPlace from "../../hooks/backend-hooks/useRemoveListPlace";
import useUser from "../../hooks/backend-hooks/useUser";
import useDeleteList from "../../hooks/backend-hooks/useDeleteList";

// components
import ListEditForm from "../../components/ListPage/ListEditForm";
import ListHeader from "../../components/ListPage/ListHeader/ListHeader";
import ListItem from "../../components/ListPage/ListItem/ListItem";

import styles from "./ListPage.module.css";

const List = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [placeIds, setPlaceIds] = useState([]);

  // form state
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");

  // get the user
  const { authUser } = useUser();
  useEffect(() => {
    console.log("authUser: ", authUser);
  }, [authUser]);

  // get state from location
  const location = useLocation();

  // get the listId from the location pathname "/list/8132247d-eb1e-4847-bb42-23a16062b95b"
  const { listId } = useParams();

  const { state } = location;

  useEffect(() => {
    console.log("location: ", location);
    console.log("listId: ", listId);
    console.log("List state: ", state);
  }, [state]);

  const { listData, listDataIsLoading } = useGetList(listId);

  useEffect(() => {
    setListName(listData?.data.listName.S);
    setDescription(listData?.data.listDescription?.S);
  }, [listData]);

  const navigate = useNavigate();

  const formRef = useRef(null);

  const { listPlacesData, isListPlacesDataLoading, refetchListPlaces } =
    useListPlaces(listId);

  useEffect(() => {
    if (listPlacesData) {
      const placeIds = listPlacesData.map((place) => place.placeId.S);
      setPlaceIds(placeIds);
    }
  }, [listPlacesData]);

  // get photos for the places
  const { placesPhotos } = useGetPhotos(placeIds);

  // update list
  const { updateListMutation } = useUpdateList();

  // delete list
  const { deleteListMutation } = useDeleteList();

  // remove place from list
  const { removeListPlaceMutation } = useRemoveListPlace();

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
      listId: state.listId.S,
      listData: {
        listName: values.listName,
        description: values.description,
        userId: state.userId.S,
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

  useEffect(() => {
    console.log("listPlacesData", listPlacesData);
  }, [listPlacesData]);

  useEffect(() => {
    console.log("listData", listData);
  }, [listData]);

  return (
    <div className={styles.listPageContainer}>
      {listData &&
        (!showEditForm ? (
          <ListHeader
            listName={state?.listName.S ? state.listName.S : listName}
            listDescription={
              state?.listDescription.S ? state.listDescription.S : description
            }
            refetchListPlaces={refetchListPlaces}
            handleDeleteList={handleDeleteList}
            setShowEditForm={setShowEditForm}
            styles={styles}
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
      <div className={styles.refreshButtonContainer}>
        <Button
          onClick={refetchListPlaces}
          icon={<ReloadOutlined />}
          className={styles.refreshButton}
        ></Button>
      </div>
      <div className={styles.listItemContainer}>
        {listData && !listPlacesData && (
          <div className={styles.noDataMessage}>No places in this list.</div>
        )}
        {listData &&
          listPlacesData?.map((place, index) => {
            const firstPhoto = placesPhotos?.[index]?.photos?.[0]?.getUrl();
            return (
              <ListItem
                key={place.placeId.S}
                place={place}
                firstPhoto={firstPhoto}
                navigate={navigate}
                removeListPlaceMutation={removeListPlaceMutation}
                listData={listData}
                authUser={authUser}
              />
            );
          })}
      </div>
    </div>
  );
};

export default List;
