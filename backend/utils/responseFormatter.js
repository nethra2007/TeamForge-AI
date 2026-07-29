/**
 * Standardized response formatters for TeamForge AI
 */

const formatAgentResponse = ({ agent, input, output, executionTime, metadata = {} }) => {
  return {
    success: true,
    agent: agent || 'TeamForge AI Agent',
    timestamp: new Date().toISOString(),
    input: input || {},
    output: output || {},
    executionTime: executionTime || '0ms',
    metadata: {
      provider: metadata.provider || 'Gemini AI Engine',
      version: '1.0.0',
      ...metadata
    }
  };
};

const formatSuccessResponse = (data, message = 'Success', metadata = {}) => {
  return {
    success: true,
    message,
    timestamp: new Date().toISOString(),
    data,
    metadata
  };
};

const formatErrorResponse = (message = 'An unexpected error occurred', errorCode = 'INTERNAL_SERVER_ERROR', details = null) => {
  return {
    success: false,
    message,
    errorCode,
    details,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  formatAgentResponse,
  formatSuccessResponse,
  formatErrorResponse
};
