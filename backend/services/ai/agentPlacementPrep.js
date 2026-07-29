const { buildPlacementPrompt, buildAnswerEvaluationPrompt } = require('../../prompts/placementPrompt');
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

const runPlacementPrepAgent = async (input, customKey = null) => {
  const promptText = buildPlacementPrompt(input);
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return formatAgentResponse({
    agent: 'PlacementPrep AI',
    input,
    output,
    executionTime,
    metadata
  });
};

const evaluateInterviewAnswer = async (input, customKey = null) => {
  const promptText = buildAnswerEvaluationPrompt(input);
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  return {
    evaluation: output,
    executionTime,
    metadata
  };
};

module.exports = {
  runPlacementPrepAgent,
  evaluateInterviewAnswer
};
