/**
 * Prompt template for Agent 4: SkillPath AI
 */
const buildSkillPathPrompt = ({ currentSkills, targetCareer, projectContext }) => {
  return `You are SkillPath AI, an expert tech career strategist, skill gap analyst, and learning platform engineer.

Current Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}
Target Career Goal: "${targetCareer || 'Senior AI Engineer'}"
${projectContext ? `Project Context: ${JSON.stringify(projectContext)}` : ''}

Generate a personalized weekly learning path to bridge the skill gap.
For every week topic, provide curated, reliable learning resources from trusted platforms: Official Documentation, GeeksforGeeks, MDN Web Docs / W3Schools, freeCodeCamp, YouTube, GitHub, and Practice Platforms. Never generate broken or fake URLs. Use official domain names (e.g., react.dev, geeksforgeeks.org, developer.mozilla.org, freecodecamp.org, youtube.com, github.com).

Respond ONLY with a valid JSON object matching this structure:
{
  "targetCareer": "${targetCareer || 'Senior AI Engineer'}",
  "missingSkills": ["LangChain / LlamaIndex", "Vector Databases (Pinecone)", "System Design for High Scale", "Docker Containerization"],
  "estimatedDuration": "4 Weeks",
  "weeklyRoadmap": [
    {
      "week": 1,
      "title": "React Architecture & State Management",
      "focusSkills": ["React Context API", "Custom Hooks"],
      "tasks": [
        "Master system prompt design for deterministic JSON parsing",
        "Implement error fallback wrappers for LLM API calls"
      ],
      "resources": [
        { "title": "React Official Documentation", "url": "https://react.dev", "type": "Documentation", "platform": "Official Docs" },
        { "title": "GeeksforGeeks React Guide", "url": "https://www.geeksforgeeks.org/reactjs-tutorial/", "type": "GeeksforGeeks", "platform": "GeeksforGeeks" },
        { "title": "MDN Web Docs - React Basics", "url": "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started", "type": "MDN", "platform": "MDN Web Docs" },
        { "title": "freeCodeCamp React Full Course", "url": "https://www.freecodecamp.org/news/tag/react/", "type": "freeCodeCamp", "platform": "freeCodeCamp" },
        { "title": "YouTube React Context Tutorial", "url": "https://www.youtube.com/results?search_query=react+context+api+tutorial", "type": "YouTube", "platform": "YouTube" },
        { "title": "GitHub React Architecture Examples", "url": "https://github.com/topics/react-boilerplate", "type": "GitHub", "platform": "GitHub" }
      ]
    },
    {
      "week": 2,
      "title": "Node.js REST API & AI Provider Integration",
      "focusSkills": ["Express.js", "Gemini API", "JWT Auth"],
      "tasks": [
        "Build decoupled AI Provider Factory with fallback engine",
        "Enforce standardized JSON response formatting across all API endpoints"
      ],
      "resources": [
        { "title": "Node.js Official Documentation", "url": "https://nodejs.org/docs", "type": "Documentation", "platform": "Official Docs" },
        { "title": "GeeksforGeeks Node.js REST API", "url": "https://www.geeksforgeeks.org/node-js-restful-api/", "type": "GeeksforGeeks", "platform": "GeeksforGeeks" },
        { "title": "freeCodeCamp Node.js Crash Course", "url": "https://www.freecodecamp.org/news/tag/nodejs/", "type": "freeCodeCamp", "platform": "freeCodeCamp" },
        { "title": "YouTube Node.js API Tutorial", "url": "https://www.youtube.com/results?search_query=nodejs+rest+api+tutorial", "type": "YouTube", "platform": "YouTube" },
        { "title": "GitHub Express REST Boilerplate", "url": "https://github.com/topics/express-rest-api", "type": "GitHub", "platform": "GitHub" }
      ]
    },
    {
      "week": 3,
      "title": "Vector DBs & RAG System Design",
      "focusSkills": ["Embeddings", "Pinecone", "Vector Search"],
      "tasks": [
        "Chunk documents into 500-token chunks with overlap",
        "Perform similarity search against vector index"
      ],
      "resources": [
        { "title": "Pinecone Official Learning Hub", "url": "https://www.pinecone.io/learn/", "type": "Documentation", "platform": "Official Docs" },
        { "title": "GeeksforGeeks Vector Database Guide", "url": "https://www.geeksforgeeks.org/vector-database/", "type": "GeeksforGeeks", "platform": "GeeksforGeeks" },
        { "title": "YouTube RAG & Pinecone Crash Course", "url": "https://www.youtube.com/results?search_query=rag+pinecone+vector+db+tutorial", "type": "YouTube", "platform": "YouTube" }
      ]
    },
    {
      "week": 4,
      "title": "Docker Containerization & Production Deployment",
      "focusSkills": ["Docker", "Vercel", "Render"],
      "tasks": [
        "Write multi-stage Dockerfile for Node.js backend",
        "Deploy production bundle to Render and Vercel"
      ],
      "resources": [
        { "title": "Docker Official Getting Started Docs", "url": "https://docs.docker.com/get-started/", "type": "Documentation", "platform": "Official Docs" },
        { "title": "freeCodeCamp Docker Handbook", "url": "https://www.freecodecamp.org/news/tag/docker/", "type": "freeCodeCamp", "platform": "freeCodeCamp" },
        { "title": "YouTube Docker for Developers", "url": "https://www.youtube.com/results?search_query=docker+for+developers+full+course", "type": "YouTube", "platform": "YouTube" }
      ]
    }
  ],
  "recommendedCourses": [
    { "name": "Multi-Agent Systems with AutoGen", "provider": "DeepLearning.AI", "url": "https://deeplearning.ai", "level": "Intermediate" },
    { "name": "Full Stack Open - Modern Web Development", "provider": "University of Helsinki", "url": "https://fullstackopen.com", "level": "Advanced" }
  ]
}`;
};

module.exports = { buildSkillPathPrompt };
