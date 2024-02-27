const express = require('express');
const dotenv= require('dotenv').config(); //process.env
const port= process.env.PORT;

const app = express();
app.listen(port, () => console.log(`Server started on port ${port}`));