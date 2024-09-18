import React, { useEffect } from "react";
import { Radio, Switch } from "antd";
import { MdOutlineLocationOn } from "react-icons/md";
import { useMap } from "@vis.gl/react-google-maps";

// State
import { useSearchContext } from "../../../state/SearchContext";
import { useMapContext } from "../../../state/MapContext";

const searchTypeOptions = [
  { label: "Place", value: "places" },
  { label: "Type", value: "type" },
];

const FilterMenu = () => {
  const { userLocation, userLocality } = useMapContext();
  const map = useMap();
  const {
    setLocationQueryInput,
    setLocationAutoCompleteResults,
    setSearchLocation,
    searchLocation,
    searchType,
    setSearchType,
    nearby,
    setNearby,
  } = useSearchContext();

  useEffect(() => {
    if (nearby) {
      setSearchLocation({
        coords: userLocation,
        locality: userLocality,
      });

      map?.setCenter(userLocation);
    } else {
      setLocationQueryInput("");
      setLocationAutoCompleteResults([]);
      setSearchLocation({
        coords: null,
        locality: null,
      });
    }
  }, [nearby]);

  useEffect(() => {
    console.log("Search location: ", searchLocation);
  }, [searchLocation]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Radio.Group
          options={searchTypeOptions}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          optionType="button"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid gray",
            padding: ".5rem",
            borderRadius: ".5rem",
            gap: ".25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <MdOutlineLocationOn />
            <p style={{ 
              maxWidth: "150px", 
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis" 
            }}>
              {searchLocation?.locality ? 
                (searchLocation.locality.length > 15 
                  ? searchLocation.locality.slice(0, 15) + '...' 
                  : searchLocation.locality
                ) 
                : ''
              }
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <h4>Nearby</h4>
            <Switch
              checked={nearby}
              onChange={(checked) => {
                setNearby(checked);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterMenu;
