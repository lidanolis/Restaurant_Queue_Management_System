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
    //socket io
    const io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.query.token;
        socket.userId = token;
        next();
      } catch (err) {
        console.error("Socket authentication error:", err);
        // If there's an error, reject the socket connection
        next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket) => {
      console.log("user " + socket.userId + " connected");

      socket.on("disconnect", () => {
        console.log("user " + socket.userId + " disconnected");
      });

      socket.on("joinRoom", ({ restaurantId }) => {
        socket.join(restaurantId);
        console.log("A user joined the restaurant " + restaurantId);
      });
      socket.on("leaveRoom", ({ restaurantId }) => {
        socket.leave(restaurantId);
        console.log("A user Left the restaurant");
      });
    });
  })
  .catch((err) => {
    console.log("Invalid Database Connection: " + err);
  });
