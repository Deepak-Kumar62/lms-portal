import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://my-lms-portal.onrender.com/api",
  withCredentials: true,
});


export default axiosInstance;
