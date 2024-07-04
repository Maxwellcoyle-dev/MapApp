// api.js
import axiosInstance from "./axiosInstance";

export const savePlace = async (placeData) => {
  const response = await axiosInstance.post("/place/", placeData);
  return response.data;
};
