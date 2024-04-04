// server/app.js

const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// Import and use the user controller functions
const {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  getUserById,
  forgetPassword,
  resetPassword,
} = require('./controllers/userController');

// Define routes for user functionalities
app.post('/api/users/register', register);
app.post('/api/users/login', login);
app.post('/api/users/admin/login', adminLogin);
app.get('/api/users/profile', getProfile);
app.put('/api/users/profile/:id', updateProfile);
app.delete('/api/users/profile/:id', deleteProfile);
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getUserById);
app.post('/api/users/forget-password', forgetPassword);
app.post('/api/users/reset-password', resetPassword);

app.listen(port, () => console.log(`Server started on port ${port}`));
