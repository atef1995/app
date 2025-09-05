// Code runner utilities
import { WebContainer } from "@webcontainer/api";
import {
  type PackageRequirement,
  detectRequiredPackages,
  createPackageJson,
  getTutorialPackages,
} from "./packageManager";
import { generateCompatibilityShims } from "./compatibilityShims";

// TypeScript compiler API for browser-based transpilation
interface TypeScriptCompiler {
  ScriptTarget: {
    ES2020: number;
  };
  ModuleKind: {
    None: number;
  };
  transpile: (input: string, compilerOptions: object) => string;
}

declare global {
  interface Window {
    ts: TypeScriptCompiler;
  }
}

let webcontainerInstance: WebContainer | null = null;

// Execute code with specific tutorial context (automatically includes relevant packages)
export async function executeCodeForTutorial(
  code: string,
  tutorialType:
    | "basic"
    | "security"
    | "database"
    | "testing"
    | "realtime" = "basic",
  language: string = "javascript",
  onOutput?: (output: string) => void
) {
  const customPackages = getTutorialPackages(tutorialType);

  if (onOutput) {
    return executeJavaScriptStream(
      code,
      language,
      onOutput,
      (result) => {
        // Handle completion
      },
      customPackages
    );
  } else {
    return executeJavaScript(code, language, customPackages);
  }
}

// Install additional packages at runtime
export async function installPackages(
  packages: string[],
  webcontainer?: WebContainer
): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    const container = webcontainer || (await initWebContainer());

    console.log("Installing additional packages:", packages.join(", "));
    const installProcess = await container.spawn("npm", [
      "install",
      ...packages,
    ]);

    let output = "";
    let error = "";

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          const text =
            typeof data === "string" ? data : new TextDecoder().decode(data);
          output += text;
          if (text.toLowerCase().includes("error")) {
            error += text;
          }
        },
      })
    );

    const exitCode = await installProcess.exit;

    return {
      success: exitCode === 0,
      output,
      error: error || undefined,
    };
  } catch (err) {
    return {
      success: false,
      output: "",
      error: err instanceof Error ? err.message : "Package installation failed",
    };
  }
}

export async function initWebContainer() {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  try {
    webcontainerInstance = await WebContainer.boot();
    return webcontainerInstance;
  } catch (error) {
    console.error("Failed to initialize WebContainer:", error);
    throw new Error("Failed to initialize code execution environment");
  }
}

// Enhanced streaming version with dynamic package detection
export async function executeJavaScriptStream(
  code: string,
  language: string = "javascript",
  onOutput: (output: string) => void,
  onComplete: (result: {
    success: boolean;
    output: string;
    error?: string;
    logs: string[];
    errors: string[];
  }) => void,
  customPackages: Record<string, string> = {}
) {
  try {
    const webcontainer = await initWebContainer();

    const useCommonJS = language === "nodejs" || language === "node";

    // Detect required packages from code
    const detectedPackages = detectRequiredPackages(code);
    const wrappedCode = createWrapperCode(
      code,
      useCommonJS,
      true,
      detectedPackages
    );

    // Create package.json with dynamic dependencies
    const packageJson = createPackageJson(
      useCommonJS,
      detectedPackages,
      customPackages
    );

    onOutput(
      "🔍 Detected packages: " + detectedPackages.map((p) => p.name).join(", ")
    );

    const files = {
      "script.js": {
        file: {
          contents: wrappedCode,
        },
      },
      "package.json": {
        file: {
          contents: JSON.stringify(packageJson, null, 2),
        },
      },
    };

    await webcontainer.mount(files);

    // Install dependencies first - only if there are non-default packages
    const hasAdditionalPackages = detectedPackages.length > 0 || Object.keys(customPackages).length > 0;
    
    if (hasAdditionalPackages) {
      onOutput("📦 Installing dependencies...");
      const installProcess = await webcontainer.spawn("npm", ["install"]);
      await installProcess.exit;
      onOutput("✅ Dependencies installed");
    } else {
      onOutput("ℹ️ No additional dependencies to install, using defaults");
    }

    const process = await webcontainer.spawn("node", ["script.js"]);

    let output = "";
    const processedLogs: string[] = [];
    const processedErrors: string[] = [];

    // Stream output in real-time
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          const chunk =
            typeof data === "string" ? data : new TextDecoder().decode(data);
          output += chunk;

          // Process each line as it comes
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim()) {
              // Skip execution markers
              if (
                line.includes("__EXECUTION_END__") ||
                line.includes("__EXECUTION_START__")
              ) {
                continue;
              }

              // Parse log format: [timestamp] TYPE: message (handle \r\n line endings)
              const logMatch = line.match(
                /^\[(\d+)\] (LOG|ERROR|WARN): (.*)\r?$/
              );

              if (logMatch) {
                const [, , type, message] = logMatch;

                if (type === "ERROR" || type === "WARN") {
                  processedErrors.push(message);
                } else {
                  processedLogs.push(message);
                }

                // Stream the output immediately
                onOutput(message);
              } else {
                // Handle lines that don't match our log format
                // These might be raw console.log output or other output
                const cleanLine = line.trim();
                if (
                  cleanLine &&
                  !cleanLine.includes("undefined") &&
                  !cleanLine.match(/^\s*$/)
                ) {
                  processedLogs.push(cleanLine);
                  onOutput(cleanLine);
                }
              }
            }
          }
        },
      })
    );

    // Set up timeout
    const timeoutPromise = new Promise<number>((_, reject) =>
      setTimeout(() => reject(new Error("Execution timeout")), 10000)
    );

    try {
      await Promise.race([process.exit, timeoutPromise]);

      onComplete({
        success: true,
        output: processedLogs.join("\n"),
        logs: processedLogs,
        errors: processedErrors,
      });
    } catch (error) {
      onComplete({
        success: false,
        output: processedLogs.join("\n"),
        error: error instanceof Error ? error.message : "Unknown error",
        logs: processedLogs,
        errors: processedErrors,
      });
    }
  } catch (error) {
    onComplete({
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
      logs: [],
      errors: [error instanceof Error ? error.message : "Unknown error"],
    });
  }
}

