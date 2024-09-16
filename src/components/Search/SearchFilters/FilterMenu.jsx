import React, { useState, useEffect } from "react";
import { Radio, Switch, Input } from "antd";
import { MdOutlineLocationOn } from "react-icons/md";
import { useMap } from "@vis.gl/react-google-maps";

// State
import { useSearchContext } from "../../../state/SearchContext";
import { useMapContext } from "../../../state/MapContext";

// Hooks
import useGetCoordsLocality from "../../../hooks/google-api-hooks/useGetCoordsLocality";

const searchTypeOptions = [
  { label: "Place", value: "places" },
  { label: "Type", value: "type" },
];

const FilterMenu = () => {
  const { userLocation } = useMapContext();
  const map = useMap();
  const {
    setSearchLocation,
    searchLocation,
    searchType,
    setSearchType,
    nearby,
    setNearby,
  } = useSearchContext();

  const { getCoordsLocality } = useGetCoordsLocality();

  useEffect(() => {
    if (nearby) {
      const getLocality = async () => {
        const locality = await getCoordsLocality(userLocation);
        setSearchLocation({
          coords: userLocation,
          locality: locality,
        });

        map?.setCenter(userLocation);
      };
      getLocality();
    } else {
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
            <p>{searchLocation?.locality}</p>
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
