"use client";

import React, { useState } from "react";

interface ProjectDownloadProps {
  frontendCode: string;
  backendCode: string;
}

const ProjectDownload: React.FC<ProjectDownloadProps> = ({
  frontendCode,
  backendCode,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const downloadProjectZip = async () => {
    setIsDownloading(true);
    try {
      // Dynamic import of JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add package.json
      const packageJson = {
        name: "nodejs-tutorial-project",
        version: "1.0.0",
        description:
          "A complete Node.js tutorial project with frontend and backend",
        main: "server.js",
        scripts: {
          start: "node server.js",
          dev: "node server.js",
          test: 'echo "No tests specified" && exit 0',
        },
        keywords: ["nodejs", "tutorial", "fullstack"],
        author: "Student",
        license: "MIT",
        dependencies: {},
        engines: {
          node: ">=14.0.0",
        },
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      // Add server.js (backend code)
      const serverCode =
        backendCode ||
        `const http = require('http');
const url = require('url');

// In-memory todo storage
let todos = [
  { id: 1, text: 'Learn Node.js modules', completed: false, createdAt: '2024-01-01T10:00:00.000Z' },
  { id: 2, text: 'Master NPM ecosystem', completed: false, createdAt: '2024-01-01T11:00:00.000Z' },
  { id: 3, text: 'Build modular applications', completed: true, createdAt: '2024-01-01T12:00:00.000Z' }
];

// CORS headers helper
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// JSON response helper
function sendJSON(res, data, statusCode = 200) {
  setCORSHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;
  const method = req.method;

  console.log(\`📡 \${method} \${pathname}\`);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Test connection endpoint
  if (pathname === '/test-connection' && method === 'GET') {
    sendJSON(res, {
      message: 'Backend server is running!',
      timestamp: new Date().toISOString(),
      server: 'Node.js Tutorial Backend',
      status: 'healthy'
    });
    return;
  }

  // Get all todos
  if (pathname === '/todos' && method === 'GET') {
    sendJSON(res, { todos, count: todos.length });
    return;
  }

  // 404 - Not found
  sendJSON(res, { error: 'Not found', status: 404 }, 404);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(\`🚀 Node.js Tutorial Server running on http://localhost:\${PORT}\`);
});`;
      zip.file("server.js", serverCode);

      // Add index.html (frontend code)
      const frontendHtml =
        frontendCode ||
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js Tutorial - Frontend</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        button { padding: 10px 20px; margin: 10px 5px; cursor: pointer; }
        .response { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Node.js Tutorial - Frontend</h1>
    <p>This frontend connects to your Node.js backend server.</p>
    
    <button onclick="testConnection()">Test Connection</button>
    <button onclick="getTodos()">Get Todos</button>
    
    <div id="response" class="response"></div>

    <script>
        const API_BASE = 'http://localhost:3001';
        
        async function testConnection() {
            try {
                const response = await fetch(\`\${API_BASE}/test-connection\`);
                const data = await response.json();
                document.getElementById('response').innerHTML = 
                    \`<h3>✅ Connection Success!</h3><pre>\${JSON.stringify(data, null, 2)}</pre>\`;
            } catch (error) {
                document.getElementById('response').innerHTML = 
                    \`<h3>❌ Connection Failed</h3><p>\${error.message}</p>\`;
            }
        }
        
        async function getTodos() {
            try {
                const response = await fetch(\`\${API_BASE}/todos\`);
                const data = await response.json();
                document.getElementById('response').innerHTML = 
                    \`<h3>📋 Todos Retrieved!</h3><pre>\${JSON.stringify(data, null, 2)}</pre>\`;
            } catch (error) {
                document.getElementById('response').innerHTML = 
                    \`<h3>❌ Request Failed</h3><p>\${error.message}</p>\`;
            }
        }
    </script>
</body>
</html>`;
      zip.file("index.html", frontendHtml);

      // Add VS Code workspace settings
      const vscodeSettings = {
        folders: [
          {
            path: ".",
          },
        ],
        settings: {
          "terminal.integrated.defaultProfile.windows": "Command Prompt",
          "files.associations": {
            "*.js": "javascript",
          },
        },
        extensions: {
          recommendations: [
            "ms-vscode.vscode-node-azure-pack",
            "formulahendry.code-runner",
          ],
        },
      };
      zip.file(
        "tutorial-project.code-workspace",
        JSON.stringify(vscodeSettings, null, 2)
      );

      // Add comprehensive README with VS Code instructions
      const readme = `# Node.js Tutorial Project

A complete Node.js tutorial project with frontend and backend components.

## 🚀 Quick Start

### Option 1: Using VS Code (Recommended)
1. **Open the project**: Double-click \`tutorial-project.code-workspace\` to open in VS Code
2. **Open terminal**: Press \`Ctrl+\` \` (backtick) or go to Terminal → New Terminal
3. **Start the server**: Type \`node server.js\` and press Enter
4. **Open frontend**: Right-click \`index.html\` → "Open with Live Server" (or just open in browser)
5. **Test the connection**: Click "Test Connection" button in the browser

### Option 2: Using Command Line
1. **Open terminal/command prompt** in this folder
2. **Start the server**: \`node server.js\`
3. **Open browser**: Go to \`file:///path/to/index.html\` or use a local server
4. **Test**: Click buttons to interact with your Node.js backend

## 📁 Project Structure

\`\`\`
tutorial-project/
├── server.js              # Your Node.js backend server
├── index.html             # Frontend HTML with JavaScript
├── package.json           # Node.js project configuration
├── tutorial-project.code-workspace  # VS Code workspace file
└── README.md              # This file
\`\`\`

## 🎯 What You'll Learn

- ✅ **HTTP Server**: Create a real Node.js HTTP server
- ✅ **API Endpoints**: Build REST API endpoints (/test-connection, /todos)
- ✅ **CORS Handling**: Enable cross-origin requests for frontend
- ✅ **Frontend Integration**: Connect HTML/JS frontend to Node.js backend
- ✅ **Real Communication**: See actual HTTP requests and responses

## 🔧 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/test-connection\` | Test if server is running |
| GET | \`/todos\` | Get all todos |
| OPTIONS | \`/*\` | CORS preflight handling |

## 🐛 Troubleshooting

**Server won't start?**
- Make sure you have Node.js installed (\`node --version\`)
- Check if port 3001 is already in use
- Try a different port: \`PORT=3002 node server.js\`

**Frontend can't connect?**
- Ensure the server is running first
- Check browser console for CORS errors
- Verify the API_BASE URL in index.html matches your server

**VS Code setup?**
- Install "Live Server" extension for easy HTML preview
- Install "Node.js Extension Pack" for better Node.js support
- Use \`Ctrl+\` \` to quickly open terminal

## 🎓 Next Steps

1. **Modify the server**: Add new endpoints in \`server.js\`
2. **Update the frontend**: Add more buttons and functionality in \`index.html\`
3. **Experiment**: Try POST requests, add form handling, store data
4. **Learn more**: Explore Express.js, databases, authentication

## 💡 Tips for Learning

- **Watch the terminal**: See real-time server logs
- **Use browser dev tools**: Check Network tab for HTTP requests
- **Experiment**: Modify code and see immediate results
- **Break things**: Error messages are great teachers!

Happy coding! 🚀
`;
      zip.file("README.md", readme);

      // Generate and download ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nodejs-tutorial-project.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("Error creating download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={downloadProjectZip}
        disabled={isDownloading}
        className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white text-sm rounded font-medium transition-colors"
      >
        {isDownloading ? "⏳" : "📦"} Download ZIP
      </button>

      {showSuccess && (
        <div className="absolute top-full left-0 mt-2 bg-green-100 dark:bg-green-900 border border-green-400 p-2 rounded shadow-lg z-10">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400 text-xs">
              ✅ Complete project ZIP downloaded!
            </span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Extract ZIP and open &quot;tutorial-project.code-workspace&quot; in
            VS Code
          </p>
        </div>
      )}
    </>
  );
};

export default ProjectDownload;
