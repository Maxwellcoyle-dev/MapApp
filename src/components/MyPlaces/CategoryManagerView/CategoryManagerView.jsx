// Libraries
import React, { useEffect, useState } from "react";
import { Button, Input, List, Modal, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// Hooks
import useUser from "../../../hooks/backend-hooks/useUser";
import useManageCategories from "../../../hooks/backend-hooks/useManageCategories";

// Styles
import styles from "./CategoryManagerView.module.css";

const CategoryManagerView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { authUser } = useUser();
  const { manageCategoriesMutation } = useManageCategories();

  useEffect(() => {
    console.log(authUser);
    if (authUser?.data.categories) {
      setCategories(authUser.data.categories);
    }
  }, [authUser]);

  const handleAddCategory = () => {
    const newCategory = {
      categoryId: Date.now().toString(),
      createdAt: Date.now().toString(),
      creationType: "user",
      lastUpdatedAt: Date.now().toString(),
      name: newCategoryName,
      tags: [],
    };
    const updatedCategories = [...categories, newCategory];
    manageCategoriesMutation.mutate({
      userId: authUser.data.userId,
      categories: updatedCategories,
    });
    setNewCategoryName("");
  };

  const handleRemoveCategory = (categoryId) => {
    const updatedCategories = categories.filter(
      (category) => category.categoryId !== categoryId
    );
    manageCategoriesMutation.mutate({
      userId: authUser.data.userId,
      categories: updatedCategories,
    });
  };

  const handleAddTag = () => {
    const updatedCategories = categories.map((cat) => {
      if (cat.categoryId === currentCategory.categoryId) {
        return {
          ...cat,
          tags: [
            ...cat.tags,
            { tagId: Date.now().toString(), tagName: newTagName },
          ],
        };
      }
      return cat;
    });
    manageCategoriesMutation.mutate({
      userId: authUser.data.userId,
      categories: updatedCategories,
    });
    setNewTagName("");
    setIsModalVisible(false);
  };

  const handleRemoveTag = (categoryId, tagId) => {
    const updatedCategories = categories.map((category) => {
      if (category.categoryId === categoryId) {
        return {
          ...category,
          tags: category.tags.filter((tag) => tag.tagId !== tagId),
        };
      }
      return category;
    });
    manageCategoriesMutation.mutate({
      userId: authUser.data.userId,
      categories: updatedCategories,
    });
  };

  const showModal = (category) => {
    setCurrentCategory(category);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleAddTag(currentCategory);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.categoryManagerContainer}>
      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>
      <List
        dataSource={categories}
        renderItem={(category) => (
          <div
            style={{
              marginBottom: "20px",
              padding: ".5rem",
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <p style={{ fontWeight: "bold", width: "40%" }}>
                {category.name}
              </p>
              <div style={{ width: "60%" }}>
                <Button type="link" onClick={() => showModal(category)}>
                  Add Tag
                </Button>
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCategory(category.categoryId)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {category.tags.map((tag) => (
                <Tag
                  style={{ marginBottom: "5px" }}
                  key={tag.tagId}
                  closable
                  onClose={() =>
                    handleRemoveTag(category.categoryId, tag.tagId)
                  }
                >
                  {tag.tagName}
                </Tag>
              ))}
            </div>
          </div>
        )}
      />
      <Modal
        title="Add a new tag"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Tag Name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default CategoryManagerView;
