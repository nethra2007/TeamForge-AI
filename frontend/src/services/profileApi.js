import api from './api';

export const updateProfileApi = async (profileData) => {
  return await api.put('/profile', profileData);
};
