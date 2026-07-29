const express = require('express');
const router = express.Router();
const {
  handleCollaboratorAgent,
  handleLitReviewAgent,
  handleHackathonMentorAgent,
  handleSkillPathAgent,
  handleGetActiveSkillPath,
  handleGetAllSkillPaths,
  handleToggleSkillPathTask,
  handleToggleResourceBookmark,
  handleToggleResourceComplete,
  handleRenameSkillPath,
  handleDuplicateSkillPath,
  handleDeleteSkillPath,
  handleSelectActiveSkillPath,
  handleSprintFlowAgent,
  handleGetActiveSprintPlan,
  handleGetAllSprintPlans,
  handleUpdateTaskStatus,
  handleEditTask,
  handleDeleteTask,
  handleRenameSprintPlan,
  handleDuplicateSprintPlan,
  handleDeleteSprintPlan,
  handleSelectActiveSprintPlan,
  handlePlacementPrepAgent,
  handleEvaluateInterviewAnswer,
  handleGetPlacementHistory,
  handleRetryInterviewSession,
  handleDeleteInterviewSession,
  handleSendWeakSkillsToSkillPath,
  handleMultiAgentPipeline
} = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/collaborator', protect, handleCollaboratorAgent);
router.post('/lit-review', protect, handleLitReviewAgent);
router.post('/hackathon-mentor', protect, handleHackathonMentorAgent);

// SkillPath AI LMS Endpoints
router.post('/skill-path', protect, handleSkillPathAgent);
router.get('/skill-path/active', protect, handleGetActiveSkillPath);
router.get('/skill-path/all', protect, handleGetAllSkillPaths);
router.post('/skill-path/toggle-task', protect, handleToggleSkillPathTask);
router.post('/skill-path/toggle-resource-bookmark', protect, handleToggleResourceBookmark);
router.post('/skill-path/toggle-resource-complete', protect, handleToggleResourceComplete);
router.put('/skill-path/:id/rename', protect, handleRenameSkillPath);
router.post('/skill-path/:id/duplicate', protect, handleDuplicateSkillPath);
router.delete('/skill-path/:id', protect, handleDeleteSkillPath);
router.post('/skill-path/:id/select-active', protect, handleSelectActiveSkillPath);

// SprintFlow AI LMS Endpoints
router.post('/sprint-flow', protect, handleSprintFlowAgent);
router.get('/sprint-flow/active', protect, handleGetActiveSprintPlan);
router.get('/sprint-flow/all', protect, handleGetAllSprintPlans);
router.post('/sprint-flow/update-task-status', protect, handleUpdateTaskStatus);
router.put('/sprint-flow/edit-task', protect, handleEditTask);
router.post('/sprint-flow/delete-task', protect, handleDeleteTask);
router.put('/sprint-flow/:id/rename', protect, handleRenameSprintPlan);
router.post('/sprint-flow/:id/duplicate', protect, handleDuplicateSprintPlan);
router.delete('/sprint-flow/:id', protect, handleDeleteSprintPlan);
router.post('/sprint-flow/:id/select-active', protect, handleSelectActiveSprintPlan);

// PlacementPrep AI Interview Platform Endpoints
router.post('/placement-prep', protect, handlePlacementPrepAgent);
router.post('/placement-prep/evaluate-answer', protect, handleEvaluateInterviewAnswer);
router.get('/placement-prep/history', protect, handleGetPlacementHistory);
router.post('/placement-prep/:id/retry', protect, handleRetryInterviewSession);
router.delete('/placement-prep/:id', protect, handleDeleteInterviewSession);
router.post('/placement-prep/send-to-skillpath', protect, handleSendWeakSkillsToSkillPath);

router.post('/pipeline', protect, handleMultiAgentPipeline);

module.exports = router;
