const { buildCollaboratorPrompt } = require('../../prompts/collaboratorPrompt');
const AIFactory = require('./providers/aiFactory');
const { formatAgentResponse } = require('../../utils/responseFormatter');

const runCollaboratorAgent = async ({ leaderProfile, projectSpec, candidatePool }, customKey = null) => {
  const promptText = buildCollaboratorPrompt({ leaderProfile, projectSpec, candidatePool });
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return formatAgentResponse({
    agent: 'TeamForge Collaborator',
    input: { projectSpec, leaderName: leaderProfile?.name, candidatePoolSize: candidatePool?.length },
    output,
    executionTime,
    metadata
  });
};

module.exports = { runCollaboratorAgent };
