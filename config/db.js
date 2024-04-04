const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
     process.exit(1);
  }
};

module.exports = connectDB; 



// import mongoose from "mongoose"

// const DBconnection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL)
//     console.log("DB connected succesfully")
//   } catch (error) {
//     console.log(`error: ${error}`)
//     process.exit(1)
//   }
// }

// export default DBconnection