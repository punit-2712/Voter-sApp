const mongoose = require("mongoose");

require("dotenv").config();
const mongoURL = "mongodb://localhost:27017/voting ";
//const mongoURL = process.env.DB_URL;
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to Mongodb");
});

//comment added
module.exports = db;
