const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'Documentation' },
  platform: { type: String, default: 'Trusted Platform' },
  bookmarked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['Simple', 'Medium', 'Advanced'], default: 'Medium' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  xp: { type: Number, default: 20 }
}, { _id: false });

const weeklyPlanSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  focusSkills: [{ type: String }],
  progress: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  isUnlocked: { type: Boolean, default: true },
  tasks: [taskSchema],
  resources: [resourceSchema]
}, { _id: false });

const learningPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentSkills: [{ type: String }],
  targetCareer: { type: String, required: true },
  missingSkills: [{ type: String }],
  estimatedDuration: { type: String, default: '4 Weeks' },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
  userXP: { type: Number, default: 0 },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  overallProgress: { type: Number, default: 0 },
  estimatedCompletionDate: { type: String, default: '' },
  weeklyRoadmap: [weeklyPlanSchema],
  recommendedCourses: [{
    name: String,
    provider: String,
    url: String,
    level: String
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningPlan', learningPlanSchema);
