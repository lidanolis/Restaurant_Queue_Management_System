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
    const namespace = io.of("/");
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
        console.log("A user joined the restaurant with the ID " + restaurantId);
      });
      socket.on("leaveRoom", ({ restaurantId }) => {
        socket.leave(restaurantId);
        console.log("A user Left the restaurant");
      });
      socket.on("checkRoom", ({ restaurantId, userId, actionType }) => {
        console.log("triggered checkRoom socket of actionType: " + actionType);
        const roomSockets =
          namespace.adapter.rooms.get(restaurantId) || new Set();

        if (roomSockets.size > 0) {
          console.log("occupied Room");
          io.emit("RoomStatusResult", {
            message: "occupied",
            userId: userId,
            actionType: actionType,
          });
        } else {
          console.log("Available Room");
          io.emit("RoomStatusResult", {
            message: "available",
            userId: userId,
            actionType: actionType,
          });
        }
      });
      socket.on("assignSeat", ({ restaurantId, userId, tableName }) => {
        console.log("emited assigned seat");
        io.to(restaurantId).emit("getSeat", {
          restaurantId: restaurantId,
          userId: userId,
          tableName: tableName,
        });
      });
    });
  })
  .catch((err) => {
    console.log("Invalid Database Connection: " + err);
  });
