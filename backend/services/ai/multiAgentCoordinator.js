const { runCollaboratorAgent } = require('./agentCollaborator');
const { runLitReviewAgent } = require('./agentLitReview');
const { runHackathonMentorAgent } = require('./agentHackathonMentor');
const { runSkillPathAgent } = require('./agentSkillPath');
const { runSprintFlowAgent } = require('./agentSprintFlow');
const { runPlacementPrepAgent } = require('./agentPlacementPrep');

/**
 * MultiAgentCoordinator executes the 6 agents sequentially, preserving shared pipeline context.
 * Step 1: TeamForge Collaborator
 * Step 2: Hackathon Mentor AI (uses collaborator project recommendation)
 * Step 3: LitReview AI (uses hackathon project topic)
 * Step 4: SprintFlow AI (uses hackathon project architecture & timeline)
 * Step 5: SkillPath AI (uses current skills & missing tech from sprint plan)
 * Step 6: PlacementPrep AI (uses target career, project summary & resume context)
 */
const runMultiAgentPipeline = async (initialProfile, customKey = null) => {
  const startTime = Date.now();

  const pipelineContext = {
    initialInput: initialProfile,
    steps: {},
    history: []
  };

  // Step 1: TeamForge Collaborator
  console.log('[Multi-Agent Pipeline] Executing Agent 1: TeamForge Collaborator...');
  const collaboratorRes = await runCollaboratorAgent({
    leaderProfile: {
      name: initialProfile.name || 'Alex Morgan',
      skills: initialProfile.skills || ['React.js', 'Node.js', 'Python'],
      preferredRole: initialProfile.preferredRole || 'Full Stack Engineer',
      preferredDomains: [initialProfile.domain || 'Autonomous AI Agents'],
      experience: '2 years'
    },
    projectSpec: {
      projectName: initialProfile.projectName || 'Autonomous AI Platform',
      projectDescription: 'Building a multi-agent AI system for student innovation.',
      domain: initialProfile.domain || 'Autonomous AI Agents',
      requiredTechnologies: initialProfile.skills || ['React.js', 'Node.js', 'Python'],
      teamSize: initialProfile.teamSize || 4
    },
    candidatePool: [
      { _id: 'c_001', name: 'Sophia Martinez', college: 'Stanford', skills: ['Python', 'FastAPI', 'PyTorch'], preferredRole: 'AI / ML Specialist' },
      { _id: 'c_002', name: 'Liam Patel', college: 'UC Berkeley', skills: ['Tailwind CSS', 'React', 'Figma'], preferredRole: 'UI/UX Designer' },
      { _id: 'c_003', name: 'Priya Sharma', college: 'BITS Pilani', skills: ['MongoDB', 'Docker', 'AWS'], preferredRole: 'Cloud Architect' }
    ]
  }, customKey);
  pipelineContext.steps.collaborator = collaboratorRes.output;
  pipelineContext.history.push({ agent: 'TeamForge Collaborator', timestamp: new Date().toISOString() });

  // Step 2: Hackathon Mentor AI
  console.log('[Multi-Agent Pipeline] Executing Agent 2: Hackathon Mentor AI...');
  const hackathonRes = await runHackathonMentorAgent({
    theme: initialProfile.domain || 'AI SaaS & Web Development',
    problemStatement: `Build an autonomous multi-agent platform for engineering student productivity and collaboration.`,
    projectIdea: initialProfile.projectName || 'TeamForge AI Platform',
    teamSize: initialProfile.teamSize || 4,
    teamContext: collaboratorRes.output.recommendedTeammates
  }, customKey);
  pipelineContext.steps.hackathonMentor = hackathonRes.output;
  pipelineContext.history.push({ agent: 'Hackathon Mentor AI', timestamp: new Date().toISOString() });

  // Step 3: LitReview AI
  console.log('[Multi-Agent Pipeline] Executing Agent 3: LitReview AI...');
  const researchTopic = hackathonRes.output.refinedProjectTitle || hackathonRes.output.projectIdea?.title || initialProfile.projectName || 'Autonomous Multi-Agent AI Platform';
  const litReviewRes = await runLitReviewAgent({
    topic: researchTopic,
    domain: initialProfile.domain || 'Computer Science & AI'
  }, customKey);
  pipelineContext.steps.litReview = litReviewRes.output;
  pipelineContext.history.push({ agent: 'LitReview AI', timestamp: new Date().toISOString() });

  // Step 4: SprintFlow AI
  console.log('[Multi-Agent Pipeline] Executing Agent 4: SprintFlow AI...');
  const sprintRes = await runSprintFlowAgent({
    projectDetails: `${hackathonRes.output.projectIdea?.title} - ${hackathonRes.output.projectIdea?.summary}`,
    timeline: '4 Weeks',
    teamMembers: collaboratorRes.output.recommendedTeammates
  }, customKey);
  pipelineContext.steps.sprintFlow = sprintRes.output;
  pipelineContext.history.push({ agent: 'SprintFlow AI', timestamp: new Date().toISOString() });

  // Step 5: SkillPath AI
  console.log('[Multi-Agent Pipeline] Executing Agent 5: SkillPath AI...');
  const skillPathRes = await runSkillPathAgent({
    currentSkills: initialProfile.skills || ['React.js', 'Node.js'],
    targetCareer: initialProfile.targetCareer || 'Senior AI Solutions Engineer',
    projectContext: hackathonRes.output.techStack
  }, customKey);
  pipelineContext.steps.skillPath = skillPathRes.output;
  pipelineContext.history.push({ agent: 'SkillPath AI', timestamp: new Date().toISOString() });

  // Step 6: PlacementPrep AI
  console.log('[Multi-Agent Pipeline] Executing Agent 6: PlacementPrep AI...');
  const placementRes = await runPlacementPrepAgent({
    resumeText: initialProfile.resumeText || `Engineering student proficient in ${initialProfile.skills?.join(', ')}. Built ${hackathonRes.output.projectIdea?.title}.`,
    targetCompany: initialProfile.targetCompany || 'Top Tech Product Companies',
    targetRole: initialProfile.targetCareer || 'Full Stack & AI Engineer'
  }, customKey);
  pipelineContext.steps.placementPrep = placementRes.output;
  pipelineContext.history.push({ agent: 'PlacementPrep AI', timestamp: new Date().toISOString() });

  const totalTime = `${Date.now() - startTime}ms`;

  return {
    success: true,
    pipeline: 'TeamForge Autonomous 6-Agent Chained Ecosystem',
    totalExecutionTime: totalTime,
    timestamp: new Date().toISOString(),
    context: pipelineContext
  };
};

module.exports = { runMultiAgentPipeline };
