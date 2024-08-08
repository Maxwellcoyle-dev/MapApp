import React, { useState, useEffect } from "react";
import { Button, Tag, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
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

  const { savedPlaceData } = useGetPlace(placeId, authUser?.data.userId);

  const { updatePlaceMutation } = useUpdatePlace();

  useEffect(() => {
    console.log("savedPlaceData -- ", savedPlaceData);
  }, [savedPlaceData]);

  useEffect(() => {
    if (savedPlaceData?.tags) {
      console.log("savedPlaceData.tags.L", savedPlaceData.tags);
      const mappedTags = savedPlaceData.tags.map((tag) => ({
        tagId: tag.tagId,
        categoryId: tag.categoryId,
        tagName: getTagNameById(tag.tagId, tag.categoryId),
        categoryName: getCategoryNameById(tag.categoryId),
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [savedPlaceData]);

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
    console.log("placeId", savedPlaceData?.placeId.S);
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
      savedPlaceData: {
        tags: updatedTags,
      },
    });
    navigate(-1);
    // close the page - return to previous page
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <div className={styles.topDiv}>
          <h2>
            {savedPlaceData ? (
              savedPlaceData.name
            ) : (
              <Skeleton title={{ width: 200 }} paragraph={false} active />
            )}
          </h2>

          <Button onClick={() => navigate(-1)} icon={<CloseOutlined />} />
        </div>
        <div className={styles.bottomDiv}>
          <Button onClick={handleSave} type="primary" className={styles.button}>
            Save
          </Button>
          <Button
            danger
            className={styles.button}
            onClick={() => setCurrentPlaceTags([])}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className={styles.categoriesContainer}>
        {allTags.map((category) => (
          <div className={styles.categoryDiv} key={category.categoryId}>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <div className={styles.tagsListDiv}>
              {category.tags.map((tag) => {
                const isSelected = currentPlaceTags.some(
                  (t) =>
                    t.tagId === tag.tagId &&
                    t.categoryId === category.categoryId
                );
                return (
                  <Tag
                    key={tag.tagId}
                    color={isSelected ? "blue" : "default"}
                    onClick={() => handleTagClick(category.categoryId, tag)}
                    className={styles.tagItem}
                  >
                    <p className={styles.tagText}>{tag.tagName}</p>
                  </Tag>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTagPage;