// Helper function to create wrapper code
function createWrapperCode(
  code: string,
  useCommonJS: boolean,
  streaming: boolean = false,
  detectedPackages: PackageRequirement[] = []
) {
  const compatibilityShims = generateCompatibilityShims(detectedPackages);

  return `
${useCommonJS ? "const util = require('util');" : "import util from 'util';"}

${compatibilityShims}

// Console capture system
const logs = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

const captureLog = (type, args) => {
  const timestamp = Date.now();
  const message = args.map(arg => 
    typeof arg === 'object' ? util.inspect(arg, { depth: 2, colors: false }) : String(arg)
  ).join(' ');
  
  logs.push({ type, message, timestamp });
  
  // ${streaming ? "Stream output immediately" : "Buffer for batch output"}
  if (type === 'error') {
    originalError(\`[\${timestamp}] ERROR: \${message}\`);
  } else if (type === 'warn') {
    originalWarn(\`[\${timestamp}] WARN: \${message}\`);
  } else {
    originalLog(\`[\${timestamp}] LOG: \${message}\`);
  }
};

console.log = (...args) => captureLog('log', args);
console.error = (...args) => captureLog('error', args);
console.warn = (...args) => captureLog('warn', args);

// Event loop monitoring
let pendingOperations = 0;
let executionComplete = false;
let finalTimeout;

// Track async operations
const originalSetTimeout = global.setTimeout;
const originalSetInterval = global.setInterval;
const originalSetImmediate = global.setImmediate;

global.setTimeout = (fn, delay, ...args) => {
  pendingOperations++;
  return originalSetTimeout(() => {
    try {
      fn(...args);
    } catch (error) {
      console.error('Async error in setTimeout:', error);
    }
    pendingOperations--;
    checkCompletion();
  }, delay);
};

global.setInterval = (fn, delay, ...args) => {
  return originalSetInterval(fn, delay, ...args);
};

if (originalSetImmediate) {
  global.setImmediate = (fn, ...args) => {
    pendingOperations++;
    return originalSetImmediate(() => {
      try {
        fn(...args);
      } catch (error) {
        console.error('Async error in setImmediate:', error);
      }
      pendingOperations--;
      checkCompletion();
    }, ...args);
  };
}

const checkCompletion = () => {
  if (executionComplete && pendingOperations <= 0) {
    setTimeout(() => {
      finishExecution();
    }, 50);
  }
};

const finishExecution = () => {
  clearTimeout(finalTimeout);
  originalLog('__EXECUTION_END__');
  process.exit(0);
};

finalTimeout = setTimeout(() => {
  originalLog('__EXECUTION_END__');
  process.exit(0);
}, 8000);

// Execute user code
async function runUserCode() {
  try {
    await (async () => {
      ${code}
    })();
    
    executionComplete = true;
    setTimeout(() => {
      checkCompletion();
    }, 100);
    
  } catch (error) {
    console.error('Execution error:', error.message);
    executionComplete = true;
    setTimeout(() => {
      checkCompletion();
    }, 100);
  }
}

runUserCode();
  `.trim();
}

