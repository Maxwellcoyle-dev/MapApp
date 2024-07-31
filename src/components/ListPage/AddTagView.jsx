import React, { useState, useEffect } from "react";
import { Button, Tag } from "antd";
import useUser from "../../hooks/backend-hooks/useUser";
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";
import styles from "./AddTagView.module.css";

const AddTagView = ({ setShowTagManager, currentListPlace, listId }) => {
  const [currentPlaceTags, setCurrentPlaceTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const { authUser } = useUser();
  const { updatePlaceMutation } = useUpdatePlace();

  useEffect(() => {
    if (currentListPlace?.tags?.L) {
      const mappedTags = currentListPlace.tags.L.map((tag) => ({
        tagId: tag.M.tagId.S,
        categoryId: tag.M.categoryId.S,
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [currentListPlace]);

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
    console.log("placeId", currentListPlace.placeId.S);
    console.log("userId", authUser.data.userId);
    const updatedTags = currentPlaceTags.map((tag) => ({
      tagId: tag.tagId,
      categoryId: tag.categoryId,
    }));
    console.log("updatedTags", updatedTags);
    updatePlaceMutation.mutate({
      placeId: currentListPlace.placeId.S,
      userId: authUser.data.userId,
      placeData: {
        tags: updatedTags,
      },
      listId: listId,
    });
    setShowTagManager(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <h3>Tag Manager</h3>
        <Button onClick={() => setShowTagManager(false)}>Close</Button>
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

export default AddTagView;
