import API from '../../services/axios';

export const companyError = error => {
  if (error?.response?.status === 404) {
    return 'This action is not available yet. Please try again later.';
  }
  return error?.response?.data?.error || error?.response?.data?.message || error?.description || error?.message || 'Unable to complete this action';
};

export const idOf = value => typeof value === 'string' ? value : value?._id || value?.id || '';
export const imageUri = value => typeof value === 'string' ? value : value?.url || value?.uri;

async function allPages(path, key) {
  const rows = [];
  let page = 1;
  let totalPages = 1;
  do {
    const { data } = await API.get(path, { params: { page, limit: 100 } });
    rows.push(...(data[key] || []));
    totalPages = Number(data.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);
  return rows;
}

export async function getCompanyProfile() {
  const { data } = await API.get('/auth/me');
  return data.user;
}
export const getCompanyBrands = () => allPages('/brands/my-brands', 'brands');
export async function getCompanyCategories() {
  const { data } = await API.get('/categories/categories-by-role', { params: { page: 1, limit: 100 } });
  return (Array.isArray(data) ? data : data.categories || []).map(category => ({ ...category, _id: idOf(category) }));
}
export async function getCompanyProducts() {
  try {
    return await allPages('/products/company/mine', 'products');
  } catch (error) {
    if (error?.response?.status !== 404) throw error;
    const [profile, products] = await Promise.all([
      getCompanyProfile(),
      allPages('/products', 'products'),
    ]);
    return products.filter(product =>
      idOf(product.companyBrand) === profile._id ||
      idOf(product.createdBy) === profile._id
    );
  }
}

export function appendCompanyImage(form, key, asset) {
  if (!asset?.uri || /^https?:/i.test(asset.uri)) return;
  form.append(key, { uri: asset.uri, type: asset.type || 'image/jpeg', name: asset.fileName || 'company-image.jpg' });
}
export function companyBrandForm(draft) {
  const form = new FormData();
  form.append('name', draft.name.trim());
  form.append('category', draft.category);
  appendCompanyImage(form, 'image', draft.image);
  return form;
}
export function companyProductForm(draft) {
  const form = new FormData();
  form.append('name', draft.name.trim());
  form.append('category', draft.category);
  if (draft.description?.trim()) form.append('description', draft.description.trim());
  (draft.images || []).forEach(asset => appendCompanyImage(form, 'images', asset));
  return form;
}
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };
export const saveCompanyBrand = (draft, id) => id
  ? API.put(`/brands/${id}`, companyBrandForm(draft), multipart)
  : API.post('/brands/create', companyBrandForm(draft), multipart);
export const deleteCompanyBrand = id => API.delete(`/brands/${id}`);
export const saveCompanyProduct = (draft, id) => id
  ? API.put(`/products/${id}`, companyProductForm(draft), multipart)
  : API.post('/products/create', companyProductForm(draft), multipart);
export const deleteCompanyProduct = id => API.delete(`/products/${id}`);
export async function getCompanyDealers() {
  const { data } = await API.get('/brands/my-dealers');
  return data.dealers || [];
}
export async function getCompanyDealerDetails(id) {
  const { data } = await API.get(`/brands/my-dealers/${id}`);
  return data.dealer || data;
}
export const assignCompanyDealer = mobile => API.post('/company/dealers', { mobile });
export const setCompanyDealerStatus = (id, status) => API.patch(`/company/dealers/${id}/status`, { status });
export const removeCompanyDealer = id => API.delete(`/company/dealers/${id}`);
export async function getCompanySubscription() {
  const { data } = await API.get('/subscription/history');
  return data;
}
export async function getCompanyPlans() {
  const { data } = await API.get('/subscription');
  return data;
}
export const startCompanyTrial = () => API.post('/subscription/skip-trial');
export async function createCompanyOrder(planId) {
  const { data } = await API.post('/subscription/create-order', { planId });
  return data;
}
export const verifyCompanyPayment = payload => API.post('/subscription/verify-payment', payload);