export async function executeJavaScript(
  code: string,
  language: string = "javascript",
  customPackages: Record<string, string> = {}
) {
  try {
    const webcontainer = await initWebContainer();

    // Determine module system based on language parameter
    const useCommonJS = language === "nodejs" || language === "node";

    // Detect required packages from code
    const detectedPackages = detectRequiredPackages(code);
    const wrappedCode = createWrapperCode(
      code,
      useCommonJS,
      false,
      detectedPackages
    );

    // Create package.json with dynamic dependencies
    const packageJson = createPackageJson(
      useCommonJS,
      detectedPackages,
      customPackages
    );

    // Create a simple JavaScript file to execute
    const files = {
      "script.js": {
        file: {
          contents: wrappedCode,
        },
      },
      "package.json": {
        file: {
          contents: JSON.stringify(packageJson, null, 2),
        },
      },
    };

    await webcontainer.mount(files);

    // Install dependencies first - only if there are non-default packages
    if (detectedPackages.length > 0 || Object.keys(customPackages).length > 0) {
      console.log(
        "Installing dependencies:",
        [
          ...detectedPackages.map((p) => p.name),
          ...Object.keys(customPackages),
        ].join(", ")
      );
      const installProcess = await webcontainer.spawn("npm", ["install"]);
      await installProcess.exit;
    }

    // Execute the JavaScript code
    const process = await webcontainer.spawn("node", ["script.js"]);

    let output = "";
    const error = "";

    // Collect output from the process
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          // WebContainer already provides text, no need to decode
          output +=
            typeof data === "string" ? data : new TextDecoder().decode(data);
        },
      })
    );

    // Wait for the process to complete with extended timeout for async operations
    const exitCode = await Promise.race([
      process.exit,
      new Promise<number>(
        (_, reject) =>
          setTimeout(() => reject(new Error("Execution timeout")), 10000) // Extended timeout
      ),
    ]);

    // Parse the output to extract user logs
    const logStartMarker = "__EXECUTION_START__";
    const logEndMarker = "__EXECUTION_END__";

    let userOutput = "";
    let executionError = "";

    if (output.includes(logStartMarker) && output.includes(logEndMarker)) {
      const startIndex = output.indexOf(logStartMarker) + logStartMarker.length;
      const endIndex = output.indexOf(logEndMarker);
      const logsSection = output.substring(startIndex, endIndex).trim();

      // Process logs and separate errors
      const processedLogs = logsSection
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          // Remove timestamp prefixes from logs
          const cleanLine = line.replace(/^\[\d+\]\s*/, "");

          if (cleanLine.startsWith("ERROR: ")) {
            executionError += cleanLine.substring(7) + "\n";
            return null;
          } else if (cleanLine.startsWith("WARN: ")) {
            return "⚠️ " + cleanLine.substring(6);
          } else if (cleanLine.startsWith("LOG: ")) {
            return cleanLine.substring(5);
          }
          return cleanLine;
        })
        .filter((line) => line !== null);

      userOutput = processedLogs.join("\n");
    } else if (output.includes("__EXECUTION_TIMEOUT__")) {
      // Handle timeout case - but only if there were actually pending operations
      const timeoutIndex = output.indexOf("__EXECUTION_TIMEOUT__");
      const afterTimeout = output
        .substring(timeoutIndex + "__EXECUTION_TIMEOUT__".length)
        .trim();
      userOutput = afterTimeout
        .split("\n")
        .filter(
          (line) =>
            line.trim().length > 0 && !line.includes("__EXECUTION_END__")
        )
        .map((line) => line.replace(/^\[\d+\]\s*/, ""))
        .join("\n");

      // Only show timeout error if output suggests there were actual issues
      if (userOutput.length === 0 || output.includes("pending")) {
        executionError =
          "Execution timeout - some async operations may not have completed";
      }
    } else {
      // Fallback to raw output if markers aren't found
      userOutput = output.trim();
    }

    return {
      success: exitCode === 0,
      output: userOutput,
      error: executionError.trim() || error.trim(),
      exitCode,
    };
  } catch (error) {
    console.error("Execution error:", error);
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown execution error",
      exitCode: 1,
    };
  }
}

