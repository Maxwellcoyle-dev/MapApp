import React from "react";
import { Image } from "antd";
import styles from "./PhotoGallery.module.css"; // replace with your actual styles import

const PhotoGallery = ({ photos }) => {
  // Split photos into chunks of 3 for each imageDiv
  const chunks = [];
  for (let i = 0; i < photos.length; i += 3) {
    chunks.push(photos.slice(i, i + 3));
  }

  return (
    <div className={styles.galleryContainer}>
      {chunks.map((chunk, index) => (
        <div key={index} className={styles.imageDiv}>
          <div className={styles.largeImageDiv}>
            {chunk[0] && (
              <Image
                width={200}
                height={200}
                className={styles.largeImage}
                preview={{ toolbarRender: () => null }}
                src={chunk[0].getUrl()}
              />
            )}
          </div>
          <div className={styles.smallImageDiv}>
            {chunk[1] && (
              <Image
                width={150}
                height={95}
                className={styles.smallImage}
                preview={{ toolbarRender: () => null }}
                src={chunk[1].getUrl()}
              />
            )}
            {chunk[2] && (
              <Image
                width={150}
                height={95}
                className={styles.smallImage}
                preview={{ toolbarRender: () => null }}
                src={chunk[2].getUrl()}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
