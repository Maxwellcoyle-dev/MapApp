import React, { useState, useEffect } from "react";
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

  const navigate = useNavigate();

  // Data
  const { appUser } = useAppUser();
  const { listData } = useGetList(listId);
  const { listPlacesData } = useListPlaces(listId);
  const { placesPhotos } = useGetPhotos(placeIds);

  useEffect(() => {
    console.log("listId: ", listId);
    console.log("listData: ", listData);
  }, [listId, listData]);

  // Mutations
  const { removeListPlaceMutation } = useRemoveListPlace();

  useEffect(() => {
    console.log("listPlacesData: ", listPlacesData);
    if (listPlacesData) {
      const placeIds = listPlacesData.map((place) => place.placeId);
      console.log("placeIds: ", placeIds);
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
      <div className={styles.listItemContainer}>
        <MapView markerList={filteredPlaces} mapHeight={!showMap ? 0 : null} />
        {listData &&
          filteredPlaces?.map((place, index) => {
            console.log("place: ", place);
            const photo = placesPhotos?.[index]?.find(
              (p) => p.width > p.height
            );
            console.log("photo: ", photo);
            console.log("placesPhotos: ", placesPhotos);
            const firstPhoto = photo ? photo.getUrl() : null;
            return (
              <ListItem
                key={place.placeId.S}
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
    </div>
  );
};

export default ListBodySection;
