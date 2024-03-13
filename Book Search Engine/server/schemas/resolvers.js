const { User } = require('../../../server/models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
        // Retrieve information about the current user
    me: async (parent, args, context) => {
      // Check if the user is authenticated
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData; // Return user data
      }

      throw AuthenticationError; // Throw authentication error if user is not authenticated
    },
  },

  Mutation: {
    // Add a new user
    addUser: async (parent, {username, email, password}) => {
        // Create a new user with provided data
        const user = await User.create({username, email, password});
        // Generate a token for the newly created user
        const token = signToken(user);
        // Return the generated token and user data
        return {token, user};
    },
    // Login user
    login: async (parent, { email, password }) => {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }
      // Check if the provided password matches the stored password
      const correctPw = await user.isCorrectPassword(password);
      // If password is incorrect, throw authentication error
      if (!correctPw) {
        throw AuthenticationError;
      }
      // Generate a token for the authenticated user
      const token = signToken(user);
      return { token, user };
    },
    // Save a book to user's savedBooks array
    saveBook: async (parent, { bookData }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the user by ID and update the savedBooks array by pushing new book data
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        
        return updatedUser; // Return the updated user data
      }

      throw AuthenticationError; // Throw authentication error if user is not authenticated
    },
    // Remove a book from user's savedBooks array
    removeBook: async (parent, { bookId }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the user by ID and update the savedBooks array by pulling the book with provided ID
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser; // Return the updated user data
      }

      throw AuthenticationError; // Throw authentication error if user is not authenticated
    },
  },
};

module.exports = resolvers;
