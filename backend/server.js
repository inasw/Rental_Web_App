const express = require('express');
const connectDB = require('./config/db');
const dotenv= require('dotenv').config(); //process.env
const port= process.env.PORT;

connectDB();

const app = express();

// middleware
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));

// routes


app.listen(port, () => console.log(`Server started on port ${port}`));