import User from "../models/users.models.js";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import session from "express-session";

// User registration and login controllers
// Render the user registration page
export const userRegistration = async (req, res) => {  
  res.render('userRegistration', {
    title: 'New User Registration',
    errors: null,
    message: null,
    description: 'Please fill out the form below to register a new user.',
  });
};



export const userRegistrationSubmit = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security

  // Validate input
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    return res.status(400).render('userRegistration', {      
      errors: null,
      message: 'All fields are required.'
      
    });
  }

  try {

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('userRegistration', {
        errors: null,
        message: 'This email is already registered.'
      });
    }

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:hashedPassword, // In a real application, you should hash the password before saving
      phoneNumber
    });

    // Save the user to the database
    await newUser.save();

    res.redirect('/userLogin'); // Redirect to login page after successful registration
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('userRegistration', {
      title: 'User Registration',
      errors: null,
      message: 'An error occurred while registering the user.'
    });
  }
}


export const userLogin = async (req, res) => {  
  res.render('userLogin', {
    title: 'User Login',
    errors: null,
    message: null,
    description: 'Please enter your email and password to log in.',
  });
};


export const userLoginSubmit = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).render('login', {
      title: 'Login',
      message: 'Email and password are required.'
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || user.password !== password) { // In a real application, compare hashed passwords
      return res.status(401).render('login', {
        title: 'Login',
        message: 'Invalid email or password.'
      });
    }

    // Set user session (this is a placeholder, implement session management as needed)
    req.session.userId = user._id;

    res.redirect('/manageContact'); // Redirect to dashboard after successful login
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('login', {
      title: 'Login',
      message: 'An error occurred while logging in.'
    });
  }
}


export const getUserProfile = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.render('404', {
      title: 'Error',
      message: 'Invalid user ID provided.'
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.render('404', {
        title: 'Error',
        message: 'User not found.'
      });
    }

    res.render('userProfile', { 
      title: 'User Profile',
      user: user
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).render('500', { 
      title: 'Error',
      message: 'An error occurred while fetching the user profile.'
    });
  }
};

