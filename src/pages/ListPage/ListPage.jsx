import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Image, Spin } from "antd";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useUpdateList from "../../hooks/backend-hooks/useUpdateList";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useGetList from "../../hooks/backend-hooks/useGetList";

import styles from "./ListPage.module.css";

const List = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [placeIds, setPlaceIds] = useState([]);

  // form state
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");

  // get state from location
  const location = useLocation();
  const { state } = location;

  const { listData } = useGetList(state.listId.S);

  useEffect(() => {
    console.log("listData -- ", listData);
  }, [listData]);

  useEffect(() => {
    console.log("state -- ", state);
    setListName(state.listName.S);
    setDescription(state?.description?.S);
  }, []);

  const navigate = useNavigate();

  const formRef = useRef(null);

  const { listPlacesData, isListPlacesDataLoading } = useListPlaces(
    state.listId.S
  );

  useEffect(() => {
    if (listPlacesData) {
      const placeIds = listPlacesData.map((place) => place.placeId.S);
      setPlaceIds(placeIds);
    }
  }, [listPlacesData]);

  const { placesPhotos } = useGetPhotos(placeIds);

  const { updateListMutation } = useUpdateList();

  // Log Checks
  useEffect(() => {
    console.log("placePhotos -- ", placesPhotos);
  }, [placesPhotos]);

  useEffect(() => {
    console.log("state -- ", state);
  }, [state]);

  useEffect(() => {
    if (listPlacesData) {
      console.log("listPlacesData", listPlacesData);
    }
  }, [listPlacesData]);

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

  const handleCancel = () => {
    setShowEditForm(false);
  };

  return (
    <div className={styles.listPageContainer}>
      {!showEditForm ? (
        <div className={styles.listHeaderDiv}>
          <div className={styles.contentDiv}>
            <h1 style={{ margin: 0 }}>{listName}</h1>
            <p>{description}</p>
          </div>
          <Button onClick={() => setShowEditForm(true)}>Edit</Button>
        </div>
      ) : (
        <div ref={formRef}>
          <Form
            initialValues={{
              listName: state.listName.S,
              description: state.description?.S || "",
            }}
            onFinish={handleUpdateList}
          >
            <Form.Item
              name="listName"
              value={listName}
              rules={[
                { required: true, message: "Please input the list name!" },
              ]}
            >
              <Input placeholder="List Name" />
            </Form.Item>
            <Form.Item
              name="description"
              rules={[
                { required: false, message: "Please input the description!" },
              ]}
            >
              <Input placeholder="Description" />
            </Form.Item>
            <div className={styles.formButtons}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      )}
      <div className={styles.listItemContainer}>
        {isListPlacesDataLoading ? (
          <Spin size="large" />
        ) : (
          listPlacesData?.map((place, index) => {
            console.log("place -- ", place);

            const firstPhoto = placesPhotos?.[index]?.photos?.[0]?.getUrl();

            return (
              <div
                key={place.placeId.S}
                className={styles.listItem}
                onClick={() => navigate(`/place/${place.placeId.S}`)}
              >
                {firstPhoto ? (
                  <Image
                    className={styles.image}
                    src={firstPhoto}
                    alt={`${place.name.S} photo`}
                  />
                ) : (
                  <Image
                    className={styles.image}
                    src="default-placeholder-image.jpg"
                    alt="Default placeholder"
                  />
                )}
                <h2>{place.name.S}</h2>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
