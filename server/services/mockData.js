export function getMockSkillGap(role, currentSkills = []) {
  const normalizedRole = (role || 'software engineer').toLowerCase();
  const normalizedSkills = (Array.isArray(currentSkills) ? currentSkills : currentSkills.split(','))
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const roleSkillMap = {
    'frontend developer': [
      { skill: 'HTML5 & Semantic Markup', status: 'have', priority: 'high' },
      { skill: 'CSS3 / Modern Layouts (Flexbox/Grid)', status: 'have', priority: 'high' },
      { skill: 'JavaScript ES6+ Core Concepts', status: 'have', priority: 'high' },
      { skill: 'React.js State Management & Hooks', status: 'partial', priority: 'high' },
      { skill: 'TypeScript Type Systems', status: 'missing', priority: 'high' },
      { skill: 'CSS Architecture (Tailwind / CSS Modules)', status: 'partial', priority: 'medium' },
      { skill: 'Frontend Testing (Jest / React Testing Library)', status: 'missing', priority: 'medium' },
      { skill: 'Web Performance & Lighthouse Optimization', status: 'missing', priority: 'low' }
    ],
    'backend developer': [
      { skill: 'Node.js & Express / Web Frameworks', status: 'have', priority: 'high' },
      { skill: 'RESTful API Architecture & JSON Design', status: 'have', priority: 'high' },
      { skill: 'Relational Databases & SQL (PostgreSQL/SQLite)', status: 'partial', priority: 'high' },
      { skill: 'Data Modeling & ORM/Query Builders', status: 'partial', priority: 'high' },
      { skill: 'Authentication & Security (JWT, OAuth, HTTPS)', status: 'missing', priority: 'high' },
      { skill: 'Caching Strategies (Redis)', status: 'missing', priority: 'medium' },
      { skill: 'API Testing & CI/CD Pipelines', status: 'missing', priority: 'medium' },
      { skill: 'Microservices & Containerization (Docker)', status: 'missing', priority: 'low' }
    ],
    'full stack developer': [
      { skill: 'JavaScript / TypeScript Core', status: 'have', priority: 'high' },
      { skill: 'Frontend Frameworks (React / Next.js)', status: 'partial', priority: 'high' },
      { skill: 'Backend Server Development (Node/Express)', status: 'partial', priority: 'high' },
      { skill: 'Database Management (SQL & NoSQL)', status: 'partial', priority: 'high' },
      { skill: 'REST & GraphQL API Design', status: 'missing', priority: 'medium' },
      { skill: 'Authentication & Authorization Protocols', status: 'missing', priority: 'medium' },
      { skill: 'Deployment & Cloud Hosting (Vercel/AWS)', status: 'missing', priority: 'medium' },
      { skill: 'End-to-End System Integration', status: 'missing', priority: 'low' }
    ],
    'data analyst': [
      { skill: 'SQL Data Extraction & Aggregations', status: 'have', priority: 'high' },
      { skill: 'Python for Data Analysis (Pandas, NumPy)', status: 'partial', priority: 'high' },
      { skill: 'Data Visualization (Tableau / PowerBI)', status: 'partial', priority: 'high' },
      { skill: 'Exploratory Data Analysis (EDA)', status: 'have', priority: 'high' },
      { skill: 'Statistical Hypothesis Testing & A/B Testing', status: 'missing', priority: 'medium' },
      { skill: 'ETL Pipelines & Data Cleaning', status: 'missing', priority: 'medium' },
      { skill: 'Executive Dashboarding & Business Storytelling', status: 'missing', priority: 'low' }
    ],
    'ml engineer': [
      { skill: 'Python Core & Data Structures', status: 'have', priority: 'high' },
      { skill: 'Machine Learning Fundamentals (Scikit-Learn)', status: 'partial', priority: 'high' },
      { skill: 'Deep Learning Frameworks (PyTorch / TensorFlow)', status: 'missing', priority: 'high' },
      { skill: 'Feature Engineering & Preprocessing', status: 'partial', priority: 'high' },
      { skill: 'Model Evaluation & Hyperparameter Tuning', status: 'missing', priority: 'medium' },
      { skill: 'MLOps & Model Deployment (FastAPI, Docker)', status: 'missing', priority: 'medium' },
      { skill: 'Vector Databases & LLM RAG Pipelines', status: 'missing', priority: 'low' }
    ]
  };

  let matchedRoleKey = Object.keys(roleSkillMap).find(k => normalizedRole.includes(k.split(' ')[0]));
  let skillsList = roleSkillMap[matchedRoleKey] || roleSkillMap['full stack developer'];

  // Dynamically update status based on user's current skills input
  skillsList = skillsList.map(item => {
    const itemName = item.skill.toLowerCase();
    const isDirectMatch = normalizedSkills.some(userSkill => itemName.includes(userSkill) || userSkill.includes(itemName.split(' ')[0].toLowerCase()));
    if (isDirectMatch) {
      return { ...item, status: 'have' };
    }
    return item;
  });

  const haveCount = skillsList.filter(s => s.status === 'have').length;
  const partialCount = skillsList.filter(s => s.status === 'partial').length;
  const matchPercentage = Math.round(((haveCount + partialCount * 0.5) / skillsList.length) * 100);

  return {
    role: role || 'Software Developer',
    matchPercentage,
    summary: `You possess strong foundational skills for ${role}, but strengthening key missing items will boost your placement readiness.`,
    requiredSkills: skillsList
  };
}

