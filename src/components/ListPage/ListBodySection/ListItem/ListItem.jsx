import React, { useState } from "react";
import { Tag } from "antd";
import { MdOutlineNewLabel, MdDeleteOutline } from "react-icons/md";

// Components
import DeletePlaceModal from "../../../DeletePlaceModal/DeletePlaceModal";

import styles from "./ListItem.module.css";

const ListItem = ({ place, firstPhoto, navigate, listData, authUser }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsModalVisible(true); // Open the modal when delete icon is clicked
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal after deletion or cancellation
  };

  return (
    <div className={styles.listItem}>
      <div className={styles.imageDiv}>
        {firstPhoto ? (
          <img
            className={styles.image}
            src={firstPhoto}
            alt={`${place.name?.S || place.placeName?.S} photo`}
          />
        ) : (
          <img
            className={styles.image}
            src="default-placeholder-image.jpg"
            alt="Default placeholder"
          />
        )}
      </div>
      {/* absolute positioning to display above the image */}
      <div className={styles.cardOverlayDiv}>
        <div
          className={styles.btnIconDiv}
          onClick={() => {
            navigate(`/add-tag/${place.placeId.S}`, {
              state: { place },
            });
          }}
        >
          <MdOutlineNewLabel className={styles.btnIcon} />
        </div>

        <div className={styles.btnIconDiv} onClick={handleDeleteClick}>
          <MdDeleteOutline className={styles.btnIcon} />
        </div>
      </div>
      <div
        onClick={() => navigate(`/place/${place.placeId.S}`)}
        className={styles.cardBody}
      >
        <div className={styles.tagContainer}>
          {place.tags?.L.map((tag, index) => (
            <Tag key={index} color="blue">
              {tag.M.tagName.S}
            </Tag>
          ))}
        </div>
        <div className={styles.infoContainer}>
          <h2>{place.placeName?.S || place.name?.S}</h2>
        </div>
      </div>
      {/* DeletePlaceModal component */}
      {isModalVisible && (
        <DeletePlaceModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          listIds={[
            {
              listId: listData.data.listId.S,
              listName: listData.data.listName.S,
            },
          ]} // Pass the list ID
          userId={authUser.data.userId}
          placeName={place.name.S}
          placeId={place.placeId.S}
        />
      )}
    </div>
  );
};

export default ListItem;
