// Import required modules
const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require('./schemas');
// Import database connection
const db = require('./config/connection');

// Define the port number
const PORT = process.env.PORT || 3001;
// Create an Apollo Server instance with schema, resolvers, and context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: ({ req }) => {
    const token = req.context.token; // Extract token from request context
    return { token }; // Provide token in the context
  },
});

// Create an Express application
const app = express();

// Define a function to start the Apollo Server
const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();
  
  // Use middleware to parse URL-encoded and JSON request bodies
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  // Use Apollo Server middleware with authentication middleware
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware // Pass authentication middleware to context
  }));

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Serve the HTML file for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Once the database connection is open, start the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the Apollo Server
startApolloServer();