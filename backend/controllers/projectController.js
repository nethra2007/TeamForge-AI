const Project = require('../models/Project');
const { getDBStatus } = require('../config/db');
const { formatSuccessResponse } = require('../utils/responseFormatter');

const getProjects = async (req, res, next) => {
  try {
    let projects = [];
    if (getDBStatus()) {
      projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    }

    if (projects.length === 0) {
      projects = [
        {
          _id: 'proj_001',
          title: 'TeamForge AI Platform',
          description: 'Your Autonomous Student Innovation & Career Copilot featuring 6 specialized AI agents.',
          domain: 'AI SaaS & Web Development',
          techStack: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Gemini API'],
          architectureSummary: 'Client-Server MERN Architecture with decoupled AI Provider Layer and shared multi-agent context pipeline.',
          elevatorPitch: 'Unifying student innovation, team matching, literature search, sprint planning, and placement prep into one platform.',
          status: 'In Progress',
          createdAt: new Date().toISOString()
        }
      ];
    }

    return res.status(200).json(formatSuccessResponse(projects, 'Projects fetched successfully'));
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, domain, techStack, architectureSummary, elevatorPitch, readmeContent } = req.body;
    let project;

    if (getDBStatus()) {
      project = await Project.create({
        title: title || 'New AI Project',
        description: description || 'Project description',
        domain: domain || 'Web & AI',
        owner: req.user._id,
        techStack: techStack || [],
        architectureSummary: architectureSummary || '',
        elevatorPitch: elevatorPitch || '',
        readmeContent: readmeContent || ''
      });
    } else {
      project = {
        _id: `proj_${Date.now()}`,
        title: title || 'New AI Project',
        description: description || 'Project description',
        domain: domain || 'Web & AI',
        techStack: techStack || [],
        architectureSummary: architectureSummary || '',
        elevatorPitch: elevatorPitch || '',
        status: 'Ideation',
        createdAt: new Date().toISOString()
      };
    }

    return res.status(201).json(formatSuccessResponse(project, 'Project created successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject };
