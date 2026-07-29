/**
 * Prompt templates for Agent 5: SprintFlow AI
 */
const buildSprintFlowPrompt = ({ projectName, projectDescription, timeline, teamMembers = [], techStack, teamSize }) => {
  const name = projectName?.trim() || 'Custom Software Project';
  const desc = projectDescription?.trim() || 'Software engineering solution';
  const horizon = timeline?.trim() || '4 Weeks';
  const stack = techStack?.trim() || 'Full Stack';
  const size = teamSize || 4;

  // Extract number of weeks from horizon (e.g. "6 Weeks" -> 6, "2 Weeks" -> 2)
  const weeksMatch = horizon.match(/(\d+)/);
  const numWeeks = weeksMatch ? parseInt(weeksMatch[1], 10) : 4;

  return `You are SprintFlow AI, an expert Senior Agile Scrum Master & Software Product Architect.

CRITICAL REQUIREMENTS:
1. Generate an authentic, professional Agile Sprint Plan tailored EXCLUSIVELY to "${name}" (${desc}) built with "${stack}".
2. You MUST generate EXACTLY ${numWeeks} Sprints (Sprint 1 to Sprint ${numWeeks}) and EXACTLY ${numWeeks} Milestones.
3. ABSOLUTELY NO REPETITIVE TASK NAMES. Do NOT append numbers to task titles (e.g. NEVER use "Core Module 1", "Core Module 2"). Each sprint MUST have completely distinct, realistic software engineering goals and tasks following a natural project lifecycle:
   - Early Sprints: System Architecture, Database Schemas, Authentication, Core Infrastructure
   - Middle Sprints: Domain Business Logic, AI Models/APIs, Realtime Processing, Feature Dashboards
   - Later Sprints: Integrations, Performance Optimization, Security Audit, Cloud Deployment & Monitoring
4. ALL generated tasks MUST start with status = "To Do".
5. Every task MUST include: unique title, detailed technical description, realistic estimated hours (4-12h), priority ("High", "Medium", "Low"), assignee, and 2-3 specific acceptance criteria.

Parameters:
- Project Name: "${name}"
- Description: "${desc}"
- Timeline Horizon: ${numWeeks} Weeks (${numWeeks} Sprints)
- Team Size: ${size}
- Technology Stack: "${stack}"

Respond ONLY with a valid JSON object matching this structure:
{
  "projectTitle": "${name} Agile Development Sprint Plan",
  "projectDescription": "${desc}",
  "totalDurationWeeks": ${numWeeks},
  "velocityScore": 92,
  "projectHealthScore": 95,
  "riskLevel": "Low Risk",
  "estimatedCompletionDate": "${numWeeks} Weeks from start",
  "sprints": [
    {
      "sprintNumber": 1,
      "sprintGoal": "System Architecture & Database Schema Design",
      "durationWeeks": 1,
      "tasks": [
        {
          "id": "SP-101",
          "title": "Configure Database Schemas and Auth Gateway",
          "description": "Technical task description specific to ${name}.",
          "assignee": "Backend Lead",
          "priority": "High",
          "status": "To Do",
          "estimatedHours": 6,
          "acceptanceCriteria": [
            "Criteria 1 specific to ${name}",
            "Criteria 2 specific to ${name}"
          ],
          "suggestedDoc": "https://developer.mozilla.org"
        }
      ]
    }
  ],
  "milestones": [
    {
      "title": "M1: Architecture & Foundation Milestone",
      "deadline": "Week 1",
      "deliverables": ["Deliverable 1 for ${name}"],
      "completed": false
    }
  ]
}`;
};

module.exports = {
  buildSprintFlowPrompt
};
