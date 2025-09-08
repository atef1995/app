import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NODEJS_TUTORIALS = [
  {
    slug: "nodejs-introduction",
    title: "Node.js Fundamentals: Your First Server-Side Journey",
    description:
      "Discover what Node.js is and start building server-side applications with JavaScript",
    mdxFile: "nodejs/01-nodejs-introduction",
    category: "nodejs",
    estimatedTime: 45.0,
    difficulty: 2,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
  },
  {
    slug: "nodejs-modules-and-npm",
    title: "Node.js Modules & NPM: Building Your JavaScript Toolkit",
    description:
      "Master Node.js modules and npm to organize code and leverage the massive ecosystem",
    mdxFile: "nodejs/02-modules-and-npm",
    category: "nodejs",
    estimatedTime: 50.0,
    difficulty: 3,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
  },
  {
    slug: "nodejs-package-management",
    title: "Package Management & npm Ecosystem",
    description:
      "Master npm, semantic versioning, and package creation. Learn to navigate the vast Node.js ecosystem and create your own publishable packages.",
    mdxFile: "nodejs/03-package-management",
    category: "nodejs",
    estimatedTime: 45.0,
    difficulty: 3,
    order: 3,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
  },
  {
    slug: "nodejs-http-and-web-servers",
    title: "HTTP & Web Servers: Building Your First Server",
    description:
      "Create powerful HTTP servers from scratch using Node.js. Master requests, responses, routing, and middleware while building real web applications.",
    mdxFile: "nodejs/04-http-and-web-servers",
    category: "nodejs",
    estimatedTime: 60.0,
    difficulty: 2,
    order: 4,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
  },
  {
    slug: "nodejs-express-framework",
    title: "Express.js Framework: Building Professional Web Applications",
    description:
      "Master Express.js, the most popular Node.js web framework. Learn routing, middleware, error handling, and build production-ready APIs with ease.",
    mdxFile: "nodejs/05-express-framework",
    category: "nodejs",
    estimatedTime: 75.0,
    difficulty: 2,
    order: 5,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
  },
  {
    slug: "nodejs-rest-api-development",
    title: "RESTful API Development: Building Production-Ready APIs",
    description:
      "Master REST API design principles and build robust, scalable APIs with Express.js. Learn CRUD operations, validation, error handling, and professional API documentation.",
    mdxFile: "nodejs/06-rest-api-development",
    category: "nodejs",
    estimatedTime: 90.0,
    difficulty: 3,
    order: 6,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
  },
  {
    slug: "nodejs-database-integration",
    title: "Database Integration: Building Data-Driven APIs",
    description:
      "Connect your Express.js APIs to real databases. Master PostgreSQL, Prisma ORM, data modeling, relationships, and build production-ready data-driven applications.",
    mdxFile: "nodejs/07-database-integration",
    category: "nodejs",
    estimatedTime: 100.0,
    difficulty: 3,
    order: 7,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
  },
  {
    slug: "nodejs-authentication-security",
    title: "Authentication & Security: Protecting Your Node.js Applications",
    description:
      "Master user authentication, JWT tokens, password security, OAuth integration, and API protection. Build secure, production-ready authentication systems that actually work in the real world.",
    mdxFile: "nodejs/08-authentication-security",
    category: "nodejs",
    estimatedTime: 120.0,
    difficulty: 4,
    order: 8,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
  },
  {
    slug: "nodejs-real-time-applications",
    title: "Real-Time Applications: Building Live, Interactive Experiences",
    description:
      "Master WebSockets, Socket.IO, and real-time data synchronization. Build chat applications, live dashboards, collaborative tools, and multiplayer experiences that keep users engaged with instant updates.",
    mdxFile: "nodejs/09-real-time-applications",
    category: "nodejs",
    estimatedTime: 135.0,
    difficulty: 4,
    order: 9,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
  },
  {
    slug: "nodejs-testing-debugging",
    title: "Testing & Debugging: Building Bulletproof Node.js Applications",
    description:
      "Master unit testing with Jest, integration testing strategies, API testing with Supertest, and advanced debugging techniques. Learn to write tests that actually catch bugs and debug applications like a pro.",
    mdxFile: "nodejs/10-testing-debugging",
    category: "nodejs",
    estimatedTime: 140.0,
    difficulty: 3,
    order: 10,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
  },
  {
    slug: "nodejs-performance-optimization",
    title: "Performance Optimization: Building Lightning-Fast Node.js Applications",
    description:
      "Master profiling techniques, memory management, caching strategies with Redis, load balancing, and clustering. Learn to identify bottlenecks and optimize Node.js applications for production-scale performance.",
    mdxFile: "nodejs/11-performance-optimization",
    category: "nodejs",
    estimatedTime: 180.0,
    difficulty: 4,
    order: 11,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
  },
];

