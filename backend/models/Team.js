const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  college: { type: String, default: '' },
  role: { type: String, required: true },
  skills: [{ type: String }],
  compatibilityScore: { type: Number, default: 85 },
  reason: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' }
}, { _id: false });

const teamSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectDescription: { type: String, default: '' },
  domain: { type: String, required: true },
  requiredTechnologies: [{ type: String }],
  teamSize: { type: Number, default: 4 },
  teamLeader: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    role: { type: String, default: 'Team Leader' },
    skills: [{ type: String }]
  },
  members: [memberSchema],
  compatibilityScore: { type: Number, default: 90 },
  aiExplanation: { type: String, default: '' },
  missingSkills: [{ type: String }],
  suggestedImprovements: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Forming', 'Active', 'Completed'], default: 'Forming' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
