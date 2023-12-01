const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const staff = require("./routes/staff");
const user = require("./routes/user");
const mainPage = require("./routes/mainRoute");

require("dotenv").config();

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/", mainPage);
app.use("/staff", staff);
app.use("/user", user);

mongoose
  .connect(process.env.URI)
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log("Database Connected");
      console.log("Backend Listening to Port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Invalid Database Connection: " + err);
  });
