require("dotenv").config();
const mongoose = require("mongoose");

const connectMongoDb = (url) => {
  return mongoose.connect(url);
};

module.exports = connectMongoDb;
