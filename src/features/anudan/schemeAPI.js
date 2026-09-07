import API from '../../services/axios';
export async function getPublicSchemes(page = 1, limit = 9) { const { data } = await API.get('/schemes', { params: { page, limit } }); return { schemes: data?.schemes || [], pagination: data?.pagination || {} }; }
export async function getPublicScheme(slug) { try { const { data } = await API.get(`/schemes/slug/${encodeURIComponent(slug)}`); return data?.scheme || data; } catch (error) { const { data } = await API.get(`/schemes/${encodeURIComponent(slug)}`); return data?.scheme || data; } }
