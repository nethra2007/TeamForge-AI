/**
 * Intelligent Mock AI Provider for TeamForge AI
 * Ensures all 6 agents work instantly out of the box when Gemini API key is missing or quota limited.
 */

class MockProvider {
  constructor() {
    this.name = 'TeamForge Autonomous Simulation Engine';
  }

  isConfigured() {
    return true;
  }

  async generateJson(promptText) {
    // Artificial small latency for realistic loading experience
    await new Promise(res => setTimeout(res, 800));

    // Detect which agent prompt was called
    if (promptText.includes('TeamForge Collaborator')) {
      let pool = [];
      try {
        const poolMatch = promptText.match(/REGISTERED CANDIDATES POOL[\s\S]*?(\[\s*\{[\s\S]*?\}\s*\])/);
        if (poolMatch) {
          pool = JSON.parse(poolMatch[1]);
        }
      } catch (e) {}

      if (pool.length > 0) {
        const selected = pool.slice(0, 3).map((c, i) => ({
          candidateId: c.id || c._id,
          name: c.name,
          email: c.email || `${c.name.toLowerCase().replace(' ', '.')}@engineering.edu`,
          college: c.college || 'Engineering Institute',
          assignedRole: c.preferredRole || (i === 0 ? 'AI / ML Specialist' : i === 1 ? 'UI/UX & Product Designer' : 'Cloud & Database Architect'),
          compatibilityScore: 95 - (i * 3),
          matchedSkills: Array.isArray(c.skills) ? c.skills.slice(0, 3) : ['JavaScript', 'Python'],
          reason: `Selected from real registered MongoDB users. Strong expertise in ${Array.isArray(c.skills) ? c.skills.slice(0, 2).join(', ') : 'software development'}, perfectly complementing project requirements.`
        }));

        return {
          compatibilityScore: 93,
          aiExplanation: "Generated optimal team structure using real registered student profiles from MongoDB.",
          recommendedTeammates: selected,
          missingSkills: ["Distributed Caching", "WebSocket State Sync"],
          suggestedImprovements: ["Set up automated CI/CD pipeline early in the sprint cycle."]
        };
      }

      return {
        compatibilityScore: 92,
        aiExplanation: "Analyzed candidate profiles and project requirements to form a balanced engineering team.",
        recommendedTeammates: [
          {
            candidateId: "mongo_user_001",
            name: "Sophia Martinez",
            email: "sophia.martinez@stanford.edu",
            college: "Stanford School of Engineering",
            assignedRole: "AI / ML Specialist",
            compatibilityScore: 96,
            matchedSkills: ["Python", "PyTorch", "FastAPI"],
            reason: "Seamlessly bridges full stack architecture with deep AI model microservices."
          },
          {
            candidateId: "mongo_user_002",
            name: "Liam Patel",
            email: "liam.patel@berkeley.edu",
            college: "UC Berkeley EECS",
            assignedRole: "UI/UX & Product Designer",
            compatibilityScore: 92,
            matchedSkills: ["Tailwind CSS", "Figma", "React"],
            reason: "Focuses on high-converting SaaS user interfaces."
          }
        ],
        missingSkills: ["Redis Caching"],
        suggestedImprovements: ["Assign 1 member to manage real-time WebSocket state."]
      };
    }

    if (promptText.includes('LitReview AI')) {
      let papers = [];
      try {
        const papersMatch = promptText.match(/REAL RESEARCH PAPERS RETRIEVED FROM SEMANTIC SCHOLAR \/ arXiv:[\s\S]*?(\[\s*\{[\s\S]*?\}\s*\])/);
        if (papersMatch) {
          papers = JSON.parse(papersMatch[1]);
        }
      } catch (e) {}

      const paperTitles = papers.map(p => p.title).join('; ');

      return {
        literatureReview: papers.length > 0
          ? `Detailed literature analysis synthesizing ${papers.length} retrieved research publications (${paperTitles.substring(0, 160)}...). The state of the art highlights core methodological shifts towards modular multi-agent orchestration and structured evaluation schemas.`
          : 'Synthesized academic literature review based on state-of-the-art publications.',
        keyFindings: papers.map(p => `Methodological insight from "${p.title?.substring(0, 70)}..." (${p.year || '2024'}): ${p.abstract?.substring(0, 120)}...`),
        researchGap: "Current literature emphasizes unaddressed challenges around multi-agent context window saturation, low-latency API coordination, and real-time citation verification.",
        futureScope: "Future extensions include implementing hybrid vector retrieval, dense semantic embeddings, and automated benchmark evaluation.",
        conclusion: `Synthesized literature review for ${papers.length} retrieved publications.`
      };
    }

    if (promptText.includes('Hackathon Mentor AI')) {
      let problem = "Student innovation challenge";
      let userIdea = "";
      try {
        const probMatch = promptText.match(/Problem Statement:\s*"([^"]+)"/);
        if (probMatch) problem = probMatch[1];
        const ideaMatch = promptText.match(/User's Initial Project Idea:\s*"([^"]+)"/);
        if (ideaMatch) userIdea = ideaMatch[1];
      } catch (e) {}

      const projectTitle = userIdea ? userIdea : `Smart AI System for ${problem.substring(0, 30)}`;

      return {
        refinedProjectTitle: projectTitle,
        tagline: "Autonomous AI-Powered Hackathon Innovation System",
        improvedProblemStatement: `Addressing the key pain points in "${problem}" by automating workflow coordination with intelligent agent assistance.`,
        keyFeatures: [
          "Automated Problem Decomposition & Workflow Orchestration",
          "Real-time AI Model & Data Pipeline Integration",
          "Interactive Dashboard with Live Metric Tracking",
          "Built-in Risk Detection & Rapid Prototyping Roadmaps"
        ],
        techStack: {
          frontend: "React.js, Tailwind CSS, Lucide Icons",
          backend: "Node.js, Express.js REST API",
          database: "MongoDB Atlas / Redis Caching",
          aiModelsAndAPIs: "Google Gemini API / Multi-Agent Engine",
          deployment: "Vercel & Render"
        },
        architecture: "Decoupled MERN stack architecture with asynchronous AI service invocation, JSON schema validation, and responsive React state management.",
        architectureDiagram: "Client UI --> Express API Router --> Gemini AI Engine --> MongoDB Database",
        folderStructure: "backend/\n  controllers/\n  models/\n  routes/\n  services/\nfrontend/\n  src/\n    components/\n    pages/\n    context/",
        roadmap: [
          { phase: "Phase 1 (Hours 0-6)", goal: "Repository setup, DB schemas, and REST API controllers" },
          { phase: "Phase 2 (Hours 6-18)", goal: "AI Service integration & core business logic implementation" },
          { phase: "Phase 3 (Hours 18-30)", goal: "Frontend UI implementation, state context, and component styling" },
          { phase: "Phase 4 (Hours 30-36)", goal: "Integration testing, live demo rehearsal, and README finalization" }
        ],
        roleAllocation: [
          { member: "Member 1 (Team Lead)", role: "Full Stack Architect", responsibilities: "Lead MERN setup, git branching, and Gemini API integration" },
          { member: "Member 2", role: "Frontend UI Developer", responsibilities: "Design SaaS dashboard, components, and responsive pages" },
          { member: "Member 3", role: "Backend & Database Engineer", responsibilities: "Build Express routes, Mongoose models, and auth middleware" },
          { member: "Member 4", role: "AI Systems & DevOps Engineer", responsibilities: "Prompt engineering, rate limiting, and Vercel/Render deployment" }
        ],
        challengesAndMitigation: [
          {
            challenge: "API Rate Limits / Latency during live judge demo",
            solution: "Implement local caching or fallback simulation to guarantee 100% uptime."
          },
          {
            challenge: "Scope creep during tight 36-hour timeframe",
            solution: "Freeze MVP features at Hour 12 and focus purely on UI polish and demo flow."
          }
        ],
        innovationScore: 94,
        pitch: `Judges, "${problem}" creates massive friction. Our solution, ${projectTitle}, solves this using autonomous AI agents to deliver seamless real-time execution.`,
        presentationTips: [
          "Hook judges in the first 15 seconds with a relatable real-world problem scenario.",
          "Demonstrate live working software rather than static PowerPoint slides.",
          "Highlight your system architecture and AI latency optimization choices.",
          "Conclude with real-world impact metrics and future scalability plan."
        ],
        readme: `# ${projectTitle}\n\n> Autonomous AI-Powered Hackathon Innovation System\n\n## Problem Statement\n${problem}\n\n## Features\n- Real-time AI Workflow Orchestration\n- MERN Stack Architecture\n- Scalable API Integration`
      };
    }

    if (promptText.includes('SkillPath AI')) {
      return {
        targetCareer: "Senior Full Stack & AI Engineer",
        missingSkills: ["LangChain Agentic Workflows", "Vector DB (Pinecone)", "System Design at Scale", "Docker Containerization"],
        estimatedDuration: "4 Weeks",
        weeklyRoadmap: [
          {
            week: 1,
            title: "Advanced React & Custom State Management",
            focusSkills: ["Context API", "Axios Interceptors", "Tailwind UI"],
            tasks: [
              "Implement global AuthContext, UserContext, and PipelineContext",
              "Build modular agent component templates with dark/light mode support"
            ],
            resources: [
              { title: "React Official Documentation", url: "https://react.dev", type: "Docs" },
              { title: "Tailwind CSS Component System", url: "https://tailwindcss.com", type: "Guide" }
            ]
          },
          {
            week: 2,
            title: "Node.js REST API Architecture & AI Integration",
            focusSkills: ["Express.js", "Gemini API", "Middleware"],
            tasks: [
              "Build decoupled AI Provider Factory with fallback engine",
              "Enforce standardized JSON response formatting across all API endpoints"
            ],
            resources: [
              { title: "Google AI Developer Portal", url: "https://ai.google.dev", type: "Documentation" }
            ]
          },
          {
            week: 3,
            title: "Multi-Agent State Orchestration & MongoDB Models",
            focusSkills: ["Mongoose", "Pipeline Coordinator", "Data Integrity"],
            tasks: [
              "Create 9 separate Mongoose schemas for Users, Teams, Projects, and AI History",
              "Pass intermediate agent context through the multi-agent coordinator pipeline"
            ],
            resources: [
              { title: "Mongoose ODM Guide", url: "https://mongoosejs.com", type: "Docs" }
            ]
          },
          {
            week: 4,
            title: "Testing, Analytics & Production Deployment",
            focusSkills: ["Vercel", "Render", "Placement Preparation"],
            tasks: [
              "Perform end-to-end integration testing for all 6 agents",
              "Deploy backend to Render and frontend to Vercel with environment variables"
            ],
            resources: [
              { title: "Vercel Deployment Platform", url: "https://vercel.com", type: "Platform" }
            ]
          }
        ],
        recommendedCourses: [
          { name: "Full Stack Web Development & AI Engineering", provider: "Stanford Online", url: "https://online.stanford.edu", level: "Intermediate" },
          { name: "Building Autonomous AI Agents with Gemini", provider: "DeepLearning.AI", url: "https://deeplearning.ai", level: "Advanced" }
        ]
      };
    }

    if (promptText.includes('SprintFlow AI')) {
      let projName = "Custom Software Project";
      let projDesc = "Software engineering project";
      let numWeeks = 4;
      let stack = "Full Stack";

      try {
        const nameMatch = promptText.match(/Project Name:\s*"([^"]+)"/);
        if (nameMatch) projName = nameMatch[1];
        
        const descMatch = promptText.match(/Description:\s*"([^"]+)"/);
        if (descMatch) projDesc = descMatch[1];
        
        const timeMatch = promptText.match(/Timeline Horizon:\s*(\d+)\s*Weeks/i) || promptText.match(/Timeline:\s*(\d+)\s*Weeks/i);
        if (timeMatch) {
          const matchW = (timeMatch[1] || timeMatch[0]).match(/(\d+)/);
          if (matchW) numWeeks = parseInt(matchW[1], 10);
        }

        const stackMatch = promptText.match(/Technology Stack:\s*"([^"]+)"/);
        if (stackMatch) stack = stackMatch[1];
      } catch (e) {}

      const lowerName = projName.toLowerCase();
      let domainPreset = 'generic';

      if (lowerName.includes('traffic') || lowerName.includes('vision') || lowerName.includes('camera') || lowerName.includes('city')) {
        domainPreset = 'traffic';
      } else if (lowerName.includes('health') || lowerName.includes('med') || lowerName.includes('patient') || lowerName.includes('clinic')) {
        domainPreset = 'healthcare';
      } else if (lowerName.includes('cart') || lowerName.includes('commerce') || lowerName.includes('store') || lowerName.includes('shop') || lowerName.includes('retail')) {
        domainPreset = 'ecommerce';
      } else if (lowerName.includes('edu') || lowerName.includes('learn') || lowerName.includes('course') || lowerName.includes('school') || lowerName.includes('tutor')) {
        domainPreset = 'education';
      } else if (lowerName.includes('agri') || lowerName.includes('farm') || lowerName.includes('crop') || lowerName.includes('soil')) {
        domainPreset = 'agriculture';
      }

      const sprintTemplates = {
        traffic: [
          {
            goal: "Project Setup & System Architecture",
            tasks: [
              { title: "Design System Architecture & Camera Ingestion Pipeline", desc: `Setup video stream pipeline and database schemas for ${projName}.`, hours: 6 },
              { title: "Implement Authentication & Camera Node Configuration APIs", desc: "Build JWT auth and camera node configuration endpoints.", hours: 5 }
            ]
          },
          {
            goal: "Vehicle Detection & AI Vision Model Integration",
            tasks: [
              { title: "Integrate YOLO Realtime Object Detection Model", desc: `Connect OpenCV/YOLO inference engine for ${projName}.`, hours: 8 },
              { title: "Develop Traffic Signal Control API Gateway", desc: "Build REST endpoints for signal timing adjustments based on density.", hours: 6 }
            ]
          },
          {
            goal: "Traffic Analytics Dashboard & Congestion Heatmaps",
            tasks: [
              { title: "Build Realtime Congestion Heatmap & Density Chart", desc: "Implement interactive WebSocket map visualization.", hours: 7 },
              { title: "Develop Historical Traffic Pattern Analytics", desc: "Build database aggregation queries for peak hour analysis.", hours: 6 }
            ]
          },
          {
            goal: "Accident Prediction & Emergency Notification System",
            tasks: [
              { title: "Train Incident & Anomaly Detection Model", desc: "Detect sudden vehicle stops and collision patterns.", hours: 8 },
              { title: "Integrate Google Maps API & Emergency Dispatch Alerts", desc: "Trigger SMS and webhook alerts to traffic authorities.", hours: 6 }
            ]
          },
          {
            goal: "Performance Optimization & Security Audit",
            tasks: [
              { title: "Optimize OpenCV Stream Frame Rate & Latency", desc: "Reduce video processing latency below 100ms.", hours: 6 },
              { title: "Execute Penetration Testing & Video Encryption Audit", desc: "Enforce TLS 1.3 encryption on RTSP camera streams.", hours: 5 }
            ]
          },
          {
            goal: "Cloud Deployment & Edge Device Monitoring",
            tasks: [
              { title: "Deploy Traffic Microservices to Kubernetes / AWS", desc: "Set up container orchestration and auto-scaling.", hours: 8 },
              { title: "Finalize System Documentation & Admin Dashboard", desc: "Publish operational user guides and API documentation.", hours: 4 }
            ]
          }
        ],
        healthcare: [
          {
            goal: "HIPAA Security Setup & Patient Auth System",
            tasks: [
              { title: "Setup HIPAA Compliant Encryption & Data Models", desc: `Design encrypted database schemas for ${projName}.`, hours: 6 },
              { title: "Build Multi-Factor Patient & Doctor Auth System", desc: "Implement OAuth2 and MFA login workflows.", hours: 6 }
            ]
          },
          {
            goal: "Clinical Diagnostics Engine & Patient Portal",
            tasks: [
              { title: "Develop Patient Electronic Health Record (EHR) Portal", desc: "Build patient medical history management views.", hours: 8 },
              { title: "Build Doctor Appointment Scheduling API", desc: "Implement calendar availability and booking logic.", hours: 6 }
            ]
          },
          {
            goal: "AI Symptom Diagnostic & Medical Report Analyzer",
            tasks: [
              { title: "Integrate AI Disease Prediction & Symptom Checker", desc: `Connect LLM diagnostic module for ${projName}.`, hours: 8 },
              { title: "Develop Automated Lab Report PDF Parser", desc: "Extract blood report data and highlight abnormal values.", hours: 6 }
            ]
          },
          {
            goal: "E-Prescription & Pharmacy Billing Gateway",
            tasks: [
              { title: "Integrate Insurance Claims & Pharmacy Billing API", desc: "Build automated claim submission workflow.", hours: 7 },
              { title: "Implement Realtime Telehealth Video Consultation", desc: "Setup WebRTC encrypted video call sessions.", hours: 8 }
            ]
          },
          {
            goal: "Clinical Analytics & Penetration Audit",
            tasks: [
              { title: "Build Hospital Operational Metrics Dashboard", desc: "Create bed occupancy and patient recovery charts.", hours: 6 },
              { title: "Execute Security Penetration Test & HIPAA Audit", desc: "Validate end-to-end audit logging for patient data access.", hours: 5 }
            ]
          },
          {
            goal: "Production Release & Telemedicine Deployment",
            tasks: [
              { title: "Deploy Telemedicine Microservices to Cloud", desc: "Setup zero-downtime deployment pipelines.", hours: 7 },
              { title: "Publish Clinical Operational Guides & API Documentation", desc: "Finalize user documentation for hospital staff.", hours: 4 }
            ]
          }
        ],
        ecommerce: [
          {
            goal: "Architecture Setup & Product Catalog Schemas",
            tasks: [
              { title: "Setup E-Commerce Database Schemas & Roles", desc: `Design product, category, and inventory models for ${projName}.`, hours: 6 },
              { title: "Build User Authentication & Profile Management", desc: "Implement customer JWT login and address book.", hours: 5 }
            ]
          },
          {
            goal: "Shopping Cart Engine & Stripe Payment Gateway",
            tasks: [
              { title: "Develop Dynamic Persistent Shopping Cart API", desc: "Implement cart item calculations and stock validation.", hours: 7 },
              { title: "Integrate Stripe & PayPal Payment Gateway", desc: "Secure checkout workflow with webhook confirmations.", hours: 8 }
            ]
          },
          {
            goal: "Order Fulfillment Pipeline & AI Recommendations",
            tasks: [
              { title: "Build Order Processing & Tracking Engine", desc: "Manage order state transitions (Pending, Shipped, Delivered).", hours: 6 },
              { title: "Implement Personalized AI Product Recommender", desc: "Suggest related items based on purchase history.", hours: 7 }
            ]
          },
          {
            goal: "Customer Reviews & Admin Inventory Dashboard",
            tasks: [
              { title: "Build Verified Customer Rating & Review System", desc: "Allow buyers to submit ratings and image reviews.", hours: 5 },
              { title: "Develop Admin Inventory & Revenue Analytics Dashboard", desc: "Track sales velocity, revenue, and low-stock alerts.", hours: 7 }
            ]
          },
          {
            goal: "Logistics Shipping & Promotional Coupon Engine",
            tasks: [
              { title: "Integrate FedEx/DHL Shipping Rate API", desc: "Calculate live shipping costs during checkout.", hours: 6 },
              { title: "Build Promotional Coupon Code & Discount System", desc: "Support percentage and fixed amount discount rules.", hours: 5 }
            ]
          },
          {
            goal: "Black Friday Concurrency Testing & Production Release",
            tasks: [
              { title: "Execute High Concurrency Load Testing", desc: "Simulate 10,000 simultaneous checkout requests.", hours: 7 },
              { title: "Deploy E-Commerce Platform to Global CDN", desc: "Publish production release to Vercel and AWS.", hours: 5 }
            ]
          }
        ],
        education: [
          {
            goal: "Project Setup & Course Catalog Architecture",
            tasks: [
              { title: "Design Course, Module & Lesson Schemas", desc: `Setup database models for ${projName}.`, hours: 6 },
              { title: "Build Student & Instructor Auth Management", desc: "Implement role-based authorization for educators.", hours: 5 }
            ]
          },
          {
            goal: "Interactive Quiz Engine & AI Homework Assistant",
            tasks: [
              { title: "Develop Automated Quiz & Grading Engine", desc: "Build multiple choice and short answer quiz modules.", hours: 7 },
              { title: "Integrate AI Student Tutor & Homework Assistant", desc: "Connect LLM context window for step-by-step guidance.", hours: 8 }
            ]
          },
          {
            goal: "Video Streaming & Learning Progress Analytics",
            tasks: [
              { title: "Build HLS Video Course Streaming Player", desc: "Implement video player with playback speed controls.", hours: 8 },
              { title: "Develop Student Learning Progress Tracker", desc: "Track lesson completion percentages and streak scores.", hours: 6 }
            ]
          },
          {
            goal: "Certificates & Student Discussion Forum",
            tasks: [
              { title: "Implement Automated PDF Course Certificate Generator", desc: "Generate downloadable signed certificates on course completion.", hours: 6 },
              { title: "Build Student Q&A Discussion Forum", desc: "Support threaded comments and instructor answers.", hours: 6 }
            ]
          },
          {
            goal: "Live Virtual Classroom & Attendance System",
            tasks: [
              { title: "Integrate WebRTC Video Classroom", desc: "Build live video lectures with screen sharing.", hours: 8 },
              { title: "Implement Automated Student Attendance Logging", desc: "Log participant entry and exit times.", hours: 5 }
            ]
          },
          {
            goal: "Load Testing & Global EdTech Deployment",
            tasks: [
              { title: "Perform Stream Load Testing for Concurrent Students", desc: "Validate CDN video distribution capacity.", hours: 6 },
              { title: "Deploy Learning Management System to Cloud", desc: "Publish platform to production environment.", hours: 5 }
            ]
          }
        ],
        agriculture: [
          {
            goal: "Farm Sensor Architecture & User Setup",
            tasks: [
              { title: "Design Soil & Weather Telemetry Database Schemas", desc: `Setup IoT data models for ${projName}.`, hours: 6 },
              { title: "Build Farmer Profile & Field Location Mapping", desc: "Map GIS boundaries and crop types.", hours: 5 }
            ]
          },
          {
            goal: "Crop Disease AI Diagnostics & Soil Monitoring",
            tasks: [
              { title: "Integrate Plant Leaf Image Disease Model", desc: "Identify crop infections using computer vision.", hours: 8 },
              { title: "Develop Soil Moisture & NPK Ingestion Pipeline", desc: "Process real-time IoT sensor telemetry.", hours: 6 }
            ]
          },
          {
            goal: "Automated Irrigation & Weather Forecasting API",
            tasks: [
              { title: "Build Automated Smart Irrigation Controller API", desc: "Trigger valve activation based on soil dryness.", hours: 7 },
              { title: "Integrate Hyper-Local Weather Forecast API", desc: "Predict rain events and adjust watering schedules.", hours: 6 }
            ]
          },
          {
            goal: "Yield Estimation Model & Crop Marketplace",
            tasks: [
              { title: "Develop AI Crop Harvest Yield Predictor", desc: "Estimate harvest volume based on historical weather.", hours: 7 },
              { title: "Build Direct-to-Buyer Produce Marketplace", desc: "Connect farmers with wholesale buyers.", hours: 7 }
            ]
          },
          {
            goal: "Offline Field Sync & Mobile Analytics",
            tasks: [
              { title: "Implement Offline Data Sync for Remote Fields", desc: "Cache sensor logs locally when cellular connectivity is lost.", hours: 7 },
              { title: "Develop Farmer Dashboard & Irrigation Insights", desc: "Visualize water savings and crop health trends.", hours: 5 }
            ]
          },
          {
            goal: "Field Edge Deployment & Mobile App Launch",
            tasks: [
              { title: "Deploy IoT Gateway Firmware & Cloud Services", desc: "Configure MQTT broker and cloud backend.", hours: 7 },
              { title: "Publish Farmer Mobile App & User Guide", desc: "Deploy PWA/Mobile app with multi-language support.", hours: 5 }
            ]
          }
        ],
        generic: [
          {
            goal: "System Architecture & Database Design",
            tasks: [
              { title: `Design Database Schemas & Data Flow for ${projName}`, desc: `Define core entity relationships and models for ${projName}.`, hours: 6 },
              { title: "Configure Express Backend & Authentication Gateway", desc: "Setup JWT security, input validation, and API routes.", hours: 5 }
            ]
          },
          {
            goal: "Core Domain Logic & Business Rules",
            tasks: [
              { title: `Implement Primary Core Controller Modules for ${projName}`, desc: `Build primary CRUD business logic for ${projName}.`, hours: 7 },
              { title: "Develop Asynchronous Processing & Task Queue", desc: "Setup background job processing for heavy operations.", hours: 6 }
            ]
          },
          {
            goal: "AI Integrations & Feature Dashboards",
            tasks: [
              { title: `Integrate AI Intelligence & Analytics Engine for ${projName}`, desc: `Connect LLM/AI services tailored to ${projName}.`, hours: 8 },
              { title: "Build Interactive Responsive User Dashboard", desc: "Develop clean SaaS interface with live data visualizers.", hours: 7 }
            ]
          },
          {
            goal: "Realtime Notifications & Third-Party APIs",
            tasks: [
              { title: "Implement WebSocket Realtime Event Notifications", desc: "Push instant alerts and status updates to connected clients.", hours: 6 },
              { title: "Integrate Third-Party External Webhooks & Services", desc: "Connect external APIs and data providers.", hours: 6 }
            ]
          },
          {
            goal: "Performance Optimization & Security Audit",
            tasks: [
              { title: "Optimize Database Indexing & API Response Latency", desc: "Benchmark queries and implement Redis caching.", hours: 6 },
              { title: "Execute End-to-End Security & Penetration Audit", desc: "Conduct security review and vulnerability patching.", hours: 5 }
            ]
          },
          {
            goal: "Cloud Deployment & Production Monitoring",
            tasks: [
              { title: "Configure CI/CD Deployment Pipeline & Docker Containers", desc: "Automate build, test, and deployment workflows.", hours: 8 },
              { title: "Publish System Documentation & Operational Guides", desc: "Finalize administrator manuals and API documentation.", hours: 4 }
            ]
          }
        ]
      };

      const selectedTemplates = sprintTemplates[domainPreset] || sprintTemplates.generic;

      // Select exactly numWeeks sprints from templates
      const sprints = Array.from({ length: numWeeks }, (_, i) => {
        const weekNum = i + 1;
        const templateIndex = Math.min(i, selectedTemplates.length - 1);
        const sprintData = selectedTemplates[templateIndex];

        return {
          sprintNumber: weekNum,
          sprintGoal: sprintData.goal,
          durationWeeks: 1,
          tasks: sprintData.tasks.map((t, tIdx) => ({
            id: `SP-${weekNum}0${tIdx + 1}`,
            title: t.title,
            description: t.desc,
            assignee: tIdx === 0 ? "Full Stack Lead" : "Backend Developer",
            priority: tIdx === 0 ? "High" : "Medium",
            status: "To Do",
            estimatedHours: t.hours,
            acceptanceCriteria: [
              `Verify ${t.title} functions correctly`,
              `All unit tests pass for ${projName}`
            ],
            suggestedDoc: "https://developer.mozilla.org"
          }))
        };
      });

      const milestones = Array.from({ length: numWeeks }, (_, i) => ({
        title: `M${i + 1}: ${sprints[i]?.sprintGoal || `Milestone ${i + 1}`}`,
        deadline: `Week ${i + 1}`,
        deliverables: [`Deliverable Module ${i + 1} for ${projName}`],
        completed: false
      }));

      return {
        projectTitle: `${projName} Agile Development Sprint Plan`,
        projectDescription: projDesc,
        totalDurationWeeks: numWeeks,
        velocityScore: 92,
        projectHealthScore: 95,
        riskLevel: "Low Risk",
        estimatedCompletionDate: `${numWeeks} Weeks from start`,
        sprints,
        milestones
      };
    }

    if (promptText.includes('evaluating a candidate\'s response')) {
      return {
        score: 8.5,
        correctnessScore: 9.0,
        confidenceScore: 8.0,
        communicationScore: 8.5,
        missingPoints: [
          "Did not mention Redis cache invalidation strategies",
          "Could explain circuit breaker threshold triggers"
        ],
        idealAnswer: "State is private mutable component data managed within a component, while props are read-only properties passed down from parent to child components.",
        suggestions: [
          "Mention specific technical keywords like TTL and cache invalidation when discussing caching.",
          "Structure your response clearly using technical terms like immutability."
        ],
        weakSkillsIdentified: ["Redis Cache Invalidation", "Circuit Breakers"]
      };
    }

    if (promptText.includes('PlacementPrep AI')) {
      return {
        targetCompany: "Google / Top Product SaaS Scaleups",
        targetRole: "Full Stack & Autonomous AI Engineer",
        readinessScore: 88,
        atsScore: 90,
        resumeFeedback: {
          strengths: [
            "Demonstrates production-level execution using MERN stack and AI agents",
            "Clear understanding of decoupled services and clean code architecture",
            "High initiative in building student productivity platforms"
          ],
          weaknesses: [
            "Quantifiable metrics could be further emphasized (e.g. throughput, sub-second latency)",
            "System design bullet points could mention vector caching mechanisms"
          ],
          suggestions: [
            "Include direct metrics: 'Built 6 autonomous AI agents serving structured JSON responses in <1.2s'.",
            "Add GitHub repository link and deployed Vercel live application link."
          ],
          atsFeedback: "Resume contains strong keyword density for Full Stack & AI roles. Adding quantifiable latency & throughput metrics will boost ATS score to 95%+."
        },
        performanceMetrics: {
          technicalScore: 84,
          behavioralScore: 88,
          projectScore: 90,
          communicationScore: 85,
          codingScore: 82,
          overallReadiness: 86
        },
        skillGap: ["Advanced Redis Caching Patterns", "Distributed Message Queues (Kafka)", "Kubernetes Deployment"],
        weakSkills: ["Redis Caching", "Docker Containerization", "Kafka Queues"],
        interviewQuestions: [
          {
            id: "q1",
            category: "Technical",
            difficulty: "Easy",
            type: "Conceptual",
            question: "How do you ensure zero-hallucination structured JSON outputs from Google Gemini API?",
            idealAnswer: "Use system prompts with strict JSON schema definitions, set responseMimeType to application/json, and wrap response parsing with strict fallback formatters.",
            keyConcepts: ["Structured JSON Output", "Schema Validation", "Graceful Error Fallbacks"]
          },
          {
            id: "q2",
            category: "Technical",
            difficulty: "Medium",
            type: "Conceptual",
            question: "Explain how user authentication persists securely across React SPA and Express REST backend.",
            idealAnswer: "Tokens are signed with bcrypt-salted credentials, issued as JWTs upon login, stored securely in client state, and passed via HTTP Authorization header Bearer tokens.",
            keyConcepts: ["JWT Signatures", "Stateless Authentication", "Auth Middleware"]
          },
          {
            id: "q3",
            category: "System Design",
            difficulty: "Hard",
            type: "Conceptual",
            question: "How would you scale the multi-agent pipeline when execution steps take longer than HTTP timeouts?",
            idealAnswer: "Transition from synchronous HTTP POST to an asynchronous job queue (e.g. BullMQ / Redis) with WebSockets or Server-Sent Events updating frontend pipeline state.",
            keyConcepts: ["Async Job Queues", "WebSockets", "Task Offloading"]
          },
          {
            id: "q4",
            category: "Behavioral",
            difficulty: "Easy",
            type: "Behavioral",
            question: "Describe how you resolved an architecture ambiguity during a tight hackathon deadline.",
            idealAnswer: "Established standard API response formatters early, separated prompt templates into reusable modules, and implemented a mock provider engine to allow frontend and backend developers to build concurrently.",
            keyConcepts: ["Agile Prioritization", "Decoupled Architecture", "Parallel Development"]
          }
        ],
        actionPlan: [
          "Complete 2 LeetCode Medium algorithms on graphs and dynamic programming daily.",
          "Review System Design core principles (Load Balancers, Caching, CAP Theorem).",
          "Conduct 2 peer mock interviews focusing on technical storytelling."
        ]
      };
    }

    // Generic JSON fallback
    return {
      message: "Generated via TeamForge AI Autonomous Engine",
      promptExcerpt: promptText.substring(0, 100) + '...'
    };
  }
}

module.exports = MockProvider;