export async function seedNodejsTutorials() {
  console.log("🌱 Starting Node.js tutorials seeding...");

  try {
    // First ensure the nodejs category exists
    const nodejsCategory = await prisma.category.upsert({
      where: { slug: "nodejs" },
      update: {
        title: "Node.js",
        description: "Learn server-side JavaScript development with Node.js",
        difficulty: "intermediate",
        topics: [
          "Node.js",
          "Server-side",
          "Runtime",
          "Modules",
          "NPM",
          "Express",
        ],
        duration: "4-6 hours",
        iconBg: "bg-green-100 dark:bg-green-900",
        iconColor: "text-green-600 dark:text-green-400",
        badgeBg: "bg-green-100 dark:bg-green-900",
        badgeColor: "text-green-800 dark:text-green-200",
        dotColor: "bg-green-600",
        order: 9,
      },
      create: {
        slug: "nodejs",
        title: "Node.js",
        description: "Learn server-side JavaScript development with Node.js",
        difficulty: "intermediate",
        topics: [
          "Node.js",
          "Server-side",
          "Runtime",
          "Modules",
          "NPM",
          "Express",
        ],
        duration: "4-6 hours",
        iconBg: "bg-green-100 dark:bg-green-900",
        iconColor: "text-green-600 dark:text-green-400",
        badgeBg: "bg-green-100 dark:bg-green-900",
        badgeColor: "text-green-800 dark:text-green-200",
        dotColor: "bg-green-600",
        order: 9,
      },
    });

    console.log(`✅ Category created/updated: ${nodejsCategory.title}`);

    // Create tutorials
    for (const tutorial of NODEJS_TUTORIALS) {
      const { category, ...tutorialData } = tutorial;
      const createdTutorial = await prisma.tutorial.upsert({
        where: { slug: tutorial.slug },
        update: {
          ...tutorialData,
          category: {
            connect: { id: nodejsCategory.id },
          },
        },
        create: {
          ...tutorialData,
          category: {
            connect: { id: nodejsCategory.id },
          },
        },
      });

      console.log(`✅ Created/updated tutorial: ${createdTutorial.title}`);
    }

    const realTimeQuizzes = [
      {
        slug: "nodejs-real-time-applications-quiz",
        title: "Real-Time Applications Quiz",
        tutorialSlug: "nodejs-real-time-applications",
        isPremium: true,
        requiredPlan: "CRACKED",
        questions: [
          {
            id: "realtime-1",
            question:
              "What is the main advantage of WebSockets over HTTP polling?",
            type: "multiple-choice",
            options: [
              "WebSockets are more secure than HTTP",
              "WebSockets provide bi-directional, real-time communication with lower overhead",
              "WebSockets work only with HTTPS",
              "WebSockets automatically handle user authentication",
            ],
            correct: 1,
            explanation:
              "WebSockets provide full-duplex communication with lower overhead than HTTP polling, allowing real-time, bi-directional data exchange between client and server.",
          },
          {
            id: "realtime-2",
            question: "What does Socket.IO provide over raw WebSockets?",
            type: "multiple-choice",
            options: [
              "Only better performance",
              "Automatic fallbacks, rooms, namespaces, and enhanced features",
              "Built-in database integration",
              "Automatic UI generation",
            ],
            correct: 1,
            explanation:
              "Socket.IO adds features like automatic fallback to polling, rooms and namespaces for organization, automatic reconnection, and enhanced error handling.",
          },
          {
            id: "realtime-3",
            question:
              "What is Operational Transform (OT) used for in collaborative applications?",
            type: "multiple-choice",
            options: [
              "Optimizing database queries",
              "Handling concurrent edits to maintain document consistency",
              "Encrypting real-time messages",
              "Managing user authentication",
            ],
            correct: 1,
            explanation:
              "Operational Transform ensures that concurrent edits from multiple users are applied correctly while maintaining document consistency and user intention.",
          },
          {
            id: "realtime-4",
            question:
              "Why is rate limiting important in real-time applications?",
            type: "multiple-choice",
            options: [
              "To improve application speed",
              "To prevent abuse, spam, and ensure fair resource usage",
              "To reduce memory usage",
              "To enable offline functionality",
            ],
            correct: 1,
            explanation:
              "Rate limiting prevents users from overwhelming the server with too many messages, protects against spam and abuse, and ensures fair resource allocation.",
          },
          {
            id: "realtime-5",
            question: "What is the purpose of rooms in Socket.IO?",
            type: "multiple-choice",
            options: [
              "To store user authentication data",
              "To group sockets for targeted message broadcasting",
              "To manage database connections",
              "To handle file uploads",
            ],
            correct: 1,
            explanation:
              "Rooms allow you to group sockets together so you can broadcast messages to specific groups of users, like chat rooms or collaborative document sessions.",
          },
          {
            id: "realtime-6",
            question:
              "How should you handle connection failures in real-time applications?",
            type: "multiple-choice",
            options: [
              "Ignore connection failures completely",
              "Implement automatic reconnection with exponential backoff",
              "Always refresh the entire page",
              "Show an error message and stop the application",
            ],
            correct: 1,
            explanation:
              "Automatic reconnection with exponential backoff prevents overwhelming the server while ensuring users regain connectivity during temporary network issues.",
          },
          {
            id: "realtime-7",
            question:
              "What is the difference between namespaces and rooms in Socket.IO?",
            type: "multiple-choice",
            options: [
              "There is no difference, they're the same thing",
              "Namespaces separate different app features, rooms group users within a namespace",
              "Rooms are for authentication, namespaces are for messaging",
              "Namespaces are faster than rooms",
            ],
            correct: 1,
            explanation:
              "Namespaces provide logical separation of different application features (like /chat vs /notifications), while rooms group users within those namespaces.",
          },
          {
            id: "realtime-8",
            question:
              "Why is message acknowledgment important in real-time applications?",
            type: "multiple-choice",
            options: [
              "To improve application performance",
              "To ensure message delivery and handle failures gracefully",
              "To reduce bandwidth usage",
              "To enable message encryption",
            ],
            correct: 1,
            explanation:
              "Message acknowledgments confirm that messages were received and processed, allowing applications to handle delivery failures and provide user feedback.",
          },
          {
            id: "realtime-9",
            question:
              "What should you consider when scaling real-time applications horizontally?",
            type: "multiple-choice",
            options: [
              "Only server performance",
              "Message synchronization across servers using Redis or similar",
              "Only client-side optimization",
              "Database performance only",
            ],
            correct: 1,
            explanation:
              "Horizontal scaling requires synchronizing messages across multiple server instances, typically using Redis adapters to share connection state and messages.",
          },
          {
            id: "realtime-10",
            question:
              "How should real-time applications handle authentication?",
            type: "multiple-choice",
            options: [
              "Authentication is not needed for real-time apps",
              "Authenticate during WebSocket handshake and periodically validate",
              "Only authenticate HTTP requests, not WebSocket connections",
              "Use only client-side authentication",
            ],
            correct: 1,
            explanation:
              "Real-time applications should authenticate during the WebSocket handshake and periodically re-validate tokens for long-lived connections to maintain security.",
          },
        ],
      },
    ];

    // Combine all quizzes
    const nodejsQuizzes = [
      ...[
        {
          slug: "nodejs-introduction-quiz",
          title: "Node.js Fundamentals Quiz",
          tutorialSlug: "nodejs-introduction",
          isPremium: false,
          requiredPlan: "FREE",
          questions: [
            {
              id: "nodejs-1",
              question: "What is Node.js?",
              type: "multiple-choice",
              options: [
                "A programming language",
                "A JavaScript runtime environment",
                "A web browser",
                "A database system",
              ],
              correct: 1,
              explanation:
                "Node.js is a JavaScript runtime environment that allows you to run JavaScript outside of a web browser.",
            },
            {
              id: "nodejs-2",
              question:
                "Which object provides information about the Node.js process?",
              type: "multiple-choice",
              options: ["window", "document", "process", "global"],
              correct: 2,
              explanation:
                "The process object provides information about the current Node.js process and environment.",
            },
            {
              id: "nodejs-3",
              question: "How do you import the file system module in Node.js?",
              type: "multiple-choice",
              options: [
                "import fs from 'fs'",
                "const fs = require('fs')",
                "include fs",
                "load fs",
              ],
              correct: 1,
              explanation:
                "The require() function is used to import modules in Node.js.",
            },
            {
              id: "nodejs-4",
              question: "What does fs.readFileSync() do?",
              type: "multiple-choice",
              options: [
                "Reads a file asynchronously",
                "Reads a file synchronously",
                "Writes to a file",
                "Deletes a file",
              ],
              correct: 1,
              explanation:
                "fs.readFileSync() reads a file synchronously, blocking code execution until complete.",
            },
            {
              id: "nodejs-5",
              question:
                "Which is a key difference between browser JavaScript and Node.js?",
              type: "multiple-choice",
              options: [
                "Node.js has access to the DOM",
                "Browser JavaScript can access the file system",
                "Node.js can access the file system directly",
                "They are exactly the same",
              ],
              correct: 2,
              explanation:
                "Node.js can directly access the file system and other system resources, while browser JavaScript cannot for security reasons.",
            },
          ],
        },
        {
          slug: "nodejs-modules-and-npm-quiz",
          title: "Node.js Modules & NPM Quiz",
          tutorialSlug: "nodejs-modules-and-npm",
          isPremium: false,
          requiredPlan: "FREE",
          questions: [
            {
              id: "modules-1",
              question: "What is the purpose of module.exports in Node.js?",
              type: "multiple-choice",
              options: [
                "To import modules from other files",
                "To make functions and objects available to other files",
                "To delete modules from memory",
                "To run modules in the background",
              ],
              correct: 1,
              explanation:
                "module.exports is used to make functions, objects, or values available for use in other files.",
            },
            {
              id: "modules-2",
              question: "How do you import a module in CommonJS?",
              type: "multiple-choice",
              options: [
                "import module from 'module'",
                "const module = require('module')",
                "include('module')",
                "load module",
              ],
              correct: 1,
              explanation:
                "In CommonJS (Node.js), you use require() to import modules.",
            },
            {
              id: "modules-3",
              question: "What does NPM stand for?",
              type: "multiple-choice",
              options: [
                "Node Package Manager",
                "New Programming Method",
                "Network Protocol Manager",
                "Node Process Monitor",
              ],
              correct: 0,
              explanation:
                "NPM stands for Node Package Manager, the default package manager for Node.js.",
            },
            {
              id: "modules-4",
              question:
                "Which file contains project metadata and dependencies?",
              type: "multiple-choice",
              options: [
                "index.js",
                "package.json",
                "node_modules.json",
                "config.js",
              ],
              correct: 1,
              explanation:
                "package.json contains project metadata, scripts, and dependency information.",
            },
            {
              id: "modules-5",
              question: "What does the ^ symbol mean in package.json versions?",
              type: "multiple-choice",
              options: [
                "Exact version only",
                "Compatible with major version",
                "Any version",
                "Latest available version",
              ],
              correct: 1,
              explanation:
                "The ^ (caret) symbol allows compatible updates within the same major version (e.g., ^4.1.0 allows 4.x.x but not 5.0.0).",
            },
            {
              id: "modules-6",
              question: "Which of these is a built-in Node.js module?",
              type: "multiple-choice",
              options: ["express", "lodash", "fs", "axios"],
              correct: 2,
              explanation:
                "fs (file system) is a built-in Node.js module, while express, lodash, and axios are third-party packages.",
            },
            {
              id: "modules-7",
              question:
                "What command installs a package as a development dependency?",
              type: "multiple-choice",
              options: [
                "npm install package",
                "npm install --save package",
                "npm install --save-dev package",
                "npm install --global package",
              ],
              correct: 2,
              explanation:
                "npm install --save-dev installs a package as a development dependency, only needed during development.",
            },
            {
              id: "modules-8",
              question: "Which module system uses import/export syntax?",
              type: "multiple-choice",
              options: ["CommonJS", "ES Modules", "AMD", "UMD"],
              correct: 1,
              explanation:
                "ES Modules (ECMAScript Modules) use import/export syntax, while CommonJS uses require/module.exports.",
            },
          ],
        },
        {
          slug: "nodejs-package-management-quiz",
          title: "Package Management & npm Ecosystem Quiz",
          tutorialSlug: "nodejs-package-management",
          isPremium: false,
          requiredPlan: "FREE",
          questions: [
            {
              id: "pkg-1",
              question:
                "What does semantic versioning format MAJOR.MINOR.PATCH represent?",
              type: "multiple-choice",
              options: [
                "Breaking changes, new features, bug fixes",
                "Bug fixes, new features, breaking changes",
                "New features, breaking changes, bug fixes",
                "Random version numbers",
              ],
              correct: 0,
              explanation:
                "Semantic versioning follows MAJOR.MINOR.PATCH where MAJOR = breaking changes, MINOR = new features (backwards compatible), PATCH = bug fixes.",
            },
            {
              id: "pkg-2",
              question:
                "What does the ^ symbol mean in package.json dependencies?",
              type: "multiple-choice",
              options: [
                "Exact version only",
                "Allow minor and patch updates within major version",
                "Allow any version",
                "Allow patch updates only",
              ],
              correct: 1,
              explanation:
                "The ^ (caret) allows compatible updates within the same major version. For example, ^4.1.0 accepts 4.x.x but not 5.0.0.",
            },
            {
              id: "pkg-3",
              question:
                "Which command installs a package for development only?",
              type: "multiple-choice",
              options: [
                "npm install package",
                "npm install --save package",
                "npm install --save-dev package",
                "npm install --global package",
              ],
              correct: 2,
              explanation:
                "npm install --save-dev installs packages needed only during development, not in production.",
            },
            {
              id: "pkg-4",
              question: "What is the main entry point field in package.json?",
              type: "multiple-choice",
              options: ["start", "main", "entry", "index"],
              correct: 1,
              explanation:
                "The 'main' field in package.json specifies the entry point file for your package.",
            },
            {
              id: "pkg-5",
              question:
                "Which npm command checks for security vulnerabilities?",
              type: "multiple-choice",
              options: ["npm check", "npm security", "npm audit", "npm scan"],
              correct: 2,
              explanation:
                "npm audit checks for known security vulnerabilities in your dependencies.",
            },
            {
              id: "pkg-6",
              question:
                "What is the difference between dependencies and devDependencies?",
              type: "multiple-choice",
              options: [
                "No difference, just organization",
                "dependencies are for production, devDependencies for development only",
                "devDependencies are more important",
                "dependencies are installed globally",
              ],
              correct: 1,
              explanation:
                "dependencies are needed in production, while devDependencies are only needed during development (testing, building, etc.).",
            },
            {
              id: "pkg-7",
              question:
                "Which file lists all installed packages and their exact versions?",
              type: "multiple-choice",
              options: [
                "package.json",
                "package-lock.json",
                "node_modules.json",
                "npm-config.json",
              ],
              correct: 1,
              explanation:
                "package-lock.json locks exact versions of all dependencies to ensure consistent installs across environments.",
            },
            {
              id: "pkg-8",
              question: "What does 'npm ci' do differently from 'npm install'?",
              type: "multiple-choice",
              options: [
                "Installs packages faster",
                "Installs from package-lock.json exactly, good for production",
                "Installs only production dependencies",
                "Creates a new package.json",
              ],
              correct: 1,
              explanation:
                "npm ci installs dependencies directly from package-lock.json without modifying it, making it ideal for production deployments.",
            },
            {
              id: "pkg-9",
              question:
                "How do you run a custom script defined in package.json?",
              type: "multiple-choice",
              options: [
                "npm script-name",
                "npm run script-name",
                "npm execute script-name",
                "node script-name",
              ],
              correct: 1,
              explanation:
                "Use 'npm run script-name' to execute custom scripts defined in the scripts section of package.json.",
            },
            {
              id: "pkg-10",
              question:
                "What should you do before publishing your first npm package?",
              type: "multiple-choice",
              options: [
                "Just run npm publish immediately",
                "Create account, test package, run npm pack --dry-run, then publish",
                "Only create an npm account",
                "Install all dependencies globally",
              ],
              correct: 1,
              explanation:
                "Before publishing: create npm account, thoroughly test your package, use 'npm pack --dry-run' to see what will be published, then 'npm publish'.",
            },
          ],
        },
        {
          slug: "nodejs-express-framework-quiz",
          title: "Express.js Framework Quiz",
          tutorialSlug: "nodejs-express-framework",
          isPremium: true,
          requiredPlan: "VIBED",
          questions: [
            {
              id: "express-1",
              question: "What is Express.js?",
              type: "multiple-choice",
              options: [
                "A programming language",
                "A web framework for Node.js",
                "A database system",
                "A browser runtime",
              ],
              correct: 1,
              explanation:
                "Express.js is a minimal and flexible web application framework for Node.js that provides robust features for web and mobile applications.",
            },
            {
              id: "express-2",
              question: "How do you create a basic route in Express.js?",
              type: "multiple-choice",
              options: [
                "app.route('/path', handler)",
                "app.get('/path', handler)",
                "app.listen('/path', handler)",
                "app.create('/path', handler)",
              ],
              correct: 1,
              explanation:
                "app.get('/path', handler) creates a route that responds to GET requests on the specified path.",
            },
            {
              id: "express-3",
              question: "What is middleware in Express.js?",
              type: "multiple-choice",
              options: [
                "Functions that execute during the request-response cycle",
                "Database connection pooling",
                "Template engines",
                "Static file servers",
              ],
              correct: 0,
              explanation:
                "Middleware functions are functions that have access to the request and response objects and the next middleware function in the request-response cycle.",
            },
            {
              id: "express-4",
              question: "How do you access route parameters in Express.js?",
              type: "multiple-choice",
              options: [
                "req.query.paramName",
                "req.params.paramName",
                "req.body.paramName",
                "req.headers.paramName",
              ],
              correct: 1,
              explanation:
                "Route parameters (like :id in /users/:id) are accessed through req.params.paramName.",
            },
            {
              id: "express-5",
              question: "What does app.use() do in Express.js?",
              type: "multiple-choice",
              options: [
                "Creates a new route",
                "Mounts middleware functions",
                "Starts the server",
                "Connects to database",
              ],
              correct: 1,
              explanation:
                "app.use() mounts middleware functions at a specified path. The middleware function is executed when the base of the requested path matches path.",
            },
            {
              id: "express-6",
              question: "How do you handle errors in Express.js?",
              type: "multiple-choice",
              options: [
                "Using try-catch blocks only",
                "Error-handling middleware with four parameters: (err, req, res, next)",
                "Using console.log",
                "Automatic error handling",
              ],
              correct: 1,
              explanation:
                "Express error-handling middleware functions have four parameters: (error, req, res, next) and must be defined after all other middleware.",
            },
            {
              id: "express-7",
              question: "What is the purpose of express.json() middleware?",
              type: "multiple-choice",
              options: [
                "To serve static files",
                "To parse incoming requests with JSON payloads",
                "To handle errors",
                "To create routes",
              ],
              correct: 1,
              explanation:
                "express.json() is built-in middleware that parses incoming requests with JSON payloads and makes the parsed data available in req.body.",
            },
            {
              id: "express-8",
              question: "How do you send a JSON response in Express.js?",
              type: "multiple-choice",
              options: [
                "res.send(JSON.stringify(data))",
                "res.json(data)",
                "res.write(data)",
                "res.end(data)",
              ],
              correct: 1,
              explanation:
                "res.json(data) sends a JSON response and automatically sets the Content-Type header to application/json.",
            },
          ],
        },
        {
          slug: "nodejs-rest-api-development-quiz",
          title: "RESTful API Development Quiz",
          tutorialSlug: "nodejs-rest-api-development",
          isPremium: true,
          requiredPlan: "VIBED",
          questions: [
            {
              id: "rest-1",
              question: "What does REST stand for?",
              type: "multiple-choice",
              options: [
                "Representational State Transfer",
                "Remote System Transfer",
                "Resource State Transformation",
                "Relational System Template",
              ],
              correct: 0,
              explanation:
                "REST stands for Representational State Transfer, an architectural style for designing networked applications.",
            },
            {
              id: "rest-2",
              question:
                "Which HTTP method is used to create a new resource in REST?",
              type: "multiple-choice",
              options: ["GET", "POST", "PUT", "DELETE"],
              correct: 1,
              explanation:
                "POST is used to create new resources in RESTful APIs. It's not idempotent, meaning multiple identical requests may have different effects.",
            },
            {
              id: "rest-3",
              question:
                "What is the difference between PUT and PATCH HTTP methods?",
              type: "multiple-choice",
              options: [
                "PUT and PATCH are identical",
                "PUT replaces entire resource, PATCH updates specific fields",
                "PUT updates fields, PATCH replaces resource",
                "PUT is for creation, PATCH is for deletion",
              ],
              correct: 1,
              explanation:
                "PUT is used to replace an entire resource with new data, while PATCH is used for partial updates to specific fields of a resource.",
            },
            {
              id: "rest-4",
              question:
                "Which HTTP status code should be returned when a resource is successfully created?",
              type: "multiple-choice",
              options: [
                "200 OK",
                "201 Created",
                "204 No Content",
                "202 Accepted",
              ],
              correct: 1,
              explanation:
                "201 Created indicates that a new resource has been successfully created as a result of the request.",
            },
            {
              id: "rest-5",
              question: "What is the correct URL structure for REST APIs?",
              type: "multiple-choice",
              options: [
                "/getUsers, /createUser, /deleteUser",
                "/users, /users/:id",
                "/userActions, /userOperations",
                "/api/getUserById",
              ],
              correct: 1,
              explanation:
                "REST APIs should use resource-based URLs with nouns (/users, /users/:id), not action-based URLs with verbs. HTTP methods determine the action.",
            },
            {
              id: "rest-6",
              question:
                "Which principle is NOT one of the six REST constraints?",
              type: "multiple-choice",
              options: [
                "Stateless",
                "Client-Server",
                "Database Integration",
                "Uniform Interface",
              ],
              correct: 2,
              explanation:
                "The six REST constraints are: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, and Code on Demand. Database Integration is not a REST constraint.",
            },
            {
              id: "rest-7",
              question: "What should you validate in API requests?",
              type: "multiple-choice",
              options: [
                "Only the request body",
                "Only required fields",
                "All user input including body, parameters, and headers",
                "Only authentication tokens",
              ],
              correct: 2,
              explanation:
                "You should validate all user input including request body, path parameters, query parameters, and relevant headers to ensure security and data integrity.",
            },
            {
              id: "rest-8",
              question:
                "What is the purpose of middleware in Express.js REST APIs?",
              type: "multiple-choice",
              options: [
                "To handle database connections only",
                "To process requests through customizable layers for cross-cutting concerns",
                "To serve static files only",
                "To compile TypeScript code",
              ],
              correct: 1,
              explanation:
                "Middleware functions process requests through customizable layers, handling cross-cutting concerns like authentication, validation, logging, and error handling.",
            },
            {
              id: "rest-9",
              question: "How should you handle errors in a REST API?",
              type: "multiple-choice",
              options: [
                "Always return 200 OK with error in response body",
                "Use appropriate HTTP status codes with consistent error response format",
                "Only use 500 Internal Server Error for all errors",
                "Return HTML error pages",
              ],
              correct: 1,
              explanation:
                "Proper error handling uses appropriate HTTP status codes (400, 401, 404, 500, etc.) with consistent JSON error response formats that provide clear error messages.",
            },
            {
              id: "rest-10",
              question:
                "What should be included in professional API documentation?",
              type: "multiple-choice",
              options: [
                "Only endpoint URLs",
                "Endpoints, parameters, responses, examples, error codes, and authentication",
                "Just the source code",
                "Only successful response examples",
              ],
              correct: 1,
              explanation:
                "Professional API documentation should include complete endpoint documentation, parameters, response schemas, examples, error codes, authentication requirements, and interactive testing capabilities.",
            },
            {
              id: "rest-11",
              question: "Which HTTP method is idempotent and safe?",
              type: "multiple-choice",
              options: ["POST", "GET", "PATCH", "DELETE"],
              correct: 1,
              explanation:
                "GET is both idempotent (same result when called multiple times) and safe (doesn't modify server state). It's used for reading/retrieving resources.",
            },
            {
              id: "rest-12",
              question: "How should you implement API versioning?",
              type: "multiple-choice",
              options: [
                "Never version APIs",
                "Use URL path versioning like /v1/users or header versioning",
                "Only use query parameters",
                "Change existing endpoints without versioning",
              ],
              correct: 1,
              explanation:
                "API versioning can be implemented through URL path versioning (/v1/users, /v2/users) or header versioning. This allows backwards compatibility when making breaking changes.",
            },
          ],
        },
        {
          slug: "nodejs-database-integration-quiz",
          title: "Database Integration Quiz",
          tutorialSlug: "nodejs-database-integration",
          isPremium: true,
          requiredPlan: "VIBED",
          questions: [
            {
              id: "db-1",
              question:
                "What is the main advantage of using a database over in-memory data storage?",
              type: "multiple-choice",
              options: [
                "Faster performance",
                "Data persistence and ACID properties",
                "Simpler code structure",
                "No setup required",
              ],
              correct: 1,
              explanation:
                "Databases provide data persistence (data survives server restarts) and ACID properties (Atomicity, Consistency, Isolation, Durability) for reliable data management.",
            },
            {
              id: "db-2",
              question: "What does ORM stand for in the context of databases?",
              type: "multiple-choice",
              options: [
                "Object Resource Management",
                "Object-Relational Mapping",
                "Operational Resource Monitor",
                "Online Resource Manager",
              ],
              correct: 1,
              explanation:
                "ORM stands for Object-Relational Mapping, which bridges the gap between JavaScript objects and database tables.",
            },
            {
              id: "db-3",
              question: "Which of these is a key benefit of using Prisma ORM?",
              type: "multiple-choice",
              options: [
                "Automatic code compilation",
                "Type safety and auto-generated TypeScript types",
                "Built-in authentication",
                "Automatic UI generation",
              ],
              correct: 1,
              explanation:
                "Prisma provides type safety by automatically generating TypeScript types from your database schema, along with excellent developer experience.",
            },
            {
              id: "db-4",
              question:
                "What file contains the database schema definition in Prisma?",
              type: "multiple-choice",
              options: [
                "database.json",
                "schema.prisma",
                "config.db",
                "models.ts",
              ],
              correct: 1,
              explanation:
                "The schema.prisma file contains the database schema definition, including models, relationships, and configuration.",
            },
            {
              id: "db-5",
              question:
                "What does the @default(autoincrement()) attribute do in Prisma?",
              type: "multiple-choice",
              options: [
                "Sets a default string value",
                "Creates an auto-incrementing integer primary key",
                "Sets the current timestamp",
                "Creates a unique constraint",
              ],
              correct: 1,
              explanation:
                "@default(autoincrement()) creates an auto-incrementing integer, commonly used for primary keys that automatically increment with each new record.",
            },
            {
              id: "db-6",
              question: "What is the purpose of database migrations?",
              type: "multiple-choice",
              options: [
                "To backup database data",
                "To version control schema changes and safely update database structure",
                "To improve query performance",
                "To connect to multiple databases",
              ],
              correct: 1,
              explanation:
                "Database migrations provide version control for schema changes, allowing you to safely update database structure while preserving data.",
            },
            {
              id: "db-7",
              question:
                "Which Prisma method is used to create a new database record?",
              type: "multiple-choice",
              options: [
                "prisma.model.insert()",
                "prisma.model.add()",
                "prisma.model.create()",
                "prisma.model.new()",
              ],
              correct: 2,
              explanation:
                "prisma.model.create() is used to create new database records with the data provided in the data object.",
            },
            {
              id: "db-8",
              question:
                "How do you find multiple records with filtering in Prisma?",
              type: "multiple-choice",
              options: [
                "prisma.model.getAll()",
                "prisma.model.findMany()",
                "prisma.model.select()",
                "prisma.model.query()",
              ],
              correct: 1,
              explanation:
                "prisma.model.findMany() is used to retrieve multiple records with optional filtering, pagination, and sorting.",
            },
            {
              id: "db-9",
              question: "What does the 'include' option do in Prisma queries?",
              type: "multiple-choice",
              options: [
                "Includes only specific fields",
                "Includes related data from other tables",
                "Includes deleted records",
                "Includes metadata",
              ],
              correct: 1,
              explanation:
                "The 'include' option fetches related data from other tables based on the relationships defined in your schema.",
            },
            {
              id: "db-10",
              question:
                "Which Prisma error code indicates a record was not found?",
              type: "multiple-choice",
              options: ["P2001", "P2025", "P2002", "P2003"],
              correct: 1,
              explanation:
                "P2025 is the Prisma error code that indicates a record was not found during an operation like update or delete.",
            },
            {
              id: "db-11",
              question:
                "What is the difference between findUnique() and findFirst() in Prisma?",
              type: "multiple-choice",
              options: [
                "No difference, they're identical",
                "findUnique() requires unique fields, findFirst() returns first match of any query",
                "findFirst() is faster than findUnique()",
                "findUnique() returns multiple records",
              ],
              correct: 1,
              explanation:
                "findUnique() requires searching by unique fields (like id or email), while findFirst() returns the first record matching any query criteria.",
            },
            {
              id: "db-12",
              question:
                "How should you handle database connections in Express.js with Prisma?",
              type: "multiple-choice",
              options: [
                "Create new PrismaClient for every request",
                "Create one PrismaClient instance and reuse it, disconnect when app shuts down",
                "Use multiple PrismaClient instances randomly",
                "Never disconnect PrismaClient",
              ],
              correct: 1,
              explanation:
                "You should create one PrismaClient instance and reuse it throughout your application, then disconnect when the app shuts down to avoid connection leaks.",
            },
          ],
        },
        {
          slug: "nodejs-authentication-security-quiz",
          title: "Authentication & Security Quiz",
          tutorialSlug: "nodejs-authentication-security",
          isPremium: true,
          requiredPlan: "VIBED",
          questions: [
            {
              id: "auth-1",
              question:
                "What is the key difference between authentication and authorization?",
              type: "multiple-choice",
              options: [
                "There is no difference, they're the same thing",
                "Authentication verifies identity, authorization determines permissions",
                "Authorization verifies identity, authentication determines permissions",
                "Authentication is for APIs, authorization is for web pages",
              ],
              correct: 1,
              explanation:
                "Authentication answers 'Who are you?' by verifying identity, while authorization answers 'What can you do?' by determining permissions based on that identity.",
            },
            {
              id: "auth-2",
              question: "Why should you never store passwords in plain text?",
              type: "multiple-choice",
              options: [
                "It takes up more database space",
                "Anyone with database access can see user passwords",
                "Plain text passwords are slower to process",
                "It's not compatible with modern browsers",
              ],
              correct: 1,
              explanation:
                "Storing passwords in plain text means anyone with database access (administrators, attackers, backup viewers) can see actual user passwords, which is a major security risk.",
            },
            {
              id: "auth-3",
              question:
                "What makes bcrypt better than MD5 for password hashing?",
              type: "multiple-choice",
              options: [
                "bcrypt is faster than MD5",
                "bcrypt includes built-in salt generation and is adaptive to hardware improvements",
                "bcrypt produces shorter hashes",
                "bcrypt doesn't require any configuration",
              ],
              correct: 1,
              explanation:
                "bcrypt automatically generates unique salts for each password and allows adjusting difficulty (salt rounds) as computers get faster, while MD5 is fast but cryptographically broken.",
            },
            {
              id: "auth-4",
              question: "What are the three parts of a JWT token?",
              type: "multiple-choice",
              options: [
                "Username, password, expiration",
                "Header, payload, signature",
                "Key, value, timestamp",
                "User, role, permissions",
              ],
              correct: 1,
              explanation:
                "A JWT consists of three base64-encoded parts separated by dots: Header (algorithm info), Payload (claims/data), and Signature (verification).",
            },
            {
              id: "auth-5",
              question:
                "What is a major limitation of JWT tokens for session management?",
              type: "multiple-choice",
              options: [
                "They're too small to store user data",
                "They expire too quickly",
                "They're difficult to revoke before expiration",
                "They only work with HTTPS",
              ],
              correct: 2,
              explanation:
                "JWTs are stateless and self-contained, making them difficult to revoke or invalidate before their expiration time, unlike server-side sessions that can be immediately terminated.",
            },
            {
              id: "auth-6",
              question: "What is the purpose of rate limiting in API security?",
              type: "multiple-choice",
              options: [
                "To make the API faster",
                "To reduce server costs",
                "To prevent abuse, brute force attacks, and ensure fair usage",
                "To compress response data",
              ],
              correct: 2,
              explanation:
                "Rate limiting prevents abuse by limiting how many requests users can make in a time window, protecting against brute force attacks and ensuring fair resource usage.",
            },
            {
              id: "auth-7",
              question:
                "In OAuth, what is the purpose of the 'state' parameter?",
              type: "multiple-choice",
              options: [
                "To store user preferences",
                "To prevent CSRF attacks during the OAuth flow",
                "To track user location",
                "To store the user's access token",
              ],
              correct: 1,
              explanation:
                "The 'state' parameter is a random value that prevents CSRF attacks by ensuring the OAuth callback matches the original request from your application.",
            },
            {
              id: "auth-8",
              question: "What does the helmet.js middleware primarily provide?",
              type: "multiple-choice",
              options: [
                "User authentication",
                "Database connection security",
                "HTTP security headers protection",
                "Password hashing utilities",
              ],
              correct: 2,
              explanation:
                "Helmet.js sets various HTTP security headers like Content-Security-Policy, X-Frame-Options, and others to protect against common web vulnerabilities.",
            },
            {
              id: "auth-9",
              question:
                "Why should you use generic error messages for login failures?",
              type: "multiple-choice",
              options: [
                "To save bandwidth",
                "To prevent information leakage about valid usernames/emails",
                "To make the code simpler",
                "To improve performance",
              ],
              correct: 1,
              explanation:
                "Generic messages like 'Invalid email or password' prevent attackers from determining which part failed, making it harder to enumerate valid usernames or emails.",
            },
            {
              id: "auth-10",
              question:
                "What is input validation and why is it crucial for security?",
              type: "multiple-choice",
              options: [
                "Checking if inputs are the right data type to improve performance",
                "Verifying and sanitizing all user input to prevent injection attacks and data corruption",
                "Making sure inputs are not too long to save database space",
                "Converting inputs to the right format for the frontend",
              ],
              correct: 1,
              explanation:
                "Input validation verifies and sanitizes all user input to prevent injection attacks (SQL, NoSQL, XSS), data corruption, and other security vulnerabilities.",
            },
            {
              id: "auth-11",
              question:
                "What should you do when implementing password reset functionality?",
              type: "multiple-choice",
              options: [
                "Send the current password via email",
                "Generate a secure token with expiration and send reset link",
                "Allow users to reset using only their email",
                "Store reset requests in browser localStorage",
              ],
              correct: 1,
              explanation:
                "Secure password reset uses a cryptographically random token with expiration time, sent via secure email link, never exposing actual passwords.",
            },
            {
              id: "auth-12",
              question:
                "What is the principle of 'defense in depth' in application security?",
              type: "multiple-choice",
              options: [
                "Using only the strongest single security measure",
                "Implementing multiple layers of security controls",
                "Focusing only on perimeter security",
                "Relying entirely on third-party security services",
              ],
              correct: 1,
              explanation:
                "Defense in depth means implementing multiple layers of security (authentication, authorization, input validation, rate limiting, etc.) so if one fails, others still provide protection.",
            },
          ],
        },
        {
          slug: "nodejs-testing-debugging-quiz",
          title: "Testing & Debugging Quiz",
          tutorialSlug: "nodejs-testing-debugging",
          isPremium: true,
          requiredPlan: "CRACKED",
          questions: [
            {
              id: "testing-1",
              question: "What is the primary purpose of unit testing in Node.js applications?",
              type: "multiple-choice",
              options: [
                "To test the entire application workflow",
                "To test individual functions and methods in isolation",
                "To test database connections",
                "To test user interface components",
              ],
              correct: 1,
              explanation:
                "Unit testing focuses on testing individual functions and methods in isolation to ensure they work correctly with various inputs and edge cases.",
            },
            {
              id: "testing-2",
              question: "Which testing framework is most commonly used with Node.js?",
              type: "multiple-choice",
              options: ["Mocha", "Jest", "Jasmine", "Vitest"],
              correct: 1,
              explanation:
                "Jest is the most popular testing framework for Node.js applications, providing built-in test runners, assertions, mocking, and coverage reporting.",
            },
            {
              id: "testing-3",
              question: "What does the 'describe' block do in Jest tests?",
              type: "multiple-choice",
              options: [
                "Runs a single test case",
                "Groups related test cases together",
                "Mocks external dependencies",
                "Measures test coverage",
              ],
              correct: 1,
              explanation:
                "The 'describe' block groups related test cases together, providing organization and context for your tests, often representing a class or feature being tested.",
            },
            {
              id: "testing-4",
              question: "What is the difference between 'it' and 'test' in Jest?",
              type: "multiple-choice",
              options: [
                "They have different functionality",
                "They are aliases for the same function",
                "'it' is for unit tests, 'test' is for integration tests",
                "'test' runs faster than 'it'",
              ],
              correct: 1,
              explanation:
                "'it' and 'test' are aliases for the same function in Jest. Both define individual test cases, with 'it' being more descriptive ('it should do something').",
            },
            {
              id: "testing-5",
              question: "How do you test asynchronous functions in Jest?",
              type: "multiple-choice",
              options: [
                "Use setTimeout() to wait",
                "Return promises or use async/await in test functions",
                "Async functions cannot be tested",
                "Use synchronous code only",
              ],
              correct: 1,
              explanation:
                "Jest handles async tests by returning promises from test functions or using async/await syntax, automatically waiting for promises to resolve.",
            },
            {
              id: "testing-6",
              question: "What is the purpose of mocking in testing?",
              type: "multiple-choice",
              options: [
                "To make tests run faster",
                "To isolate code under test by replacing dependencies with controlled fake implementations",
                "To increase test coverage",
                "To test error conditions only",
              ],
              correct: 1,
              explanation:
                "Mocking replaces real dependencies with controlled fake implementations, allowing you to isolate the code under test and control external behavior.",
            },
            {
              id: "testing-7",
              question: "How do you mock an entire module in Jest?",
              type: "multiple-choice",
              options: [
                "jest.mockModule('module')",
                "jest.mock('module')",
                "jest.replace('module')",
                "jest.stub('module')",
              ],
              correct: 1,
              explanation:
                "jest.mock('module') mocks an entire module, replacing all its exports with Jest mock functions or custom implementations.",
            },
            {
              id: "testing-8",
              question: "What is integration testing in the context of Node.js APIs?",
              type: "multiple-choice",
              options: [
                "Testing individual functions",
                "Testing how multiple components work together, including HTTP endpoints",
                "Testing only database connections",
                "Testing user interface interactions",
              ],
              correct: 1,
              explanation:
                "Integration testing verifies how multiple components work together, including testing actual HTTP endpoints, database interactions, and component integration.",
            },
            {
              id: "testing-9",
              question: "Which library is commonly used for HTTP endpoint testing in Node.js?",
              type: "multiple-choice",
              options: ["axios", "supertest", "fetch", "request"],
              correct: 1,
              explanation:
                "Supertest is specifically designed for testing HTTP endpoints in Node.js applications, providing a fluent API for making requests and asserting responses.",
            },
            {
              id: "testing-10",
              question: "What should you do before each test to ensure test isolation?",
              type: "multiple-choice",
              options: [
                "Clear all variables",
                "Restart the server",
                "Reset database state and clear mocks",
                "Delete all files",
              ],
              correct: 2,
              explanation:
                "Test isolation requires resetting database state, clearing mocks, and ensuring each test starts with a clean slate to prevent tests from affecting each other.",
            },
            {
              id: "testing-11",
              question: "What is test coverage and why is it important?",
              type: "multiple-choice",
              options: [
                "The number of tests written",
                "The percentage of code executed during tests",
                "The time taken to run all tests",
                "The number of bugs found",
              ],
              correct: 1,
              explanation:
                "Test coverage measures the percentage of code executed during tests, helping identify untested code paths and ensuring comprehensive testing.",
            },
            {
              id: "testing-12",
              question: "How do you debug Node.js applications effectively?",
              type: "multiple-choice",
              options: [
                "Use console.log() everywhere",
                "Use Node.js debugger, IDE debugging tools, and structured logging",
                "Read code without running it",
                "Use only error handling",
              ],
              correct: 1,
              explanation:
                "Effective debugging uses proper debugging tools like Node.js debugger, IDE integration, structured logging, and step-by-step code execution rather than just console.log().",
            },
            {
              id: "testing-13",
              question: "What is the Node.js debugger command to set a breakpoint in code?",
              type: "multiple-choice",
              options: ["break", "debugger", "pause", "stop"],
              correct: 1,
              explanation:
                "The 'debugger' statement creates a breakpoint in your code when running with Node.js debugger, pausing execution for inspection.",
            },
            {
              id: "testing-14",
              question: "How should you structure test files in a Node.js project?",
              type: "multiple-choice",
              options: [
                "All tests in one file",
                "Mirror source code structure with .test.js or .spec.js files",
                "Random organization",
                "Tests in separate repository",
              ],
              correct: 1,
              explanation:
                "Test files should mirror your source code structure, using naming conventions like .test.js or .spec.js, making tests easy to find and maintain.",
            },
            {
              id: "testing-15",
              question: "What are the key principles of writing good tests?",
              type: "multiple-choice",
              options: [
                "Make tests as complex as possible",
                "Fast, independent, repeatable, self-validating, and timely (F.I.R.S.T)",
                "Write tests after deployment",
                "Test only happy paths",
              ],
              correct: 1,
              explanation:
                "Good tests follow F.I.R.S.T principles: Fast execution, Independent of each other, Repeatable in any environment, Self-validating with clear pass/fail, and Timely (written with or before code).",
            },
          ],
        },
      ],
      ...realTimeQuizzes,
      {
        slug: "nodejs-performance-optimization-quiz",
        title: "Performance Optimization Quiz",
        tutorialSlug: "nodejs-performance-optimization",
        isPremium: true,
        requiredPlan: "CRACKED",
        questions: [
          {
            id: "perf-1",
            question:
              "What is the first step in performance optimization?",
            type: "multiple-choice",
            options: [
              "Start optimizing code immediately",
              "Profile and measure to identify actual bottlenecks",
              "Add more servers",
              "Optimize the database first",
            ],
            correct: 1,
            explanation:
              "Performance optimization should always start with profiling and measuring to identify the actual bottlenecks, rather than guessing where problems might be.",
          },
          {
            id: "perf-2",
            question: "What is the main cause of memory leaks in Node.js?",
            type: "multiple-choice",
            options: [
              "Using too much CPU",
              "Unclosed event listeners, timers, and circular references",
              "Having too many files open",
              "Using async/await",
            ],
            correct: 1,
            explanation:
              "Memory leaks in Node.js are typically caused by unclosed event listeners, unterminated timers, circular references, and not properly cleaning up resources.",
          },
          {
            id: "perf-3",
            question: "What is the cache-aside pattern?",
            type: "multiple-choice",
            options: [
              "Application manages cache manually, checking cache first then database",
              "Database automatically manages cache",
              "Cache writes data to database automatically",
              "Cache replaces the database entirely",
            ],
            correct: 0,
            explanation:
              "Cache-aside pattern means the application manually manages the cache, checking cache first for data, and if not found, fetching from database and storing in cache.",
          },
          {
            id: "perf-4",
            question: "When should you use Node.js clustering?",
            type: "multiple-choice",
            options: [
              "Always, for every application",
              "When you have CPU-intensive tasks and multiple CPU cores",
              "Only for database-heavy applications",
              "When using Express.js",
            ],
            correct: 1,
            explanation:
              "Node.js clustering is beneficial when you have CPU-intensive tasks and multiple CPU cores available. For I/O-heavy apps, optimize the I/O operations first.",
          },
          {
            id: "perf-5",
            question: "What does the N+1 query problem refer to?",
            type: "multiple-choice",
            options: [
              "Having N+1 database connections",
              "Making one query to get N items, then N additional queries for related data",
              "Having N+1 servers in a cluster",
              "Making N+1 API calls to external services",
            ],
            correct: 1,
            explanation:
              "The N+1 problem occurs when you make one query to fetch N items, then make N additional queries to fetch related data for each item, instead of using efficient JOINs or batch loading.",
          },
          {
            id: "perf-6",
            question: "What is the purpose of a load balancer?",
            type: "multiple-choice",
            options: [
              "To cache database queries",
              "To distribute incoming requests across multiple servers",
              "To compress response data",
              "To encrypt network traffic",
            ],
            correct: 1,
            explanation:
              "A load balancer distributes incoming requests across multiple servers to prevent any single server from being overwhelmed and to improve overall system reliability.",
          },
          {
            id: "perf-7",
            question: "Which Node.js built-in module helps with performance profiling?",
            type: "multiple-choice",
            options: [
              "fs",
              "http",
              "perf_hooks",
              "cluster",
            ],
            correct: 2,
            explanation:
              "The perf_hooks module provides access to performance measurement APIs, including performance.now(), performance.mark(), and PerformanceObserver.",
          },
          {
            id: "perf-8",
            question: "What is the difference between horizontal and vertical scaling?",
            type: "multiple-choice",
            options: [
              "Horizontal adds more servers, vertical increases server resources",
              "Vertical adds more servers, horizontal increases server resources",
              "They are the same thing",
              "Horizontal is for databases, vertical is for web servers",
            ],
            correct: 0,
            explanation:
              "Horizontal scaling (scale out) adds more servers/instances, while vertical scaling (scale up) increases the resources (CPU, memory) of existing servers.",
          },
          {
            id: "perf-9",
            question: "What should you monitor in production for performance?",
            type: "multiple-choice",
            options: [
              "Only response times",
              "Response times, error rates, throughput, and resource usage",
              "Only error logs",
              "Only CPU usage",
            ],
            correct: 1,
            explanation:
              "Production monitoring should include response times (P95, P99), error rates, throughput (requests/second), memory usage, CPU usage, and availability metrics.",
          },
          {
            id: "perf-10",
            question: "When optimizing API performance, what should you prioritize?",
            type: "multiple-choice",
            options: [
              "Code readability over performance",
              "The biggest bottlenecks first (80/20 rule)",
              "Optimize everything equally",
              "Focus only on database queries",
            ],
            correct: 1,
            explanation:
              "Follow the 80/20 rule: identify and fix the biggest bottlenecks first, as they typically provide the most significant performance improvements with the least effort.",
          },
        ],
      },
    ];

    // Create quizzes
    for (const quiz of nodejsQuizzes) {
      // Find the tutorial this quiz belongs to
      const tutorial = await prisma.tutorial.findUnique({
        where: { slug: quiz.tutorialSlug },
      });

      if (!tutorial) {
        console.warn(`⚠️ Tutorial not found for quiz: ${quiz.slug}`);
        continue;
      }

      const { tutorialSlug, ...quizData } = quiz;
      const createdQuiz = await prisma.quiz.upsert({
        where: { slug: quiz.slug },
        update: {
          title: quizData.title,
          questions: quizData.questions,
          isPremium: quizData.isPremium,
          requiredPlan: quizData.requiredPlan,
        },
        create: {
          ...quizData,
          tutorialId: tutorial.id,
        },
      });

      console.log(`✅ Created/updated quiz: ${createdQuiz.title}`);
    }

    console.log("🎉 Node.js tutorials and quizzes seeded successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total Node.js tutorials: ${NODEJS_TUTORIALS.length}`);
    console.log(`   - Total Node.js quizzes: ${nodejsQuizzes.length}`);
    console.log(
      `   - Category: ${nodejsCategory.title} (${nodejsCategory.slug})`
    );
    console.log("📚 Tutorials created:");
    console.log("   1. Node.js Fundamentals: Your First Server-Side Journey");
    console.log(
      "   2. Node.js Modules & NPM: Building Your JavaScript Toolkit"
    );
    console.log("   3. Package Management & npm Ecosystem");
    console.log("   4. HTTP & Web Servers: Building Your First Server");
    console.log(
      "   5. Express.js Framework: Building Professional Web Applications"
    );
    console.log(
      "   6. RESTful API Development: Building Production-Ready APIs"
    );
    console.log("   7. Database Integration: Building Data-Driven APIs");
    console.log(
      "   8. Authentication & Security: Protecting Your Node.js Applications"
    );
    console.log(
      "   9. Real-Time Applications: Building Live, Interactive Experiences"
    );
    console.log(
      "   10. Testing & Debugging: Building Bulletproof Node.js Applications"
    );
    console.log(
      "   11. Performance Optimization: Building Lightning-Fast Node.js Applications"
    );

    return nodejsCategory;
  } catch (error) {
    console.error("❌ Error seeding Node.js tutorials:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
seedNodejsTutorials()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default seedNodejsTutorials;
