import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Image, Spin } from "antd";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons";

// hooks
import useListPlaces from "../../hooks/backend-hooks/useListPlaces";
import useUpdateList from "../../hooks/backend-hooks/useUpdateList";
import useGetPhotos from "../../hooks/google-api-hooks/useGetPhotos";
import useGetList from "../../hooks/backend-hooks/useGetList";
import useRemoveListPlace from "../../hooks/backend-hooks/useRemoveListPlace";
import useUser from "../../hooks/backend-hooks/useUser";

import styles from "./ListPage.module.css";
import AddTagView from "../../components/ListPage/AddTagView";

const List = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [placeIds, setPlaceIds] = useState([]);

  // tag manager state
  const [showTagManager, setShowTagManager] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // form state
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");

  // get the user
  const { authUser } = useUser();

  // get state from location
  const location = useLocation();
  const { state } = location;

  const { listData, listDataIsLoading } = useGetList(state.listId.S);

  useEffect(() => {
    console.log("user -- ", authUser);
    console.log("listData -- ", listData);
    setListName(listData?.data.listName.S);
    setDescription(listData?.data.listDescription?.S);
  }, [listData]);

  useEffect(() => {
    console.log("state -- ", state);
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

  const { removeListPlaceMutation } = useRemoveListPlace();

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

  if (listDataIsLoading) {
    <div className={styles.listPageContainer}>
      <Spin size="large" />
    </div>;
  }

  if (listData) {
    return (
      <div className={styles.listPageContainer}>
        {!showEditForm ? (
          <div className={styles.listHeaderDiv}>
            <div className={styles.contentDiv}>
              <h1 style={{ margin: 0 }}>{listData.data.listName.S}</h1>
              <p>{listData.data.listDescription.S}</p>
            </div>
            <Button onClick={() => setShowEditForm(true)}>Edit</Button>
          </div>
        ) : (
          <div ref={formRef}>
            <Form
              initialValues={{
                listName: listData?.data.listName.S || "",
                description: listData.data.listDescription.S || "",
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
              const firstPhoto = placesPhotos?.[index]?.photos?.[0]?.getUrl();
              return (
                <div key={place.placeId.S} className={styles.listItem}>
                  <div className={styles.cardHeader}>
                    <Button
                      className={styles.actionButton}
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Delete place:", place.placeId.S);
                        removeListPlaceMutation.mutate({
                          listId: listData.data.listId.S,
                          placeId: place.placeId.S,
                          userId: authUser.data.userId,
                        });
                      }}
                    />
                    <Button
                      icon={<PlusSquareOutlined />}
                      onClick={() => {
                        setSelectedPlace(place);
                        setShowTagManager(true);
                      }}
                    >
                      Add Tag
                    </Button>
                    {/* Add more buttons/icons for sharing and tagging here */}
                  </div>
                  <div onClick={() => navigate(`/place/${place.placeId.S}`)}>
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
                    <div className={styles.cardBody}>
                      <h2>{place.name.S}</h2>
                      {/* Render tag icons here */}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {showTagManager && (
          <AddTagView
            setShowTagManager={setShowTagManager}
            selectedPlace={selectedPlace}
          />
        )}
      </div>
    );
  }
};

export default List;
