import API from "../../services/axios";

export const getCategoriesAPI = () => {
  return API.get("/categories"); // your route
};

export const getPublicCategoriesAPI = () => {
  return API.get("/categories/public");
};


export const getmyCategoriesAPI = () => {
  return API.get("/categories/my-categories"); // your route
};

// 🔥 NEW (brands by category)
export const getBrandsByCategoryAPI = (categoryId, page = 1, isAdmin = false) => {
  return API.get(`/categories/${categoryId}/brands?page=${page}&limit=10&isAdmin=${isAdmin}`);
};

export const getMyBrandsByCategoryAPI = (categoryId, page = 1) => {
  return API.get(`/categories/${categoryId}/my-brands?page=${page}&limit=10`);
};

export const getProductsByBrandAPI = (productId, page = 1) => {
  return API.get(`/brands/product/${productId}/brands`);
  // brands/product/69fda7c09aaffa99c673a45d/brands
};