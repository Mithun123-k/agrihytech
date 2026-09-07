import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  // baseURL:"https://agrihytech-2zx4j.ondigitalocean.app/api", // 🔥 change this
  // baseURL:"http://10.0.2.2:8000/api",
  baseURL: "https://api.agrihitechkisan.in/api",
  timeout: 10000,
});

API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) await AsyncStorage.removeItem("token");
    return Promise.reject(err);
  }
);

export default API;
