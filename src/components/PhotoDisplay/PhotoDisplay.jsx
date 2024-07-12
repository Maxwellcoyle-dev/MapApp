import React from "react";
import { Carousel, Image, Row, Col } from "antd";
import styles from "./PhotoDisplay.module.css";

const PhotoDisplay = ({ placeData }) => {
  const preprocessImages = (photos) => {
    let groups = [];
    for (let i = 0; i < photos.length; i += 3) {
      let group = photos.slice(i, i + 3);
      groups.push(group);
    }
    return groups;
  };

  const imageGroups = preprocessImages(placeData.photos);

  const getColumnLayout = (group) => {
    if (group.length === 1) {
      return (
        <Col span={24} className={styles.singleCol}>
          <Image
            className={styles.mainImage}
            src={group[0].getUrl()}
            alt={placeData.name}
          />
        </Col>
      );
    } else if (group.length === 2) {
      return (
        <Col span={24} className={styles.doubleCol}>
          <Row className={styles.row}>
            <Col span={12} className={styles.rightCol}>
              <Image
                className={styles.mainImage}
                src={group[0].getUrl()}
                alt={placeData.name}
              />
            </Col>
            <Col span={12} className={styles.rightCol}>
              <Image
                className={styles.mainImage}
                src={group[1].getUrl()}
                alt={placeData.name}
              />
            </Col>
          </Row>
        </Col>
      );
    } else {
      const tallestIndex = group.reduce(
        (maxIndex, photo, index, arr) =>
          photo.height / photo.width >
          arr[maxIndex].height / arr[maxIndex].width
            ? index
            : maxIndex,
        0
      );
      const tallestPhoto = group[tallestIndex];
      const otherPhotos = group.filter((_, index) => index !== tallestIndex);

      return (
        <>
          <Col span={12} className={styles.leftCol}>
            <Image
              className={styles.mainImage}
              src={tallestPhoto.getUrl()}
              alt={placeData.name}
            />
          </Col>
          <Col span={12} className={styles.rightCol}>
            {otherPhotos.map((photo, thumbIndex) => (
              <Image
                key={thumbIndex}
                className={styles.thumbnail}
                src={photo.getUrl()}
                alt={placeData.name}
              />
            ))}
          </Col>
        </>
      );
    }
  };

  return (
    <Carousel className={styles.carousel}>
      {imageGroups.map((group, index) => (
        <div key={index}>
          <div className={styles.photoDisplay}>
            <Row className={styles.row}>{getColumnLayout(group)}</Row>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default PhotoDisplay;
