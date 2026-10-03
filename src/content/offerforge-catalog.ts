// Mirrors OfferForge-AI/backend/src/config/interviewRoles.js (roles, sections, rubrics, first bank question).
// Regenerate from that file if the product catalog changes.

export type SectionKey = "dsa" | "system-design" | "oop" | "cs-fundamentals" | "behavioral" | "javascript" | "react" | "web-fundamentals" | "backend" | "databases" | "sql" | "statistics" | "analytics-case" | "ml" | "requirements" | "product-sense" | "metrics" | "execution";

export type InterviewSection = {
  title: string;
  short: string;
  minutes: number;
  brief: string;
  rubric: readonly [string, string, string, string];
  sample: { question: string; hint: string };
};

export type InterviewRole = {
  id: string;
  title: string;
  blurb: string;
  sections: readonly { key: SectionKey; count: number }[];
};

export const interviewSections: Record<SectionKey, InterviewSection> = {
  "dsa": {
    "title": "Data Structures & Algorithms",
    "short": "DSA",
    "minutes": 8,
    "brief": "One problem per question. Explain your approach, write code or pseudocode, then state time and space complexity.",
    "rubric": [
      "Approach & correctness",
      "Complexity analysis",
      "Edge cases",
      "Clarity of explanation"
    ],
    "sample": {
      "question": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Example: nums = [2, 7, 11, 15], target = 9 → [0, 1].",
      "hint": "Start with the brute-force idea, then improve it. State time and space complexity."
    }
  },
  "system-design": {
    "title": "System Design",
    "short": "System Design",
    "minutes": 10,
    "brief": "Open-ended design. Clarify requirements, sketch the architecture, then discuss data, scale, and trade-offs.",
    "rubric": [
      "Requirements & scope",
      "Architecture",
      "Data model & storage",
      "Scaling & trade-offs"
    ],
    "sample": {
      "question": "Design a URL shortening service like bit.ly.",
      "hint": "Cover short-code generation, storage, redirects at high read volume, and link expiry."
    }
  },
  "oop": {
    "title": "Object-Oriented Programming",
    "short": "OOP",
    "minutes": 5,
    "brief": "OOP principles and low-level design. Use concrete classes and examples, not textbook definitions.",
    "rubric": [
      "Concept accuracy",
      "Design quality",
      "Practical examples",
      "Clarity"
    ],
    "sample": {
      "question": "Design the classes for a parking lot: multiple floors, spot sizes (bike, car, truck), and tickets issued at entry and paid at exit.",
      "hint": "Name the main classes, their relationships, and where polymorphism helps."
    }
  },
  "cs-fundamentals": {
    "title": "CS Fundamentals",
    "short": "CS Core",
    "minutes": 4,
    "brief": "Operating systems, databases, and networking. Explain how things actually work under the hood.",
    "rubric": [
      "Accuracy",
      "Depth",
      "Real-world connection",
      "Clarity"
    ],
    "sample": {
      "question": "What is the difference between a process and a thread? What does a context switch cost, and when would you choose multiple processes over multiple threads?",
      "hint": "Cover memory sharing and isolation."
    }
  },
  "behavioral": {
    "title": "Behavioral",
    "short": "Behavioral",
    "minutes": 4,
    "brief": "Real stories from your experience. Use the STAR format: Situation, Task, Action, Result.",
    "rubric": [
      "Situation & context",
      "Ownership of actions",
      "Result & impact",
      "Reflection"
    ],
    "sample": {
      "question": "Tell me about a time you disagreed with a teammate. How did you resolve it?",
      "hint": "Use STAR. Focus on what you did."
    }
  },
  "javascript": {
    "title": "JavaScript",
    "short": "JavaScript",
    "minutes": 5,
    "brief": "Language fundamentals that trip people up in real code.",
    "rubric": [
      "Accuracy",
      "Depth",
      "Examples",
      "Clarity"
    ],
    "sample": {
      "question": "Explain the JavaScript event loop. In what order does this log, and why?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
      "hint": "Distinguish microtasks from macrotasks."
    }
  },
  "react": {
    "title": "React & Frontend Architecture",
    "short": "React",
    "minutes": 6,
    "brief": "How React works and how you structure real frontend code.",
    "rubric": [
      "Accuracy",
      "Practical judgment",
      "Performance awareness",
      "Clarity"
    ],
    "sample": {
      "question": "How does React decide what to re-render? Explain reconciliation, why keys matter in lists, and when React.memo or useMemo actually help.",
      "hint": "Mention when memoization is not worth it."
    }
  },
  "web-fundamentals": {
    "title": "Web Fundamentals",
    "short": "Web",
    "minutes": 5,
    "brief": "Browser, CSS, performance, and accessibility.",
    "rubric": [
      "Accuracy",
      "Practical approach",
      "Depth",
      "Clarity"
    ],
    "sample": {
      "question": "A page loads slowly on mobile. How do you diagnose it, and what would you fix?",
      "hint": "Mention Core Web Vitals and the tools you would use."
    }
  },
  "backend": {
    "title": "APIs & Backend Engineering",
    "short": "Backend",
    "minutes": 6,
    "brief": "API design, authentication, and building reliable services.",
    "rubric": [
      "Correctness",
      "Design quality",
      "Reliability & security",
      "Clarity"
    ],
    "sample": {
      "question": "Design a REST API for a to-do app with users, lists, and tasks. Show the endpoints, status codes, and how you handle pagination and validation.",
      "hint": "Be specific about URLs and HTTP methods."
    }
  },
  "databases": {
    "title": "Databases",
    "short": "Databases",
    "minutes": 6,
    "brief": "Schema design, indexing, transactions, and choosing the right store.",
    "rubric": [
      "Correctness",
      "Data modeling",
      "Performance",
      "Trade-offs"
    ],
    "sample": {
      "question": "Design a relational schema for an e-commerce app with users, products, orders, and order items. Which indexes would you add, and why?",
      "hint": "Show tables, keys, and relationships."
    }
  },
  "sql": {
    "title": "SQL",
    "short": "SQL",
    "minutes": 6,
    "brief": "Write real queries. Watch for NULLs, duplicates, and ties.",
    "rubric": [
      "Query correctness",
      "SQL technique",
      "Edge cases",
      "Clarity"
    ],
    "sample": {
      "question": "Tables: employees(id, name, department_id, salary) and departments(id, name). Write a query that returns the highest-paid employee in each department, including ties.",
      "hint": "A window function or a correlated subquery both work."
    }
  },
  "statistics": {
    "title": "Statistics & Probability",
    "short": "Statistics",
    "minutes": 5,
    "brief": "Statistical reasoning applied to real product and business decisions.",
    "rubric": [
      "Statistical correctness",
      "Intuition",
      "Application",
      "Clarity"
    ],
    "sample": {
      "question": "Explain a p-value to a product manager. What does p = 0.03 mean, and what does it not mean?",
      "hint": "Avoid jargon but stay correct."
    }
  },
  "analytics-case": {
    "title": "Analytics Case",
    "short": "Case",
    "minutes": 7,
    "brief": "A business problem to break down with data. Structure first, then metrics and hypotheses.",
    "rubric": [
      "Structured thinking",
      "Metric choice",
      "Hypotheses & data",
      "Recommendation"
    ],
    "sample": {
      "question": "Daily active users of a food delivery app dropped 15% week over week. How would you investigate?",
      "hint": "Rule out data issues first, then segment."
    }
  },
  "ml": {
    "title": "Machine Learning",
    "short": "ML",
    "minutes": 6,
    "brief": "Core ML concepts and practical modeling judgment.",
    "rubric": [
      "Conceptual accuracy",
      "Practical judgment",
      "Evaluation",
      "Clarity"
    ],
    "sample": {
      "question": "Explain the bias–variance trade-off. How do you detect overfitting, and what do you do about it?",
      "hint": "Refer to training versus validation curves."
    }
  },
  "requirements": {
    "title": "Requirements & Process",
    "short": "Requirements",
    "minutes": 5,
    "brief": "Turning vague asks into clear, testable requirements and managing stakeholders.",
    "rubric": [
      "Stakeholder understanding",
      "Structured approach",
      "Clarity of requirements",
      "Communication"
    ],
    "sample": {
      "question": "A stakeholder says, \"We need a report of everything.\" How do you turn that into clear requirements?",
      "hint": "What questions do you ask, and what do you deliver?"
    }
  },
  "product-sense": {
    "title": "Product Sense",
    "short": "Product",
    "minutes": 7,
    "brief": "Designing and improving products. Start from users and their problems.",
    "rubric": [
      "User focus",
      "Structured thinking",
      "Creativity",
      "Prioritization"
    ],
    "sample": {
      "question": "How would you improve Google Maps for daily commuters?",
      "hint": "Pick a user segment, find their pain points, then prioritize solutions."
    }
  },
  "metrics": {
    "title": "Metrics & Analytics",
    "short": "Metrics",
    "minutes": 6,
    "brief": "Defining success and diagnosing changes in the numbers.",
    "rubric": [
      "Metric selection",
      "Structured thinking",
      "Trade-off awareness",
      "Clarity"
    ],
    "sample": {
      "question": "Which metrics would you track to measure the success of Instagram Reels?",
      "hint": "Name one north-star metric and a few guardrail metrics."
    }
  },
  "execution": {
    "title": "Execution & Prioritization",
    "short": "Execution",
    "minutes": 5,
    "brief": "Prioritizing, shipping, and handling things going wrong.",
    "rubric": [
      "Prioritization",
      "Stakeholder management",
      "Pragmatism",
      "Clarity"
    ],
    "sample": {
      "question": "You have 10 feature requests and capacity for 3 this quarter. How do you decide which to build?",
      "hint": "Name a framework, but show judgment beyond it."
    }
  }
};

