import api from './api';

export const runCollaboratorApi = async (data) => {
  return await api.post('/agents/collaborator', data);
};

export const runLitReviewApi = async (data) => {
  return await api.post('/agents/lit-review', data);
};

export const runHackathonMentorApi = async (data) => {
  return await api.post('/agents/hackathon-mentor', data);
};

export const runSkillPathApi = async (data) => {
  return await api.post('/agents/skill-path', data);
};

export const getSkillPathActiveApi = async () => {
  return await api.get('/agents/skill-path/active');
};

export const getAllSkillPathsApi = async () => {
  return await api.get('/agents/skill-path/all');
};

export const toggleSkillPathTaskApi = async (data) => {
  return await api.post('/agents/skill-path/toggle-task', data);
};

export const toggleResourceBookmarkApi = async (data) => {
  return await api.post('/agents/skill-path/toggle-resource-bookmark', data);
};

export const toggleResourceCompleteApi = async (data) => {
  return await api.post('/agents/skill-path/toggle-resource-complete', data);
};

export const renameSkillPathApi = async (id, data) => {
  return await api.put(`/agents/skill-path/${id}/rename`, data);
};

export const duplicateSkillPathApi = async (id) => {
  return await api.post(`/agents/skill-path/${id}/duplicate`);
};

export const deleteSkillPathApi = async (id) => {
  return await api.delete(`/agents/skill-path/${id}`);
};

export const selectActiveSkillPathApi = async (id) => {
  return await api.post(`/agents/skill-path/${id}/select-active`);
};

export const runSprintFlowApi = async (data) => {
  return await api.post('/agents/sprint-flow', data);
};

export const getSprintFlowActiveApi = async (params = {}) => {
  return await api.get('/agents/sprint-flow/active', { params });
};

export const getAllSprintPlansApi = async () => {
  return await api.get('/agents/sprint-flow/all');
};

export const updateTaskStatusApi = async (data) => {
  return await api.post('/agents/sprint-flow/update-task-status', data);
};

export const editTaskApi = async (data) => {
  return await api.put('/agents/sprint-flow/edit-task', data);
};

export const deleteTaskApi = async (data) => {
  return await api.post('/agents/sprint-flow/delete-task', data);
};

export const renameSprintPlanApi = async (id, data) => {
  return await api.put(`/agents/sprint-flow/${id}/rename`, data);
};

export const duplicateSprintPlanApi = async (id) => {
  return await api.post(`/agents/sprint-flow/${id}/duplicate`);
};

export const deleteSprintPlanApi = async (id) => {
  return await api.delete(`/agents/sprint-flow/${id}`);
};

export const selectActiveSprintPlanApi = async (id) => {
  return await api.post(`/agents/sprint-flow/${id}/select-active`);
};

export const runPlacementPrepApi = async (data) => {
  return await api.post('/agents/placement-prep', data);
};

export const evaluateInterviewAnswerApi = async (data) => {
  return await api.post('/agents/placement-prep/evaluate-answer', data);
};

export const getPlacementHistoryApi = async () => {
  return await api.get('/agents/placement-prep/history');
};

export const retryInterviewSessionApi = async (id) => {
  return await api.post(`/agents/placement-prep/${id}/retry`);
};

export const deleteInterviewSessionApi = async (id) => {
  return await api.delete(`/agents/placement-prep/${id}`);
};

export const sendWeakSkillsToSkillPathApi = async (data) => {
  return await api.post('/agents/placement-prep/send-to-skillpath', data);
};

export const runMultiAgentPipelineApi = async (data) => {
  return await api.post('/agents/pipeline', data);
};

export const getHistoryApi = async () => {
  return await api.get('/history');
};

export const getAnalyticsApi = async () => {
  return await api.get('/analytics');
};
