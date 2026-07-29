import api from './api';

export const getTeamsApi = async () => {
  return await api.get('/teams');
};

export const createTeamApi = async (teamData) => {
  return await api.post('/teams', teamData);
};
