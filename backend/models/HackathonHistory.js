const mongoose = require('mongoose');

const hackathonHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theme: { type: String, default: '' },
  problemStatement: { type: String, required: true },
  projectIdea: { type: String, default: '' },
  refinedProjectTitle: { type: String, default: '' },
  improvedProblemStatement: { type: String, default: '' },
  techStack: { type: mongoose.Schema.Types.Mixed, default: {} },
  architecture: { type: String, default: '' },
  folderStructure: { type: String, default: '' },
  roadmap: [{ type: mongoose.Schema.Types.Mixed }],
  roleAllocation: [{ type: mongoose.Schema.Types.Mixed }],
  challengesAndMitigation: [{ type: mongoose.Schema.Types.Mixed }],
  innovationScore: { type: Number, default: 85 },
  presentationTips: [{ type: String }],
  pitch: { type: String, default: '' },
  readme: { type: String, default: '' },
  features: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('HackathonHistory', hackathonHistorySchema);
