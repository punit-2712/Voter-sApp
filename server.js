const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./db");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;



const userRoutes = require("./routes/userRoutes");
const candidateRoute = require("./routes/candidateRoutes");
//use the routers
app.use("/user", userRoutes);
app.use("/candidate", candidateRoute);

app.listen(PORT, () => {
  console.log("Listening to port 3000");
});
