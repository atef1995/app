const { readdirSync } = require("fs");
const path = require("path");

// next-sitemap.config.js
module.exports = {
  siteUrl: "https://www.vibed-to-cracked.com",
  generateRobotsTxt: true, // optional
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  async additionalPaths(config) {
    const tutorialDir = path.join(__dirname, "./src/content/tutorials");
    const files = readdirSync(tutorialDir);
    console.log({ url: process.env.NEXTAUTH_URL });

    const challengesRes = await fetch(
      process.env.NEXTAUTH_URL + "/api/challenges",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const { challenges } = await challengesRes.json();
    console.log(challenges);

    return [
      files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
          const slug = file.replace(/\.mdx$/, "");
          return {
            loc: `/tutorials/${slug}`,
            changefreq: "weekly",
            priority: 0.8,
          };
        }),
      ...challenges?.map((slug) => ({
        loc: `/challenges/${slug}`,
        changefreq: "weekly",
        priority: 0.7,
      })),
    ];
  },
};
