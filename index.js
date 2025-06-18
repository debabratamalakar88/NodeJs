//const express = require('express')
import express from 'express';
const app = express()
// Import routes and database connection
import ContactRoutes from './routes/contacts.routes.js';
import UserRoutes from './routes/users.routes.js';
import { connectDB } from './config/database.js';


const PORT = process.env.PORT;

// Connect to MongoDB
connectDB()

    
app.listen(PORT, () => {
  console.log(`Server started Successfully on port ${PORT}.`)
})

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files from the 'public' directory

app.use('/', ContactRoutes); // Use the contacts routes
app.use('/', UserRoutes); // Use the user routes