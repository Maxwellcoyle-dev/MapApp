import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import useUpdatePlace from "../../hooks/backend-hooks/useUpdatePlace";

import styles from "./NoteEditorModal.module.css";

const NoteEditorModal = ({
  visible,
  onClose,
  note,
  setNote,
  optimalPlaceData,
  userId,
}) => {
  const [editorNote, setEditorNote] = useState(note || "");
  const { updatePlaceAsync, updatePlaceIsPending, updatePlaceIsSuccess } =
    useUpdatePlace();

  const handleClose = () => {
    setEditorNote(note);
    onClose();
  };

  useEffect(() => {
    setEditorNote(note);
  }, [note]);

  const handleSave = () => {
    console.log("optimalPlaceData", optimalPlaceData);
    console.log("note", note);
    setNote(editorNote);
    // check if note is empty
    // check if optimalPlaceData.note is equal to note
    const isNoteUpdated = optimalPlaceData.note === editorNote;
    if (isNoteUpdated) {
      onClose();
    } else {
      const newPlaceData = {
        ...optimalPlaceData,
        placeNote: editorNote,
      };
      updatePlaceAsync({
        placeId: optimalPlaceData.placeId,
        userId: userId,
        placeData: newPlaceData,
      });
    }
  };

  useEffect(() => {
    if (updatePlaceIsSuccess) {
      onClose();
    }
  }, [updatePlaceIsSuccess]);

  return (
    <Modal
      title="Edit Note"
      open={visible}
      onOk={handleSave}
      onCancel={onClose}
      footer={null}
    >
      <div className={styles.modalContainer}>
        <div className={styles.editorDiv}>
          <ReactQuill
            value={editorNote}
            onChange={setEditorNote}
            modules={{
              toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }]],
            }}
            formats={["bold", "italic", "underline", "list", "bullet"]}
            placeholder="Add your notes here..."
            className={styles.editor}
          />
        </div>
        <div className={styles.buttonDiv}>
          <Button
            type="primary"
            onClick={handleSave}
            loading={updatePlaceIsPending}
          >
            Save
          </Button>
          <Button danger onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteEditorModal;
