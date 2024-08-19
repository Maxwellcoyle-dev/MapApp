/* global google */

import React, { useState, useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { MdFormatListBulleted, MdOutlineMap } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Components
import MapView from "../../MapComponent/Map/MapView";
import ListItem from "./ListItem/ListItem";
import FilterForm from "./FilterForm/FilterForm";

// Hooks
import useGetList from "../../../hooks/backend-hooks/useGetList";
import useGetPhotos from "../../../hooks/google-api-hooks/useGetPhotos";
import useListPlaces from "../../../hooks/backend-hooks/useListPlaces";
import useRemoveListPlace from "../../../hooks/backend-hooks/useRemoveListPlace";
import useAppUser from "../../../hooks/backend-hooks/useAppUser";

// state
import { useMapContext } from "../../../state/MapContext";

// Utilities
import {
  extractCategoryTags,
  extractPlaceTypes,
  extractVicinities,
  handleFilter,
} from "./FilterLogic";

// Styles
import styles from "./ListBodySection.module.css";

const ListBodySection = ({ listId, showFilterForm, setShowFilterForm }) => {
  const [placeIds, setPlaceIds] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const { center, setCenter, zoom, setZoom } = useMapContext();

  const map = useMap();

  const navigate = useNavigate();

  // Data
  const { appUser } = useAppUser();
  const { listData } = useGetList(listId);
  const { listPlacesData } = useListPlaces(listId);
  const { placesPhotos } = useGetPhotos(placeIds);

  // Mutations
  const { removeListPlaceMutation } = useRemoveListPlace();

  useEffect(() => {
    if (!map || isMapInitialized) return;

    if (listPlacesData?.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      listPlacesData.forEach((marker) => {
        bounds.extend({
          lat: marker.geometry.location.lat,
          lng: marker.geometry.location.lng,
        });
      });
      const paddingOptions = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      };
      map.panToBounds(bounds, paddingOptions);
      setIsMapInitialized(true); // Only set this once

      console.log("bounds: ", bounds);
      console.log("center: ", bounds.getCenter());
      console.log("zoom: ", map.getZoom());
      // Optionally set initial center and zoom
      setCenter(bounds.getCenter());
      setZoom(null);
    }
  }, [listPlacesData, map, setCenter, setZoom, isMapInitialized]);

  useEffect(() => {
    console.log("listPlacesData: ", listPlacesData);
    if (listPlacesData) {
      const placeIds = listPlacesData.map((place) => place.placeId);
      setPlaceIds(placeIds);
      setFilteredPlaces(listPlacesData); // Initialize filtered places
      setLoading(false);
    }
  }, [listPlacesData]);

  const vicinities = extractVicinities(listPlacesData || []);
  const categoryTags = extractCategoryTags(listPlacesData || []);
  const placeTypes = extractPlaceTypes(listPlacesData || []);

  const handleFilterFormSubmit = (newFilters) => {
    setFilters(newFilters);
    handleFilter(
      newFilters,
      listPlacesData,
      setFilteredPlaces,
      setShowFilterForm
    );
  };

  const handleSearch = (searchTerm) => {
    const newFilters = { ...filters, name: searchTerm };
    setFilters(newFilters);
    handleFilter(
      newFilters,
      listPlacesData,
      setFilteredPlaces,
      setShowFilterForm
    );
  };

  const clearFilters = () => {
    setFilters({});
    setFilteredPlaces(listPlacesData);
  };

  return (
    <div className={styles.listBodySection}>
      <div
        className={`${styles.filterFormContainer} ${
          showFilterForm ? "" : "collapsed"
        }`}
      >
        <FilterForm
          filters={filters}
          onFilter={handleFilterFormSubmit}
          categoryTags={categoryTags}
          placeTypes={placeTypes}
          vicinities={vicinities}
          showFilterForm={showFilterForm}
          setShowFilterForm={setShowFilterForm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
        />
      </div>
      <MapView markerList={filteredPlaces} showMap={showMap} page="list" />
      {!showMap && (
        <div className={styles.listItemContainer}>
          {filteredPlaces?.map((place, index) => {
            const photo = placesPhotos?.[index]?.find(
              (p) => p.width > p.height
            );

            const firstPhoto = photo ? photo.getUrl() : null;
            return (
              <ListItem
                key={place.placeId}
                place={place}
                firstPhoto={firstPhoto}
                navigate={navigate}
                removeListPlaceMutation={removeListPlaceMutation}
                listData={listData}
                appUser={appUser}
              />
            );
          })}
        </div>
      )}
      {showMap ? (
        <div
          className={styles.toggleButtonDiv}
          onClick={() => setShowMap(false)}
        >
          <MdFormatListBulleted className={styles.viewToggleIcon} />
        </div>
      ) : (
        <div
          className={styles.toggleButtonDiv}
          onClick={() => setShowMap(true)}
        >
          <MdOutlineMap className={styles.viewToggleIcon} />
        </div>
      )}
    </div>
  );
};

export default ListBodySection;
