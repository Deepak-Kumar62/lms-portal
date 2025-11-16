import axiosInstance from "@/axiosInstance";

export const registerUser = async (data) => {
  return await axiosInstance.post("/auth/register", data);
};

export const loginUser = async (data) => {
  return await axiosInstance.post("/auth/login", data, {
    withCredentials: true,
  });
};

export const logoutUser = async () => {
  return await axiosInstance.post("/auth/logout", { withCredentials: true });
};

export const checkAuth = async () => {
  return await axiosInstance.get("/auth/check", { withCredentials: true });
};
