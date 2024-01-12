import { User } from "../models/user.model.js";

// Function to check if the username is already taken
async function isUsernameTaken(username) {
    const existingUser = await User.findOne({ username });
    return existingUser !== null;
  }
  
  // Function to check if the email is already registered
  async function isEmailRegistered(email) {
    const existingUser = await User.findOne({ email });
    return existingUser !== null;
  }
export { isEmailRegistered, isUsernameTaken };


