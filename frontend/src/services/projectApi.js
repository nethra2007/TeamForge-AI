import api from './api';

export const getProjectsApi = async () => {
  return await api.get('/projects');
};

export const createProjectApi = async (projectData) => {
  return await api.post('/projects', projectData);
};
