// Libaries
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

// Components
import SearchNav from "./components/SearchNav/SearchNav";
import SearchTypeSwitch from "./components/SearchTypeSwitch";
import LocationSearchInput from "./components/LocationSearchInput/LocationSearchInput";
import GlobalSearchInput from "./components/GlobalSearchInput/GlobalSearchInput";
import LocationToggle from "./components/LocationToggle";
import AutoComplete from "./components/AutoComplete/AutoComplete";
import PlaceTypeSelector from "./components/PlaceTypeSelector/PlaceTypeSelector";
import RadiusSelect from "./components/RadiusSelect";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";

// Hooks
import useGetUserLocation from "../../../hooks/useGetUserLocation";

// Styles
import styles from "./Search.module.css";

const Search = ({ searchRef, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { showMap } = useMapContext();
  const { globalSearch, nearby, autoCompleteResults } = useSearchContext();

  const { getUserLocation, loading, error } = useGetUserLocation();

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
    // Call onToggle after a short delay to ensure the DOM has updated
    setTimeout(() => onToggle(isCollapsed), 0);
  };

  useEffect(() => {
    if (showMap) {
      setIsCollapsed(true);
    }
  }, [showMap]);

  useEffect(() => {
    // Trigger onToggle whenever isCollapsed changes
    onToggle(isCollapsed);
  }, [isCollapsed, onToggle]);

  return (
    <div
      className={`${styles.searchBarContainer} ${
        isCollapsed ? styles.collapsed : ""
      }`}
      ref={searchRef}
    >
      <SearchNav />
      <LocationToggle />
      {globalSearch && (
        <div style={{ width: "100%" }}>
          <GlobalSearchInput />
          {autoCompleteResults.length > 0 && (
            <div>
              <AutoComplete />
            </div>
          )}
        </div>
      )}
      {!globalSearch && (
        <>
          <PlaceTypeSelector />
        </>
      )}
      {!isCollapsed && (
        <>
          <div className={styles.searchOptions}>
            <RadiusSelect />
            <SearchTypeSwitch />
          </div>
          {!nearby && <LocationSearchInput />}
        </>
      )}
      <div className={styles.collapseButtonDiv}>
        <div className={styles.collapseButton} onClick={handleToggle}>
          {!isCollapsed ? (
            <MdKeyboardArrowUp className={styles.collapseButtonIcon} />
          ) : (
            <MdKeyboardArrowDown className={styles.collapseButtonIcon} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
