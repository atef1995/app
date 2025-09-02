// Code runner utilities
import { WebContainer } from "@webcontainer/api";

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

export async function executeJavaScript(code: string) {
  try {
    const webcontainer = await initWebContainer();

    // Industry-proven approach: Monitor event loop and capture all async output
    const wrappedCode = `
const util = require('util');

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
  
  // Also output immediately for real-time feedback
  if (type === 'error') {
    originalError(\`[\${timestamp}] ERROR: \${message}\`);
  } else if (type === 'warn') {
    originalWarn(\`[\${timestamp}] WARN: \${message}\`);
  } else {
    originalLog(\`[\${timestamp}] \${message}\`);
  }
};

console.log = (...args) => captureLog('log', args);
console.error = (...args) => captureLog('error', args);
console.warn = (...args) => captureLog('warn', args);

// Event loop monitoring - this is the key to async support
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
  // For intervals, we'll let them run but not track them for completion
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

// Check if execution is complete
const checkCompletion = () => {
  if (executionComplete && pendingOperations === 0) {
    finishExecution();
  }
};

const finishExecution = () => {
  clearTimeout(finalTimeout);
  
  // Output all logs in order
  originalLog('__EXECUTION_START__');
  logs.sort((a, b) => a.timestamp - b.timestamp).forEach(log => {
    originalLog(\`\${log.type.toUpperCase()}: \${log.message}\`);
  });
  originalLog('__EXECUTION_END__');
  
  process.exit(0);
};

// Fallback timeout to prevent infinite hanging
finalTimeout = setTimeout(() => {
  originalLog('__EXECUTION_TIMEOUT__');
  logs.sort((a, b) => a.timestamp - b.timestamp).forEach(log => {
    originalLog(\`\${log.type.toUpperCase()}: \${log.message}\`);
  });
  originalLog('__EXECUTION_END__');
  process.exit(0);
}, 5000);

// Execute user code
try {
  ${code}
  
  // Mark synchronous execution as complete
  executionComplete = true;
  
  // Check immediately in case there are no async operations
  process.nextTick(checkCompletion);
  
} catch (error) {
  console.error('Execution error:', error.message);
  executionComplete = true;
  setTimeout(finishExecution, 100);
}
    `.trim();

    // Create a simple JavaScript file to execute
    const files = {
      "script.js": {
        file: {
          contents: wrappedCode,
        },
      },
      "package.json": {
        file: {
          contents: JSON.stringify({
            name: "js-runner",
            type: "module",
            dependencies: {},
          }),
        },
      },
    };

    await webcontainer.mount(files);

    // Execute the JavaScript code
    const process = await webcontainer.spawn("node", ["script.js"]);

    let output = "";
    const error = "";

    // Collect output from the process
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          // WebContainer already provides text, no need to decode
          output += typeof data === 'string' ? data : new TextDecoder().decode(data);
        },
      })
    );

    // Wait for the process to complete with extended timeout for async operations
    const exitCode = await Promise.race([
      process.exit,
      new Promise<number>(
        (_, reject) =>
          setTimeout(() => reject(new Error("Execution timeout")), 15000) // Extended timeout
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
      // Handle timeout case
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
      executionError =
        "Execution timeout - some async operations may not have completed";
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
            type: "module",
            dependencies: {
              typescript: "^5.0.0",
              "@types/node": "^18.0.0",
            },
            scripts: {
              build:
                "tsc script.ts --outDir ./dist --target ES2020 --module ES2020 --moduleResolution node --allowJs --strict false",
            },
          }),
        },
      },
      "tsconfig.json": {
        file: {
          contents: JSON.stringify({
            compilerOptions: {
              target: "ES2020",
              module: "ES2020",
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
      "ES2020",
    ]);

    let compileError = "";

    // Read compile process output
    const compileReader = compileProcess.output.getReader();
    const readCompileOutput = async () => {
      try {
        while (true) {
          const { done, value } = await compileReader.read();
          if (done) break;

          const text = typeof value === 'string' ? value : new TextDecoder().decode(value);
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

          const text = typeof value === 'string' ? value : new TextDecoder().decode(value);
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
