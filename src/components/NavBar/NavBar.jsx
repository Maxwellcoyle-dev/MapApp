import React, { useEffect, useState } from "react";
import {
  MdOutlineExplore,
  MdFormatListBulleted,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import styles from "./NavBar.module.css";

const NavBar = ({ selectedMarker }) => {
  const [currentTab, setCurrentTab] = useState("/");
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    setCurrentTab(location.pathname);
  }, [location]);

  return (
    <div className={styles.navBar}>
      <button className={styles.button}>
        <Link to="/">
          <div
            className={
              currentTab === "/"
                ? styles.iconContainerSelected
                : styles.iconContainer
            }
          >
            <MdOutlineExplore className={styles.icon} />
          </div>
          <p className={styles.text}>Explore</p>
        </Link>
      </button>
      <button className={styles.button}>
        <Link to="/manager">
          <div
            className={
              currentTab === "/manager"
                ? styles.iconContainerSelected
                : styles.iconContainer
            }
          >
            <MdFormatListBulleted className={styles.icon} />
          </div>
          <p className={styles.text}>Lists</p>
        </Link>
      </button>
      <button className={styles.button}>
        <Link to="/my-account">
          <div
            className={
              currentTab === "/my-account"
                ? styles.iconContainerSelected
                : styles.iconContainer
            }
          >
            <MdOutlineAccountCircle className={styles.icon} />
          </div>
          <p className={styles.text}>Account</p>
        </Link>
      </button>
    </div>
  );
};

export default NavBar;
