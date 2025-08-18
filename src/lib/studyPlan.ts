import { Tutorial, Challenge } from "@prisma/client";

export interface StudyPlanStep {
  id: string;
  title: string;
  description: string;
  type: "tutorial" | "challenge" | "quiz" | "project" | "milestone";
  resourceId?: string; // ID of tutorial, challenge, etc.
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[]; // IDs of previous steps
  skills: string[]; // Skills learned in this step
  isOptional: boolean;
  order: number;
}

export interface StudyPlanPhase {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  estimatedWeeks: number;
  steps: StudyPlanStep[];
  milestoneProject?: {
    title: string;
    description: string;
    requirements: string[];
  };
}

export interface StudyPlan {
  id: string;
  language: string;
  title: string;
  description: string;
  totalHours: number;
  totalWeeks: number;
  skillLevel:
    | "beginner-to-expert"
    | "intermediate-to-expert"
    | "advanced-to-expert";
  phases: StudyPlanPhase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStudyProgress {
  userId: string;
  studyPlanId: string;
  currentPhaseId: string;
  currentStepId: string;
  completedSteps: string[];
  completedPhases: string[];
  totalProgressPercentage: number;
  hoursSpent: number;
  startedAt: Date;
  estimatedCompletionDate: Date;
  lastActivityAt: Date;
}

// JavaScript Study Plan Data
export const javascriptStudyPlan: StudyPlan = {
  id: "javascript-expert-path",
  language: "javascript",
  title: "JavaScript: Zero to Expert",
  description:
    "A comprehensive journey from absolute beginner to expert JavaScript developer, covering modern syntax, advanced concepts, and real-world applications.",
  totalHours: 200,
  totalWeeks: 24,
  skillLevel: "beginner-to-expert",
  phases: [
    {
      id: "foundations",
      title: "🌱 JavaScript Fundamentals",
      description: "Master the core concepts and syntax of JavaScript",
      color: "from-green-400 to-blue-500",
      icon: "🌱",
      estimatedWeeks: 4,
      steps: [
        {
          id: "variables-types",
          title: "Variables and Data Types",
          description:
            "Learn about let, const, var and JavaScript's type system",
          type: "tutorial",
          resourceId: "variables-and-data-types",
          estimatedHours: 3,
          difficulty: "beginner",
          prerequisites: [],
          skills: ["variables", "data types", "type coercion"],
          isOptional: false,
          order: 1,
        },
        {
          id: "variables-quiz",
          title: "Variables Quiz",
          description: "Test your understanding of variables and data types",
          type: "quiz",
          resourceId: "variables-data-types-quiz",
          estimatedHours: 1,
          difficulty: "beginner",
          prerequisites: ["variables-types"],
          skills: ["variables", "data types"],
          isOptional: false,
          order: 2,
        },
        {
          id: "functions-scope",
          title: "Functions and Scope",
          description:
            "Understanding function declarations, expressions, and scope",
          type: "tutorial",
          resourceId: "functions-and-scope",
          estimatedHours: 4,
          difficulty: "beginner",
          prerequisites: ["variables-types"],
          skills: ["functions", "scope", "closures"],
          isOptional: false,
          order: 3,
        },
        {
          id: "functions-challenge",
          title: "Function Challenges",
          description: "Practice creating and using functions",
          type: "challenge",
          resourceId: "function-basics",
          estimatedHours: 2,
          difficulty: "beginner",
          prerequisites: ["functions-scope"],
          skills: ["functions", "problem solving"],
          isOptional: false,
          order: 4,
        },
        {
          id: "arrays-objects",
          title: "Arrays and Objects",
          description: "Working with JavaScript's fundamental data structures",
          type: "tutorial",
          resourceId: "arrays-and-objects",
          estimatedHours: 5,
          difficulty: "beginner",
          prerequisites: ["functions-scope"],
          skills: ["arrays", "objects", "data manipulation"],
          isOptional: false,
          order: 5,
        },
        {
          id: "control-flow",
          title: "Control Flow",
          description: "Conditional statements and loops",
          type: "tutorial",
          resourceId: "control-structures",
          estimatedHours: 3,
          difficulty: "beginner",
          prerequisites: ["arrays-objects"],
          skills: ["conditionals", "loops", "logic"],
          isOptional: false,
          order: 6,
        },
      ],
      milestoneProject: {
        title: "Calculator App",
        description:
          "Build a functional calculator using basic JavaScript concepts",
        requirements: [
          "Use functions for calculations",
          "Handle user input validation",
          "Implement basic arithmetic operations",
          "Show results dynamically",
        ],
      },
    },
    {
      id: "dom-interactive",
      title: "🎨 DOM Manipulation & Interactivity",
      description: "Learn to make web pages interactive and dynamic",
      color: "from-purple-400 to-pink-500",
      icon: "🎨",
      estimatedWeeks: 3,
      steps: [
        {
          id: "dom-basics",
          title: "DOM Manipulation",
          description: "Selecting and modifying HTML elements with JavaScript",
          type: "tutorial",
          resourceId: "dom-manipulation",
          estimatedHours: 4,
          difficulty: "beginner",
          prerequisites: ["control-flow"],
          skills: ["DOM", "element selection", "event handling"],
          isOptional: false,
          order: 1,
        },
        {
          id: "events-handling",
          title: "Event Handling",
          description: "Responding to user interactions",
          type: "tutorial",
          resourceId: "event-handling",
          estimatedHours: 4,
          difficulty: "intermediate",
          prerequisites: ["dom-basics"],
          skills: ["events", "user interaction", "form handling"],
          isOptional: false,
          order: 2,
        },
        {
          id: "interactive-challenges",
          title: "Interactive Challenges",
          description: "Build interactive web components",
          type: "challenge",
          resourceId: "dom-interaction",
          estimatedHours: 6,
          difficulty: "intermediate",
          prerequisites: ["events-handling"],
          skills: ["DOM manipulation", "events", "UI development"],
          isOptional: false,
          order: 3,
        },
      ],
      milestoneProject: {
        title: "To-Do List App",
        description:
          "Create a fully functional to-do list with add, edit, delete, and mark complete features",
        requirements: [
          "Add new tasks dynamically",
          "Edit existing tasks inline",
          "Delete tasks with confirmation",
          "Mark tasks as complete/incomplete",
          "Save to localStorage",
        ],
      },
    },
    {
      id: "modern-javascript",
      title: "⚡ Modern JavaScript (ES6+)",
      description: "Master modern JavaScript features and syntax",
      color: "from-yellow-400 to-orange-500",
      icon: "⚡",
      estimatedWeeks: 4,
      steps: [
        {
          id: "es6-features",
          title: "ES6 Fundamentals",
          description: "Arrow functions, template literals, destructuring",
          type: "tutorial",
          resourceId: "es6-fundamentals",
          estimatedHours: 5,
          difficulty: "intermediate",
          prerequisites: ["interactive-challenges"],
          skills: [
            "ES6",
            "arrow functions",
            "destructuring",
            "template literals",
          ],
          isOptional: false,
          order: 1,
        },
        {
          id: "async-programming",
          title: "Asynchronous JavaScript",
          description: "Promises, async/await, and handling API calls",
          type: "tutorial",
          resourceId: "asynchronous-javascript-mastery",
          estimatedHours: 6,
          difficulty: "intermediate",
          prerequisites: ["es6-features"],
          skills: ["promises", "async/await", "API calls", "error handling"],
          isOptional: false,
          order: 2,
        },
        {
          id: "modules-imports",
          title: "Modules and Imports",
          description: "Organizing code with ES6 modules",
          type: "tutorial",
          resourceId: "modules-imports",
          estimatedHours: 3,
          difficulty: "intermediate",
          prerequisites: ["async-programming"],
          skills: ["modules", "imports", "exports", "code organization"],
          isOptional: false,
          order: 3,
        },
        {
          id: "api-project",
          title: "API Integration Project",
          description: "Build an app that fetches and displays data from APIs",
          type: "challenge",
          resourceId: "api-integration",
          estimatedHours: 8,
          difficulty: "intermediate",
          prerequisites: ["modules-imports"],
          skills: ["API integration", "async programming", "data handling"],
          isOptional: false,
          order: 4,
        },
      ],
      milestoneProject: {
        title: "Weather Dashboard",
        description:
          "Create a weather application that fetches data from multiple APIs",
        requirements: [
          "Fetch weather data from API",
          "Display current weather and forecast",
          "Search for different cities",
          "Handle loading states and errors",
          "Responsive design",
        ],
      },
    },
    {
      id: "advanced-concepts",
      title: "🔥 Advanced JavaScript",
      description: "Deep dive into advanced concepts and patterns",
      color: "from-red-400 to-purple-600",
      icon: "🔥",
      estimatedWeeks: 5,
      steps: [
        {
          id: "oop-javascript",
          title: "Object-Oriented Programming",
          description: "Classes, inheritance, and OOP principles in JavaScript",
          type: "tutorial",
          resourceId: "typescript-oop",
          estimatedHours: 6,
          difficulty: "advanced",
          prerequisites: ["api-project"],
          skills: ["OOP", "classes", "inheritance", "encapsulation"],
          isOptional: false,
          order: 1,
        },
        {
          id: "design-patterns",
          title: "Design Patterns",
          description: "Common design patterns in JavaScript",
          type: "tutorial",
          resourceId: "design-patterns",
          estimatedHours: 5,
          difficulty: "advanced",
          prerequisites: ["oop-javascript"],
          skills: ["design patterns", "architecture", "best practices"],
          isOptional: false,
          order: 2,
        },
        {
          id: "performance-optimization",
          title: "Performance Optimization",
          description: "Optimizing JavaScript code for performance",
          type: "tutorial",
          resourceId: "performance-optimization",
          estimatedHours: 4,
          difficulty: "advanced",
          prerequisites: ["design-patterns"],
          skills: ["performance", "optimization", "debugging"],
          isOptional: false,
          order: 3,
        },
        {
          id: "testing-debugging",
          title: "Testing and Debugging",
          description: "Writing tests and debugging JavaScript applications",
          type: "tutorial",
          resourceId: "testing-debugging",
          estimatedHours: 5,
          difficulty: "advanced",
          prerequisites: ["performance-optimization"],
          skills: ["testing", "debugging", "unit tests", "integration tests"],
          isOptional: false,
          order: 4,
        },
      ],
      milestoneProject: {
        title: "Task Management System",
        description:
          "Build a complex task management application with advanced features",
        requirements: [
          "Object-oriented architecture",
          "User authentication simulation",
          "Data persistence with localStorage",
          "Performance optimizations",
          "Comprehensive error handling",
          "Unit tests for core functionality",
        ],
      },
    },
    {
      id: "professional-development",
      title: "💼 Professional JavaScript",
      description: "Industry-standard tools and practices",
      color: "from-blue-400 to-indigo-600",
      icon: "💼",
      estimatedWeeks: 4,
      steps: [
        {
          id: "build-tools",
          title: "Build Tools and Bundlers",
          description: "Webpack, Vite, and modern development workflow",
          type: "tutorial",
          resourceId: "build-tools",
          estimatedHours: 4,
          difficulty: "advanced",
          prerequisites: ["testing-debugging"],
          skills: ["build tools", "bundlers", "development workflow"],
          isOptional: false,
          order: 1,
        },
        {
          id: "frameworks-intro",
          title: "Framework Fundamentals",
          description: "Introduction to React, Vue, or similar frameworks",
          type: "tutorial",
          resourceId: "framework-intro",
          estimatedHours: 8,
          difficulty: "advanced",
          prerequisites: ["build-tools"],
          skills: ["frameworks", "component architecture", "state management"],
          isOptional: false,
          order: 2,
        },
        {
          id: "deployment-optimization",
          title: "Deployment and Optimization",
          description: "Deploying JavaScript applications to production",
          type: "tutorial",
          resourceId: "deployment",
          estimatedHours: 3,
          difficulty: "advanced",
          prerequisites: ["frameworks-intro"],
          skills: ["deployment", "CI/CD", "production optimization"],
          isOptional: false,
          order: 3,
        },
      ],
      milestoneProject: {
        title: "Portfolio Website",
        description:
          "Create a professional portfolio showcasing all your JavaScript skills",
        requirements: [
          "Modern framework implementation",
          "Responsive design",
          "Performance optimized",
          "SEO friendly",
          "Deployed to production",
          "Showcase previous projects",
        ],
      },
    },
    {
      id: "expert-mastery",
      title: "🏆 Expert Mastery",
      description: "Advanced topics and specialized knowledge",
      color: "from-purple-600 to-pink-600",
      icon: "🏆",
      estimatedWeeks: 4,
      steps: [
        {
          id: "advanced-algorithms",
          title: "Advanced Algorithms",
          description: "Complex algorithms and data structures in JavaScript",
          type: "tutorial",
          resourceId: "advanced-algorithms",
          estimatedHours: 6,
          difficulty: "advanced",
          prerequisites: ["deployment-optimization"],
          skills: ["algorithms", "data structures", "problem solving"],
          isOptional: false,
          order: 1,
        },
        {
          id: "security-best-practices",
          title: "JavaScript Security",
          description: "Security considerations and best practices",
          type: "tutorial",
          resourceId: "security",
          estimatedHours: 4,
          difficulty: "advanced",
          prerequisites: ["advanced-algorithms"],
          skills: ["security", "best practices", "vulnerability prevention"],
          isOptional: false,
          order: 2,
        },
        {
          id: "capstone-project",
          title: "Capstone Project",
          description:
            "Build a comprehensive application demonstrating expert-level skills",
          type: "project",
          resourceId: "capstone-project",
          estimatedHours: 20,
          difficulty: "advanced",
          prerequisites: ["security-best-practices"],
          skills: [
            "full-stack development",
            "project management",
            "advanced JavaScript",
          ],
          isOptional: false,
          order: 3,
        },
      ],
      milestoneProject: {
        title: "Full-Stack Application",
        description: "Create a complete web application with advanced features",
        requirements: [
          "Frontend with modern JavaScript framework",
          "Backend API integration",
          "Database integration",
          "User authentication",
          "Real-time features",
          "Production deployment",
          "Comprehensive testing",
          "Documentation",
        ],
      },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Helper functions
export function calculateTotalSteps(studyPlan: StudyPlan): number {
  return studyPlan.phases.reduce(
    (total, phase) => total + phase.steps.length,
    0
  );
}

export function calculateCompletedSteps(
  studyPlan: StudyPlan,
  completedSteps: string[]
): number {
  return completedSteps.length;
}

export function calculateProgressPercentage(
  studyPlan: StudyPlan,
  completedSteps: string[]
): number {
  const totalSteps = calculateTotalSteps(studyPlan);
  const completed = calculateCompletedSteps(studyPlan, completedSteps);
  return totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
}

export function getCurrentPhase(
  studyPlan: StudyPlan,
  completedSteps: string[]
): StudyPlanPhase | null {
  for (const phase of studyPlan.phases) {
    const phaseSteps = phase.steps.map((s) => s.id);
    const completedInPhase = phaseSteps.filter((stepId) =>
      completedSteps.includes(stepId)
    );

    if (completedInPhase.length < phaseSteps.length) {
      return phase;
    }
  }

  // All phases completed
  return studyPlan.phases[studyPlan.phases.length - 1];
}

export function getNextStep(
  studyPlan: StudyPlan,
  completedSteps: string[]
): StudyPlanStep | null {
  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (!completedSteps.includes(step.id)) {
        // Check if prerequisites are met
        const prerequisitesMet = step.prerequisites.every((prereq) =>
          completedSteps.includes(prereq)
        );

        if (prerequisitesMet) {
          return step;
        }
      }
    }
  }

  return null; // All steps completed
}

export function getSkillsLearned(
  studyPlan: StudyPlan,
  completedSteps: string[]
): string[] {
  const skills = new Set<string>();

  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (completedSteps.includes(step.id)) {
        step.skills.forEach((skill) => skills.add(skill));
      }
    }
  }

  return Array.from(skills);
}

export function estimateCompletionDate(
  studyPlan: StudyPlan,
  completedSteps: string[],
  hoursPerWeek: number = 10
): Date {
  let remainingHours = 0;

  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (!completedSteps.includes(step.id)) {
        remainingHours += step.estimatedHours;
      }
    }
  }

  const remainingWeeks = Math.ceil(remainingHours / hoursPerWeek);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + remainingWeeks * 7);

  return completionDate;
}
