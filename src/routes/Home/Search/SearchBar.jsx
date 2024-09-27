// Libaries
import React, { useState } from "react";
import { Button } from "antd";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

// Components
import SearchNav from "./SearchNav/SearchNav";
import SearchTypeSwitch from "./SearchTypeSwitch";
import LocationSearchInput from "./LocationSearchInput/LocationSearchInput";
import GlobalSearchInput from "./GlobalSearchInput/GlobalSearchInput";
import LocationToggle from "./LocationToggle";
import AutoComplete from "./AutoComplete/AutoComplete";
import PlaceTypeSelector from "./PlaceTypeSelector/PlaceTypeSelector";
import RadiusSelect from "./RadiusSelect";

// State
import { useMapContext } from "../../../state/MapContext";
import { useSearchContext } from "../../../state/SearchContext";

// Styles
import styles from "./SearchBar.module.css";
const SearchBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { showMap } = useMapContext();
  const { globalSearch, nearby, autoCompleteResults } = useSearchContext();

  return (
    <div
      className={
        showMap ? styles.searchBarContainer_Map : styles.searchBarContainer_List
      }
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
        <div className={styles.searchOptions}>
          <RadiusSelect />
          <SearchTypeSwitch />
          {!nearby && <LocationSearchInput />}
        </div>
      )}
      <div className={styles.collapseButtonDiv}>
        <Button
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={!isCollapsed ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        />
      </div>
    </div>
  );
};

export default SearchBar;
