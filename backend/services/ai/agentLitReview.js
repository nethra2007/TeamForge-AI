const { buildLitReviewPrompt } = require('../../prompts/litReviewPrompt');
const AIFactory = require('./providers/aiFactory');
const { searchAcademicPapers } = require('../academicApi');
const { formatAgentResponse } = require('../../utils/responseFormatter');

const runLitReviewAgent = async (input, customKey = null) => {
  const { topic, domain } = input;

  // Search real papers via Semantic Scholar API with arXiv fallback
  const externalPapers = await searchAcademicPapers(topic, 5);

  if (!externalPapers || externalPapers.length === 0) {
    return formatAgentResponse({
      agent: 'LitReview AI',
      input,
      output: {
        papers: [],
        noPapersFound: true,
        literatureReview: `No relevant research papers were found for "${topic}" across Semantic Scholar or arXiv databases.`,
        keyFindings: [],
        researchGap: "Unable to identify research gaps as no public academic papers matched this query.",
        futureScope: "Try broadening your search query or specifying standard academic terms.",
        conclusion: "No literature available for processing."
      },
      executionTime: '300ms',
      metadata: { provider: 'Academic API Engine' }
    });
  }

  const promptText = buildLitReviewPrompt({ topic, domain, externalPapers });
  const { output, executionTime, metadata } = await AIFactory.generateWithFallback(promptText, customKey);

  // Attach real retrieved papers to output
  output.papers = externalPapers;
  output.noPapersFound = false;

  return formatAgentResponse({
    agent: 'LitReview AI',
    input,
    output,
    executionTime,
    metadata
  });
};

module.exports = { runLitReviewAgent };