// TypeScript compilation and execution
export async function executeTypeScript(code: string) {
  try {
    const webcontainer = await initWebContainer();

    // Create TypeScript files with proper configuration
    const files = {
      "script.ts": {
        file: {
          contents: code,
        },
      },
      "package.json": {
        file: {
          contents: JSON.stringify({
            name: "ts-runner",
            type: "commonjs",
            dependencies: {
              typescript: "^5.0.0",
              "@types/node": "^18.0.0",
              express: "^4.18.2",
              "@types/express": "^4.17.21",
              lodash: "^4.17.21",
              "@types/lodash": "^4.14.202",
              axios: "^1.6.0",
              moment: "^2.29.4",
              uuid: "^9.0.1",
              "@types/uuid": "^9.0.7",
              chalk: "^4.1.2",
              dotenv: "^16.3.1",
            },
            scripts: {
              build:
                "tsc script.ts --outDir ./dist --target ES2020 --module CommonJS --moduleResolution node --allowJs --strict false",
            },
          }),
        },
      },
      "tsconfig.json": {
        file: {
          contents: JSON.stringify({
            compilerOptions: {
              target: "ES2020",
              module: "CommonJS",
              moduleResolution: "node",
              outDir: "./dist",
              allowJs: true,
              strict: false,
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
            },
            include: ["script.ts"],
          }),
        },
      },
    };

    await webcontainer.mount(files);

    // Install dependencies
    const installProcess = await webcontainer.spawn("npm", ["install"]);
    await installProcess.exit;

    // Compile TypeScript
    const compileProcess = await webcontainer.spawn("npx", [
      "tsc",
      "script.ts",
      "--outDir",
      "./dist",
      "--target",
      "ES2020",
      "--module",
      "CommonJS",
    ]);

    let compileError = "";

    // Read compile process output
    const compileReader = compileProcess.output.getReader();
    const readCompileOutput = async () => {
      try {
        while (true) {
          const { done, value } = await compileReader.read();
          if (done) break;

          const text =
            typeof value === "string" ? value : new TextDecoder().decode(value);
          if (text.includes("error")) {
            compileError += text;
          }
        }
      } finally {
        compileReader.releaseLock();
      }
    };

    const compileOutputPromise = readCompileOutput();

    const [compileExitCode] = await Promise.all([
      compileProcess.exit,
      compileOutputPromise,
    ]);

    if (compileExitCode !== 0) {
      return {
        success: false,
        output: "",
        error: compileError || "TypeScript compilation failed",
        exitCode: compileExitCode,
        compiled: false,
      };
    }

    // Execute the compiled JavaScript
    const runProcess = await webcontainer.spawn("node", ["dist/script.js"]);

    let output = "";
    let error = "";

    // Read run process output
    const runReader = runProcess.output.getReader();
    const readRunOutput = async () => {
      try {
        while (true) {
          const { done, value } = await runReader.read();
          if (done) break;

          const text =
            typeof value === "string" ? value : new TextDecoder().decode(value);
          if (
            text.includes("Error") ||
            text.includes("error") ||
            text.includes("TypeError")
          ) {
            error += text;
          } else {
            output += text;
          }
        }
      } finally {
        runReader.releaseLock();
      }
    };

    const runOutputPromise = readRunOutput();

    // Wait for execution to complete with timeout
    const [exitCode] = await Promise.race([
      Promise.all([runProcess.exit, runOutputPromise]),
      new Promise<[number]>((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout")), 10000)
      ),
    ]);

    return {
      success: exitCode === 0,
      output: output.trim(),
      error: error.trim(),
      exitCode,
      compiled: true,
    };
  } catch (error) {
    console.error("TypeScript execution error:", error);
    return {
      success: false,
      output: "",
      error:
        error instanceof Error
          ? error.message
          : "Unknown TypeScript execution error",
      exitCode: 1,
      compiled: false,
    };
  }
}

// Load TypeScript compiler if not already loaded
async function loadTypeScriptCompiler(): Promise<boolean> {
  if (typeof window !== "undefined" && window.ts) {
    return true;
  }

  try {
    // Load TypeScript compiler from CDN
    const script = document.createElement("script");
    script.src = "https://unpkg.com/typescript@latest/lib/typescript.js";

    return new Promise((resolve) => {
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  } catch {
    return false;
  }
}

// TypeScript execution using the official TypeScript compiler
export async function executeTypeScriptWithCompiler(code: string) {
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    // Load TypeScript compiler
    const tsLoaded = await loadTypeScriptCompiler();

    if (!tsLoaded || !window.ts) {
      // Fallback to simple transpiler
      return executeTypeScriptSimple(code);
    }

    // Configure TypeScript compiler options
    const compilerOptions = {
      target: window.ts.ScriptTarget.ES2020,
      module: window.ts.ModuleKind.None,
      strict: false,
      esModuleInterop: true,
      skipLibCheck: true,
      removeComments: false,
      sourceMap: false,
    };

    // Transpile TypeScript to JavaScript
    const result = window.ts.transpile(code, compilerOptions);

    if (!result) {
      throw new Error("TypeScript compilation failed");
    }

    // Create mock console for capturing output
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: unknown[]) => {
        errors.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      warn: (...args: unknown[]) => {
        logs.push(
          "⚠️ " +
            args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
              )
              .join(" ")
        );
      },
    };

    // Execute the transpiled JavaScript
    const func = new Function("console", result);
    func(mockConsole);

    return {
      success: true,
      output: logs.join("\n"),
      error: errors.join("\n"),
      logs,
      errors,
      transpiledCode: result,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown TypeScript error";

    console.error("TypeScript compiler execution failed:");
    console.error("Original code:", code);
    console.error("Error:", errorMessage);

    return {
      success: false,
      output: "",
      error: errorMessage,
      logs: [],
      errors: [
        errorMessage,
        "TypeScript compiler failed, check console for details",
      ],
      transpiledCode: "",
    };
  }
}

// Simplified TypeScript evaluation using regex-based transpilation (fallback)
export function executeTypeScriptSimple(code: string) {
  let jsCode = "";

  try {
    // Basic TypeScript to JavaScript transpilation for simple cases
    // This is a simplified version that handles basic TypeScript syntax
    jsCode = code
      // First, handle multiline interfaces and types
      .replace(/interface\s+\w+\s*(\<[^>]*\>)?\s*\{[\s\S]*?\}\s*;?/g, "")
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")

      // Handle class property declarations with types
      .replace(
        /^(\s*)(public|private|protected|readonly)?\s*(\w+)\s*:\s*[^=;]+\s*;?\s*$/gm,
        "$1$3;"
      )

      // Remove type annotations from variable declarations (improved)
      .replace(
        /:\s*([A-Za-z_$][\w$]*(\[\])?|\{[^}]*\}|\([^)]*\)\s*=>\s*[^,;]+)\s*(?=[=;,\)\{])/g,
        ""
      )

      // Remove function return type annotations (more comprehensive)
      .replace(
        /\)\s*:\s*([A-Za-z_$][\w$]*(\[\])?|\{[^}]*\}|\([^)]*\)\s*=>\s*[^{]+)\s*\{/g,
        ") {"
      )

      // Remove type assertions
      .replace(/\bas\s+[A-Za-z_$][\w$]*(\[\])?/g, "")

      // Remove generic type parameters but be careful with comparison operators
      .replace(/(\w+)\s*<[^<>=!]*>/g, "$1")

      // Remove access modifiers from class members and parameters
      .replace(/\b(public|private|protected|readonly)\s+/g, "")

      // Clean up constructor parameter properties
      .replace(/constructor\s*\(\s*([^)]*)\s*\)/g, (match, params) => {
        const cleanParams = params
          .replace(/\b(public|private|protected|readonly)\s+/g, "")
          .replace(/:\s*[A-Za-z_$][\w$]*(\[\])?/g, "");
        return `constructor(${cleanParams})`;
      })

      // Remove abstract keyword
      .replace(/\babstract\s+/g, "")

      // Remove implements clause
      .replace(/\simplements\s+[\w\s,<>]+(?=\s*\{)/g, "")

      // Clean up extends clause with generics
      .replace(/extends\s+([\w]+)(<[^>]*>)?/g, "extends $1")

      // Remove empty lines that might have been created
      .replace(/\n\s*\n\s*\n/g, "\n\n")

      // Clean up any remaining semicolons that might be floating
      .replace(/;\s*;/g, ";");

    // Create a sandbox environment
    const logs: string[] = [];
    const errors: string[] = [];

    // Override console methods
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: unknown[]) => {
        errors.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      warn: (...args: unknown[]) => {
        logs.push(
          "⚠️ " +
            args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
              )
              .join(" ")
        );
      },
    };

    // Create a function with the transpiled code and mock console
    const func = new Function("console", jsCode);

    // Execute the code
    func(mockConsole);

    return {
      success: true,
      output: logs.join("\n"),
      error: errors.join("\n"),
      logs,
      errors,
      transpiledCode: jsCode,
    };
  } catch (error) {
    // If there's a syntax error, it might be due to incomplete TypeScript transpilation
    // Let's provide more helpful debugging info
    const errorMessage =
      error instanceof Error ? error.message : "Unknown TypeScript error";

    // Log to browser console for debugging
    console.error("TypeScript execution failed:");
    console.error("Original code:", code);
    console.error("Transpiled code:", jsCode);
    console.error("Error:", errorMessage);

    return {
      success: false,
      output: "",
      error: errorMessage,
      logs: [],
      errors: [errorMessage, "Check browser console for detailed debug info"],
      transpiledCode: jsCode || "",
    };
  }
}

