/**
 * Dynamic Prompt Templates for Agent 6: PlacementPrep AI
 */
const buildPlacementPrompt = ({ resumeText, targetCompany, targetRole, userProjects = [] }) => {
  const projectListStr = userProjects.length > 0
    ? userProjects.map(p => `${p.title}: ${p.description} (Tech: ${p.techStack?.join(', ')})`).join('; ')
    : 'TeamForge AI (Multi-Agent Student Career Copilot, React, Node.js, Express, MongoDB, Gemini API, JWT, WebSockets)';

  return `You are PlacementPrep AI, a Senior Technical Hiring Manager and Interview Architect for top product tech companies (${targetCompany || 'Google, Amazon, Microsoft, Top SaaS Scaleups'}).

Candidate Context:
Target Company: "${targetCompany || 'Google / Top Product Tech'}"
Target Role: "${targetRole || 'Full Stack & AI Engineer'}"
Resume Text: "${resumeText || 'Final year CS student with MERN stack and AI agent experience.'}"
User Projects: "${projectListStr}"

Task:
1. Conduct a rigorous resume analysis (Strengths, Weaknesses, Improvements, ATS Compatibility Score 0-100%).
2. Generate a dynamic interview question bank containing exactly 15 questions divided as follows:
   - 5 Easy Questions
   - 5 Medium Questions
   - 5 Hard Questions
   Across these 6 Categories: Technical, Behavioral, Project, System Design, Coding, HR.
3. For Coding questions, include short snippets or output prediction/debugging scenarios.
4. For Project questions, ask specific architecture, database, JWT, APIs, AI integration, MongoDB, React, Express, and deployment questions based on the candidate's projects.

Respond ONLY with a valid JSON object matching this structure:
{
  "targetCompany": "${targetCompany || 'Google / Top Product Tech'}",
  "targetRole": "${targetRole || 'Full Stack & AI Engineer'}",
  "readinessScore": 86,
  "atsScore": 90,
  "resumeFeedback": {
    "strengths": [
      "Solid hands-on full-stack experience with modern MERN tech stack",
      "Demonstrates high initiative through autonomous AI multi-agent project work",
      "Clean modular backend architecture and JWT authentication"
    ],
    "weaknesses": [
      "Needs explicit metric achievements (e.g. 'Improved API response latency by 35%')",
      "Could highlight distributed caching and messaging queue integration"
    ],
    "suggestions": [
      "Add quantifiable performance metrics to project bullet points.",
      "Include a direct live demo URL and GitHub repository link."
    ],
    "atsFeedback": "Resume contains strong keyword density for Full Stack & AI roles. Adding quantifiable latency & throughput metrics will boost ATS score to 95%+."
  },
  "performanceMetrics": {
    "technicalScore": 82,
    "behavioralScore": 85,
    "projectScore": 88,
    "communicationScore": 84,
    "codingScore": 80,
    "overallReadiness": 84
  },
  "skillGap": ["Distributed Caching (Redis)", "Kafka / RabbitMQ", "System Design Load Balancing"],
  "weakSkills": ["Redis", "Docker Containerization", "Kafka Queues"],
  "interviewQuestions": [
    {
      "id": "q1",
      "category": "Technical",
      "difficulty": "Easy",
      "type": "Conceptual",
      "question": "What is the difference between state and props in React, and when should you lift state up?",
      "idealAnswer": "Props are read-only inputs passed from parent to child components, while state is private mutable data managed within a component. State is lifted up to the closest common ancestor when multiple child components need to share and react to the same state changes.",
      "keyConcepts": ["React State", "Props Immutability", "Lifting State Up"]
    },
    {
      "id": "q2",
      "category": "Project",
      "difficulty": "Medium",
      "type": "Conceptual",
      "question": "In your TeamForge AI project, how did you handle state preservation and security during JWT authentication between React frontend and Express backend?",
      "idealAnswer": "JWT tokens are signed with a strong secret key on the backend upon password verification. The client stores the token securely in AuthContext memory/sessionStorage and attaches it as a Bearer token in HTTP Authorization headers for protected REST endpoints verified via Express middleware.",
      "keyConcepts": ["JWT Auth", "Express Middleware", "AuthContext"]
    },
    {
      "id": "q3",
      "category": "Coding",
      "difficulty": "Easy",
      "type": "MCQ",
      "question": "What will be the output of console.log(typeof NaN) in JavaScript?",
      "options": ["'number'", "'nan'", "'undefined'", "'object'"],
      "idealAnswer": "'number'",
      "keyConcepts": ["JavaScript Types", "NaN Behavior"]
    },
    {
      "id": "q4",
      "category": "Coding",
      "difficulty": "Medium",
      "type": "Output Prediction",
      "question": "What will be printed to the console?\n\nconsole.log(1 + '2' + 3);\nconsole.log(1 + 2 + '3');",
      "codeSnippet": "console.log(1 + '2' + 3);\nconsole.log(1 + 2 + '3');",
      "idealAnswer": "Output:\n'123'\n'33'\nExplanation: The first expression evaluates 1 + '2' to '12' via string coercion, then '12' + 3 to '123'. The second evaluates 1 + 2 to 3 first, then 3 + '3' to '33'.",
      "keyConcepts": ["Type Coercion", "Operator Precedence"]
    },
    {
      "id": "q5",
      "category": "System Design",
      "difficulty": "Hard",
      "type": "Conceptual",
      "question": "Design a high-throughput real-time multi-agent execution pipeline that handles 10,000 concurrent student requests without crashing Express API workers.",
      "idealAnswer": "Use an asynchronous task queue like BullMQ powered by Redis to decouple API request ingestion from AI agent execution workers. Stream execution status updates back to React clients using WebSockets or Server-Sent Events (SSE), and implement rate-limiting circuit breakers around Gemini API endpoints.",
      "keyConcepts": ["Redis Queue", "Worker Threads", "WebSockets", "Circuit Breakers"]
    },
    {
      "id": "q6",
      "category": "Behavioral",
      "difficulty": "Easy",
      "type": "Behavioral",
      "question": "Tell me about a technical dispute you had with a teammate during project development and how you resolved it.",
      "idealAnswer": "Utilized the STAR method: Described a disagreement over monolithic vs modular AI prompt organization. Evaluated both approaches by benchmarking maintainability and testability, agreed on an abstracted AI Provider pattern, and documented clear API contracts.",
      "keyConcepts": ["STAR Method", "Conflict Resolution", "Technical Collaboration"]
    },
    {
      "id": "q7",
      "category": "HR",
      "difficulty": "Easy",
      "type": "Behavioral",
      "question": "Why do you specifically want to join ${targetCompany || 'our company'} in a ${targetRole || 'Full Stack & AI'} capacity?",
      "idealAnswer": "Highlighted alignment between personal experience in autonomous multi-agent systems and the company's innovation roadmap in large-scale AI applications, showing passion for continuous learning and engineering excellence.",
      "keyConcepts": ["Role Alignment", "Company Knowledge", "Career Motivation"]
    }
  ]
}`;
};

const buildAnswerEvaluationPrompt = ({ question, expectedSkill, userAnswer, idealAnswer, category, difficulty }) => {
  return `You are an expert AI Technical Interviewer evaluating a candidate's response.

Question Category: ${category || 'Technical'} (${difficulty || 'Medium'})
Question: "${question}"
Candidate User Answer: "${userAnswer || 'No answer provided'}"
Ideal Reference Answer: "${idealAnswer || ''}"

Evaluate the candidate's answer thoroughly and constructively.
Respond ONLY with a valid JSON object matching this structure:
{
  "score": 8.5,
  "correctnessScore": 9.0,
  "confidenceScore": 8.0,
  "communicationScore": 8.5,
  "missingPoints": [
    "Did not mention Redis cache invalidation strategies",
    "Could explain circuit breaker threshold triggers"
  ],
  "idealAnswer": "${idealAnswer || ''}",
  "suggestions": [
    "Mention specific technical keywords like TTL and cache invalidation when discussing caching.",
    "Structure your response clearly using the STAR method for behavioral/project questions."
  ],
  "weakSkillsIdentified": ["Redis Cache Invalidation", "Circuit Breakers"]
}`;
};

module.exports = {
  buildPlacementPrompt,
  buildAnswerEvaluationPrompt
};
