import React, { useState, useEffect } from "react";
import { Button, Tag, Skeleton } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import isEqual from "lodash/isEqual"; // Import lodash for deep comparison

// Hooks
import useAppUser from "../../hooks/backend-hooks/useAppUser";
import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";
import useGetOptimalPlaceData from "../../hooks/useGetOptimalPlaceData";

// styles
import styles from "./AddTag.module.css";

const AddTag = () => {
  const [isSavedTags, setIsSavedTags] = useState(true);
  const [currentPlaceTags, setCurrentPlaceTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { placeId } = useParams();
  const { appUser } = useAppUser();

  const { optimalPlaceData } = useGetOptimalPlaceData(
    placeId,
    appUser?.data.userId
  );

  const { updatePlaceAsync, updatePlaceIsPending, updatePlaceIsSuccess } =
    useUpdatePlace();

  useEffect(() => {
    if (optimalPlaceData?.tags) {
      const mappedTags = optimalPlaceData.tags.map((tag) => ({
        tagId: tag.tagId,
        categoryId: tag.categoryId,
        tagName: tag.tagName,
        categoryName: tag.categoryName,
      }));
      setCurrentPlaceTags(mappedTags);
    }
  }, [optimalPlaceData]);

  useEffect(() => {
    if (appUser?.data?.categories) {
      setAllTags(appUser.data.categories);
    }
  }, [appUser]);

  // New effect to compare currentPlaceTags with optimalPlaceData.tags
  useEffect(() => {
    const tagsChanged = !isEqual(currentPlaceTags, optimalPlaceData?.tags);
    setIsSavedTags(!tagsChanged); // Disable button if tags have not changed
  }, [currentPlaceTags, optimalPlaceData]);

  const handleTagClick = (category, tag) => {
    const tagExists = currentPlaceTags.some(
      (t) => t.tagId === tag.tagId && t.categoryId === category.categoryId
    );

    if (tagExists) {
      const newCurrentTags = currentPlaceTags.filter(
        (t) => !(t.tagId === tag.tagId && t.categoryId === category.categoryId)
      );
      setCurrentPlaceTags(newCurrentTags);
    } else {
      const newCurrentTags = [
        ...currentPlaceTags,
        {
          tagId: tag.tagId,
          categoryId: category.categoryId,
          tagName: tag.tagName,
          categoryName: category.categoryName,
        },
      ];
      setCurrentPlaceTags(newCurrentTags);
    }
  };

  const handleSave = () => {
    const updatedTags = currentPlaceTags.map((tag) => ({
      tagId: tag.tagId,
      categoryId: tag.categoryId,
      tagName: tag.tagName,
      categoryName: tag.categoryName,
    }));

    if (!isEqual(updatedTags, optimalPlaceData?.tags)) {
      updatePlaceAsync({
        placeId: placeId,
        userId: appUser.data.userId,
        placeData: {
          tags: updatedTags,
        },
      });
    }
  };

  useEffect(() => {
    if (updatePlaceIsSuccess) {
      navigate(-1);
    }
  }, [updatePlaceIsSuccess]);

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <div className={styles.topDiv}>
          <h2>
            {optimalPlaceData || state?.placeName?.S ? (
              optimalPlaceData?.placeName || state?.placeName?.S
            ) : (
              <Skeleton title={{ width: 200 }} paragraph={false} active />
            )}
          </h2>

          <Button onClick={() => navigate(-1)} icon={<CloseOutlined />} />
        </div>
        <div className={styles.bottomDiv}>
          <Button
            onClick={handleSave}
            type="primary"
            className={styles.button}
            loading={updatePlaceIsPending}
            disabled={isSavedTags}
          >
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

export default AddTag;
