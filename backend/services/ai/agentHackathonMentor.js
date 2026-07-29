const { buildHackathonPrompt } = require('../../prompts/hackathonPrompt');
const AIFactory = require('./providers/aiFactory');
const { formatAgentResponse } = require('../../utils/responseFormatter');

const runHackathonMentorAgent = async (input, customKey = null) => {
  const promptText = buildHackathonPrompt(input);
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return formatAgentResponse({
    agent: 'Hackathon Mentor AI',
    input,
    output,
    executionTime,
    metadata
  });
};

module.exports = { runHackathonMentorAgent };
