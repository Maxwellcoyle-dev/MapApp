import React, { useEffect } from "react";
import { Image, Tag } from "antd";
import { MdOutlineNewLabel, MdDeleteOutline } from "react-icons/md";

import styles from "./ListItem.module.css";

const ListItem = ({
  place,
  firstPhoto,
  navigate,
  removeListPlaceMutation,
  listData,
  authUser,
}) => {
  useEffect(() => {
    console.log("Place:", place);
  }, [place]);

  return (
    <div className={styles.listItem}>
      <div className={styles.imageDiv}>
        {firstPhoto ? (
          <Image
            className={styles.image}
            src={firstPhoto}
            alt={`${place.name.S} photo`}
          />
        ) : (
          <Image
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

        <div
          className={styles.btnIconDiv}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Delete place:", place.placeId.S);
            removeListPlaceMutation.mutate({
              listId: listData.data.listId.S,
              placeId: place.placeId.S,
              userId: authUser.data.userId,
            });
          }}
        >
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
          <h2>{place.name.S}</h2>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
