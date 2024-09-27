import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";

// State
import { useSearchContext } from "../../../../state/SearchContext";

import styles from "./AutoComplete.module.css";

const AutoComplete = () => {
  const navigate = useNavigate();

  const { autoCompleteResults, setAutoCompleteResults, setQueryInput } =
    useSearchContext();

  // const handleAutoCompleteSelect = useAutoCompleteSelect();

  const handleAutocompleteClick = (placeId) => {
    console.log("placeId", placeId);
    setAutoCompleteResults([]);
    setQueryInput("");
    navigate(`/place/${placeId}`);
  };

  if (autoCompleteResults === null) {
    return null;
  }

  return (
    autoCompleteResults?.length > 0 && (
      <div className={styles.autocompleteContainer}>
        {autoCompleteResults.map((place) => {
          return (
            <div
              key={place.place_id}
              onClick={() => {
                handleAutocompleteClick(place.place_id);
              }}
              className={styles.autocompleteItem}
            >
              <div className={styles.resultText}>
                <p className={styles.mainText}>
                  <strong>{place.structured_formatting.main_text}</strong>
                </p>
                <p className={styles.secondaryText}>
                  {place.structured_formatting.secondary_text}
                </p>
              </div>
              <div className={styles.tagContainer}>
                <Tag
                  className={styles.sourceTag}
                  color={place.source === "google" ? "blue" : "green"}
                >
                  {place.source === "google" ? (
                    "Google"
                  ) : (
                    <>
                      Saved Place
                      {place.listName && (
                        <div className={styles.listNameContainer}>
                          <UnorderedListOutlined className={styles.listIcon} />
                          {place.listName}
                        </div>
                      )}
                    </>
                  )}
                </Tag>
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export default AutoComplete;
