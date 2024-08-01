// Libraries
import React, { useState } from "react";
import { Form, Radio } from "antd";

// Components
import ListsView from "../../components/MyPlaces/ListsView/ListsView";
import CategoryManager from "../../components/MyPlaces/CategoryManagerView/CategoryManagerView";

// Styles
import styles from "./MyPlacesPage.module.css";

const MyPlacesPage = () => {
  const [showManager, setShowManager] = useState("list-manager");

  return (
    <div className={styles.manager}>
      <div className={styles.headerDiv}>
        <h1>Manager</h1>
        <p>Manage your lists and categories here.</p>
      </div>

      <Form className={styles.formDiv}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Radio.Group
            className={styles.radioButtonGroup}
            onChange={(e) => setShowManager(e.target.value)}
            value={showManager}
          >
            <Radio.Button className={styles.radioButton} value="list-manager">
              List Manager
            </Radio.Button>
            <Radio.Button
              className={styles.radioButton}
              value="category-manager"
            >
              Category Manager
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
      {showManager === "list-manager" && <ListsView />}
      {showManager === "category-manager" && <CategoryManager />}
    </div>
  );
};

export default MyPlacesPage;
