import React from "react";

// Components
import Menu from "./Menu";

import styles from "./SearchNav.module.css";

import logo from "../../../../../assets/mapapp-logo-v2-192.png";

const SearchNav = () => {
  return (
    <div className={styles.searchMenu}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="App Logo" className={styles.logo} />
        <p className={styles.appName}>Foodie Map App</p>
      </div>
      <Menu />
    </div>
  );
};

export default SearchNav;
