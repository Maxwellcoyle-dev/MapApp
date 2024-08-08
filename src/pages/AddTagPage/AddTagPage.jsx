import React, { useState, useEffect } from "react";
import { Button, Tag, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { state } = location;

  const { placeId } = useParams();
  const { authUser } = useUser();
  const { savedPlaceData } = useGetPlace(placeId, authUser?.data.userId);
  const { updatePlaceMutation } = useUpdatePlace();

  useEffect(() => {
    if (savedPlaceData?.tags) {
      console.log("savedPlaceData.tags", savedPlaceData.tags);
      const mappedTags = savedPlaceData.tags.map((tag) => ({
        tagId: tag.tagId,
        categoryId: tag.categoryId,
        tagName: tag.tagName,
        categoryName: tag.categoryName,
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [savedPlaceData]);

  useEffect(() => {
    if (authUser?.data?.categories) {
      setAllTags(authUser.data.categories);
    }
  }, [authUser]);

  const handleTagClick = (category, tag) => {
    const tagExists = currentPlaceTags.some((t) => {
      return t.tagId === tag.tagId && t.categoryId === category.categoryId;
    });
    if (tagExists) {
      setCurrentPlaceTags(
        currentPlaceTags.filter(
          (t) =>
            !(t.tagId === tag.tagId && t.categoryId === category.categoryId)
        )
      );
    } else {
      setCurrentPlaceTags([
        ...currentPlaceTags,
        {
          tagId: tag.tagId,
          categoryId: category.categoryId,
          tagName: tag.tagName,
          categoryName: category.categoryName,
        },
      ]);
    }
  };

  const handleSave = () => {
    const updatedTags = currentPlaceTags.map((tag) => ({
      tagId: tag.tagId,
      categoryId: tag.categoryId,
      tagName: tag.tagName,
      categoryName: tag.categoryName,
    }));

    updatePlaceMutation.mutate({
      placeId: placeId,
      userId: authUser.data.userId,
      placeData: {
        tags: updatedTags,
      },
    });
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <div className={styles.topDiv}>
          <h2>
            {savedPlaceData || state?.name?.S ? (
              savedPlaceData.name || state.name.S
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
            <h3 className={styles.categoryName}>{category.categoryName}</h3>
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
                    onClick={() => handleTagClick(category, tag)}
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
