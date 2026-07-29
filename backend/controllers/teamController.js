const Team = require('../models/Team');
const { getDBStatus } = require('../config/db');
const { formatSuccessResponse } = require('../utils/responseFormatter');

const getTeams = async (req, res, next) => {
  try {
    let teams = [];
    if (getDBStatus()) {
      teams = await Team.find({ 'members.userId': req.user._id }).sort({ createdAt: -1 });
    }
    
    if (teams.length === 0) {
      teams = [
        {
          _id: 'team_001',
          name: 'TeamForge Alpha',
          domain: 'AI SaaS Platform',
          projectIdea: 'Autonomous 6-Agent Student Copilot',
          compatibilityScore: 94,
          members: [
            { name: req.user?.name || 'Alex Morgan', role: 'Lead Full Stack & AI Engineer', skills: ['React', 'Node.js', 'Gemini API'], compatibilityScore: 96 },
            { name: 'Sarah Chen', role: 'AI / ML Specialist', skills: ['Python', 'FastAPI', 'PyTorch'], compatibilityScore: 95 },
            { name: 'David Miller', role: 'UI/UX Designer', skills: ['Tailwind CSS', 'Figma'], compatibilityScore: 91 },
            { name: 'Priya Sharma', role: 'Cloud & Database Architect', skills: ['MongoDB', 'Docker'], compatibilityScore: 90 }
          ],
          suggestedRoles: ['Lead Full Stack Engineer', 'AI Specialist', 'UI/UX Designer', 'Cloud Architect'],
          status: 'Active',
          createdAt: new Date().toISOString()
        }
      ];
    }

    return res.status(200).json(formatSuccessResponse(teams, 'Teams fetched successfully'));
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const { name, domain, projectIdea, members } = req.body;
    let team;

    if (getDBStatus()) {
      team = await Team.create({
        name: name || 'New Team',
        domain: domain || 'Web & Artificial Intelligence',
        projectIdea: projectIdea || '',
        compatibilityScore: 92,
        createdBy: req.user._id,
        members: members || [
          { userId: req.user._id, name: req.user.name, role: req.user.preferredRole || 'Leader', skills: req.user.skills || [] }
        ]
      });
    } else {
      team = {
        _id: `team_${Date.now()}`,
        name: name || 'New Team',
        domain: domain || 'Web & AI',
        projectIdea: projectIdea || '',
        compatibilityScore: 92,
        members: members || [
          { name: req.user?.name || 'Primary User', role: req.user?.preferredRole || 'Team Lead', skills: req.user?.skills || [] }
        ],
        status: 'Forming',
        createdAt: new Date().toISOString()
      };
    }

    return res.status(201).json(formatSuccessResponse(team, 'Team created successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeams, createTeam };
