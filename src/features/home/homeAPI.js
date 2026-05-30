import API from "../../services/axios";

// 🔹 Get Home Data
export const getHomeAPI = () => {
  return API.get("/home"); // 👈 your backend route
};

// 🔹 Get User Home Data
export const getUserHomeAPI = () => {
  return API.get("/home/user"); // 👈 your backend route
};