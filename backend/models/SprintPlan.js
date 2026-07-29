const mongoose = require('mongoose');

const kanbanTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignee: { type: String, default: 'Unassigned' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  estimatedHours: { type: Number, default: 8 },
  dueDate: { type: String, default: '' },
  acceptanceCriteria: [{ type: String }],
  suggestedDoc: { type: String, default: '' },
  starterCode: { type: String, default: '' },
  aiExplanation: { type: String, default: '' },
  aiSteps: [{ type: String }],
  aiRecommendedLibs: [{ type: String }],
  folderStructure: { type: String, default: '' },
  aiChallenges: [{ type: String }],
  aiEstimatedTime: { type: String, default: '' }
}, { _id: false });

const sprintSchema = new mongoose.Schema({
  sprintNumber: { type: Number, required: true },
  sprintGoal: { type: String, required: true },
  durationWeeks: { type: Number, default: 1 },
  tasks: [kanbanTaskSchema]
}, { _id: false });

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: { type: String, required: true },
  deliverables: [{ type: String }],
  completed: { type: Boolean, default: false }
}, { _id: false });

const sprintPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, default: '' },
  domain: { type: String, default: 'Software Engineering' },
  deadline: { type: String, default: '4 Weeks' },
  totalDurationWeeks: { type: Number, default: 4 },
  teamSize: { type: Number, default: 4 },
  techStack: { type: String, default: '' },
  sprints: [sprintSchema],
  milestones: [milestoneSchema],
  velocityScore: { type: Number, default: 90 },
  projectHealthScore: { type: Number, default: 92 },
  riskLevel: { type: String, enum: ['Low Risk', 'Moderate Risk', 'High Risk'], default: 'Low Risk' },
  estimatedCompletionDate: { type: String, default: '' },
  overallProgress: { type: Number, default: 0 },
  completedTasksCount: { type: Number, default: 0 },
  totalTasksCount: { type: Number, default: 0 },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('SprintPlan', sprintPlanSchema);
