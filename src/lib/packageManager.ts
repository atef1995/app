// Package management utilities for WebContainer
interface PackageRequirement {
  name: string;
  version?: string;
  isDevDependency?: boolean;
}

// Package record types
type PackageRecord = Record<string, string>;
type PackageReplacementRecord = Record<string, string | null>;

// Default packages available in all executions
const DEFAULT_PACKAGES: PackageRecord = {
  express: "^4.18.2",
  lodash: "^4.17.21",
  axios: "^1.6.0",
  moment: "^2.29.4",
  uuid: "^9.0.1",
  chalk: "^4.1.2",
  dotenv: "^16.3.1"
};

// Common packages for authentication/security tutorials
const SECURITY_PACKAGES: PackageRecord = {
  bcryptjs: "^2.4.3", // Pure JS implementation instead of bcrypt
  jsonwebtoken: "^9.0.2",
  "express-rate-limit": "^7.1.5",
  "express-slow-down": "^2.0.1",
  helmet: "^7.1.0",
  passport: "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "express-session": "^1.17.3",
  "express-mongo-sanitize": "^2.2.0",
  hpp: "^0.2.3",
  validator: "^13.11.0"
};

// Database packages
const DATABASE_PACKAGES: PackageRecord = {
  "@prisma/client": "^5.7.1",
  prisma: "^5.7.1",
  mongodb: "^6.3.0",
  mongoose: "^8.0.3"
};

// Package replacements for WebContainer compatibility
// Maps problematic native packages to pure JS alternatives
const PACKAGE_REPLACEMENTS: PackageReplacementRecord = {
  bcrypt: "bcryptjs", // bcrypt has native bindings, bcryptjs is pure JS
  "node-gyp": null, // Skip packages that require compilation
  canvas: null, // Native graphics package
  sharp: null, // Native image processing
  sqlite3: "better-sqlite3", // Better WebContainer support
  "node-sass": "sass", // Pure JS Sass compiler
};

// Check if a module is a built-in Node.js module
function isBuiltinModule(moduleName: string): boolean {
  const builtinModules = [
    'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns',
    'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode',
    'querystring', 'readline', 'repl', 'stream', 'string_decoder', 'timers',
    'tls', 'tty', 'url', 'util', 'vm', 'zlib', 'constants', 'module', 'process'
  ];
  return builtinModules.includes(moduleName);
}

// Function to detect required packages from code
function detectRequiredPackages(code: string): PackageRequirement[] {
  const packages: PackageRequirement[] = [];
  const packageMap: PackageRecord = { ...DEFAULT_PACKAGES, ...SECURITY_PACKAGES, ...DATABASE_PACKAGES };
  
  // Common require/import patterns
  const requirePatterns = [
    /require\(['"`]([^'"`]+)['"`]\)/g,
    /from\s+['"`]([^'"`]+)['"`]/g,
    /import\s+['"`]([^'"`]+)['"`]/g,
    /import\s+.*\s+from\s+['"`]([^'"`]+)['"`]/g
  ];
  
  requirePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      let packageName = match[1];
      
      // Skip built-in Node.js modules
      if (isBuiltinModule(packageName)) continue;
      
      // Skip relative imports
      if (packageName.startsWith('./') || packageName.startsWith('../')) continue;
      
      // Handle package replacements for WebContainer compatibility
      if (PACKAGE_REPLACEMENTS[packageName] !== undefined) {
        const replacement = PACKAGE_REPLACEMENTS[packageName];
        if (replacement === null) {
          // Skip this package entirely
          continue;
        } else {
          // Use the replacement package
          packageName = replacement;
        }
      }
      
      // Add package if we have it in our map, or use the replacement
      const version = packageMap[packageName] || packageMap[match[1]] || "latest";
      packages.push({
        name: packageName,
        version
      });
    }
  });
  
  return packages;
}

// Create package.json with dynamic dependencies
function createPackageJson(
  useCommonJS: boolean, 
  additionalPackages: PackageRequirement[] = [],
  customPackages: Record<string, string> = {}
): object {
  const dependencies: PackageRecord = { ...DEFAULT_PACKAGES };
  
  // Add detected packages
  additionalPackages.forEach(pkg => {
    if (!pkg.isDevDependency) {
      dependencies[pkg.name] = pkg.version || 'latest';
    }
  });
  
  // Add custom packages
  Object.assign(dependencies, customPackages);
  
  return {
    name: "js-runner",
    type: useCommonJS ? "commonjs" : "module",
    dependencies
  };
}

// Get packages for specific tutorial types
function getTutorialPackages(tutorialType: "basic" | "security" | "database" | "testing" | "realtime"): PackageRecord {
  switch (tutorialType) {
    case "security":
      return SECURITY_PACKAGES;
    case "database":
      return DATABASE_PACKAGES;
    case "testing":
      return {
        jest: "^29.7.0",
        supertest: "^6.3.3",
        "@types/jest": "^29.5.8",
        "@types/supertest": "^2.0.16"
      };
    case "realtime":
      return {
        "socket.io": "^4.7.4",
        ws: "^8.14.2"
      };
    default:
      return {};
  }
}

export {
  type PackageRequirement,
  type PackageRecord,
  type PackageReplacementRecord,
  DEFAULT_PACKAGES,
  SECURITY_PACKAGES,
  DATABASE_PACKAGES,
  PACKAGE_REPLACEMENTS,
  detectRequiredPackages,
  createPackageJson,
  getTutorialPackages
};