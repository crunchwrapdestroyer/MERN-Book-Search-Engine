// Import the Schema class from mongoose
const { Schema } = require('mongoose');

// Define the book schema
const bookSchema = new Schema({
  // Define authors field as an array of strings
  authors: [
    {
      type: String,
    },
  ],
  // Define description field as a string, required
  description: {
    type: String,
    required: true,
  },
  // Define bookId field as a string, required
  bookId: {
    type: String,
    required: true,
  },
  // Define image field as a string
  image: {
    type: String,
  },
  // Define link field as a string
  link: {
    type: String,
  },
  // Define title field as a string, required
  title: {
    type: String,
    required: true,
  },
});

// Export the book schema
module.exports = bookSchema;
