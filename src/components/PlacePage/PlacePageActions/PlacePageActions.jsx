import React from "react";
import { Button, Tag } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import styles from "./PlacePageActions.module.css";

const PlacePageActions = ({
  isSaved,
  onTag,
  onAddNote,
  tags = [],
  note = "",
  myRating,
  handleRatingClick,
}) => {
  const truncatedNote =
    note && note.length > 100 ? note.substring(0, 100) + "..." : note;

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.myRatingDiv}>
        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MdOutlineStar
              key={star}
              className={
                star <= myRating ? styles.filledStar : styles.emptyStar
              }
              onClick={() => handleRatingClick(star)}
            />
          ))}
        </div>
      </div>
      <div className={styles.tagDiv}>
        <Button
          type="dashed"
          className={styles.tagButton}
          disabled={!isSaved}
          onClick={onTag}
        >
          <PlusOutlined /> <p>Tags</p>
        </Button>
        {tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {tags.map((tag) => (
              <Tag key={tag.tagId} className={styles.tag}>
                {tag.tagName}
              </Tag>
            ))}
          </div>
        )}
      </div>

      <div className={styles.noteDiv} onClick={onAddNote}>
        <div className={styles.noteContent}>
          {note ? (
            <div dangerouslySetInnerHTML={{ __html: truncatedNote }} />
          ) : (
            <p className={styles.placeholderText}>Click here to add a note</p>
          )}
          <EditOutlined className={styles.editIcon} />
        </div>
      </div>
    </div>
  );
};

export default PlacePageActions;