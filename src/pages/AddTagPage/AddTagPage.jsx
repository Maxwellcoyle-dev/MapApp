import React, { useState, useEffect } from "react";
import { Button, Tag } from "antd";
import { useParams, useNavigate } from "react-router-dom";

// Hooks
import useUser from "../../hooks/backend-hooks/useUser";
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";
import useGetPlace from "../../hooks/backend-hooks/useGetPlace";

// styles
import styles from "./AddTagPage.module.css";

const AddTagPage = () => {
  const [currentPlaceTags, setCurrentPlaceTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  const { placeId } = useParams();

  const { authUser } = useUser();

  const { placeData } = useGetPlace(placeId, authUser?.data.userId);

  const { updatePlaceMutation } = useUpdatePlace();

  useEffect(() => {
    console.log("placeData -- ", placeData);
  }, [placeData]);

  useEffect(() => {
    if (placeData?.tags?.L) {
      console.log("placeData.tags.L", placeData.tags.L);
      const mappedTags = placeData.tags.L.map((tag) => ({
        tagId: tag.M.tagId.S,
        categoryId: tag.M.categoryId.S,
        tagName: getTagNameById(tag.M.tagId.S, tag.M.categoryId.S),
        categoryName: getCategoryNameById(tag.M.categoryId.S),
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [placeData]);

  useEffect(() => {
    if (authUser?.data?.categories) {
      setAllTags(authUser.data.categories);
    }
  }, [authUser]);

  const getTagNameById = (tagId, categoryId) => {
    const category = authUser?.data?.categories.find(
      (cat) => cat.categoryId === categoryId
    );
    if (category) {
      const tag = category.tags.find((t) => t.tagId === tagId);
      return tag ? tag.tagName : "";
    }
    return "";
  };

  const getCategoryNameById = (categoryId) => {
    const category = authUser?.data?.categories.find(
      (cat) => cat.categoryId === categoryId
    );
    return category ? category.name : "";
  };

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
          tagName: tag.tagName,
          categoryName: getCategoryNameById(categoryId),
        },
      ]);
    }
  };

  const handleSave = () => {
    console.log("placeId", placeData?.placeId.S);
    console.log("userId", authUser.data.userId);
    const updatedTags = currentPlaceTags.map((tag) => ({
      tagId: tag.tagId,
      categoryId: tag.categoryId,
      tagName: tag.tagName,
      categoryName: tag.categoryName,
    }));
    console.log("updatedTags", updatedTags);
    updatePlaceMutation.mutate({
      placeId: placeId,
      userId: authUser.data.userId,
      placeData: {
        tags: updatedTags,
      },
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
