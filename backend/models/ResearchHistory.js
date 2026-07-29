const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: String }],
  year: { type: String, default: '2024' },
  url: { type: String, default: '' },
  abstract: { type: String, default: '' },
  citationCount: { type: Number, default: 0 },
  source: { type: String, default: 'Semantic Scholar' }
}, { _id: false });

const researchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  domain: { type: String, default: '' },
  literatureReview: { type: String, default: '' },
  keyFindings: [{ type: String }],
  researchGap: { type: String, default: '' },
  futureScope: { type: String, default: '' },
  conclusion: { type: String, default: '' },
  retrievedPapers: [paperSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('ResearchHistory', researchHistorySchema);
