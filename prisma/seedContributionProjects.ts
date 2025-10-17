/**
 * Seed Contribution Projects
 *
 * Seeds the database with contribution projects for the PR-based system.
 * Starting with the Portfolio Site template project with 5 features.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedContributionProjects() {
  console.log("🚀 Seeding Contribution Projects...");

  // Portfolio Site Project
  const portfolioProject = await prisma.contributionProject.upsert({
    where: { slug: "portfolio-site-template" },
    update: {},
    create: {
      slug: "portfolio-site-template",
      title: "Portfolio Site Template",
      description:
        "Build a modern, responsive portfolio website with Next.js and Tailwind CSS. Perfect for beginners to learn real-world development workflows with GitHub PRs and code reviews.",
      githubRepoUrl: "https://github.com/vibed-to-cracked/portfolio-template",
      githubOwner: "vibed-to-cracked",
      githubRepo: "portfolio-template",
      category: "frontend",
      difficulty: 2,
      estimatedHours: 20,
      xpReward: 500,
      isPremium: false,
      requiredPlan: "FREE",
      published: true,

      // Features array - each feature is a separate PR opportunity
      features: [
        {
          id: "dark-mode-toggle",
          title: "Dark Mode Toggle",
          description:
            "Implement a dark mode toggle that persists user preference across sessions",
          difficulty: 1,
          estimatedHours: 3,
          xpReward: 100,
          requirements: [
            "Create a toggle button component",
            "Implement theme switching with Tailwind dark: classes",
            "Store preference in localStorage",
            "Apply dark styles to all pages",
            "Add smooth transition animations",
          ],
          acceptanceCriteria: [
            "Toggle switches between light and dark themes",
            "Preference persists across browser sessions",
            "All text remains readable in both modes",
            "No layout shifts when switching themes",
            "Button has proper ARIA labels for accessibility",
          ],
          testCases: [
            "User can click toggle to switch themes",
            "Theme preference is saved to localStorage",
            "Page loads with previously saved theme",
            "All components support both themes",
          ],
        },
        {
          id: "contact-form",
          title: "Contact Form with Validation",
          description:
            "Build a fully functional contact form with client-side validation and email integration",
          difficulty: 2,
          estimatedHours: 4,
          xpReward: 150,
          requirements: [
            "Create contact form component with name, email, message fields",
            "Implement client-side validation",
            "Add email service integration (e.g., Resend, SendGrid)",
            "Display success/error messages",
            "Add rate limiting to prevent spam",
          ],
          acceptanceCriteria: [
            "Form validates email format",
            "All required fields show error messages when empty",
            "Success message appears after submission",
            "Email is sent to configured address",
            "Form resets after successful submission",
          ],
          testCases: [
            "Form shows validation errors for invalid email",
            "Form cannot be submitted with empty fields",
            "Success message displays on valid submission",
            "Email is received at destination",
          ],
        },
        {
          id: "blog-section",
          title: "Blog Section with MDX",
          description:
            "Create a blog section that renders MDX content with syntax highlighting and reading time",
          difficulty: 3,
          estimatedHours: 6,
          xpReward: 250,
          requirements: [
            "Set up MDX rendering with next-mdx-remote",
            "Create blog post listing page",
            "Implement individual blog post pages",
            "Add syntax highlighting for code blocks",
            "Calculate and display reading time",
            "Add responsive images",
          ],
          acceptanceCriteria: [
            "Blog posts render from MDX files",
            "Code blocks have proper syntax highlighting",
            "Reading time is calculated correctly",
            "Images are responsive and optimized",
            "Blog listing shows all posts sorted by date",
            "Individual post pages have proper metadata",
          ],
          testCases: [
            "MDX content renders correctly",
            "Code syntax highlighting works",
            "Reading time displays on all posts",
            "Blog listing page loads without errors",
          ],
        },
        {
          id: "admin-dashboard",
          title: "Admin Dashboard with Analytics",
          description:
            "Build a protected admin dashboard with basic analytics and content management",
          difficulty: 4,
          estimatedHours: 8,
          xpReward: 400,
          requirements: [
            "Implement authentication guard for admin routes",
            "Create dashboard layout with navigation",
            "Add analytics charts (page views, form submissions)",
            "Build content management interface",
            "Implement role-based access control",
          ],
          acceptanceCriteria: [
            "Only authenticated admin users can access dashboard",
            "Analytics charts display data correctly",
            "Content can be created/edited/deleted",
            "Dashboard is responsive on all devices",
            "All actions are logged for audit trail",
          ],
          testCases: [
            "Unauthenticated users are redirected to login",
            "Non-admin users cannot access dashboard",
            "Analytics data updates in real-time",
            "Content changes persist to database",
          ],
        },
        {
          id: "analytics-integration",
          title: "Google Analytics & Performance Monitoring",
          description:
            "Integrate Google Analytics 4 and implement performance monitoring",
          difficulty: 4,
          estimatedHours: 5,
          xpReward: 350,
          requirements: [
            "Set up Google Analytics 4 integration",
            "Implement page view tracking",
            "Add custom event tracking (form submissions, button clicks)",
            "Set up performance monitoring with Web Vitals",
            "Create privacy-friendly cookie consent banner",
          ],
          acceptanceCriteria: [
            "GA4 tracks page views correctly",
            "Custom events appear in GA4 dashboard",
            "Web Vitals metrics are collected",
            "Cookie consent banner follows GDPR guidelines",
            "User can opt out of tracking",
          ],
          testCases: [
            "Page views register in GA4",
            "Custom events fire on user actions",
            "Performance metrics are collected",
            "Cookie consent blocks tracking until accepted",
          ],
        },
      ],

      // PR Template students must use
      prTemplate: `## Description
[Brief description of the feature you implemented]

## Feature Checklist
- [ ] All requirements from the feature spec are met
- [ ] Code follows the project style guide
- [ ] All acceptance criteria are satisfied
- [ ] Tests pass locally
- [ ] No console errors or warnings

## Screenshots/Demo
[Add screenshots or GIF demonstrating the feature]

## Testing Steps
1. [Step-by-step instructions to test your implementation]
2.
3.

## Additional Notes
[Any additional context or notes for reviewers]`,

      // Required CI/CD checks that must pass
      requiredChecks: [
        {
          name: "build",
          description: "Next.js production build must succeed",
        },
        {
          name: "lint",
          description: "ESLint must pass with no errors",
        },
        {
          name: "type-check",
          description: "TypeScript must compile without errors",
        },
      ],

      // Review criteria for peer/mentor reviewers
      reviewCriteria: [
        {
          category: "Functionality",
          weight: 40,
          criteria: [
            "Feature works as specified",
            "All acceptance criteria are met",
            "Edge cases are handled",
            "No bugs or console errors",
          ],
        },
        {
          category: "Code Quality",
          weight: 30,
          criteria: [
            "Code is clean and readable",
            "Variables and functions have clear names",
            "No unnecessary code duplication",
            "Follows project conventions",
          ],
        },
        {
          category: "Best Practices",
          weight: 20,
          criteria: [
            "Proper error handling",
            "Accessibility considerations (ARIA labels, keyboard navigation)",
            "Performance optimizations",
            "Security best practices",
          ],
        },
        {
          category: "Documentation",
          weight: 10,
          criteria: [
            "Code comments where needed",
            "PR description is clear and complete",
            "README updated if necessary",
          ],
        },
      ],
    },
  });

  console.log(`✅ Created project: ${portfolioProject.title}`);
  console.log(`   Features: ${(portfolioProject.features as any[]).length}`);

  // REST API Project - Highly valued by employers
  const apiProject = await prisma.contributionProject.upsert({
    where: { slug: "production-ready-rest-api" },
    update: {},
    create: {
      slug: "production-ready-rest-api",
      title: "Production-Ready REST API",
      description:
        "Build a professional Node.js REST API with authentication, testing, and deployment. Learn industry-standard practices that companies expect: JWT auth, comprehensive testing, API documentation, error handling, and Docker deployment.",
      githubRepoUrl: "https://github.com/atef1995/rest-api-starter",
      githubOwner: "atef1995",
      githubRepo: "rest-api-starter",
      category: "backend",
      difficulty: 3,
      estimatedHours: 35,
      xpReward: 800,
      isPremium: false,
      requiredPlan: "FREE",
      published: true,

      features: [
        {
          id: "jwt-authentication",
          title: "JWT Authentication System",
          description:
            "Implement a complete JWT-based authentication system with registration, login, and token refresh",
          difficulty: 3,
          estimatedHours: 6,
          xpReward: 200,
          requirements: [
            "Create user registration endpoint with password hashing (bcrypt)",
            "Implement login endpoint that returns JWT access and refresh tokens",
            "Add token refresh endpoint for seamless user experience",
            "Create authentication middleware to protect routes",
            "Implement logout functionality with token blacklisting",
            "Add password reset via email functionality",
          ],
          acceptanceCriteria: [
            "Passwords are hashed using bcrypt with proper salt rounds",
            "JWT tokens contain appropriate claims and expiration",
            "Protected routes reject requests without valid tokens",
            "Refresh tokens work correctly and old tokens are invalidated",
            "Token expiration is handled gracefully",
            "Email is sent for password reset with secure token",
          ],
          testCases: [
            "User can register with valid credentials",
            "User cannot register with duplicate email",
            "User can login and receive JWT token",
            "Protected routes are accessible with valid token",
            "Expired tokens are rejected",
            "Refresh token successfully generates new access token",
          ],
        },
        {
          id: "comprehensive-testing",
          title: "Comprehensive Test Suite",
          description:
            "Build a complete testing suite with unit, integration, and E2E tests using Jest and Supertest",
          difficulty: 4,
          estimatedHours: 8,
          xpReward: 250,
          requirements: [
            "Set up Jest testing framework with TypeScript support",
            "Write unit tests for all business logic functions",
            "Create integration tests for API endpoints using Supertest",
            "Add E2E tests for complete user workflows",
            "Implement test database seeding and cleanup",
            "Achieve at least 80% code coverage",
            "Set up GitHub Actions to run tests on every PR",
          ],
          acceptanceCriteria: [
            "All tests pass consistently",
            "Test coverage is at least 80%",
            "Tests use proper setup and teardown",
            "Mock external dependencies appropriately",
            "Tests are fast and don't rely on external services",
            "GitHub Actions CI passes on all PRs",
          ],
          testCases: [
            "Unit tests cover all service functions",
            "Integration tests cover all API endpoints",
            "E2E tests cover authentication flow",
            "Tests properly clean up test data",
            "Coverage report shows 80%+ coverage",
          ],
        },
        {
          id: "api-documentation",
          title: "Interactive API Documentation",
          description:
            "Create comprehensive API documentation using Swagger/OpenAPI with interactive testing",
          difficulty: 2,
          estimatedHours: 5,
          xpReward: 150,
          requirements: [
            "Install and configure Swagger UI Express",
            "Document all API endpoints with OpenAPI 3.0 specification",
            "Include request/response schemas and examples",
            "Add authentication documentation with JWT examples",
            "Document all error responses and status codes",
            "Enable interactive API testing in browser",
          ],
          acceptanceCriteria: [
            "Swagger UI is accessible at /api-docs route",
            "All endpoints are documented with descriptions",
            "Request and response schemas are complete",
            "Authentication requirements are clearly documented",
            "Interactive testing works for all endpoints",
            "Error responses are documented with examples",
          ],
          testCases: [
            "Swagger UI loads without errors",
            "All endpoints appear in documentation",
            "Try it out feature works for public endpoints",
            "Authentication flow is documented clearly",
            "Examples are accurate and helpful",
          ],
        },
        {
          id: "error-handling-logging",
          title: "Production Error Handling & Logging",
          description:
            "Implement enterprise-grade error handling and logging with Winston and custom error classes",
          difficulty: 3,
          estimatedHours: 6,
          xpReward: 180,
          requirements: [
            "Create custom error classes for different error types",
            "Implement global error handling middleware",
            "Set up Winston logger with multiple transports",
            "Add request logging middleware with correlation IDs",
            "Implement proper HTTP status codes for all errors",
            "Add error monitoring integration (e.g., Sentry)",
            "Create user-friendly error responses",
          ],
          acceptanceCriteria: [
            "All errors are caught and handled gracefully",
            "Errors are logged with appropriate levels",
            "Stack traces are hidden from users in production",
            "Correlation IDs allow request tracing",
            "Different environments have appropriate log levels",
            "Sensitive data is not logged",
          ],
          testCases: [
            "Validation errors return 400 with clear messages",
            "Authentication failures return 401",
            "Authorization failures return 403",
            "Not found errors return 404",
            "Server errors return 500 without exposing internals",
            "All errors are logged to appropriate transports",
          ],
        },
        {
          id: "rate-limiting-security",
          title: "Security & Rate Limiting",
          description:
            "Implement security best practices including rate limiting, helmet, CORS, and input validation",
          difficulty: 3,
          estimatedHours: 5,
          xpReward: 170,
          requirements: [
            "Install and configure Helmet.js for security headers",
            "Implement rate limiting with express-rate-limit",
            "Set up CORS with proper origin configuration",
            "Add input validation with Joi or Zod",
            "Implement SQL injection prevention",
            "Add XSS protection and sanitization",
            "Set up environment-based security configs",
          ],
          acceptanceCriteria: [
            "Security headers are set correctly",
            "Rate limiting prevents abuse (100 requests/15min per IP)",
            "CORS allows only specified origins",
            "All user input is validated before processing",
            "SQL queries use parameterized statements",
            "XSS attempts are blocked",
          ],
          testCases: [
            "Helmet adds security headers to responses",
            "Excessive requests return 429 Too Many Requests",
            "CORS blocks unauthorized origins",
            "Invalid input is rejected with clear errors",
            "SQL injection attempts are prevented",
            "XSS payloads are sanitized",
          ],
        },
        {
          id: "docker-deployment",
          title: "Docker Containerization & Deployment",
          description:
            "Containerize the API with Docker and create production-ready deployment configuration",
          difficulty: 4,
          estimatedHours: 10,
          xpReward: 300,
          requirements: [
            "Create optimized Dockerfile with multi-stage builds",
            "Add docker-compose.yml for local development",
            "Include PostgreSQL database in docker-compose",
            "Configure environment variables properly",
            "Add health check endpoint and Docker health checks",
            "Create .dockerignore for optimized builds",
            "Document deployment steps in README",
            "Add GitHub Actions workflow for Docker image builds",
          ],
          acceptanceCriteria: [
            "Docker image builds successfully",
            "Container runs without errors",
            "Database connection works in containerized environment",
            "Environment variables are properly configured",
            "Health check endpoint returns correct status",
            "Docker image is optimized for size",
            "docker-compose up starts entire stack",
            "GitHub Actions builds and pushes Docker image",
          ],
          testCases: [
            "docker build completes successfully",
            "docker-compose up starts all services",
            "API responds to requests in container",
            "Database migrations run automatically",
            "Health check returns 200 status",
            "Container restarts automatically on failure",
          ],
        },
      ],

      prTemplate: `## Description
[Brief description of the feature you implemented]

## Technical Implementation
- **Technologies Used**: [List libraries/tools used]
- **Design Decisions**: [Explain key architectural choices]
- **Security Considerations**: [Any security measures implemented]

## Feature Checklist
- [ ] All requirements from the feature spec are met
- [ ] Code follows REST API best practices
- [ ] All acceptance criteria are satisfied
- [ ] Tests pass with at least 80% coverage
- [ ] API documentation is updated
- [ ] No security vulnerabilities introduced
- [ ] Error handling is comprehensive

## Testing Evidence
- [ ] Unit tests pass: [X passing tests]
- [ ] Integration tests pass: [X passing tests]
- [ ] Code coverage: [X%]
- [ ] Manual testing completed

## API Documentation
[Link to updated Swagger docs or include endpoint examples]

## Testing Steps
1. [Step-by-step instructions to test your implementation]
2. Include curl commands or Postman collection
3. Show expected responses

## Additional Notes
[Any additional context, performance considerations, or notes for reviewers]`,

      requiredChecks: [
        {
          name: "tests",
          description: "All unit and integration tests must pass",
        },
        {
          name: "coverage",
          description: "Code coverage must be at least 80%",
        },
        {
          name: "lint",
          description: "ESLint must pass with no errors",
        },
        {
          name: "security",
          description: "Security audit must pass (npm audit)",
        },
      ],

      reviewCriteria: [
        {
          category: "Code Quality",
          weight: 25,
          criteria: [
            "Code is clean, readable, and follows conventions",
            "Functions are small and single-purpose",
            "No code duplication",
            "TypeScript types are properly defined",
          ],
        },
        {
          category: "Testing",
          weight: 30,
          criteria: [
            "Comprehensive test coverage (80%+)",
            "Tests are well-written and meaningful",
            "Edge cases are tested",
            "Tests are maintainable and clear",
          ],
        },
        {
          category: "Security",
          weight: 25,
          criteria: [
            "Authentication and authorization work correctly",
            "Input validation prevents injection attacks",
            "Sensitive data is not exposed",
            "Security best practices are followed",
          ],
        },
        {
          category: "Documentation",
          weight: 20,
          criteria: [
            "API endpoints are documented in Swagger",
            "Code has clear comments where needed",
            "README is updated with setup instructions",
            "PR description explains implementation clearly",
          ],
        },
      ],
    },
  });

  console.log(`✅ Created project: ${apiProject.title}`);
  console.log(`   Features: ${(apiProject.features as any[]).length}`);

  console.log("\n🎉 Contribution projects seeded successfully!");
}

// Run seeding
seedContributionProjects()
  .catch((error) => {
    console.error("Error seeding contribution projects:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
