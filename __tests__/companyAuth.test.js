/**
 * @jest-environment node
 * @jest-environment-options {"customExportConditions":["node","node-addons"]}
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { registerCompany } from '../src/features/auth/authSlice';
import API from '../src/services/axios';

jest.mock('../src/services/axios', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { setItem: jest.fn(), getItem: jest.fn(), removeItem: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

test('registers a company through its endpoint and retains its session for subscription', async () => {
  const payload = {
    mobile: '9876543210', companyName: 'Test Company', contactPerson: 'Test Contact',
    state: 'Bihar', district: 'Patna', village: 'Patna', pincode: '800001',
    email: '', gstNumber: '', address: '',
  };
  const user = { _id: 'company-1', role: 'COMPANY', companyName: payload.companyName };
  API.post.mockResolvedValue({ data: { token: 'test-token', user } });
  const store = configureStore({ reducer: { auth: authReducer } });
  await store.dispatch(registerCompany(payload)).unwrap();
  expect(API.post).toHaveBeenCalledWith('/auth/register-company', payload);
  expect(store.getState().auth).toMatchObject({
    token: 'test-token', user, isRegistered: true, isAuthenticated: false, loading: false,
  });
});

test.each([
  [{ response: { data: { error: 'User already exists' } } }, 'User already exists'],
  [new Error('Network unavailable'), 'Company registration failed'],
])('handles company registration failures without authenticating', async (error, message) => {
  API.post.mockRejectedValue(error);
  const store = configureStore({ reducer: { auth: authReducer } });
  await expect(store.dispatch(registerCompany({})).unwrap()).rejects.toBe(message);
  expect(store.getState().auth).toMatchObject({
    error: message, loading: false, isAuthenticated: false, token: null,
  });
});
