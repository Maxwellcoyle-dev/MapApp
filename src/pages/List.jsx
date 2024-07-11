import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// hooks
import useGetPlaceDetails from "../hooks/google-api-hooks/useGetPlaceDetails";

const List = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);

  return <div>List</div>;
};

export default List;
