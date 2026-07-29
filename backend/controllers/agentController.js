const mongoose = require('mongoose');
const { runCollaboratorAgent } = require('../services/ai/agentCollaborator');
const { runLitReviewAgent } = require('../services/ai/agentLitReview');
const { runHackathonMentorAgent } = require('../services/ai/agentHackathonMentor');
const { runSkillPathAgent } = require('../services/ai/agentSkillPath');
const { runSprintFlowAgent } = require('../services/ai/agentSprintFlow');
const { runPlacementPrepAgent, evaluateInterviewAnswer } = require('../services/ai/agentPlacementPrep');
const { runMultiAgentPipeline } = require('../services/ai/multiAgentCoordinator');

const { getDBStatus } = require('../config/db');

const formatAgentResponse = ({ agent, input, output, executionTime = '25ms', metadata = {} }) => ({
  success: true,
  agent,
  input,
  output,
  executionTime,
  timestamp: new Date().toISOString(),
  metadata
});

const formatSuccessResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});
const ResearchHistory = require('../models/ResearchHistory');
const HackathonHistory = require('../models/HackathonHistory');
const LearningPlan = require('../models/LearningPlan');
const SprintPlan = require('../models/SprintPlan');
const PlacementReport = require('../models/PlacementReport');
const Notification = require('../models/Notification');

const User = require('../models/User');
const Team = require('../models/Team');

const ensureCandidateUsersInDB = async (currentUserId) => {
  if (!getDBStatus()) return [];

  let candidates = await User.find({ _id: { $ne: currentUserId } }).select('-password');

  if (candidates.length < 3) {
    const sampleCandidates = [
      {
        name: 'Sophia Martinez',
        email: 'sophia.martinez@stanford.edu',
        password: 'password123',
        college: 'Stanford School of Engineering',
        branch: 'Computer Science & AI',
        skills: ['Python', 'PyTorch', 'FastAPI', 'Google Gemini API', 'Vector DBs'],
        interests: ['Artificial Intelligence', 'LLM Agents', 'Machine Learning'],
        preferredRole: 'AI / ML Specialist',
        preferredDomains: ['Artificial Intelligence', 'Web SaaS'],
        experience: '2+ years AI Research',
        githubUrl: 'https://github.com/sophiamartinez',
        linkedinUrl: 'https://linkedin.com/in/sophiamartinez'
      },
      {
        name: 'Liam Patel',
        email: 'liam.patel@berkeley.edu',
        password: 'password123',
        college: 'UC Berkeley EECS',
        branch: 'Software Engineering',
        skills: ['Tailwind CSS', 'Figma', 'React.js', 'Framer Motion', 'UI/UX Design'],
        interests: ['Frontend Engineering', 'User Interfaces', 'Design Systems'],
        preferredRole: 'UI/UX & Frontend Engineer',
        preferredDomains: ['Web Development', 'Design Systems'],
        experience: '2 years Frontend UI',
        githubUrl: 'https://github.com/liampatel',
        linkedinUrl: 'https://linkedin.com/in/liampatel'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@bits.edu',
        password: 'password123',
        college: 'BITS Pilani',
        branch: 'Computer Science',
        skills: ['MongoDB Atlas', 'Docker', 'Kubernetes', 'AWS', 'Node.js'],
        interests: ['Cloud Architecture', 'DevOps', 'Databases'],
        preferredRole: 'Cloud & Database Architect',
        preferredDomains: ['Cloud Computing', 'Backend SaaS'],
        experience: '1.5 years DevOps & DB',
        githubUrl: 'https://github.com/priyasharma',
        linkedinUrl: 'https://linkedin.com/in/priyasharma'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@mit.edu',
        password: 'password123',
        college: 'MIT EECS',
        branch: 'Cybersecurity & Systems',
        skills: ['Node.js', 'Express', 'JWT', 'Redis', 'WebSockets', 'Go'],
        interests: ['Backend Systems', 'Security', 'Distributed Systems'],
        preferredRole: 'Backend & Systems Engineer',
        preferredDomains: ['Distributed Systems', 'Security'],
        experience: '2 years Backend Systems',
        githubUrl: 'https://github.com/marcusvance',
        linkedinUrl: 'https://linkedin.com/in/marcusvance'
      }
    ];

    for (const c of sampleCandidates) {
      try {
        await User.create(c);
      } catch (err) {
        // Ignored if user already exists
      }
    }

    candidates = await User.find({ _id: { $ne: currentUserId } }).select('-password');
  }

  return candidates;
};

