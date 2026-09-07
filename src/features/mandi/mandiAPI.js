import axios from 'axios';

const GOV_API = 'https://api.data.gov.in/resource';
const GOV_RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070';
const GOV_KEY = '579b464db66ec23bdd000001f27d1e78757f4556420c6a48b1aa21a3';

export async function getMandiPrices({ state, district, market, commodity } = {}) {
  const params = { 'api-key': GOV_KEY, format: 'json', limit: 20, offset: 0 };
  if (state) params['filters[state]'] = state;
  if (district) params['filters[district]'] = district;
  if (market) params['filters[market]'] = market;
  if (commodity) params['filters[commodity]'] = commodity;
  const response = await axios.get(`${GOV_API}/${GOV_RESOURCE}`, { params });
  return response.data?.records || [];
}

export async function getMandiMarkets({ state, district } = {}) {
  const params = { 'api-key': GOV_KEY, format: 'json', limit: 10000, offset: 0 };
  if (state) params['filters[state]'] = state;
  if (district) params['filters[district]'] = district;
  const response = await axios.get(`${GOV_API}/${GOV_RESOURCE}`, { params });
  const records = response.data?.records || [];
  return [...new Set(records.map(item => item.market).filter(Boolean))].map((name, index) => ({ id: `${name}-${index}`, name }));
}
export async function getMandiCommodities(filters = {}) {
  const params = { 'api-key': GOV_KEY, format: 'json', limit: 10000, offset: 0 };
  if (filters.state) params['filters[state]'] = filters.state;
  if (filters.district) params['filters[district]'] = filters.district;
  if (filters.market) params['filters[market]'] = filters.market;
  const response = await axios.get(`${GOV_API}/${GOV_RESOURCE}`, { params });
  return [...new Set((response.data?.records || []).map(item => item.commodity).filter(Boolean))].sort();
}

export const mandiError = error => error?.response?.data?.error || error?.message || 'Unable to load mandi prices';
