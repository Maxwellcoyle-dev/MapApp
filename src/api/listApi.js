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

export const removePlace = async (listIds, placeId, userId) => {
  const response = await axiosInstance.put("/list/remove-place", {
    listIds,
    placeId,
    userId,
  });
  return response.data;
};

export const deleteList = async (listId, userId) => {
  const response = await axiosInstance.put(
    `/list/delete-list/${listId}/user/${userId}`
  );
  return response.data;
};
