import api from './api';

export const loginUserApi = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const registerUserApi = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const getMeApi = async () => {
  return await api.get('/auth/me');
};
