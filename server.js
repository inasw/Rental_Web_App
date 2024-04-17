const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoutes'); // Change from userRoutes to userRouter
const port = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use userRouter for user functionalities
app.use('/api/users', userRouter); // Change '/api/users/userRouter' to '/api/users'

app.listen(port, () => console.log(`Server started on port ${port}`));
