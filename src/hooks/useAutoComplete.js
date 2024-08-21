// State
import { useSearchContext } from "../state/SearchContext";

// Hooks
import useListPlaces from "./backend-hooks/useListPlaces";
import useGoogleAutocomplete from "./google-api-hooks/useGoogleAutocomplete";
import useAppUser from "./backend-hooks/useAppUser";

const useAutoComplete = () => {
  const { setAutoCompleteResults, setQueryInput, setSearchQuery } =
    useSearchContext();
  const { appUser } = useAppUser();
  const { allListsData } = useListPlaces(appUser?.data.userId);

  const handleGoogleAutoComplete = useGoogleAutocomplete();

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setQueryInput(inputValue);

    if (inputValue === "") {
      setAutoCompleteResults([]);
      return;
    }

    // Fetch Google autocomplete results
    const googleResults = await handleGoogleAutoComplete(inputValue);
    console.log("google results -- ", googleResults);

    // Search saved places
    const savedPlaceResults = searchSavedPlaces(allListsData, inputValue);
    console.log("saved place results -- ", savedPlaceResults);

    const transformedSavedPlaceResults = savedPlaceResults.map((place) =>
      transformSavedPlaceToAutocompleteFormat(place)
    );
    console.log(
      "transformed saved place results -- ",
      transformedSavedPlaceResults
    );

    // Combine Google and saved places results
    const combinedResults = [
      ...transformedSavedPlaceResults,
      ...googleResults,
    ].slice(0, 10); // Limiting to top 5 results

    setAutoCompleteResults(combinedResults);
  };

  return handleInputChange;
};

export default useAutoComplete;

const transformSavedPlaceToAutocompleteFormat = (place) => {
  return {
    description: `${place.placeName}, ${place.vicinity}`, // Construct the description
    place_id: place.placeId,
    reference: place.placeId,
    structured_formatting: {
      main_text: place.placeName,
      secondary_text: place.formatted_address || place.vicinity || "", // Use vicinity or address as secondary text
    },
    types: place.types ? Object.values(place.types) : ["establishment"], // Fallback to a default type if types are missing
    listName: place.listName, // Preserve the list name for later reference if needed
    source: "saved", // Indicate that this is a saved place
  };
};

// Function to search through saved places
const searchSavedPlaces = (listsData, query) => {
  const results = [];
  listsData?.forEach((list) => {
    list?.places.forEach((place) => {
      if (place.placeName.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          ...place,
          listName: list.listName, // Include the list name for reference
        });
      }
    });
  });

  return results.slice(0, 5); // Return top 5 saved places
};
