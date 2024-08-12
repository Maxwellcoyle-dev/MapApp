import React, { useEffect, useState } from "react";
import { Button, Input, List, Modal, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

// componenta
import NewTagModal from "./NewTagModal";
import CategoryModal from "./CategoryModal";

// state
import { useAppContext } from "../../state/AppContext";

// hooks
import useUser from "../../hooks/backend-hooks/useUser";
import useManageCategories from "../../hooks/backend-hooks/useManageCategories";

import styles from "./ManageCategoriesPage.module.css";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showAddTagModal, setShowAddTagModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const navigate = useNavigate();

  const { showManageCategoriesModal, setShowManageCategoriesModal } =
    useAppContext();

  const { authUser } = useUser();
  const {
    manageCategoriesAsync,
    manageCategoriesIsPending,
    manageCategoriesIsSuccess,
  } = useManageCategories();

  useEffect(() => {
    if (authUser?.data.categories) {
      setCategories(authUser.data.categories);
    }
  }, [authUser]);

  // submit the new categories to the backend.
  const handlePageSubmit = () => {
    console.log("categories", categories);
    console.log("authUser.data.categories", authUser.data.categories);
    const updateCategories = categories !== authUser.data.categories;
    console.log("updateCategories", updateCategories);
    if (updateCategories) {
      manageCategoriesAsync({
        userId: authUser.data.userId,
        categories,
      });
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (manageCategoriesIsSuccess) {
      navigate(-1);
    }
  }, [manageCategoriesIsSuccess]);

  const handleAddCategory = () => {
    const newCategory = {
      categoryId: uuid(),
      createdAt: Date.now().toString(),
      creationType: "user",
      lastUpdatedAt: Date.now().toString(),
      categoryName: newCategoryName,
      tags: [],
    };
    const updatedCategories = [...categories, newCategory];

    setCategories(updatedCategories);

    setNewCategoryName("");
    setShowAddCategoryModal(false);
  };

  const handleRemoveCategory = (categoryId) => {
    // remove the category from the categories list
    const updatedCategories = categories.filter(
      (category) => category.categoryId !== categoryId
    );
    setCategories(updatedCategories);
  };

  const handleAddTag = () => {
    console.log("currentCategory", currentCategory);
    const updatedCategories = categories.map((cat) => {
      console.log("cat", cat);
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
    setCategories(updatedCategories);
    setNewTagName("");
    setShowAddTagModal(false);
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
    setCategories(updatedCategories);
  };

  const showModal = (category) => {
    setCurrentCategory(category);
    setShowAddTagModal(true);
  };

  return (
    <div className={styles.manageCategoriesPage}>
      <div className={styles.categoryManagerContainer}>
        <h2 style={{ margin: 0 }}>Manage Categories</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddCategoryModal(true)}
        >
          Add Category
        </Button>
      </div>

      <div className={styles.categoryListContainer}>
        <List
          dataSource={categories}
          renderItem={(category) => (
            <div className={styles.categoryManagerItem}>
              <div className={styles.categoryManagerItemHeader}>
                <div className={styles.topDiv}>
                  <h3 style={{ fontWeight: "bold" }}>
                    {category.categoryName}
                  </h3>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveCategory(category.categoryId)}
                  ></Button>
                </div>
                <div className={styles.buttonDiv}>
                  <Button
                    onClick={() => showModal(category)}
                    icon={<PlusOutlined />}
                    type="dashed"
                  >
                    Tag
                  </Button>
                </div>
              </div>
              <div
                style={{ display: "flex", flexWrap: "wrap" }}
                className={styles.tagListDiv}
              >
                {category.tags.map((tag) => (
                  <Tag
                    className={styles.tagItem}
                    style={{ marginBottom: "5px" }}
                    key={tag.tagId}
                    closable
                    onClose={() =>
                      handleRemoveTag(category.categoryId, tag.tagId)
                    }
                  >
                    <p className={styles.tagText}>{tag.tagName}</p>
                  </Tag>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      <div
        className={styles.footerButtonDiv}
        style={{
          position: "sticky",
          bottom: 0,
          background: "white",
          zIndex: 1000,
          paddingTop: "10px",
          textAlign: "right", // Align buttons to the right
          padding: "10px 1rem",
        }}
      >
        <Button
          key="submit"
          type="primary"
          loading={manageCategoriesIsPending}
          onClick={handlePageSubmit}
        >
          Save
        </Button>
        <Button
          key="back"
          onClick={() => navigate(-1)}
          style={{ marginLeft: "10px" }}
        >
          Close
        </Button>
      </div>
      <NewTagModal
        handleSubmit={handleAddTag}
        handleCancel={() => setShowAddTagModal(false)}
        open={showAddTagModal}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
      />
      <CategoryModal
        handleSubmit={handleAddCategory}
        handleCancel={() => setShowAddCategoryModal(false)}
        open={showAddCategoryModal}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />
    </div>
  );
};

export default ManageCategoriesPage;
