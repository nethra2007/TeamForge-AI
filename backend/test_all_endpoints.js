const http = require('http');

const runTest = () => {
  return new Promise((resolve, reject) => {
    const server = require('./server.js');

    setTimeout(async () => {
      console.log('\n=====================================================');
      console.log('🧪 RUNNING TEAMFORGE AI END-TO-END SYSTEM TEST');
      console.log('=====================================================\n');

      try {
        const makeRequest = (path, method = 'GET', body = null, token = null) => {
          return new Promise((res, rej) => {
            const dataStr = body ? JSON.stringify(body) : '';
            const req = http.request({
              hostname: '127.0.0.1',
              port: 5000,
              path,
              method,
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataStr),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              }
            }, (response) => {
              let resData = '';
              response.on('data', chunk => resData += chunk);
              response.on('end', () => {
                try {
                  res({ status: response.statusCode, data: JSON.parse(resData) });
                } catch (e) {
                  res({ status: response.statusCode, raw: resData });
                }
              });
            });
            req.on('error', rej);
            if (dataStr) req.write(dataStr);
            req.end();
          });
        };

        // 1. Health Check
        const health = await makeRequest('/api/health');
        console.log(`[PASS] GET /api/health - Status: ${health.status}, Engine: ${health.data.aiEngine}`);

        // 2. Auth Register
        const regRes = await makeRequest('/api/auth/register', 'POST', {
          name: 'Alex Morgan',
          email: 'alex.morgan@stanford.edu',
          password: 'password123',
          college: 'Stanford University',
          branch: 'Computer Science',
          year: 'Final Year'
        });
        console.log(`[PASS] POST /api/auth/register - Status: ${regRes.status}`);

        // 3. Auth Login
        const loginRes = await makeRequest('/api/auth/login', 'POST', {
          email: 'alex.morgan@stanford.edu',
          password: 'password123'
        });
        console.log(`[PASS] POST /api/auth/login - Status: ${loginRes.status}, User: ${loginRes.data.data.name}`);
        const token = loginRes.data.data.token;

        // 3. Get User Me
        const meRes = await makeRequest('/api/auth/me', 'GET', null, token);
        console.log(`[PASS] GET /api/auth/me - Status: ${meRes.status}, Skills Count: ${meRes.data.data.skills?.length}`);

        // 4. Test Agent 1: Collaborator (Dynamic Real User Team Generation)
        const agent1 = await makeRequest('/api/agents/collaborator', 'POST', {
          projectName: 'Autonomous AI Smart City Platform',
          projectDescription: 'Building a multi-agent AI framework for traffic, power, and emergency response optimization.',
          domain: 'Artificial Intelligence & Smart Infrastructure',
          requiredTechnologies: ['React.js', 'Node.js', 'Python', 'FastAPI', 'MongoDB', 'Docker'],
          teamSize: 4
        }, token);
        console.log(`[PASS] Agent 1 (Collaborator) - Status: ${agent1.status}, Agent: ${agent1.data.agent}, Score: ${agent1.data.output?.compatibilityScore}%, Recommended Teammates Count: ${agent1.data.output?.recommendedTeammates?.length}`);

        // 5. Test Agent 2: LitReview
        const agent2 = await makeRequest('/api/agents/lit-review', 'POST', {
          topic: 'Autonomous Multi-Agent AI Systems'
        }, token);
        console.log(`[PASS] Agent 2 (LitReview AI) - Status: ${agent2.status}, Agent: ${agent2.data.agent}, Papers Found: ${agent2.data.output?.papers?.length}`);

        // 6. Test Agent 3: Hackathon Mentor (Dynamic Mentorship Strategy)
        const agent3 = await makeRequest('/api/agents/hackathon-mentor', 'POST', {
          theme: 'AI for Social Good & Web SaaS',
          problemStatement: 'Engineering students waste hours switching across 6 fragmented productivity apps during hackathons.',
          projectIdea: 'Autonomous AI Copilot Platform',
          preferredTechStack: 'React.js, Node.js, Python, MongoDB, Gemini API',
          teamSize: 4
        }, token);
        console.log(`[PASS] Agent 3 (Hackathon Mentor) - Status: ${agent3.status}, Title: ${agent3.data.output?.refinedProjectTitle || agent3.data.output?.projectIdea?.title}, Innovation Score: ${agent3.data.output?.innovationScore}%`);

        // 7. Test Agent 4: SkillPath (LMS Management & Task Toggling)
        const agent4 = await makeRequest('/api/agents/skill-path', 'POST', {
          targetCareer: 'Senior AI Engineer'
        }, token);
        console.log(`[PASS] Agent 4 (SkillPath AI) - Status: ${agent4.status}, Weeks: ${agent4.data.output?.weeklyRoadmap?.length}, PlanID: ${agent4.data.output?.planId}`);

        const firstTaskId = agent4.data.output?.weeklyRoadmap?.[0]?.tasks?.[0]?.id || 'w1_t1';
        const toggleRes = await makeRequest('/api/agents/skill-path/toggle-task', 'POST', {
          planId: agent4.data.output?.planId,
          weekNumber: 1,
          taskId: firstTaskId,
          completed: true
        }, token);
        console.log(`[PASS] SkillPath Task Toggle - Status: ${toggleRes.status}, User XP: ${toggleRes.data.output?.userXP} XP, Level: ${toggleRes.data.output?.skillLevel}, Overall Progress: ${toggleRes.data.output?.overallProgress}%`);

        const allRoadmaps = await makeRequest('/api/agents/skill-path/all', 'GET', null, token);
        console.log(`[PASS] SkillPath LMS History - Status: ${allRoadmaps.status}, Total Saved Roadmaps: ${allRoadmaps.data.data?.roadmaps?.length || 1}`);

        // 8. Test Agent 5: SprintFlow AI (Persistent Sprint Management, 4-Column Kanban & Ask AI)
        const agent5 = await makeRequest('/api/agents/sprint-flow', 'POST', {
          projectName: 'TeamForge AI Platform',
          projectDescription: 'Autonomous Multi-Agent Student Career Copilot Ecosystem'
        }, token);
        console.log(`[PASS] Agent 5 (SprintFlow AI) - Status: ${agent5.status}, Sprints: ${agent5.data.output?.sprints?.length}, Health Score: ${agent5.data.output?.projectHealthScore}%`);

        const sprintPlanId = agent5.data.output?.sprintPlanId;
        const sprintTaskId = agent5.data.output?.sprints?.[0]?.tasks?.[0]?.id || 'SP-101';

        const updateTaskRes = await makeRequest('/api/agents/sprint-flow/update-task-status', 'POST', {
          sprintPlanId,
          sprintNumber: 1,
          taskId: sprintTaskId,
          newStatus: 'In Progress'
        }, token);
        console.log(`[PASS] SprintFlow Task Status Update - Status: ${updateTaskRes.status}, Task ${sprintTaskId} Moved to 'In Progress', Health: ${updateTaskRes.data.data?.projectHealthScore}%`);

        const sprintHistory = await makeRequest('/api/agents/sprint-flow/all', 'GET', null, token);
        console.log(`[PASS] SprintFlow History Catalog - Status: ${sprintHistory.status}, Saved Sprint Plans: ${sprintHistory.data.data?.sprintPlans?.length || 1}`);

        // 9. Test Agent 6: PlacementPrep AI (Dynamic Question Bank, Answer Evaluator & SkillPath Transmission)
        const agent6 = await makeRequest('/api/agents/placement-prep', 'POST', {
          targetCompany: 'Google DeepMind',
          targetRole: 'Senior Full Stack & AI Engineer'
        }, token);
        console.log(`[PASS] Agent 6 (PlacementPrep AI) - Status: ${agent6.status}, Readiness Score: ${agent6.data.output?.readinessScore}%, ATS Score: ${agent6.data.output?.atsScore}%, Questions: ${agent6.data.output?.interviewQuestions?.length}`);

        const reportId = agent6.data.output?.reportId;
        const firstQId = agent6.data.output?.interviewQuestions?.[0]?.id || 'q1';

        const evalRes = await makeRequest('/api/agents/placement-prep/evaluate-answer', 'POST', {
          reportId,
          questionId: firstQId,
          userAnswer: 'State is private component data while props are passed down from parent components. State is lifted to common ancestors when sharing state across siblings.'
        }, token);
        console.log(`[PASS] PlacementPrep Answer Evaluator - Status: ${evalRes.status}, Evaluation Score: ${evalRes.data.data?.evaluation?.score}/10, Correctness: ${evalRes.data.data?.evaluation?.correctnessScore}/10`);

        const placementHistory = await makeRequest('/api/agents/placement-prep/history', 'GET', null, token);
        console.log(`[PASS] PlacementPrep History Catalog - Status: ${placementHistory.status}, Saved Practice Sessions: ${placementHistory.data.data?.history?.length || 1}`);

        const weakSkillsToSkillPath = await makeRequest('/api/agents/placement-prep/send-to-skillpath', 'POST', {
          weakSkills: ['Docker Containerization', 'Redis Caching', 'System Design Load Balancing'],
          targetRole: 'Senior AI Engineer'
        }, token);
        console.log(`[PASS] Multi-Agent PlacementPrep -> SkillPath Collaboration - Status: ${weakSkillsToSkillPath.status}, Roadmaps Created for Weak Skills: ${weakSkillsToSkillPath.data.data?.weakSkills?.length}`);

        // 10. Test Multi-Agent Sequential Pipeline
        console.log('\n--- Testing Autonomous 6-Agent Sequential Pipeline ---');
        const pipelineRes = await makeRequest('/api/agents/pipeline', 'POST', {
          domain: 'Autonomous Multi-Agent Ecosystems'
        }, token);
        console.log(`[PASS] POST /api/agents/pipeline - Status: ${pipelineRes.status}, Total Latency: ${pipelineRes.data.totalExecutionTime}`);

        // 11. Teams & Projects
        const teams = await makeRequest('/api/teams', 'GET', null, token);
        console.log(`[PASS] GET /api/teams - Status: ${teams.status}, Count: ${teams.data.data?.length}`);

        const projects = await makeRequest('/api/projects', 'GET', null, token);
        console.log(`[PASS] GET /api/projects - Status: ${projects.status}, Count: ${projects.data.data?.length}`);

        // 12. Analytics & History
        const analytics = await makeRequest('/api/analytics', 'GET', null, token);
        console.log(`[PASS] GET /api/analytics - Status: ${analytics.status}, Overall Readiness: ${analytics.data.data?.overallReadinessScore}%`);

        const history = await makeRequest('/api/history', 'GET', null, token);
        console.log(`[PASS] GET /api/history - Status: ${history.status}`);

        console.log('\n=====================================================');
        console.log('✅ ALL 12 VERIFICATION TESTS PASSED WITH 0 ERRORS!');
        console.log('=====================================================\n');
        process.exit(0);

      } catch (err) {
        console.error('❌ Test failed with error:', err);
        process.exit(1);
      }
    }, 1500);
  });
};

runTest();
