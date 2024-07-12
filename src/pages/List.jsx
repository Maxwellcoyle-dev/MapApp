import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "antd";

// hooks
import useGetPlaceDetails from "../hooks/google-api-hooks/useGetPlaceDetails";

const List = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state) {
      console.log(state);
    }
  }, [state]);

  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);

  return (
    <div>
      <h1>{state.listName.S}</h1>
      {state.description?.S ? (
        <p> "Add description"</p>
      ) : (
        <Button>Add description</Button>
      )}
    </div>
  );
};

export default List;
