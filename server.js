// server/app.js

const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// Import and use the userRoutes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); 

app.listen(port, () => console.log(`Server started on port ${port}`));
