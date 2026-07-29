const ResearchHistory = require('../models/ResearchHistory');
const HackathonHistory = require('../models/HackathonHistory');
const LearningPlan = require('../models/LearningPlan');
const SprintPlan = require('../models/SprintPlan');
const PlacementReport = require('../models/PlacementReport');
const { getDBStatus } = require('../config/db');
const { formatSuccessResponse } = require('../utils/responseFormatter');

const getAgentHistory = async (req, res, next) => {
  try {
    let history = {
      research: [],
      hackathons: [],
      learningPlans: [],
      sprintPlans: [],
      placementReports: []
    };

    if (getDBStatus() && req.user?._id) {
      history.research = await ResearchHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
      history.hackathons = await HackathonHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
      history.learningPlans = await LearningPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
      history.sprintPlans = await SprintPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
      history.placementReports = await PlacementReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    return res.status(200).json(formatSuccessResponse(history, 'Agent generation history fetched successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAgentHistory };
