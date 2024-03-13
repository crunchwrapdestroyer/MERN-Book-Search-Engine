// Import the Express router
const router = require('express').Router();
// Import controller methods for user-related operations
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// Import authentication middleware
const { authMiddleware } = require('../../utils/auth');

// Define routes for user-related operations

// Route to create a new user
router.route('/').post(createUser).put(authMiddleware, saveBook);

// Route to login a user
router.route('/login').post(login);

// Route to get information about the current user
router.route('/me').get(authMiddleware, getSingleUser);

// Route to delete a saved book for the current user
router.route('/books/:bookId').delete(authMiddleware, deleteBook);

// Export the router
module.exports = router;