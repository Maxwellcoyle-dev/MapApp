import React, { useState, useEffect } from "react";
import { Button, Tag } from "antd";
import { useParams, useLocation, useNavigate, use } from "react-router-dom";

// Hooks
import useUser from "../../hooks/backend-hooks/useUser";
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";

// styles
import styles from "./AddTagPage.module.css";

const AddTagPage = () => {
  const [currentPlaceTags, setCurrentPlaceTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  const { placeId } = useParams();
  const location = useLocation();
  const { state } = useLocation();
  const { place, listId } = state;

  useEffect(() => {
    console.log("location -- ", location);
    console.log("placeId", placeId);
    console.log("place", place);
    console.log("listId", listId);
  }, [place, listId, placeId]);

  const { authUser } = useUser();
  const { updatePlaceMutation } = useUpdatePlace();

  useEffect(() => {
    if (place?.tags?.L) {
      const mappedTags = place.tags.L.map((tag) => ({
        tagId: tag.M.tagId.S,
        categoryId: tag.M.categoryId.S,
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [place]);

  useEffect(() => {
    if (authUser?.data?.categories) {
      setAllTags(authUser.data.categories);
    }
  }, [authUser]);

  const handleTagClick = (categoryId, tag) => {
    const tagExists = currentPlaceTags.some(
      (t) => t.tagId === tag.tagId && t.categoryId === categoryId
    );
    if (tagExists) {
      setCurrentPlaceTags(
        currentPlaceTags.filter(
          (t) => !(t.tagId === tag.tagId && t.categoryId === categoryId)
        )
      );
    } else {
      setCurrentPlaceTags([
        ...currentPlaceTags,
        {
          tagId: tag.tagId,
          categoryId: categoryId,
        },
      ]);
    }
  };

  const handleSave = () => {
    console.log("placeId", place.placeId.S);
    console.log("userId", authUser.data.userId);
    const updatedTags = currentPlaceTags.map((tag) => ({
      tagId: tag.tagId,
      categoryId: tag.categoryId,
    }));
    console.log("updatedTags", updatedTags);
    updatePlaceMutation.mutate({
      placeId: place.placeId.S,
      userId: authUser.data.userId,
      placeData: {
        tags: updatedTags,
      },
      listId: listId,
    });
    navigate(-1);
    // close the page - return to previous page
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <h3>Tag Manager</h3>
        <Button onClick={() => navigate(-1)}>Close</Button>
      </div>
      {allTags.map((category) => (
        <div className={styles.categoryDiv} key={category.categoryId}>
          <h4>{category.name}</h4>
          <div className={styles.tagsListDiv}>
            {category.tags.map((tag) => {
              const isSelected = currentPlaceTags.some(
                (t) =>
                  t.tagId === tag.tagId && t.categoryId === category.categoryId
              );
              return (
                <Tag
                  key={tag.tagId}
                  color={isSelected ? "blue" : "default"}
                  onClick={() => handleTagClick(category.categoryId, tag)}
                  className={styles.tagItem}
                >
                  {tag.tagName}
                </Tag>
              );
            })}
          </div>
        </div>
      ))}
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default AddTagPage;
