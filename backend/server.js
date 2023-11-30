const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
