export const extractPlaceTypes = (placesData) => {
  const types = placesData.flatMap((place) => place.types?.SS);
  return [...new Set(types)]; // Remove duplicates
};

export const extractVicinities = (placesData) => {
  console.log("placesData", placesData);
  const vicinities = placesData.map((place) => {
    const vicinity = place.vicinity?.split(", ").pop();
    return vicinity;
  });
  return [...new Set(vicinities)]; // Remove duplicates
};

export const extractCategoryTags = (placesData) => {
  return placesData.reduce((acc, place) => {
    place.tags?.forEach((tag) => {
      const categoryName = tag.categoryName;
      const tagName = tag.tagName;
      const tagId = tag.tagId;
      const categoryId = tag.categoryId;

      if (!acc[categoryName]) {
        acc[categoryName] = { categoryId, tags: [] };
      }

      acc[categoryName].tags.push({ tagName, tagId });
    });
    return acc;
  }, {});
};

export const handleFilter = (
  filters,
  listPlacesData,
  setFilteredPlaces,
  setShowFilterForm
) => {
  let filtered = listPlacesData;

  console.log("Applying filters:", filters);

  if (filters.name) {
    filtered = filtered.filter((place) =>
      place.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.rating) {
    filtered = filtered.filter((place) => place?.rating >= filters.rating);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((place) =>
      filters.tags.every((tag) => place.tags?.some((t) => t.tagId === tag))
    );
  }

  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((place) =>
      filters.types.every((type) => place.types?.includes(type))
    );
  }

  if (filters.vicinity) {
    filtered = filtered.filter((place) =>
      place.vicinity?.includes(filters.vicinity)
    );
  }

  console.log("Filtered places:", filtered);
  setFilteredPlaces(filtered);
  setShowFilterForm(false);
};
