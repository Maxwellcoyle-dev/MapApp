import React, { useState, useContext } from "react";

import { GoogleMapsAPIContext } from "../../context/GoogleMapsAPIProvider";

const PlacesComponent = ({ places, isLoading, error }) => {
  const [input, setInput] = useState("");
  const { setQuery } = useContext(GoogleMapsAPIContext);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for places"
      />
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