// Simplified console.log capture for basic JavaScript evaluation
// Improved async-aware JavaScript execution
export async function executeJavaScriptAsync(code: string): Promise<{
  success: boolean;
  output: string;
  error: string;
  logs: string[];
  errors: string[];
}> {
  return new Promise((resolve) => {
    const logs: string[] = [];
    const errors: string[] = [];
    const timeouts: NodeJS.Timeout[] = [];
    let completedTimeouts = 0;
    let totalTimeouts = 0;

    // Override console methods
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: unknown[]) => {
        errors.push(
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        );
      },
      warn: (...args: unknown[]) => {
        logs.push(
          "⚠️ " +
            args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(" ")
        );
      },
    };

    // Override setTimeout to track async operations
    const originalSetTimeout = setTimeout;
    const mockSetTimeout = (callback: () => void, delay: number) => {
      totalTimeouts++;
      const timeout = originalSetTimeout(() => {
        try {
          callback();
        } catch (error) {
          errors.push(`Async error: ${error}`);
        }
        completedTimeouts++;

        // Check if all async operations are done
        if (completedTimeouts === totalTimeouts) {
          // Wait a bit more for any additional async operations
          originalSetTimeout(() => {
            resolve({
              success: errors.length === 0,
              output: logs.join("\n"),
              error: errors.join("\n"),
              logs,
              errors,
            });
          }, 100);
        }
      }, delay);

      timeouts.push(timeout);
      return timeout;
    };

    try {
      // Create function with mocked globals
      const func = new Function("console", "setTimeout", "Promise", code);

      // Execute the code with native Promise support
      func(mockConsole, mockSetTimeout, Promise);

      // If no timeouts were created, resolve immediately
      if (totalTimeouts === 0) {
        resolve({
          success: errors.length === 0,
          output: logs.join("\n"),
          error: errors.join("\n"),
          logs,
          errors,
        });
      } else {
        // Set a maximum timeout for the entire execution
        originalSetTimeout(() => {
          // Clear any remaining timeouts
          timeouts.forEach((t) => clearTimeout(t));
          resolve({
            success: errors.length === 0,
            output: logs.join("\n"),
            error: errors.join("\n"),
            logs,
            errors,
          });
        }, 15000); // 15 second maximum
      }
    } catch (error) {
      errors.push(String(error));
      resolve({
        success: false,
        output: logs.join("\n"),
        error: errors.join("\n"),
        logs,
        errors,
      });
    }
  });
}

export function executeJavaScriptSimple(code: string) {
  try {
    // Create a sandbox environment
    const logs: string[] = [];
    const errors: string[] = [];

    // Override console methods
    const mockConsole = {
      log: (...args: unknown[]) => {
        logs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: unknown[]) => {
        errors.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ")
        );
      },
      warn: (...args: unknown[]) => {
        logs.push(
          "⚠️ " +
            args
              .map((arg) =>
                typeof arg === "object" ? JSON.stringify(arg) : String(arg)
              )
              .join(" ")
        );
      },
    };

    // Create a function with the code and mock console
    const func = new Function("console", code);

    // Execute the code
    func(mockConsole);

    return {
      success: true,
      output: logs.join("\n"),
      error: errors.join("\n"),
      logs,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error instanceof Error ? error.message : "Unknown error",
      logs: [],
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}
