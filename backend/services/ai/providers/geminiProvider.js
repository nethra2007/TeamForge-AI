const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.name = 'Google Gemini API';
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async generateJson(promptText) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured.');
    }

    const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-exp'];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        });

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (err) {
        lastError = err;
        // Try next model candidate
      }
    }

    console.warn(`[GeminiProvider Warning] API call failed: ${lastError?.message}. Switching to fallback provider.`);
    throw lastError;
  }
}

module.exports = GeminiProvider;
