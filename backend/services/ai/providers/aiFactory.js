const GeminiProvider = require('./geminiProvider');
const MockProvider = require('./mockProvider');

class AIFactory {
  static getProvider(customKey = null) {
    const apiKey = customKey || process.env.GEMINI_API_KEY;
    const gemini = new GeminiProvider(apiKey);

    if (gemini.isConfigured()) {
      return gemini;
    }

    // Default fallback to MockProvider if key is not configured
    return new MockProvider();
  }

  static async generateWithFallback(promptText, customKey = null) {
    const startTime = Date.now();
    let providerUsed = 'Google Gemini API';
    let output;

    const primaryProvider = AIFactory.getProvider(customKey);

    try {
      if (primaryProvider.name.includes('Gemini')) {
        output = await primaryProvider.generateJson(promptText);
        providerUsed = 'Google Gemini API (Live)';
      } else {
        output = await primaryProvider.generateJson(promptText);
        providerUsed = 'TeamForge Simulation Engine (Fallback)';
      }
    } catch (error) {
      console.warn(`[AIFactory Warning] Primary AI Provider failed: ${error.message}. Switching to Mock Engine.`);
      const mockProvider = new MockProvider();
      output = await mockProvider.generateJson(promptText);
      providerUsed = 'TeamForge Simulation Engine (Fallback)';
    }

    const executionTime = `${Date.now() - startTime}ms`;

    return {
      output,
      executionTime,
      metadata: {
        provider: providerUsed
      }
    };
  }
}

module.exports = AIFactory;
