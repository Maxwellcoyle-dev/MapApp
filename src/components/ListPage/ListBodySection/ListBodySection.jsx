import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import ListItem from "./ListItem/ListItem";
import FilterForm from "./FilterForm/FilterForm";

// Hooks
import useGetList from "../../../hooks/backend-hooks/useGetList";
import useGetPhotos from "../../../hooks/google-api-hooks/useGetPhotos";
import useListPlaces from "../../../hooks/backend-hooks/useListPlaces";
import useRemoveListPlace from "../../../hooks/backend-hooks/useRemoveListPlace";
import useUser from "../../../hooks/backend-hooks/useUser";

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

  const navigate = useNavigate();

  // Data
  const { authUser } = useUser();
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
      const placeIds = listPlacesData.map((place) => place.placeId.S);
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
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.listItemContainer}>
          {listData && !filteredPlaces.length && (
            <div className={styles.noDataMessage}>No places in this list.</div>
          )}
          {listData &&
            filteredPlaces.map((place, index) => {
              console.log("place: ", place);
              console.log("placesPhotos: ", placesPhotos);
              const photo = placesPhotos?.[index]?.find(
                (p) => p.width > p.height
              );
              const firstPhoto = photo ? photo.getUrl() : null;
              return (
                <ListItem
                  key={place.placeId.S}
                  place={place}
                  firstPhoto={firstPhoto}
                  navigate={navigate}
                  removeListPlaceMutation={removeListPlaceMutation}
                  listData={listData}
                  authUser={authUser}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ListBodySection;
