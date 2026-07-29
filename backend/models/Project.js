const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, default: 'Web & AI' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  techStack: [{ type: String }],
  architectureSummary: { type: String, default: '' },
  elevatorPitch: { type: String, default: '' },
  readmeContent: { type: String, default: '' },
  status: { type: String, enum: ['Ideation', 'In Progress', 'Completed'], default: 'Ideation' },
  sprintPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'SprintPlan' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
