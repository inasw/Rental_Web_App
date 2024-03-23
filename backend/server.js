const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config(); //process.env
const port = process.env.PORT;

connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/orders", require("./routes/ordersRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/house", require("./routes/houseRoutes"));
app.use("/api/request", require("./routes/requestRoutes"));

app.listen(port, () => console.log(`Server started on port ${port}`));
