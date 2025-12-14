const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("MongoDB connected!");
  } catch (dbError) {
    console.log("Connection failed!", dbError);
  }
};

module.exports = connectToDatabase;