export function getMockInterviewQuestions(role) {
  const roleQuestions = {
    'frontend developer': [
      "Can you explain the Virtual DOM in React and how it differs from the real DOM?",
      "Describe a challenging bug you encountered with asynchronous JavaScript or Promises and how you resolved it.",
      "How do you optimize a React web application that suffers from slow rendering and large bundle size?",
      "Explain the difference between state management using Context API vs Redux/Zustand.",
      "Tell me about a time when you received tough feedback during a code review and how you handled it."
    ],
    'backend developer': [
      "How do RESTful APIs handle state management and how does JWT authentication work under the hood?",
      "Explain how database indexing speeds up queries and what tradeoffs it introduces during write operations.",
      "How would you handle high concurrent requests hitting an Express server without overloading the database?",
      "Describe the event loop in Node.js and explain non-blocking I/O.",
      "Tell me about a project where you had to make an architectural tradeoff between simplicity and performance."
    ],
    'data analyst': [
      "How do INNER JOIN, LEFT JOIN, and FULL OUTER JOIN differ in SQL? Provide a practical scenario for each.",
      "How do you handle missing or corrupt data in a large dataset using Pandas?",
      "Explain how you communicate complex technical insights to non-technical business stakeholders.",
      "What is the difference between correlation and causation, and how do you test for it?",
      "Describe a data visualization project you built and how it influenced a decision."
    ]
  };

  const normalizedRole = (role || '').toLowerCase();
  const key = Object.keys(roleQuestions).find(k => normalizedRole.includes(k.split(' ')[0]));

  return roleQuestions[key] || [
    `Explain how key architecture patterns apply to a production ${role} application.`,
    "Describe a complex technical problem you solved recently. What was your systematic approach?",
    "How do you handle API errors or network failures gracefully in a client-server web app?",
    "What strategies do you use for code quality, unit testing, and maintainability?",
    "Tell me about a time you had to learn a new framework or tool quickly under tight deadline constraints."
  ];
}

export function getMockAnswerEvaluation(question, answer) {
  const answerLength = (answer || '').trim().length;
  let score = 7;
  if (answerLength > 150) score = 9;
  else if (answerLength > 75) score = 8;
  else if (answerLength > 30) score = 6;
  else score = 4;

  return {
    score,
    feedback: `Good structured attempt. Your response addresses the main question points clearly, though adding concrete real-world examples would make it stand out more to recruiters.`,
    strengths: [
      "Clear technical terminology used correctly.",
      "Direct answer to the prompt with structured reasoning."
    ],
    improvements: [
      "Provide specific code snippet examples or concrete project metrics.",
      "Elaborate slightly more on edge-case handling."
    ]
  };
}

export function getMockRoadmap(role, skillGapResults = [], interviewSummary = {}) {
  return {
    role: role || 'Target Role',
    timelineWeeks: 6,
    summary: `Customized placement preparation roadmap focusing on high-priority missing technical competencies and mock interview feedback.`,
    milestones: [
      {
        phase: "Phase 1: Core Foundation & High-Priority Skill Gaps",
        duration: "Weeks 1 - 2",
        topics: ["Master core TypeScript types, interfaces & generics", "Deep dive into React State & Performance optimization"],
        projectIdea: "Build a real-time collaborative dashboard featuring TypeScript and state management.",
        resources: ["Official Documentation", "Frontend Masters / FreeCodeCamp deep dives"],
        status: "in-progress"
      },
      {
        phase: "Phase 2: Full System Design & Testing",
        duration: "Weeks 3 - 4",
        topics: ["Implement automated testing with Jest and Cypress", "RESTful API Security & JWT Authentication"],
        projectIdea: "Develop a secure auth microservice with database persistence & full test suite.",
        resources: ["Full Stack Open course", "MDN Web Docs Architecture Guides"],
        status: "upcoming"
      },
      {
        phase: "Phase 3: Portfolio & Placement Interview Drills",
        duration: "Weeks 5 - 6",
        topics: ["Behavioral interview STAR method refinement", "System architecture whiteboard drills & resume optimization"],
        projectIdea: "Deploy full-stack project live on Vercel/Render with CI/CD GitHub Actions.",
        resources: ["Cracking the Coding Interview", "Tech Interview Handbook"],
        status: "upcoming"
      }
    ]
  };
}
