/* eslint-disable @typescript-eslint/no-unused-vars */
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to safely fetch data with error handling
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// next-sitemap.config.js
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  siteUrl: process.env.NODE_ENV === 'production'
    ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com")
    : "https://vibed-to-cracked.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/payment"],
      },
    ],
  },
  exclude: [
    "/admin/*",
    "/api/*",
    "/auth/*",
    "/test-error",
    "/glitch-demo",
    "/achievements/shared/*"
  ],
  async additionalPaths(config) {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXTAUTH_URL || "https://vibed-to-cracked.com")
      : "https://vibed-to-cracked.com";
    const paths = [];

    // Static tutorial files from content directory
    try {
      const tutorialDir = path.join(__dirname, "./src/content/tutorials");
      const walkDir = (dir, basePath = "") => {
        const items = [];
        try {
          const files = readdirSync(dir, { withFileTypes: true });
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
              items.push(...walkDir(fullPath, path.join(basePath, file.name)));
            } else if (file.name.endsWith('.mdx')) {
              const slug = file.name.replace(/\.mdx$/, "");
              const tutorialPath = basePath ? `${basePath}/${slug}` : slug;
              items.push({
                loc: `/tutorials/${tutorialPath}`,
                changefreq: "weekly",
                priority: 0.8,
                lastmod: new Date().toISOString(),
              });
            }
          }
        } catch (error) {
          console.warn(`Error reading directory ${dir}:`, error.message);
        }
        return items;
      };

      paths.push(...walkDir(tutorialDir));
    } catch (error) {
      console.warn("Error processing tutorial files:", error.message);
    }

    // Dynamic tutorials from database
    const tutorialsData = await safeFetch(`${baseUrl}/api/tutorials`);
    if (tutorialsData?.success && tutorialsData?.data) {
      const dbTutorialPaths = tutorialsData.data
        .filter(tutorial => tutorial.published)
        .map(tutorial => ({
          loc: `/tutorials/${tutorial.slug}`,
          changefreq: "weekly",
          priority: tutorial.isPremium ? 0.9 : 0.8,
          lastmod: new Date(tutorial.updatedAt || tutorial.createdAt).toISOString(),
        }));
      paths.push(...dbTutorialPaths);
    }

    // Tutorial categories
    const categories = ["fundamentals", "oop", "advanced", "async", "dom", "data-structures"];
    const categoryPaths = categories.map(category => ({
      loc: `/tutorials/category/${category}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
    paths.push(...categoryPaths);

    // Challenges
    const challengesData = await safeFetch(`${baseUrl}/api/challenges`);
    if (challengesData?.challenges) {
      const challengePaths = challengesData.challenges.map(challenge => ({
        loc: `/practice/${challenge.slug}`,
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }));
      paths.push(...challengePaths);
    }

    // Quizzes
    const quizzesData = await safeFetch(`${baseUrl}/api/quizzes`);
    if (quizzesData?.quizzes) {
      const quizPaths = quizzesData.quizzes.map(quiz => ({
        loc: `/quiz/${quiz.slug}`,
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date(quiz.updatedAt || quiz.createdAt).toISOString(),
      }));
      paths.push(...quizPaths);
    }

    // Projects
    const projectsData = await safeFetch(`${baseUrl}/api/projects`);
    if (projectsData?.success && projectsData?.data) {
      const projectPaths = projectsData.data.map(project => ({
        loc: `/projects/${project.slug}`,
        changefreq: "monthly",
        priority: 0.6,
        lastmod: new Date(project.updatedAt || project.createdAt).toISOString(),
      }));
      paths.push(...projectPaths);
    }

    // High priority static pages
    const staticPages = [
      { loc: "/tutorials", priority: 0.9 },
      { loc: "/quizzes", priority: 0.8 },
      { loc: "/practice", priority: 0.8 },
      { loc: "/projects", priority: 0.7 },
      { loc: "/pricing", priority: 0.8 },
      { loc: "/dashboard", priority: 0.6 },
      { loc: "/settings", priority: 0.4 },
      { loc: "/achievements", priority: 0.5 },
      { loc: "/social", priority: 0.5 },
    ];

    staticPages.forEach(page => {
      paths.push({
        ...page,
        changefreq: "weekly",
        lastmod: new Date().toISOString(),
      });
    });

    console.log(`Generated ${paths.length} additional sitemap paths`);
    return paths.flat().filter(Boolean);
  },
};