// @desc Agent 1: TeamForge Collaborator
// @route POST /api/agents/collaborator
const handleCollaboratorAgent = async (req, res, next) => {
  try {
    const { projectName, projectDescription, domain, requiredTechnologies, teamSize, apiKey } = req.body;

    const currentUserId = req.user?._id || '650000000000000000000001';
    let leaderProfile = req.user;

    if (getDBStatus() && req.user?._id) {
      leaderProfile = await User.findById(req.user._id).select('-password');
    }

    if (!leaderProfile) {
      leaderProfile = {
        _id: currentUserId,
        name: 'Alex Morgan',
        email: 'alex.morgan@stanford.edu',
        college: 'Stanford University',
        branch: 'Computer Science & AI',
        skills: ['React.js', 'Node.js', 'Python', 'Tailwind CSS'],
        interests: ['Artificial Intelligence', 'Full Stack SaaS'],
        preferredRole: 'Lead Full Stack Engineer',
        preferredDomains: ['Web Development & Artificial Intelligence'],
        experience: '2 years MERN & AI'
      };
    }

    // Fetch candidate pool from real MongoDB registered users
    let candidatesPool = [];
    if (getDBStatus()) {
      candidatesPool = await ensureCandidateUsersInDB(currentUserId);
    } else {
      candidatesPool = [
        {
          _id: '650000000000000000000002',
          name: 'Sophia Martinez',
          email: 'sophia.martinez@stanford.edu',
          college: 'Stanford School of Engineering',
          skills: ['Python', 'PyTorch', 'FastAPI', 'Google Gemini API', 'Vector DBs'],
          interests: ['Artificial Intelligence', 'LLM Agents'],
          preferredRole: 'AI / ML Specialist',
          preferredDomains: ['Artificial Intelligence'],
          githubUrl: 'https://github.com/sophiamartinez',
          linkedinUrl: 'https://linkedin.com/in/sophiamartinez'
        },
        {
          _id: '650000000000000000000003',
          name: 'Liam Patel',
          email: 'liam.patel@berkeley.edu',
          college: 'UC Berkeley EECS',
          skills: ['Tailwind CSS', 'Figma', 'React.js', 'Framer Motion'],
          interests: ['Frontend Engineering', 'User Interfaces'],
          preferredRole: 'UI/UX & Product Designer',
          preferredDomains: ['Design Systems'],
          githubUrl: 'https://github.com/liampatel',
          linkedinUrl: 'https://linkedin.com/in/liampatel'
        },
        {
          _id: '650000000000000000000004',
          name: 'Priya Sharma',
          email: 'priya.sharma@bits.edu',
          college: 'BITS Pilani',
          skills: ['MongoDB Atlas', 'Docker', 'Kubernetes', 'AWS', 'Node.js'],
          interests: ['Cloud Architecture', 'DevOps'],
          preferredRole: 'Cloud & Database Architect',
          preferredDomains: ['Cloud Computing'],
          githubUrl: 'https://github.com/priyasharma',
          linkedinUrl: 'https://linkedin.com/in/priyasharma'
        }
      ];
    }

    const projectSpec = {
      projectName: projectName || 'Innovative AI Student Project',
      projectDescription: projectDescription || 'Autonomous multi-agent platform simplifying student innovation.',
      domain: domain || 'Web & Artificial Intelligence',
      requiredTechnologies: Array.isArray(requiredTechnologies)
        ? requiredTechnologies
        : (requiredTechnologies ? requiredTechnologies.split(',').map(t => t.trim()) : ['React.js', 'Node.js', 'Python']),
      teamSize: Number(teamSize) || 4
    };

    const formattedPool = candidatesPool.map(c => ({
      _id: c._id.toString(),
      name: c.name,
      email: c.email,
      college: c.college,
      branch: c.branch,
      skills: c.skills,
      interests: c.interests,
      preferredRole: c.preferredRole,
      preferredDomains: c.preferredDomains,
      experience: c.experience,
      githubUrl: c.githubUrl,
      linkedinUrl: c.linkedinUrl
    }));

    const response = await runCollaboratorAgent({
      leaderProfile: {
        _id: leaderProfile._id.toString(),
        name: leaderProfile.name,
        email: leaderProfile.email,
        college: leaderProfile.college,
        skills: leaderProfile.skills,
        interests: leaderProfile.interests,
        preferredRole: leaderProfile.preferredRole,
        preferredDomains: leaderProfile.preferredDomains,
        experience: leaderProfile.experience
      },
      projectSpec,
      candidatePool: formattedPool
    }, apiKey);

    // Persist Team inside MongoDB Teams collection
    if (getDBStatus() && req.user?._id) {
      try {
        const teamMembers = (response.output.recommendedTeammates || []).map(m => ({
          userId: m.candidateId && m.candidateId.length === 24 ? m.candidateId : undefined,
          name: m.name,
          email: m.email || '',
          college: m.college || '',
          role: m.assignedRole || 'Team Member',
          skills: m.matchedSkills || [],
          compatibilityScore: m.compatibilityScore || 90,
          reason: m.reason || '',
          githubUrl: m.githubUrl || '',
          linkedinUrl: m.linkedinUrl || ''
        }));

        await Team.create({
          projectName: projectSpec.projectName,
          projectDescription: projectSpec.projectDescription,
          domain: projectSpec.domain,
          requiredTechnologies: projectSpec.requiredTechnologies,
          teamSize: projectSpec.teamSize,
          teamLeader: {
            userId: req.user._id,
            name: leaderProfile.name,
            role: leaderProfile.preferredRole || 'Team Leader',
            skills: leaderProfile.skills || []
          },
          members: teamMembers,
          compatibilityScore: response.output.compatibilityScore || 92,
          aiExplanation: response.output.aiExplanation || '',
          missingSkills: response.output.missingSkills || [],
          suggestedImprovements: response.output.suggestedImprovements || [],
          createdBy: req.user._id
        });

        await Notification.create({
          user: req.user._id,
          title: 'New Team Generated',
          message: `TeamForge Collaborator generated a new dynamic team for "${projectSpec.projectName}".`,
          type: 'team'
        });
      } catch (dbErr) {
        console.warn(`[Team Persistence Warning] ${dbErr.message}`);
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc Agent 2: LitReview AI
// @route POST /api/agents/lit-review
const handleLitReviewAgent = async (req, res, next) => {
  try {
    const { topic, domain, apiKey } = req.body;

    if (!topic || !topic.trim()) {
      res.status(400);
      throw new Error('Please enter a research topic.');
    }

    const response = await runLitReviewAgent({
      topic: topic.trim(),
      domain: domain ? domain.trim() : 'Computer Science & AI'
    }, apiKey);

    if (getDBStatus() && req.user?._id) {
      try {
        await ResearchHistory.create({
          user: req.user._id,
          topic: topic.trim(),
          domain: domain ? domain.trim() : 'Computer Science & AI',
          literatureReview: response.output.literatureReview || '',
          keyFindings: response.output.keyFindings || [],
          researchGap: response.output.researchGap || '',
          futureScope: response.output.futureScope || '',
          conclusion: response.output.conclusion || '',
          retrievedPapers: response.output.papers || []
        });

        await Notification.create({
          user: req.user._id,
          title: 'Literature Review Complete',
          message: `LitReview AI synthesized ${response.output.papers?.length || 0} papers for "${topic}".`,
          type: 'agent'
        });
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc Agent 3: Hackathon Mentor AI
// @route POST /api/agents/hackathon-mentor
const handleHackathonMentorAgent = async (req, res, next) => {
  try {
    const { theme, domain, problemStatement, projectIdea, preferredTechStack, teamSize, teamContext, apiKey } = req.body;

    const actualTheme = theme || domain;
    if (!problemStatement || !problemStatement.trim()) {
      res.status(400);
      throw new Error('Please enter a problem statement for your hackathon project.');
    }

    const response = await runHackathonMentorAgent({
      theme: actualTheme ? actualTheme.trim() : 'AI & Web SaaS Hackathon',
      problemStatement: problemStatement.trim(),
      projectIdea: projectIdea ? projectIdea.trim() : '',
      preferredTechStack: preferredTechStack ? preferredTechStack.trim() : '',
      teamSize: Number(teamSize) || 4,
      teamContext
    }, apiKey);

    if (getDBStatus() && req.user?._id) {
      try {
        await HackathonHistory.create({
          user: req.user._id,
          theme: actualTheme || 'General AI Hackathon',
          problemStatement: problemStatement.trim(),
          projectIdea: projectIdea || '',
          refinedProjectTitle: response.output.refinedProjectTitle || response.output.projectIdea?.title || 'Hackathon Winner Solution',
          improvedProblemStatement: response.output.improvedProblemStatement || '',
          techStack: response.output.techStack || {},
          architecture: response.output.architecture || '',
          folderStructure: response.output.folderStructure || '',
          roadmap: response.output.roadmap || response.output.timeline || [],
          roleAllocation: response.output.roleAllocation || [],
          challengesAndMitigation: response.output.challengesAndMitigation || [],
          innovationScore: response.output.innovationScore || 90,
          presentationTips: response.output.presentationTips || response.output.presentationPoints || [],
          pitch: response.output.pitch || '',
          readme: response.output.readme || '',
          features: response.output.keyFeatures || response.output.features || []
        });

        await Notification.create({
          user: req.user._id,
          title: 'Hackathon Strategy Generated',
          message: `Hackathon Mentor AI generated architecture & roadmap for "${response.output.refinedProjectTitle || 'Project'}".`,
          type: 'agent'
        });
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const transformWeeklyRoadmapToInteractiveTasks = (weeklyRoadmap) => {
  if (!Array.isArray(weeklyRoadmap)) return [];

  let previousWeekCompleted = true;

  return weeklyRoadmap.map((w, wIdx) => {
    const weekNum = w.week || (wIdx + 1);
    const rawTasks = Array.isArray(w.tasks) ? w.tasks : [];
    const rawResources = Array.isArray(w.resources) ? w.resources : [];

    const formattedTasks = rawTasks.map((t, tIdx) => {
      if (typeof t === 'object' && t !== null && t.id) {
        return {
          id: String(t.id),
          text: String(t.text || 'Learning Task'),
          difficulty: t.difficulty || 'Medium',
          completed: Boolean(t.completed),
          completedAt: t.completedAt || null,
          xp: Number(t.xp || 20)
        };
      }
      const text = typeof t === 'string' ? t : (t.text || 'Learning Task');
      let difficulty = 'Medium';
      let xp = 20;
      if (tIdx === 0) { difficulty = 'Simple'; xp = 10; }
      else if (tIdx === 1) { difficulty = 'Medium'; xp = 20; }
      else { difficulty = 'Advanced'; xp = 30; }

      return {
        id: `w${weekNum}_t${tIdx + 1}`,
        text,
        difficulty,
        completed: false,
        xp
      };
    });

    const formattedResources = rawResources.map((res, rIdx) => {
      if (typeof res === 'object' && res !== null && res.id) {
        return res;
      }
      const title = res.title || 'Learning Resource';
      const url = res.url || 'https://developer.mozilla.org';
      const type = res.type || 'Documentation';
      const platform = res.platform || (type.includes('GeeksforGeeks') ? 'GeeksforGeeks' : type.includes('MDN') ? 'MDN Web Docs' : type.includes('freeCodeCamp') ? 'freeCodeCamp' : type.includes('YouTube') ? 'YouTube' : type.includes('GitHub') ? 'GitHub' : 'Trusted Platform');

      return {
        id: `w${weekNum}_res${rIdx + 1}`,
        title,
        url,
        type,
        platform,
        bookmarked: false,
        completed: false
      };
    });

    const completedCount = formattedTasks.filter(t => t.completed).length;
    const progress = formattedTasks.length > 0 ? Math.round((completedCount / formattedTasks.length) * 100) : 0;
    const isCompleted = progress === 100;

    const isUnlocked = weekNum === 1 ? true : previousWeekCompleted;
    previousWeekCompleted = isCompleted;

    return {
      week: weekNum,
      title: w.title || `Week ${weekNum} Focus`,
      focusSkills: w.focusSkills || [],
      progress,
      isCompleted,
      isUnlocked,
      tasks: formattedTasks,
      resources: formattedResources
    };
  });
};

const calculateSkillPathMetrics = (plan) => {
  let totalTasks = 0;
  let completedTasks = 0;
  let totalXP = 0;
  let previousWeekCompleted = true;

  if (Array.isArray(plan.weeklyRoadmap)) {
    plan.weeklyRoadmap.forEach((w, wIdx) => {
      const weekNum = w.week || (wIdx + 1);
      let weekCompleted = 0;
      if (Array.isArray(w.tasks)) {
        w.tasks.forEach((t) => {
          totalTasks += 1;
          if (t.completed) {
            completedTasks += 1;
            weekCompleted += 1;
            totalXP += (t.xp || (t.difficulty === 'Simple' ? 10 : t.difficulty === 'Advanced' ? 30 : 20));
          }
        });
      }
      w.progress = w.tasks && w.tasks.length > 0 ? Math.round((weekCompleted / w.tasks.length) * 100) : 0;
      w.isCompleted = w.progress === 100;

      // Unlock logic
      w.isUnlocked = weekNum === 1 ? true : previousWeekCompleted;
      previousWeekCompleted = w.isCompleted;
    });
  }

  plan.overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  plan.userXP = totalXP;
  plan.status = plan.overallProgress === 100 ? 'Completed' : 'In Progress';

  if (totalXP < 100) {
    plan.skillLevel = 'Beginner';
  } else if (totalXP < 300) {
    plan.skillLevel = 'Intermediate';
  } else {
    plan.skillLevel = 'Advanced';
  }

  const now = new Date();
  const weeksLeft = Math.max(1, Math.ceil(((totalTasks - completedTasks) / Math.max(1, totalTasks)) * 4));
  const targetDate = new Date(now.getTime() + (weeksLeft * 7 * 24 * 60 * 60 * 1000));
  plan.estimatedCompletionDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return plan;
};

// @desc Agent 4: SkillPath AI
// @route POST /api/agents/skill-path
const handleSkillPathAgent = async (req, res, next) => {
  try {
    const { currentSkills, targetCareer, forceNew, projectContext, apiKey } = req.body;
    const requestedCareer = targetCareer || req.user?.targetCareer || 'Senior AI Engineer';

    // If user has an existing active plan and forceNew is not requested, return existing plan to prevent regeneration
    if (getDBStatus() && req.user?._id && !forceNew) {
      const existingPlan = await LearningPlan.findOne({ user: req.user._id, targetCareer: requestedCareer, isActive: true }).sort({ updatedAt: -1 })
        || await LearningPlan.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

      if (existingPlan) {
        return res.status(200).json(formatAgentResponse({
          agent: 'SkillPath AI',
          input: { currentSkills: existingPlan.currentSkills, targetCareer: existingPlan.targetCareer },
          output: {
            planId: existingPlan._id,
            targetCareer: existingPlan.targetCareer,
            missingSkills: existingPlan.missingSkills,
            estimatedDuration: existingPlan.estimatedDuration,
            userXP: existingPlan.userXP,
            skillLevel: existingPlan.skillLevel,
            overallProgress: existingPlan.overallProgress,
            status: existingPlan.status,
            estimatedCompletionDate: existingPlan.estimatedCompletionDate,
            weeklyRoadmap: existingPlan.weeklyRoadmap,
            recommendedCourses: existingPlan.recommendedCourses,
            isLoadedFromDB: true
          },
          executionTime: '20ms',
          metadata: { provider: 'MongoDB Cached Active Plan' }
        }));
      }
    }

    const response = await runSkillPathAgent({
      currentSkills: currentSkills || req.user?.skills || ['React.js', 'Node.js', 'Python'],
      targetCareer: requestedCareer,
      projectContext
    }, apiKey);

    const interactiveRoadmap = transformWeeklyRoadmapToInteractiveTasksAndResources(response.output.weeklyRoadmap);

    let savedPlan = null;
    if (getDBStatus() && req.user?._id) {
      try {
        await LearningPlan.updateMany({ user: req.user._id }, { isActive: false });

        const planObj = {
          user: req.user._id,
          currentSkills: currentSkills || req.user?.skills || [],
          targetCareer: requestedCareer,
          missingSkills: response.output.missingSkills || [],
          estimatedDuration: response.output.estimatedDuration || '4 Weeks',
          weeklyRoadmap: interactiveRoadmap,
          recommendedCourses: response.output.recommendedCourses || [],
          userXP: 0,
          skillLevel: 'Beginner',
          overallProgress: 0,
          status: 'In Progress',
          isActive: true,
          estimatedCompletionDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        savedPlan = await LearningPlan.create(planObj);
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    response.output.planId = savedPlan ? savedPlan._id : 'demo_plan_id';
    response.output.weeklyRoadmap = interactiveRoadmap;
    response.output.userXP = savedPlan ? savedPlan.userXP : 0;
    response.output.skillLevel = savedPlan ? savedPlan.skillLevel : 'Beginner';
    response.output.overallProgress = savedPlan ? savedPlan.overallProgress : 0;
    response.output.status = savedPlan ? savedPlan.status : 'In Progress';
    response.output.estimatedCompletionDate = savedPlan ? savedPlan.estimatedCompletionDate : 'In 4 Weeks';
    response.output.isLoadedFromDB = false;

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const transformWeeklyRoadmapToInteractiveTasksAndResources = transformWeeklyRoadmapToInteractiveTasks;

// @desc Get active learning plan for logged in user
// @route GET /api/agents/skill-path/active
const handleGetActiveSkillPath = async (req, res, next) => {
  try {
    if (!getDBStatus() || !req.user?._id) {
      return res.status(200).json(formatSuccessResponse({ plan: null }));
    }

    const plan = await LearningPlan.findOne({ user: req.user._id, isActive: true }).sort({ updatedAt: -1 })
      || await LearningPlan.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    if (!plan) {
      return res.status(200).json(formatSuccessResponse({ plan: null }));
    }

    return res.status(200).json(formatSuccessResponse({
      planId: plan._id,
      targetCareer: plan.targetCareer,
      currentSkills: plan.currentSkills,
      missingSkills: plan.missingSkills,
      estimatedDuration: plan.estimatedDuration,
      userXP: plan.userXP,
      skillLevel: plan.skillLevel,
      overallProgress: plan.overallProgress,
      status: plan.status,
      estimatedCompletionDate: plan.estimatedCompletionDate,
      weeklyRoadmap: plan.weeklyRoadmap,
      recommendedCourses: plan.recommendedCourses
    }));
  } catch (error) {
    next(error);
  }
};

// @desc Get all learning roadmaps for logged-in user
// @route GET /api/agents/skill-path/all
const handleGetAllSkillPaths = async (req, res, next) => {
  try {
    if (!getDBStatus() || !req.user?._id) {
      return res.status(200).json(formatSuccessResponse({ roadmaps: [] }));
    }

    const roadmaps = await LearningPlan.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json(formatSuccessResponse({ roadmaps }));
  } catch (error) {
    next(error);
  }
};

// @desc Toggle task completion status in SkillPath learning tracker
// @route POST /api/agents/skill-path/toggle-task
const handleToggleSkillPathTask = async (req, res, next) => {
  try {
    const { planId, weekNumber, taskId, completed } = req.body;

    if (!getDBStatus()) {
      return res.status(200).json(formatAgentResponse({
        agent: 'SkillPath AI',
        input: { planId, weekNumber, taskId, completed },
        output: {
          planId: planId || 'demo_plan',
          targetCareer: 'Senior AI Engineer',
          userXP: completed ? 20 : 0,
          skillLevel: 'Beginner',
          overallProgress: completed ? 25 : 0,
          estimatedCompletionDate: 'In 4 Weeks'
        },
        executionTime: '5ms',
        metadata: { provider: 'Simulation Mode' }
      }));
    }

    let plan = null;
    if (planId && planId !== 'demo_plan_id' && mongoose.Types.ObjectId.isValid(planId)) {
      plan = await LearningPlan.findById(planId);
    }
    if (!plan && req.user?._id) {
      plan = await LearningPlan.findOne({ user: req.user._id, isActive: true }).sort({ updatedAt: -1 })
        || await LearningPlan.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    }

    if (!plan && req.user?._id) {
      const defaultRoadmap = transformWeeklyRoadmapToInteractiveTasks([
        { week: 1, title: 'Foundations & Architecture', focusSkills: ['React', 'Node.js'], tasks: ['Setup MERN project architecture', 'Implement authentication flow'] },
        { week: 2, title: 'AI Integration & API Scaling', focusSkills: ['Gemini API', 'MongoDB'], tasks: ['Integrate Gemini prompt chains', 'Optimize database indexing'] }
      ]);
      plan = await LearningPlan.create({
        user: req.user._id,
        currentSkills: req.user.skills || ['React.js', 'Node.js'],
        targetCareer: req.user.targetCareer || 'Senior AI Engineer',
        missingSkills: ['System Design', 'AI Optimization'],
        estimatedDuration: '4 Weeks',
        weeklyRoadmap: defaultRoadmap,
        userXP: 0,
        skillLevel: 'Beginner',
        overallProgress: 0,
        status: 'In Progress',
        estimatedCompletionDate: 'In 4 Weeks'
      });
    }

    if (!plan) {
      return res.status(200).json(formatAgentResponse({
        agent: 'SkillPath AI',
        input: { planId, weekNumber, taskId, completed },
        output: {
          planId: planId || 'demo_plan',
          targetCareer: 'Senior AI Engineer',
          userXP: completed ? 20 : 0,
          skillLevel: 'Beginner',
          overallProgress: completed ? 25 : 0,
          estimatedCompletionDate: 'In 4 Weeks'
        },
        executionTime: '5ms',
        metadata: { provider: 'Fallback State' }
      }));
    }

    if (plan.weeklyRoadmap) {
      plan.weeklyRoadmap = transformWeeklyRoadmapToInteractiveTasks(plan.weeklyRoadmap);
    }

    const targetWeekNum = Number(weekNumber) || 1;
    const week = plan.weeklyRoadmap.find(w => w.week === targetWeekNum) || plan.weeklyRoadmap[0];

    // Check week lock condition: Only allow toggling if week is unlocked
    if (week && week.isUnlocked && week.tasks && week.tasks.length > 0) {
      let task = week.tasks.find(t => t.id === taskId);
      if (!task) {
        task = week.tasks[0];
      }
      if (task) {
        task.completed = Boolean(completed);
        task.completedAt = completed ? new Date() : null;
      }
    }

    plan = calculateSkillPathMetrics(plan);

    try {
      await LearningPlan.findByIdAndUpdate(plan._id, {
        weeklyRoadmap: plan.weeklyRoadmap,
        overallProgress: plan.overallProgress,
        userXP: plan.userXP,
        skillLevel: plan.skillLevel,
        status: plan.status,
        estimatedCompletionDate: plan.estimatedCompletionDate
      });
    } catch (saveErr) {
      console.warn(`[LearningPlan Update Warning] ${saveErr.message}`);
    }

    if (plan.overallProgress === 100) {
      try {
        await Notification.create({
          user: req.user._id,
          title: 'Learning Roadmap Completed!',
          message: `Congratulations! You have completed 100% of your SkillPath roadmap for ${plan.targetCareer}.`,
          type: 'agent'
        });
      } catch (e) {}
    }

    return res.status(200).json(formatAgentResponse({
      agent: 'SkillPath AI',
      input: { planId, weekNumber, taskId, completed },
      output: {
        planId: plan._id,
        targetCareer: plan.targetCareer,
        userXP: plan.userXP,
        skillLevel: plan.skillLevel,
        overallProgress: plan.overallProgress,
        status: plan.status,
        estimatedCompletionDate: plan.estimatedCompletionDate,
        weeklyRoadmap: plan.weeklyRoadmap,
        missingSkills: plan.missingSkills
      },
      executionTime: '15ms',
      metadata: { provider: 'MongoDB Task Tracker' }
    }));
  } catch (error) {
    console.error(`[SkillPath Toggle Error] ${error.message}`);
    next(error);
  }
};

// @desc Toggle resource bookmark
// @route POST /api/agents/skill-path/toggle-resource-bookmark
const handleToggleResourceBookmark = async (req, res, next) => {
  try {
    const { planId, weekNumber, resourceId, bookmarked } = req.body;
    let plan = null;
    if (planId && mongoose.Types.ObjectId.isValid(planId)) {
      plan = await LearningPlan.findById(planId);
    }
    if (!plan && req.user?._id) {
      plan = await LearningPlan.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    }

    if (plan && plan.weeklyRoadmap) {
      const week = plan.weeklyRoadmap.find(w => w.week === Number(weekNumber));
      if (week && week.resources) {
        const resObj = week.resources.find(r => r.id === resourceId);
        if (resObj) {
          resObj.bookmarked = Boolean(bookmarked);
        }
      }
      await LearningPlan.findByIdAndUpdate(plan._id, { weeklyRoadmap: plan.weeklyRoadmap });
    }

    return res.status(200).json(formatAgentResponse({
      agent: 'SkillPath AI',
      input: { planId, weekNumber, resourceId, bookmarked },
      output: { planId, resourceId, bookmarked },
      executionTime: '10ms'
    }));
  } catch (error) {
    next(error);
  }
};

// @desc Toggle resource completion
// @route POST /api/agents/skill-path/toggle-resource-complete
const handleToggleResourceComplete = async (req, res, next) => {
  try {
    const { planId, weekNumber, resourceId, completed } = req.body;
    let plan = null;
    if (planId && mongoose.Types.ObjectId.isValid(planId)) {
      plan = await LearningPlan.findById(planId);
    }
    if (!plan && req.user?._id) {
      plan = await LearningPlan.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    }

    if (plan && plan.weeklyRoadmap) {
      const week = plan.weeklyRoadmap.find(w => w.week === Number(weekNumber));
      if (week && week.resources) {
        const resObj = week.resources.find(r => r.id === resourceId);
        if (resObj) {
          resObj.completed = Boolean(completed);
        }
      }
      await LearningPlan.findByIdAndUpdate(plan._id, { weeklyRoadmap: plan.weeklyRoadmap });
    }

    return res.status(200).json(formatAgentResponse({
      agent: 'SkillPath AI',
      input: { planId, weekNumber, resourceId, completed },
      output: { planId, resourceId, completed },
      executionTime: '10ms'
    }));
  } catch (error) {
    next(error);
  }
};

// @desc Rename roadmap target career/role
// @route PUT /api/agents/skill-path/:id/rename
const handleRenameSkillPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetCareer } = req.body;
    const plan = await LearningPlan.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { targetCareer },
      { new: true }
    );
    return res.status(200).json(formatSuccessResponse({ plan }));
  } catch (error) {
    next(error);
  }
};

// @desc Duplicate roadmap
// @route POST /api/agents/skill-path/:id/duplicate
const handleDuplicateSkillPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await LearningPlan.findOne({ _id: id, user: req.user._id });
    if (!existing) {
      res.status(404);
      throw new Error('Roadmap not found');
    }

    const clonedData = existing.toObject();
    delete clonedData._id;
    delete clonedData.createdAt;
    delete clonedData.updatedAt;
    clonedData.targetCareer = `${clonedData.targetCareer} (Copy)`;
    clonedData.isActive = false;

    const duplicated = await LearningPlan.create(clonedData);
    return res.status(201).json(formatSuccessResponse({ plan: duplicated }));
  } catch (error) {
    next(error);
  }
};

// @desc Delete roadmap
// @route DELETE /api/agents/skill-path/:id
const handleDeleteSkillPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LearningPlan.findOneAndDelete({ _id: id, user: req.user._id });
    return res.status(200).json(formatSuccessResponse({ message: 'Roadmap deleted successfully', id }));
  } catch (error) {
    next(error);
  }
};

// @desc Set active roadmap
// @route POST /api/agents/skill-path/:id/select-active
const handleSelectActiveSkillPath = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LearningPlan.updateMany({ user: req.user._id }, { isActive: false });
    const plan = await LearningPlan.findOneAndUpdate({ _id: id, user: req.user._id }, { isActive: true }, { new: true });
    return res.status(200).json(formatSuccessResponse({ plan }));
  } catch (error) {
    next(error);
  }
};

// @desc Get active sprint plan by ID or project ID (Do NOT auto-load random sprint if no ID passed)
// @route GET /api/agents/sprint-flow/active
const handleGetActiveSprintPlan = async (req, res, next) => {
  try {
    if (!getDBStatus() || !req.user?._id) {
      return res.status(200).json(formatSuccessResponse({ sprintPlan: null }));
    }

    const { id, projectId } = req.query;

    // Only load if explicit ID or projectId is passed from Sprint History
    if (id || projectId) {
      const query = { user: req.user._id };
      if (id) query._id = id;
      if (projectId) query.projectId = projectId;

      const sprintPlan = await SprintPlan.findOne(query);
      return res.status(200).json(formatSuccessResponse({ sprintPlan }));
    }

    // Default: Return null so opening SprintFlow AI starts with clean input fields
    return res.status(200).json(formatSuccessResponse({ sprintPlan: null }));
  } catch (error) {
    next(error);
  }
};

// @desc Get all saved sprint plans for logged in user
// @route GET /api/agents/sprint-flow/all
const handleGetAllSprintPlans = async (req, res, next) => {
  try {
    if (!getDBStatus() || !req.user?._id) {
      return res.status(200).json(formatSuccessResponse({ sprintPlans: [] }));
    }

    const sprintPlans = await SprintPlan.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json(formatSuccessResponse({ sprintPlans }));
  } catch (error) {
    next(error);
  }
};

// @desc Agent 5: SprintFlow AI
// @route POST /api/agents/sprint-flow
const handleSprintFlowAgent = async (req, res, next) => {
  try {
    const { projectName, projectDescription, timeline, teamSize, techStack, teamMembers, apiKey } = req.body;

    const name = projectName?.trim() || 'Custom Project';
    const desc = projectDescription?.trim() || 'Software engineering project';
    const horizon = timeline?.trim() || '4 Weeks';
    const stack = techStack?.trim() || 'Full Stack';
    const size = teamSize || 4;

    // Parse weeks horizon from timeline
    const weeksMatch = horizon.match(/(\d+)/);
    const numWeeks = weeksMatch ? parseInt(weeksMatch[1], 10) : 4;

    // Attempt to automatically retrieve team members if not passed
    let activeTeamMembers = teamMembers || [];
    if (activeTeamMembers.length === 0 && getDBStatus() && req.user?._id) {
      try {
        const Team = require('../models/Team');
        const userTeam = await Team.findOne({ members: req.user._id }).populate('members', 'name role skills');
        if (userTeam && userTeam.members) {
          activeTeamMembers = userTeam.members.map(m => ({ name: m.name, role: m.role || 'Engineer' }));
        }
      } catch (err) {}
    }

    const response = await runSprintFlowAgent({
      projectName: name,
      projectDescription: desc,
      timeline: horizon,
      teamSize: size,
      techStack: stack,
      teamMembers: activeTeamMembers
    }, apiKey);

    // Enforce dynamic project title format: <Project Name> Agile Development Sprint Plan
    response.output.projectTitle = `${name} Agile Development Sprint Plan`;

    // CRITICAL SYSTEM REQUIREMENT: All generated tasks MUST start in status = "To Do"
    if (response.output?.sprints) {
      response.output.sprints.forEach(s => {
        if (s.tasks) {
          s.tasks.forEach(t => {
            t.status = 'To Do';
          });
        }
      });
    }

    // Calculate initial totals across generated tasks
    let totalTasksCount = 0;
    (response.output.sprints || []).forEach(s => {
      totalTasksCount += (s.tasks || []).length;
    });

    let sprintPlanId = null;
    let projectId = new mongoose.Types.ObjectId().toString();

    if (getDBStatus() && req.user?._id) {
      try {
        await SprintPlan.updateMany({ user: req.user._id }, { isActive: false });

        const plan = await SprintPlan.create({
          user: req.user._id,
          projectId,
          projectTitle: response.output.projectTitle,
          projectDescription: desc,
          domain: 'Software Engineering',
          deadline: horizon,
          totalDurationWeeks: response.output.totalDurationWeeks || numWeeks,
          teamSize: size,
          techStack: stack,
          sprints: response.output.sprints || [],
          milestones: response.output.milestones || [],
          velocityScore: response.output.velocityScore || 90,
          projectHealthScore: response.output.projectHealthScore || 95,
          riskLevel: response.output.riskLevel || 'Low Risk',
          estimatedCompletionDate: response.output.estimatedCompletionDate || `${horizon} from start`,
          overallProgress: 0,
          completedTasksCount: 0,
          totalTasksCount,
          isActive: true
        });

        sprintPlanId = plan._id;
        projectId = plan.projectId;
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    response.output.sprintPlanId = sprintPlanId;
    response.output.projectId = projectId;
    response.output.isLoadedFromDB = false;
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc Update Kanban task status (To Do, In Progress, Completed)
// @route POST /api/agents/sprint-flow/update-task-status
const handleUpdateTaskStatus = async (req, res, next) => {
  try {
    const { sprintPlanId, sprintNumber, taskId, newStatus } = req.body;

    if (!getDBStatus() || !sprintPlanId) {
      return res.status(400).json({ success: false, message: 'Invalid request or DB disconnected' });
    }

    const plan = await SprintPlan.findById(sprintPlanId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Sprint plan not found' });
    }

    let targetTask = null;
    let totalTasks = 0;
    let completedTasks = 0;

    plan.sprints.forEach((s, idx) => {
      s.tasks.forEach(t => {
        totalTasks += 1;
        if (t.id === taskId) {
          t.status = newStatus;
          targetTask = t;
        }
        if (t.status === 'Completed' || t.status === 'Done') {
          completedTasks += 1;
        }
      });

      // Milestone Auto-Update: If all tasks in Sprint S are Completed, mark Milestone S as completed
      if (s.tasks && s.tasks.length > 0) {
        const sprintAllCompleted = s.tasks.every(t => t.status === 'Completed' || t.status === 'Done');
        if (sprintAllCompleted && plan.milestones && plan.milestones[idx]) {
          plan.milestones[idx].completed = true;
        }
      }
    });

    if (!targetTask) {
      return res.status(404).json({ success: false, message: 'Task not found in sprint plan' });
    }

    const overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);
    plan.overallProgress = overallProgress;
    plan.completedTasksCount = completedTasks;
    plan.totalTasksCount = totalTasks;

    // Recalculate Project Health Score
    const progressBonus = Math.round(overallProgress * 0.2);
    const healthScore = Math.max(30, Math.min(100, 80 + progressBonus));
    plan.projectHealthScore = healthScore;
    plan.riskLevel = healthScore > 80 ? 'Low Risk' : healthScore > 50 ? 'Moderate Risk' : 'High Risk';

    if (overallProgress === 100) {
      plan.status = 'Completed';
    }

    await plan.save();

    // Multi-Agent Collaboration Trigger: If sprint reaches 100%, trigger notification for PlacementPrep AI
    if (overallProgress === 100 && req.user?._id) {
      try {
        const Notification = require('../models/Notification');
        await Notification.create({
          user: req.user._id,
          title: 'Sprint 100% Completed!',
          message: `Congratulations! ${plan.projectTitle} has reached 100% completion. PlacementPrep AI is ready for mock interviews.`,
          type: 'agent'
        });
      } catch (e) {}
    }

    return res.status(200).json(formatSuccessResponse({
      sprintPlanId: plan._id,
      taskId,
      newStatus,
      overallProgress,
      projectHealthScore: plan.projectHealthScore,
      riskLevel: plan.riskLevel,
      plan
    }, 'Task status updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Edit task details
// @route PUT /api/agents/sprint-flow/edit-task
const handleEditTask = async (req, res, next) => {
  try {
    const { sprintPlanId, taskId, title, description, assignee, priority, estimatedHours, acceptanceCriteria, suggestedDoc } = req.body;

    if (!getDBStatus() || !sprintPlanId || !taskId) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    const plan = await SprintPlan.findById(sprintPlanId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Sprint plan not found' });
    }

    let targetTask = null;
    plan.sprints.forEach(s => {
      s.tasks.forEach(t => {
        if (t.id === taskId) {
          if (title) t.title = title;
          if (description !== undefined) t.description = description;
          if (assignee !== undefined) t.assignee = assignee;
          if (priority) t.priority = priority;
          if (estimatedHours) t.estimatedHours = estimatedHours;
          if (acceptanceCriteria) t.acceptanceCriteria = acceptanceCriteria;
          if (suggestedDoc !== undefined) t.suggestedDoc = suggestedDoc;
          targetTask = t;
        }
      });
    });

    if (!targetTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await plan.save();
    return res.status(200).json(formatSuccessResponse({ plan, targetTask }, 'Task edited successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete task from sprint plan
// @route DELETE /api/agents/sprint-flow/delete-task
const handleDeleteTask = async (req, res, next) => {
  try {
    const { sprintPlanId, taskId } = req.body;

    if (!getDBStatus() || !sprintPlanId || !taskId) {
      return res.status(400).json({ success: false, message: 'Invalid request parameters' });
    }

    const plan = await SprintPlan.findById(sprintPlanId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Sprint plan not found' });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    plan.sprints.forEach(s => {
      s.tasks = s.tasks.filter(t => t.id !== taskId);
      s.tasks.forEach(t => {
        totalTasks += 1;
        if (t.status === 'Completed' || t.status === 'Done') {
          completedTasks += 1;
        }
      });
    });

    const overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);
    plan.overallProgress = overallProgress;
    plan.completedTasksCount = completedTasks;
    plan.totalTasksCount = totalTasks;

    await plan.save();
    return res.status(200).json(formatSuccessResponse({ plan, taskId }, 'Task deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Rename Sprint Plan
// @route PUT /api/agents/sprint-flow/:id/rename
const handleRenameSprintPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectTitle, projectDescription } = req.body;

    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    const plan = await SprintPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Sprint plan not found' });
    }

    if (projectTitle) plan.projectTitle = projectTitle;
    if (projectDescription !== undefined) plan.projectDescription = projectDescription;
    await plan.save();

    return res.status(200).json(formatSuccessResponse({ plan }, 'Sprint plan renamed'));
  } catch (error) {
    next(error);
  }
};

// @desc Duplicate Sprint Plan
// @route POST /api/agents/sprint-flow/:id/duplicate
const handleDuplicateSprintPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    const existing = await SprintPlan.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sprint plan not found' });
    }

    await SprintPlan.updateMany({ user: req.user._id }, { isActive: false });

    const duplicate = await SprintPlan.create({
      user: req.user._id,
      projectTitle: `${existing.projectTitle} (Copy)`,
      projectDescription: existing.projectDescription,
      domain: existing.domain,
      deadline: existing.deadline,
      totalDurationWeeks: existing.totalDurationWeeks,
      teamSize: existing.teamSize,
      techStack: existing.techStack,
      sprints: existing.sprints,
      milestones: existing.milestones,
      velocityScore: existing.velocityScore,
      projectHealthScore: existing.projectHealthScore,
      riskLevel: existing.riskLevel,
      estimatedCompletionDate: existing.estimatedCompletionDate,
      overallProgress: existing.overallProgress,
      completedTasksCount: existing.completedTasksCount,
      totalTasksCount: existing.totalTasksCount,
      status: existing.status,
      isActive: true
    });

    return res.status(200).json(formatSuccessResponse({ duplicate }, 'Sprint plan duplicated'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete Sprint Plan
// @route DELETE /api/agents/sprint-flow/:id
const handleDeleteSprintPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    await SprintPlan.findByIdAndDelete(id);
    return res.status(200).json(formatSuccessResponse({ id }, 'Sprint plan deleted'));
  } catch (error) {
    next(error);
  }
};

// @desc Select active sprint plan
// @route POST /api/agents/sprint-flow/:id/select-active
const handleSelectActiveSprintPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    await SprintPlan.updateMany({ user: req.user._id }, { isActive: false });
    const plan = await SprintPlan.findByIdAndUpdate(id, { isActive: true }, { new: true });

    return res.status(200).json(formatSuccessResponse({ plan }, 'Sprint plan activated'));
  } catch (error) {
    next(error);
  }
};

// @desc Agent 6: PlacementPrep AI
// @route POST /api/agents/placement-prep
const handlePlacementPrepAgent = async (req, res, next) => {
  try {
    const { resumeText, targetCompany, targetRole, apiKey } = req.body;

    let userProjects = [];
    if (getDBStatus() && req.user?._id) {
      try {
        const Project = require('../models/Project');
        userProjects = await Project.find({ members: req.user._id }).limit(3);
      } catch (err) {}
    }

    const response = await runPlacementPrepAgent({
      resumeText: resumeText || req.user?.resumeText || 'Full stack student engineer with AI agent experience',
      targetCompany: targetCompany || req.user?.targetCompany || 'Google / Top Tech Product Companies',
      targetRole: targetRole || req.user?.targetCareer || 'Full Stack & AI Engineer',
      userProjects
    }, apiKey);

    let reportId = null;
    if (getDBStatus() && req.user?._id) {
      try {
        const report = await PlacementReport.create({
          user: req.user._id,
          targetCompany: targetCompany || 'Top Tech Companies',
          targetRole: targetRole || 'Full Stack AI Engineer',
          readinessScore: response.output.readinessScore || 85,
          atsScore: response.output.atsScore || 88,
          resumeFeedback: response.output.resumeFeedback || {},
          performanceMetrics: response.output.performanceMetrics || {},
          skillGap: response.output.skillGap || [],
          weakSkills: response.output.weakSkills || [],
          interviewQuestions: response.output.interviewQuestions || []
        });
        reportId = report._id;
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    response.output.reportId = reportId;
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc Evaluate User Answer for active interview question
// @route POST /api/agents/placement-prep/evaluate-answer
const handleEvaluateInterviewAnswer = async (req, res, next) => {
  try {
    const { reportId, questionId, userAnswer, apiKey } = req.body;

    let targetReport = null;
    let targetQuestion = null;

    if (getDBStatus() && reportId) {
      targetReport = await PlacementReport.findById(reportId);
      if (targetReport) {
        targetQuestion = targetReport.interviewQuestions.find(q => q.id === questionId || q._id?.toString() === questionId);
      }
    }

    if (!targetQuestion) {
      return res.status(404).json({ success: false, message: 'Interview session or question not found' });
    }

    const evalResult = await evaluateInterviewAnswer({
      question: targetQuestion.question,
      expectedSkill: targetQuestion.keyConcepts?.join(', '),
      userAnswer,
      idealAnswer: targetQuestion.idealAnswer,
      category: targetQuestion.category,
      difficulty: targetQuestion.difficulty
    }, apiKey);

    const evaluationData = {
      correctnessScore: evalResult.evaluation.correctnessScore || 8,
      confidenceScore: evalResult.evaluation.confidenceScore || 8,
      communicationScore: evalResult.evaluation.communicationScore || 8,
      score: evalResult.evaluation.score || 8,
      missingPoints: evalResult.evaluation.missingPoints || [],
      idealAnswer: evalResult.evaluation.idealAnswer || targetQuestion.idealAnswer,
      suggestions: evalResult.evaluation.suggestions || [],
      evaluated: true
    };

    // Update MongoDB record
    if (targetReport) {
      targetQuestion.userAnswer = userAnswer;
      targetQuestion.evaluation = evaluationData;

      // Update weak skills if low score
      if (evaluationData.score < 7 && evalResult.evaluation.weakSkillsIdentified) {
        evalResult.evaluation.weakSkillsIdentified.forEach(skill => {
          if (!targetReport.weakSkills.includes(skill)) {
            targetReport.weakSkills.push(skill);
          }
        });
      }

      // Re-calculate performance breakdown metrics
      const evaluatedQuestions = targetReport.interviewQuestions.filter(q => q.evaluation && q.evaluation.evaluated);
      if (evaluatedQuestions.length > 0) {
        const avgScore = Math.round((evaluatedQuestions.reduce((acc, q) => acc + (q.evaluation.score || 0), 0) / evaluatedQuestions.length) * 10);
        targetReport.readinessScore = avgScore;
        if (targetReport.performanceMetrics) {
          targetReport.performanceMetrics.overallReadiness = avgScore;
        }
      }

      await targetReport.save();
    }

    return res.status(200).json(formatSuccessResponse({
      reportId,
      questionId,
      evaluation: evaluationData,
      report: targetReport
    }, 'Answer evaluated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Get all interview practice history
// @route GET /api/agents/placement-prep/history
const handleGetPlacementHistory = async (req, res, next) => {
  try {
    if (!getDBStatus() || !req.user?._id) {
      return res.status(200).json(formatSuccessResponse({ history: [] }));
    }

    const history = await PlacementReport.find({ user: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json(formatSuccessResponse({ history }));
  } catch (error) {
    next(error);
  }
};

// @desc Retry Interview Practice Session
// @route POST /api/agents/placement-prep/:id/retry
const handleRetryInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    const report = await PlacementReport.findById(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    // Reset user answers and evaluations
    report.interviewQuestions.forEach(q => {
      q.userAnswer = '';
      q.evaluation = {
        correctnessScore: 0,
        confidenceScore: 0,
        communicationScore: 0,
        score: 0,
        missingPoints: [],
        idealAnswer: q.idealAnswer,
        suggestions: [],
        evaluated: false
      };
    });

    report.status = 'In Progress';
    await report.save();

    return res.status(200).json(formatSuccessResponse({ report }, 'Interview session reset for retry'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete Interview Practice Session
// @route DELETE /api/agents/placement-prep/:id
const handleDeleteInterviewSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!getDBStatus()) {
      return res.status(400).json({ success: false, message: 'Database disconnected' });
    }

    await PlacementReport.findByIdAndDelete(id);
    return res.status(200).json(formatSuccessResponse({ id }, 'Interview session deleted'));
  } catch (error) {
    next(error);
  }
};

// @desc Multi-Agent Collaboration: Send Weak Skills from PlacementPrep AI to SkillPath AI
// @route POST /api/agents/placement-prep/send-to-skillpath
const handleSendWeakSkillsToSkillPath = async (req, res, next) => {
  try {
    const { weakSkills, targetRole, apiKey } = req.body;

    const skillsToLearn = Array.isArray(weakSkills) && weakSkills.length > 0
      ? weakSkills
      : ['System Design', 'Docker', 'Redis Caching', 'High Latency Optimization'];

    // Invoke SkillPath AI agent using weak skills as current input
    const skillPathResponse = await runSkillPathAgent({
      currentSkills: ['Basic MERN Stack'],
      targetCareer: targetRole || 'Senior Full Stack & AI Engineer',
      forceNew: true,
      weakSkillsOverride: skillsToLearn
    }, apiKey);

    // Transform raw weeklyRoadmap into structured interactive task & resource objects
    const interactiveRoadmap = transformWeeklyRoadmapToInteractiveTasksAndResources(
      skillPathResponse.output.weeklyRoadmap || []
    );

    // Save generated learning plan to DB
    if (getDBStatus() && req.user?._id) {
      try {
        await LearningPlan.create({
          user: req.user._id,
          targetCareer: `Targeted Mastery: ${skillsToLearn.join(', ')}`,
          currentSkills: ['Basic MERN'],
          missingSkills: skillsToLearn,
          estimatedDuration: '4 Weeks',
          weeklyRoadmap: interactiveRoadmap,
          recommendedCourses: skillPathResponse.output.recommendedCourses || [],
          isActive: true
        });
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    return res.status(200).json(formatSuccessResponse({
      learningPlan: { ...skillPathResponse.output, weeklyRoadmap: interactiveRoadmap },
      weakSkills: skillsToLearn
    }, 'Weak skills sent to SkillPath AI successfully! Custom learning roadmap compiled.'));
  } catch (error) {
    next(error);
  }
};

// @desc Multi-Agent Coordinator Chained Execution Pipeline
// @route POST /api/agents/pipeline
const handleMultiAgentPipeline = async (req, res, next) => {
  try {
    const { apiKey, ...profileData } = req.body;
    const userProfile = {
      skills: req.user?.skills || profileData.skills || ['React.js', 'Node.js', 'Python', 'Tailwind CSS'],
      interests: req.user?.interests || profileData.interests || ['AI Agents', 'Full Stack Development'],
      preferredRole: req.user?.preferredRole || profileData.preferredRole || 'Full Stack AI Engineer',
      domain: profileData.domain || 'Autonomous AI Ecosystems',
      teamSize: profileData.teamSize || 4,
      targetCareer: req.user?.targetCareer || profileData.targetCareer || 'Senior AI Engineer',
      targetCompany: req.user?.targetCompany || profileData.targetCompany || 'Google DeepMind',
      resumeText: req.user?.resumeText || profileData.resumeText || 'Engineering student skilled in MERN, AI, and APIs.'
    };

    const pipelineResult = await runMultiAgentPipeline(userProfile, apiKey);

    // Save notification
    if (getDBStatus() && req.user?._id) {
      try {
        await Notification.create({
          user: req.user._id,
          title: 'Multi-Agent Pipeline Complete',
          message: 'All 6 Autonomous AI Agents successfully generated output context for your project.',
          type: 'agent'
        });
      } catch (dbErr) {
        console.warn(`[DB Persist Warning] ${dbErr.message}`);
      }
    }

    return res.status(200).json(pipelineResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCollaboratorAgent,
  handleLitReviewAgent,
  handleHackathonMentorAgent,
  handleSkillPathAgent,
  handleGetActiveSkillPath,
  handleGetAllSkillPaths,
  handleToggleSkillPathTask,
  handleToggleResourceBookmark,
  handleToggleResourceComplete,
  handleRenameSkillPath,
  handleDuplicateSkillPath,
  handleDeleteSkillPath,
  handleSelectActiveSkillPath,
  handleSprintFlowAgent,
  handleGetActiveSprintPlan,
  handleGetAllSprintPlans,
  handleUpdateTaskStatus,
  handleEditTask,
  handleDeleteTask,
  handleRenameSprintPlan,
  handleDuplicateSprintPlan,
  handleDeleteSprintPlan,
  handleSelectActiveSprintPlan,
  handlePlacementPrepAgent,
  handleEvaluateInterviewAnswer,
  handleGetPlacementHistory,
  handleRetryInterviewSession,
  handleDeleteInterviewSession,
  handleSendWeakSkillsToSkillPath,
  handleMultiAgentPipeline
};