export const interviewRoles: readonly InterviewRole[] = [
  {
    "id": "sde",
    "title": "Software Development Engineer",
    "blurb": "The classic SDE loop: problem solving, design, OOP, and CS fundamentals.",
    "sections": [
      {
        "key": "dsa",
        "count": 2
      },
      {
        "key": "system-design",
        "count": 2
      },
      {
        "key": "oop",
        "count": 2
      },
      {
        "key": "cs-fundamentals",
        "count": 2
      },
      {
        "key": "behavioral",
        "count": 1
      }
    ]
  },
  {
    "id": "frontend",
    "title": "Frontend Developer",
    "blurb": "JavaScript depth, React, and the web platform, plus a coding round.",
    "sections": [
      {
        "key": "javascript",
        "count": 2
      },
      {
        "key": "react",
        "count": 2
      },
      {
        "key": "web-fundamentals",
        "count": 2
      },
      {
        "key": "dsa",
        "count": 1
      },
      {
        "key": "behavioral",
        "count": 1
      }
    ]
  },
  {
    "id": "backend",
    "title": "Backend Developer",
    "blurb": "Algorithms, APIs, databases, and designing systems that scale.",
    "sections": [
      {
        "key": "dsa",
        "count": 2
      },
      {
        "key": "backend",
        "count": 2
      },
      {
        "key": "databases",
        "count": 2
      },
      {
        "key": "system-design",
        "count": 2
      },
      {
        "key": "behavioral",
        "count": 1
      }
    ]
  },
  {
    "id": "data-analyst",
    "title": "Data Analyst",
    "blurb": "SQL, statistics, and turning business questions into analysis.",
    "sections": [
      {
        "key": "sql",
        "count": 2
      },
      {
        "key": "statistics",
        "count": 2
      },
      {
        "key": "analytics-case",
        "count": 2
      },
      {
        "key": "behavioral",
        "count": 1
      }
    ]
  },
  {
    "id": "data-scientist",
    "title": "Data Scientist",
    "blurb": "Statistics, machine learning, and the SQL to get the data.",
    "sections": [
      {
        "key": "statistics",
        "count": 2
      },
      {
        "key": "ml",
        "count": 2
      },
      {
        "key": "sql",
        "count": 2
      },
      {
        "key": "behavioral",
        "count": 1
      }
    ]
  },
  {
    "id": "business-analyst",
    "title": "Business Analyst",
    "blurb": "Requirements, stakeholders, and data-driven business cases.",
    "sections": [
      {
        "key": "requirements",
        "count": 2
      },
      {
        "key": "analytics-case",
        "count": 2
      },
      {
        "key": "sql",
        "count": 1
      },
      {
        "key": "behavioral",
        "count": 2
      }
    ]
  },
  {
    "id": "product-manager",
    "title": "Product Manager",
    "blurb": "Product sense, metrics, execution, and leadership stories.",
    "sections": [
      {
        "key": "product-sense",
        "count": 2
      },
      {
        "key": "metrics",
        "count": 2
      },
      {
        "key": "execution",
        "count": 2
      },
      {
        "key": "behavioral",
        "count": 2
      }
    ]
  }
];

export const interviewLevels = [
  {
    "id": "easy",
    "label": "Entry level"
  },
  {
    "id": "medium",
    "label": "Mid level"
  },
  {
    "id": "hard",
    "label": "Senior"
  }
] as const;
