import API from "../../services/axios";

export const getProductByIdAPI = ({
  productId,
  lat,
  lng,
  role,
}) => {

  let url = `/products/${productId}`;

  if (lat !== undefined &&
    lng !== undefined
  ) {
    url += `?lat=${lat}&lng=${lng}`;
  }

  return API.get(url);
};

export const createProductAPI = (formData) => {
  return API.post("/products/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// UPDATE PRODUCT
export const updateProductAPI = (id, formData) => {
  return API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
