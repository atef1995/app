# Node.js Tutorial Server

A simple Node.js server template for learning backend development. This server provides a REST API for managing todos and demonstrates core Node.js concepts.

## Quick Start

1. **Download and Extract** this folder to your computer
2. **Open Terminal/Command Prompt** and navigate to this folder
3. **Start the server**:
   ```bash
   node server.js
   ```
4. **Test the server** by visiting: http://localhost:3001/test-connection

## Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/test-connection` | Test if server is running |
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a specific todo |
| DELETE | `/todos/:id` | Delete a specific todo |
| GET | `/stats` | Get todo statistics |

## Example API Usage

### Test Connection
```bash
curl http://localhost:3001/test-connection
```

### Get All Todos
```bash
curl http://localhost:3001/todos
```

### Create New Todo
```bash
curl -X POST http://localhost:3001/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "Learn Node.js"}'
```

### Update Todo
```bash
curl -X PUT http://localhost:3001/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete Todo
```bash
curl -X DELETE http://localhost:3001/todos/1
```

### Get Statistics
```bash
curl http://localhost:3001/stats
```

## Features

- ✅ Pure Node.js (no external dependencies)
- ✅ CORS enabled for frontend integration
- ✅ RESTful API design
- ✅ JSON request/response handling
- ✅ In-memory data storage
- ✅ Error handling and validation
- ✅ Detailed console logging

## Integration with Tutorial Frontend

This server is designed to work with the tutorial frontend. Once running:

1. The frontend will automatically detect your local server
2. All API requests will be sent to `http://localhost:3001`
3. You'll see real-time logs in your terminal
4. Changes you make to the server code will be reflected immediately

## Customization

### Change the Port
Set the `PORT` environment variable or modify line 129:
```javascript
const PORT = process.env.PORT || 3001;
```

### Add New Endpoints
Add new route handlers in the main request handler function around line 25.

### Modify Data Structure
Update the `todos` array and related functions to change the data model.

## Troubleshooting

**Server won't start?**
- Make sure you have Node.js installed (version 14 or higher)
- Check if port 3001 is already in use
- Try a different port by setting `PORT=3002 node server.js`

**Frontend can't connect?**
- Ensure the server is running on `http://localhost:3001`
- Check that CORS headers are properly set
- Verify no firewall is blocking the connection

**Need help?**
- Check the console output for error messages
- Make sure all syntax is correct if you've modified the code
- Restart the server after making changes

## Next Steps

1. **Experiment** with the API using curl or Postman
2. **Modify** the server to add new features
3. **Learn** by reading through the commented code
4. **Practice** building more complex endpoints

Happy coding! 🚀