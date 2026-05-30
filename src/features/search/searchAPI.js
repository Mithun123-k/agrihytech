import API from "../../services/axios";

// 🔹 Search Products / Brands / Categories
export const searchAPI = async (query) => {
  const response = await API.get(
    `/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
};