// Vercel serverless entry point.
// Exposes the existing Express application (server.js) as a Vercel function.
// server.js only calls app.listen() when run directly, so importing it here is safe.
module.exports = require('../server.js');
