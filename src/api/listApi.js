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

export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(`/user/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/user/${userId}`);
  return response.data;
};
