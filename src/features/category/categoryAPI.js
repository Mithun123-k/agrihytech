import API from "../../services/axios";

export const getCategoriesAPI = () => {
  return API.get("/categories"); // your route
};

export const getCategoriesByRoleAPI = () => {
  return API.get("categories/categories-by-role");
};

export const getPublicCategoriesAPI = () => {
  return API.get("/categories/public");
};


export const getmyCategoriesAPI = () => {
  return API.get("/categories/my-categories"); // your route
};

export const getSubCategoriesAPI = categoryId =>
  API.get('/subcategories', { params: { categoryId } });

export const saveAdminCategoryAPI = (form, id) => id
  ? API.put(`/categories/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  : API.post('/categories/create', form, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteAdminCategoryAPI = id => API.delete(`/categories/${id}`);

export const saveAdminSubCategoryAPI = (form, id) => id
  ? API.put(`/subcategories/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  : API.post('/subcategories', form, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteAdminSubCategoryAPI = id => API.delete(`/subcategories/${id}`);

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
