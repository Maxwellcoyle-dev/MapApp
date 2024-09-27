import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import { MdOutlineNewLabel, MdDeleteOutline } from "react-icons/md";

// Components
import DeletePlaceModal from "../../../../modals/DeletePlaceModal/DeletePlaceModal";

import styles from "./ListItem.module.css";

const ListItem = ({ place, firstPhoto, navigate, listData, appUser }) => {
  useEffect(() => {
    console.log("place: ", place);
    console.log("firstPhoto: ", firstPhoto);
  }, [place]);
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
            alt={`${place.placeName} photo`}
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
            navigate(`/add-tag/${place.placeId}`, {
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
        onClick={() => navigate(`/place/${place.placeId}`)}
        className={styles.cardBody}
      >
        <div className={styles.tagContainer}>
          {place.tags?.map((tag, index) => (
            <Tag key={index} color="blue">
              {tag.tagName}
            </Tag>
          ))}
        </div>
        <div className={styles.infoContainer}>
          <h2>{place?.placeName || place?.name}</h2>
        </div>
      </div>
      {/* DeletePlaceModal component */}
      {isModalVisible && (
        <DeletePlaceModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          listIds={[
            {
              listId: listData.data.listId,
              listName: listData.data.listName,
            },
          ]} // Pass the list ID
          userId={appUser.data.userId}
          placeName={place.placeName}
          placeId={place.placeId}
        />
      )}
    </div>
  );
};

export default ListItem;
