const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  correctnessScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  missingPoints: [{ type: String }],
  idealAnswer: { type: String, default: '' },
  suggestions: [{ type: String }],
  evaluated: { type: Boolean, default: false }
}, { _id: false });

const dynamicQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'Project', 'System Design', 'Coding', 'HR'],
    default: 'Technical'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  type: {
    type: String,
    enum: ['MCQ', 'Output Prediction', 'Debugging', 'Short Coding', 'Conceptual', 'Behavioral'],
    default: 'Conceptual'
  },
  question: { type: String, required: true },
  idealAnswer: { type: String, required: true },
  keyConcepts: [{ type: String }],
  options: [{ type: String }], // Optional for MCQs
  codeSnippet: { type: String, default: '' }, // Optional for coding/debugging
  userAnswer: { type: String, default: '' },
  evaluation: { type: evaluationSchema, default: () => ({}) }
}, { _id: false });

const placementReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCompany: { type: String, required: true },
  targetRole: { type: String, required: true },
  readinessScore: { type: Number, required: true, default: 85 },
  atsScore: { type: Number, default: 88 },
  resumeFeedback: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    atsFeedback: { type: String, default: '' }
  },
  performanceMetrics: {
    technicalScore: { type: Number, default: 80 },
    behavioralScore: { type: Number, default: 85 },
    projectScore: { type: Number, default: 90 },
    communicationScore: { type: Number, default: 82 },
    codingScore: { type: Number, default: 78 },
    overallReadiness: { type: Number, default: 83 }
  },
  skillGap: [{ type: String }],
  weakSkills: [{ type: String }],
  interviewQuestions: [dynamicQuestionSchema],
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlacementReport', placementReportSchema);
