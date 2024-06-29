import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://4fg07ip4a5.execute-api.us-east-2.amazonaws.com/dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
