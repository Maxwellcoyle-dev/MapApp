import React, { useState, useEffect } from "react";
import { Button, Input, Select, Modal, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// hooks
import useUser from "../../hooks/backend-hooks/useUser";
import useManageTags from "../../hooks/backend-hooks/useManageTags";

// styles
import styles from "./AddTagView.module.css";

const { Option } = Select;

const AddTagView = ({ setShowTagManager, selectedPlace }) => {
  const { authUser } = useUser();
  //   const { manageTagsMutation } = useManageTags();
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    console.log("selectedPlace -- ", selectedPlace);
  }, [selectedPlace]);

  useEffect(() => {
    console.log("authUser -- ", authUser);
    if (authUser?.data.categories) {
      setCategories(authUser.data.categories);
    }
  }, [authUser]);

  const handleAddTag = () => {
    const newTag = {
      tagId: Date.now().toString(),
      tagName: newTagName,
    };
    const updatedCategories = categories.map((category) => {
      if (category.categoryId === currentCategory.categoryId) {
        return {
          ...category,
          tags: [...category.tags, newTag],
        };
      }
      return category;
    });
    // manageTagsMutation.mutate({
    //   userId: authUser.data.userId,
    //   categories: updatedCategories,
    // });
    setNewTagName("");
    setIsModalVisible(false);
  };

  const handleTagSelect = (tagIds) => {
    setSelectedTags(tagIds);
  };

  const showModal = (category) => {
    setCurrentCategory(category);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleAddTag();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <h3>Tag Manager</h3>
        <Button onClick={() => setShowTagManager(false)}>Close </Button>
      </div>
      <h4>Current Tags</h4>

      <h4>Add New Tags</h4>
      {categories.map((category) => (
        <div className={styles.categoryDiv} key={category.categoryId}>
          <h4>{category.name}</h4>
          <div className={styles.tagsListDiv}>
            {category.tags.map((tag) => (
              <Tag key={tag.tagId}>{tag.tagName}</Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddTagView;
