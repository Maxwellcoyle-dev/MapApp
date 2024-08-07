import React from "react";
import { Carousel, Image } from "antd";
import styles from "./PhotoDisplay.module.css";

const PhotoDisplay = ({ placeData }) => {
  return (
    <Carousel className={styles.carousel}>
      {placeData.photos?.map((photo, index) => (
        <div key={index} className={styles.photoDiv}>
          <Image
            className={styles.mainImage}
            src={photo.getUrl()}
            alt={placeData.name}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default PhotoDisplay;
