const { buildSkillPathPrompt } = require('../../prompts/skillPathPrompt');
const AIFactory = require('./providers/aiFactory');
const { formatAgentResponse } = require('../../utils/responseFormatter');

const runSkillPathAgent = async (input, customKey = null) => {
  const promptText = buildSkillPathPrompt(input);
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return formatAgentResponse({
    agent: 'SkillPath AI',
    input,
    output,
    executionTime,
    metadata
  });
};

module.exports = { runSkillPathAgent };
