//const express = require('express')
import express from 'express';
const app = express()
// Import routes and database connection
import ContactRoutes from './routes/contacts.routes.js';
import UserRoutes from './routes/users.routes.js';
import { connectDB } from './config/database.js';
//import sessionMiddleware from './middleware/sessionValidate.js';

import cookieParser from 'cookie-parser';
app.use(cookieParser()); // Middleware to parse cookies
//app.use(cookieParser('MySecret1')); // Middleware to parse signed cookies




import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.PORT;

// Connect to MongoDB
connectDB()

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    //secure: config.NODE_ENV === "production", // Use secure cookies in production
    //httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (14 days)
  }),
}));
    
app.listen(PORT, () => {
  console.log(`Server started Successfully on port ${PORT}.`)
})


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files from the 'public' directory

//app.use(sessionValidate.sessionMiddleware); // Use session middleware for session management


app.use('/', ContactRoutes); // Use the contacts routes
app.use('/', UserRoutes); // Use the user routes