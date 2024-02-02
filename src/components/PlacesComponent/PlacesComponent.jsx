import React, { useState } from "react";
import { usePlacesSearch } from "../../hooks/usePlacesSearch";

const PlacesComponent = () => {
  const [searchInBounds, setSearchInBounds] = React.useState(false);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const {
    data: places,
    isLoading,
    error,
  } = usePlacesSearch(query, searchInBounds);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for places"
      />
      <label>
        <input
          type="checkbox"
          checked={searchInBounds}
          onChange={() => setSearchInBounds(!searchInBounds)}
        />
        Search within current map view
      </label>
      <button onClick={() => setQuery(input)}>Search</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {places &&
          places.map((place, index) => <li key={index}>{place.name}</li>)}
      </ul>
    </div>
  );
};

export default PlacesComponent;
