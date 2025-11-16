import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// // Global Error Handler
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const msg = error?.response?.data?.message || "Something went wrong!";
//     toast.error(msg);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
