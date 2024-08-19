import React from "react";
import { Button, Tag, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";
import styles from "./PlacePageActions.module.css";

const PlacePageActions = ({
  placeId,
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
      <div className={styles.placeHeader}>
        <h2>My Info</h2>
        <Tooltip
          placement="topRight"
          title="This is your personal information about this place. Add a your rating, custom tags, and notes."
        >
          <div>
            <InfoCircleOutlined />
          </div>
        </Tooltip>
      </div>
      <div className={styles.myInfoContainer}>
        {/* My Rating Section */}
        <div className={styles.myRatingDiv}>
          <p className={styles.sectionTitle}>My Rating</p>
          <div className={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MdOutlineStar
                key={star}
                className={
                  star <= myRating ? styles.filledStar : styles.emptyStar
                }
                onClick={() => {
                  handleRatingClick(star);
                }}
              />
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className={styles.tagDiv}>
          <p className={styles.sectionTitle}>Tags</p>
          <Button type="dashed" className={styles.tagButton} onClick={onTag}>
            <PlusOutlined />
            Tags
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

        {/* Notes Section */}
        <div className={styles.noteDiv} onClick={onAddNote}>
          <p className={styles.sectionTitle}>Notes</p>
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
    </div>
  );
};

export default PlacePageActions;
