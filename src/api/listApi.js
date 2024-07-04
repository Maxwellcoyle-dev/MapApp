// api.js
import axiosInstance from "./axiosInstance";

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

export const updateList = async (listData) => {
  const response = await axiosInstance.put("/list/", listData);
  return response.data;
};
