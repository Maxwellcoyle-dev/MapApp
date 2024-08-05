// api.js
import axiosInstance from "./axiosInstance";

export const savePlace = async (placeData) => {
  const response = await axiosInstance.post("/place/", placeData);
  return response.data;
};

export const getPlace = async (placeId, userId) => {
  const response = await axiosInstance.get(`/place/${placeId}/user/${userId}`);
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

export const updatePlace = async (placeId, userId, placeData) => {
  const response = await axiosInstance.put(`/place/${placeId}`, {
    userId,
    placeData,
  });
  return response.data;
};
