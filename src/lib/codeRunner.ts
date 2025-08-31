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

    // Create a simple JavaScript file to execute
    const files = {
      "script.js": {
        file: {
          contents: code,
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
    let error = "";

    // Capture stdout
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
      })
    );

    // Capture stderr
    process.output.pipeTo(
      new WritableStream({
        write(data) {
          error += data;
        },
      })
    );

    // Wait for execution to complete with timeout
    const exitCode = await Promise.race([
      process.exit,
      new Promise<number>((_, reject) =>
        setTimeout(() => reject(new Error("Execution timeout")), 5000)
      ),
    ]);

    return {
      success: exitCode === 0,
      output: output.trim(),
      error: error.trim(),
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

    let compileOutput = "";
    let compileError = "";

    compileProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          if (data.includes("error")) {
            compileError += data;
          } else {
            compileOutput += data;
          }
        },
      })
    );

    const compileExitCode = await compileProcess.exit;

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
    const error = "";

    runProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
      })
    );

    // Wait for execution to complete with timeout
    const exitCode = await Promise.race([
      runProcess.exit,
      new Promise<number>((_, reject) =>
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
    const debugInfo = `
Original TypeScript code:
${code}

Transpiled JavaScript:
${jsCode || "Failed to transpile"}

Error: ${errorMessage}
    `.trim();

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
