import API from "../../services/axios";

// 🔥 Get All Brands
export const getAllBrandsAPI = (page = 1, search = "") => {
  return API.get(`/brands`);
};

export const getProductsByBrandAPI = (brandId, page = 1) => {
  return API.get(`/brands/${brandId}/products`);
};

export const getProductsByCategoryAPI = (categoryId, page = 1) => {
  return API.get(`/products/user/${categoryId}`);
}

export const getMyProductsByBrandAPI = (brandId, page = 1) => {
  return API.get(`/brands/${brandId}/my-products?page=${page}&limit=10`);
};

// 🔥 Get My Brands
export const getMyBrandsAPI = (page = 1, search = "") => {
  return API.get(
    `/brands/my-brands?page=${page}&limit=10&search=${search}`
  );
};

// Create brand
export const createBrandAPI = (formData) => {
  return API.post("/brands/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update brand
export const updateBrandAPI = (id, formData) => {
  return API.put(`/brands/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductAPI = async (productId) => {
  return await API.delete(`/products/${productId}`);
};
