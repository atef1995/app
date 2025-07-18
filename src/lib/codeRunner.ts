// Code runner utilities
import { WebContainer } from "@webcontainer/api";

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
