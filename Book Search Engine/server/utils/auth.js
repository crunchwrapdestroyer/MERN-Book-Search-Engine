// Import the jsonwebtoken module for JWT functionality
const jwt = require('jsonwebtoken');

// Define the token secret and expiration time
const secret = 'mysecretsshhhhh';
const expiration = '2h';

// Export middleware and token signing functions
module.exports = {
  // Authentication middleware function
  authMiddleware: function (req, res, next) {
    // Extract token from various sources
    let token = req.query.token || req.headers.authorization || req.body.token;

    // Extract token from authorization header if present
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If token is not provided, return an error response
    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // Verify and decode the token
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Attach decoded user data to the request object
      req.user = data;
  
      // Attach token to the request context for future use
      req.context = { token };
    } catch {
      // If token verification fails, return an error response
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // Proceed to the next middleware or route handler
    next();
  },
  // Function to sign a new JWT token
  signToken: function ({ username, email, _id }) {
    // Create payload for the token
    const payload = { username, email, _id };

    // Sign the token with payload, secret, and expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};