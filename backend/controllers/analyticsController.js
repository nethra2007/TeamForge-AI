const { formatSuccessResponse } = require('../utils/responseFormatter');

const getAnalytics = async (req, res, next) => {
  try {
    const user = req.user || {};

    const analyticsData = {
      overallReadinessScore: user.readinessScore || 88,
      readinessBreakdown: {
        technicalSkills: 85,
        projectPortfolio: 92,
        researchLitReview: 82,
        teamCollaboration: 95,
        interviewPreparedness: 86
      },
      skillRadar: [
        { skill: 'React & Frontend', level: 90 },
        { skill: 'Node & APIs', level: 88 },
        { skill: 'AI & Gemini', level: 92 },
        { skill: 'MongoDB & DBs', level: 85 },
        { skill: 'Sprint Management', level: 88 },
        { skill: 'System Design', level: 80 }
      ],
      sprintMetrics: {
        totalSprintsCompleted: 3,
        velocityScore: 92,
        tasksCompleted: 14,
        tasksPending: 3
      },
      agentUsageStats: [
        { agent: 'TeamForge Collaborator', runs: 8 },
        { agent: 'LitReview AI', runs: 12 },
        { agent: 'Hackathon Mentor AI', runs: 15 },
        { agent: 'SkillPath AI', runs: 9 },
        { agent: 'SprintFlow AI', runs: 11 },
        { agent: 'PlacementPrep AI', runs: 14 }
      ]
    };

    return res.status(200).json(formatSuccessResponse(analyticsData, 'Student analytics metrics fetched'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
