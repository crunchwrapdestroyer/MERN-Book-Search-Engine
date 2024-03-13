const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Importing the bookSchema from the Book module
const bookSchema = require('./Book');
// Define the user schema
const userSchema = new Schema(
  {
    // Define username field with type, required, and unique properties
    username: {
      type: String,
      required: true,
      unique: true,
    },
        // Define email field with type, required, unique, and match properties
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    // Define password field with type and required properties
    password: {
      type: String,
      required: true,
    },
    // Define savedBooks field as an array of bookSchema
    savedBooks: [bookSchema],
  },
  {
    // Define options for toJSON method
    toJSON: {
      virtuals: true,
    },
  }
);
// Middleware function to hash the password before saving
userSchema.pre('save', async function (next) {
  // Check if the password is new or modified
  if (this.isNew || this.isModified('password')) {
    // Generate salt and hash the password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  // Proceed to the next middleware
  next();
});
// Method to compare the provided password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  // Compare the provided password with the hashed password
  return bcrypt.compare(password, this.password);
};
// Virtual property to calculate the number of saved books
userSchema.virtual('bookCount').get(function () {
  // Return the length of the savedBooks array
  return this.savedBooks.length;
});
// Create the User model
const User = model('User', userSchema);

module.exports = User; // Export the User model
