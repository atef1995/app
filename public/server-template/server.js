const http = require('http');
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

// Request body parser
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (error) {
      callback(error, null);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  console.log(`📡 ${method} ${pathname}`);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // Test connection endpoint
  if (pathname === '/test-connection' && method === 'GET') {
    console.log('📡 Test connection endpoint called');
    sendJSON(res, {
      message: 'Backend server is running!',
      timestamp: new Date().toISOString(),
      server: 'Node.js Tutorial Backend',
      environment: 'Local Development Server',
      endpoints: [
        'GET /test-connection',
        'GET /todos',
        'POST /todos',
        'PUT /todos/:id',
        'DELETE /todos/:id',
        'GET /stats'
      ],
      status: 'healthy'
    });
    return;
  }

  // Get all todos
  if (pathname === '/todos' && method === 'GET') {
    console.log(`📋 Fetching all todos (${todos.length} items)`);
    sendJSON(res, {
      todos,
      count: todos.length,
      message: 'Todos fetched successfully',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Create new todo
  if (pathname === '/todos' && method === 'POST') {
    parseRequestBody(req, (error, body) => {
      if (error) {
        sendJSON(res, { error: 'Invalid JSON data', status: 400 }, 400);
        return;
      }

      const { text } = body;
      if (!text || text.trim() === '') {
        sendJSON(res, { error: 'Todo text is required', status: 400 }, 400);
        return;
      }

      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };

      todos.push(newTodo);
      console.log(`✅ Created todo: ${newTodo.text}`);

      sendJSON(res, {
        ...newTodo,
        message: 'Todo created successfully',
        totalTodos: todos.length
      }, 201);
    });
    return;
  }

  // Update todo
  if (pathname.startsWith('/todos/') && method === 'PUT') {
    const id = parseInt(pathname.split('/')[2]);
    parseRequestBody(req, (error, body) => {
      if (error) {
        sendJSON(res, { error: 'Invalid JSON data', status: 400 }, 400);
        return;
      }

      const todoIndex = todos.findIndex(t => t.id === id);
      if (todoIndex === -1) {
        sendJSON(res, { error: 'Todo not found', status: 404 }, 404);
        return;
      }

      todos[todoIndex] = { ...todos[todoIndex], ...body };
      console.log(`📝 Updated todo ${id}: ${todos[todoIndex].text}`);

      sendJSON(res, {
        ...todos[todoIndex],
        message: 'Todo updated successfully'
      });
    });
    return;
  }

  // Delete todo
  if (pathname.startsWith('/todos/') && method === 'DELETE') {
    const id = parseInt(pathname.split('/')[2]);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      sendJSON(res, { error: 'Todo not found', status: 404 }, 404);
      return;
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    console.log(`🗑️ Deleted todo: ${deletedTodo.text}`);

    sendJSON(res, {
      message: 'Todo deleted successfully',
      deletedTodo,
      remainingCount: todos.length
    });
    return;
  }

  // Get statistics
  if (pathname === '/stats' && method === 'GET') {
    const stats = {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      completionRate: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0,
      oldestTodo: todos.length > 0 ? todos[0].createdAt : null,
      newestTodo: todos.length > 0 ? todos[todos.length - 1].createdAt : null,
      generatedAt: new Date().toISOString(),
      server: 'Node.js Tutorial Backend'
    };

    console.log('📊 Generated todo statistics:', stats);
    sendJSON(res, stats);
    return;
  }

  // 404 - Not found
  sendJSON(res, { 
    error: 'Not found', 
    status: 404,
    availableEndpoints: [
      'GET /test-connection',
      'GET /todos',
      'POST /todos',
      'PUT /todos/:id', 
      'DELETE /todos/:id',
      'GET /stats'
    ]
  }, 404);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Node.js Tutorial Server running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET  /test-connection - Test server connection`);
  console.log(`   GET  /todos          - Get all todos`);
  console.log(`   POST /todos          - Create new todo`);
  console.log(`   PUT  /todos/:id      - Update todo`);
  console.log(`   DELETE /todos/:id    - Delete todo`);
  console.log(`   GET  /stats          - Get todo statistics`);
  console.log(`\n🌐 CORS enabled for all origins`);
  console.log(`💡 Ready to receive requests from your tutorial frontend!`);
});