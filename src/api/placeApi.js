// api.js
import axiosInstance from "./axiosInstance";

export const savePlace = async (placeData) => {
  const response = await axiosInstance.post("/place/", placeData);
  return response.data;
};

export const scanPlaces = async (listId) => {
  const response = await axiosInstance.get("/places/", {
    params: {
      listId,
    },
  });
  return response.data;
};
