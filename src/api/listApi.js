// api.js
import axiosInstance from "./axiosInstance";

export const getList = async (listId) => {
  const response = await axiosInstance.get(`/list/${listId}`);
  return response.data;
};

export const scanLists = async (userId) => {
  const response = await axiosInstance.get(`/lists/`, {
    params: {
      userId,
    },
  });
  return response.data;
};

export const createList = async (listData) => {
  const response = await axiosInstance.post("/list/", listData);
  return response.data;
};

export const updateList = async (listId, listData) => {
  const response = await axiosInstance.put(`/list/${listId}`, listData);
  return response.data;
};

export const removePlace = async (listId, placeId, userId) => {
  const response = await axiosInstance.put(
    `/list/${listId}/remove-place/${placeId}/user/${userId}`
  );
  return response.data;
};
