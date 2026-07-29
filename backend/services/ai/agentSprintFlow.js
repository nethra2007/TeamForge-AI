const { buildSprintFlowPrompt } = require('../../prompts/sprintFlowPrompt');
const AIFactory = require('./providers/aiFactory');

const formatAgentResponse = ({ agent, input, output, executionTime = '25ms', metadata = {} }) => ({
  success: true,
  agent,
  input,
  output,
  executionTime,
  timestamp: new Date().toISOString(),
  metadata
});

const runSprintFlowAgent = async (input, customKey = null) => {
  const promptText = buildSprintFlowPrompt(input);
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return formatAgentResponse({
    agent: 'SprintFlow AI',
    input,
    output,
    executionTime,
    metadata
  });
};

module.exports = {
  runSprintFlowAgent
};
