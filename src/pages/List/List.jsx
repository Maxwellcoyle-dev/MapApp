import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Image } from "antd";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useUpdateList from "../../hooks/backend-hooks/useUpdateList";

import styles from "./List.module.css";

const List = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { listPlacesData, isListPlacesDataLoading } = useListPlaces(
    state.listId.S
  );

  const { updateListMutation } = useUpdateList();

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
    updateListMutation.mutate({
      listId: state.listId.S,
      listData: {
        listName: values.listName,
        description: values.description,
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
            <h1>{state.listName.S}</h1>
            <p>{state.description?.S || "Description"}</p>
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
              rules={[
                { required: true, message: "Please input the list name!" },
              ]}
            >
              <Input placeholder="List Name" />
            </Form.Item>
            <Form.Item
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
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
      {isListPlacesDataLoading && <p>Loading...</p>}
      {listPlacesData && listPlacesData.length > 0 && (
        <div className={styles.listItemContainer}>
          {listPlacesData.map((place) => (
            <div
              key={place.placeId.S}
              className={styles.listItem}
              onClick={() => navigate(`/place/${place.placeId.S}`)}
            >
              <Image
                className={styles.image}
                src={place.photos.SS[0]}
                alt={`${place.name.S} photo`}
              />
              <h2>{place.name.S}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
